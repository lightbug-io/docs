import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { defineConfig } from 'vitepress';
import { useSidebar } from 'vitepress-openapi';
import { loadSpec } from '../swagger/load';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { pagefindPlugin } from 'vitepress-plugin-pagefind';
import { withMermaid } from "vitepress-plugin-mermaid";
import { imgSize } from "@mdit/plugin-img-size";
import { figure } from "@mdit/plugin-figure";
import { attrs } from "@mdit/plugin-attrs";
import { align } from "@mdit/plugin-align";
import { include } from "@mdit/plugin-include";
import { withSidebar, generateSidebar } from 'vitepress-sidebar';
import yamlEmbed from '../utils/markdownit-yaml-plugin.js';


// Load protocol messages from YAML file
const protocolYamlPath = path.resolve(__dirname, '../public/files/protocol-v3.yaml');
const protocolYaml = fs.readFileSync(protocolYamlPath, 'utf8');
const protocolData = yaml.load(protocolYaml);

// Generate menu items for protocol messages grouped by their respective groups
const protocolMessages = protocolData.messages;
const protocolGroups = protocolData.groups;
const protocolMenuItems = Object.keys(protocolGroups)
  .filter(groupKey => !protocolGroups[groupKey].hidden)
  .map(groupKey => {
    const group = protocolGroups[groupKey];
    const items: { text: string; link: string }[] = [];
    if (group.overview) {
      items.push({
        text: 'Overview',
        link: `/devices/api/messages/overview-${groupKey}`
      });
    }
    items.push(
      ...Object.keys(protocolMessages)
        .filter(key => (protocolMessages[key].group === groupKey) && !protocolMessages[key].hidden)
        .map(key => ({
          text: `${key}: ${protocolMessages[key].name}`,
          link: `/devices/api/messages/${key}-${protocolMessages[key].name.toLowerCase().replace(/ /g, '-')}`
        }))
    );
    return {
      text: group.name || groupKey,
      collapsed: true,
      items: items
    };
  });

// Ability to generate other collections of side bar entries
const sidebarItemsFromDir = (dir) => {
  const files = fs.readdirSync(dir)
    .filter(file => file !== 'index.md' && file.endsWith('.md'))

  const items = files.map(file => {
    const fullPath = path.resolve(dir, file);
    let order = 100;
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      // simple frontmatter parse: look for leading --- yaml --- block
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fm = yaml.load(fmMatch[1]);
        if (fm && typeof fm.order === 'number') {
          order = fm.order;
        }
      }
    } catch (e) {
      // ignore and use default order
    }

    const name = file.replace('.md', '')
    const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    return {
      text: displayName,
      link: `${dir}/${name}`,
      order,
    }
  })

  // sort by order, then by text
  items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.text.localeCompare(b.text);
  });

  // remove the temporary order field before returning
  return items.map(({ order, ...rest }) => rest)
}

const sidebarSpec1 = useSidebar({ spec: loadSpec(1) });
const sidebarSpec2 = useSidebar({ spec: loadSpec(2) });

// Generate Admin Actions sidebar automatically using vitepress-sidebar
const generateAdminDevicesSidebar = () => {
  // Helper function to fix links recursively
  const fixLinks = (items, prefix = '/apps/admin/devices') => {
    return items.map(item => {
      const newItem = { ...item };

      // Fix the link if it exists and doesn't already start with the prefix
      if (newItem.link && !newItem.link.startsWith(prefix)) {
        newItem.link = prefix + (newItem.link.startsWith('/') ? '' : '/') + newItem.link;
      }

      // Recursively fix nested items
      if (newItem.items) {
        newItem.items = fixLinks(newItem.items, prefix);
      }

      return newItem;
    });
  };

  // Use vitepress-sidebar to auto-generate the entire devices section
  const devicesSidebar = generateSidebar({
    documentRootPath: '/',
    scanStartPath: 'apps/admin/devices',
    hyphenToSpace: true,
    capitalizeFirst: true,
    useTitleFromFrontmatter: true,
    sortMenusByFrontmatterOrder: true,
    frontmatterOrderDefaultValue: 100,
    includeRootIndexFile: false,
    includeFolderIndexFile: false,
    useFolderLinkFromIndexFile: true,
  });

  const fixedSidebar = Array.isArray(devicesSidebar) ? fixLinks(devicesSidebar) : devicesSidebar;
  return fixedSidebar as any;
};

// Function to make a sidebar group be collapsed
function collapse(group) {
  group.collapsed = true;
  return group;
}

function reorder(
  group: { items: { link: string }[] },
  orderAtStart: string[] = [],
  orderAtEnd: string[] = []
) {
  const orderedStart: { link: string }[] = [];
  const orderedEnd: { link: string }[] = [];
  const unordered: { link: string }[] = [];
  for (const item of group.items) {
    if (orderAtStart.includes(item.link)) {
      orderedStart.push(item);
    } else if (orderAtEnd.includes(item.link)) {
      orderedEnd.push(item);
    } else {
      unordered.push(item);
    }
  }
  group.items = orderedStart.concat(unordered, orderedEnd);
  return group;
}

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Lightbug Documentation",
  description: "home for everything Lightbug",
  lang: 'en-GB',
  cleanUrls: true,
  sitemap: {
    hostname: process.env.DEPLOYMENT_NAME === 'Production' ? 'https://docs.lightbug.io' : 'https://docs-next.lightbug.io'
  },
  rewrites: {
    '/onprem/' : '/silos/',
  },
  vite: {
    server: {
      allowedHosts: [
        ".trycloudflare.com"
      ]
    },
    ssr: {
      noExternal: ["vuetify"]
    },
    plugins: [
      pagefindPlugin(),
    ],
  },
  markdown: {
    config: (md) => {
      md.use(tabsMarkdownPlugin)
      md.use(imgSize)
      md.use(figure)
      md.use(attrs)
      md.use(align)
      // Embed YAML values from files during markdown parsing to avoid Vue
      // interpolation errors for `{{yaml:...}}` tokens.
      md.use(yamlEmbed, { baseDir: path.resolve(__dirname, '..', 'public', 'files') })
      md.use(include,{
        currentPath: () => {
          return path.resolve(__dirname, '..', 'index.md');
        },
      })
    },
    languages: (() => {
      try {
        const toitGrammar = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../ext/toit-ide-tools/vscode/syntaxes/toit.tmLanguage.json'), 'utf8'));

        const toitLang = {
          ...toitGrammar,
          id: 'toit',
          aliases: ['toit']
        };

        return [toitLang];
      } catch (error) {
        console.error('Error loading Toit grammar:', error);
        return [];
      }
    })(),
    container: {
      tipLabel: '⚡ Tip',
      warningLabel: '⚠️ Warning',
      dangerLabel: '⚠️ Danger',
      infoLabel: 'ℹ️ Information',
      detailsLabel: 'Details'
    }
  },
  mermaid:{
    //mermaidConfig !theme here works for light mode since dark theme is forced in dark mode
  },
  head: [
    [
      'script',
      { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${process.env.PUBLIC_GOOGLE_ANALYTICS}` }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.PUBLIC_GOOGLE_ANALYTICS}');`
    ]
    ,
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }
    ],
    [
      'link',
      { rel: 'manifest', href: '/site.webmanifest' }
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: `https://github.com/lightbug-io/docs/edit/${process.env.DEPLOYMENT_NAME === 'Production' ? 'production' : 'main'}/:path`
    },
    nav: [
      {
        text: 'Hardware',
        items: [
          { text: 'Devices', link: '/devices/' },
          { text: 'APIs', link: '/devices/api/' },
        ],
      },
      {
        text: 'Cloud',
        items: [
          { text: 'Cloud App', link: '/apps/cloud/' },
          { text: 'Admin App', link: '/apps/admin/' },
          { text: 'Web APIs', link: '/apis/' },
        ],
      },
      {
        text : 'APIs',
        items: [
          { text: 'Cloud', link: '/apis/' },
          { text: 'Device', link: '/devices/api/' },
        ]
      },
      { text: 'On Premise', link: '/onprem/' },
      { text: 'Guides', link: '/guides/' },
      {
        text: 'Company',
        items: [
          { text: 'About', link: 'https://lightbug.io/about/' },
          { text: 'Contact', link: 'https://lightbug.io/contact/' },
        ]
      }
    ],
    sidebar: {
      '/terminology': [
        {
          text: 'FAQ',
          link: '/faq/',
        },
        {
          text: 'Terminology',
          link: '/terminology/',
          items: [
            {
              text: 'General',
              items: [
                {
                  text: 'Positioning',
                  link: '/terminology/positioning/',
                  items: [
                    { text: 'GNSS', link: '/terminology/positioning/gnss' },
                    { text: 'RTK', link: '/terminology/positioning/rtk' },
                    { text: 'WiFi', link: '/terminology/positioning/wifi' },
                    { text: 'Cellular', link: '/terminology/positioning/cellular' },
                  ]
                },
                { text: 'IoT', link: '/terminology/iot' },
                { text: 'Observability', link: '/terminology/observability' },
              ]
            },
            { text: 'Devices', link: '/terminology/devices' },
            { text: 'Points', link: '/terminology/points' },
            { text: 'Readings', link: '/terminology/readings' },
            { text: 'Billing', link: '/terminology/billing' },
          ],
        },
      ],
      '/faq': [
        {
          text: 'FAQ',
          link: '/faq/',
          items: sidebarItemsFromDir('faq'),
        },
        {
          text: 'Terminology',
          link: '/terminology/',
        }
      ],
      '/devices': [
        {
          text: 'Devices',
          link : '/devices',
          items: [
            {
              text: 'Core',
              items: [
                {
                  text: 'Zero',
                  link: '/devices/zero/',
                },
                {
                  text: 'Pro',
                  link: '/devices/pro/',
                },
                {
                  text: 'Vehicle',
                  link: '/devices/vehicle/',
                  collapsed: true,
                  items: [
                    { text: 'Installation', link: '/devices/vehicle/installation' },
                  ]
                },
                {
                  text: 'Enviro',
                  link: '/devices/enviro/',
                },
              ]
            },
            {
              text: 'RTK',
              items: [
                {
                  text: 'Handheld',
                  link: '/devices/rtk/handheld/',
                  collapsed: true,
                  items: [
                    { text: 'External', link: '/devices/rtk/handheld/external' },
                    { text: 'Screen', link: '/devices/rtk/handheld/screen' },
                    { text: 'ESP32', link: '/devices/rtk/handheld/esp32' },
                    { text: 'Accessories', link: '/devices/rtk/handheld/accessories' },
                  ]
                },
                { text: 'Vehicle', link: '/devices/rtk/vehicle' },
              ]
            },
            {
              text: 'Custom',
              link: '/devices/custom',
            },
            {
              text: 'Peripherals',
              link: '/devices/peripherals',
            },
            {
              text: 'Lineage',
              link: '/devices/history/',
              collapsed: true,
              items: [
                { text: 'VT2', link: '/devices/history/VT2' },
              ]
            }
          ]
        },
        {
          text: 'API',
          link : '/devices/api/',
        },
      ],
      '/devices/api/': [
        {
          text: 'Devices',
          link : '/devices',
        },
        {
          text: 'API',
          link : '/devices/api/',
          items: [
            {
              text: 'Overview',
              link: '/devices/api/',
            },
            {
              text: 'Glossary',
              link: '/devices/api/glossary',
            },
            {
              text: 'Toit',
              link: '/devices/api/sdks/toit/',
              items: [
                { text: 'Getting Started', link: '/devices/api/sdks/toit/getting-started' },
                {
                  text: 'Examples',
                  link: '/devices/api/sdks/toit/examples/',
                  items: sidebarItemsFromDir('devices/api/sdks/toit/examples')
                },
              ],
            },
            {
              text: 'Messages',
              link: '/devices/api/messages',
              items: protocolMenuItems,
            },
            {
              text: 'Protocol',
              link: '/devices/api/protocol/',
              items: [
                {
                  text: 'Prefix',
                  link: '/devices/api/protocol/prefix',
                },
                {
                  text: 'Stop',
                  link: '/devices/api/protocol/stop',
                },
                {
                  text: 'Structure',
                  link: '/devices/api/protocol/structure',
                },
                {
                  text: 'Headers',
                  link: '/devices/api/protocol/headers',
                },
                {
                  text: 'Examples',
                  link: '/devices/api/protocol/examples',
                },
              ]
            },
            {
              text: 'Tools',
              collapsed: true,
              items: [
                {
                  text: 'Generate',
                  link: '/devices/api/tools/generate',
                },
                {
                  text: 'Parse',
                  link: '/devices/api/tools/parse',
                },
                {
                  text: 'Screen',
                  link: '/devices/api/tools/screen',
                },
              ]
            },
          ]
        },
      ],
      '/apis': [
        {
          text: 'APIs',
          link: '/apis',
          items: [
            {
              text: 'Getting Started',
              collapsed: false,
              items: [
                { text: 'Base URLs', link: '/apis/base-urls/' },
                { text: 'Authentication', link: '/apis/authentication/' },
                { text: 'Rate Limits', link: '/apis/rate-limits/' },
              ]
            },
            {
              text: 'Version 2',
              link: '/apis/v2/',
              collapsed: false,
              items: [
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["auth"],
                  text: "Authentication",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["personalAccessTokens"],
                  text: "Access Tokens",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                reorder(collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["plans"],
                  text: "Plans",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                [
                  '/apis/v2/get-users-plans-summary',
                  '/apis/v2/get-users-userid-plans-summary',
                ],[
                  '/apis/v2/get-devices-id-plan',
                  '/apis/v2/put-devices-id-plan',
                  '/apis/v2/delete-devices-id-plan',
                ],
              ),
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["devices"],
                  text: "Devices",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["geofences"],
                  text: "Geofences",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["geofencelists"],
                  text: "Geofence Lists",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
              ],
            },
            {
              text: 'Version 1',
              link: '/apis/v1/',
              collapsed: false,
              items: [
                {
                  text: 'Glossary',
                  link: '/apis/v1/glossary', // No ending /, as the sub items are not sub pages
                  collapsed: true,
                  items: [
                    {
                      text: 'Datapoints',
                      link: '/apis/v1/glossary#datapoints',
                      items: [
                        { text: 'sendReason', link: '/apis/v1/glossary#sendreason' },
                        { text: 'alertType', link: '/apis/v1/glossary#alerttype' },
                        { text: 'ErrorCode', link: '/apis/v1/glossary#errorcode' },
                      ]
                    },
                    {
                      text: 'Readings',
                      link: '/apis/v1/glossary#readings',
                    },
                    {
                      text: 'Device Settings',
                      link: '/apis/v1/glossary#device-settings',
                      items: [
                        { text: 'behaviour', link: '/apis/v1/glossary#behaviour' },
                        { text: 'modeControl', link: '/apis/v1/glossary#modecontrol' },
                        { text: 'modeControl2', link: '/apis/v1/glossary#modecontrol2' },
                      ]
                    },
                  ],
                },
                {text: 'Filtering', link: '/apis/v1/filtering'},
                {text: 'SDKs', link: '/apis/v1/sdks'},
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["authentication"], text: "Authentication", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                reorder(
                  collapse(sidebarSpec1.generateSidebarGroup({ tag: ["device"], text: "Devices", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                  [
                    '/apis/v1/get-devices',
                    '/apis/v1/get-devices-id',
                    '/apis/v1/get-users-id-devices',
                    '/apis/v1/get-users-id-getDeviceSummary',
                    '/apis/v1/get-users-id-getDevicesInZone',
                    '/apis/v1/get-users-id-getDevicesByTag',
                  ]
                ),
                reorder(
                  collapse(sidebarSpec1.generateSidebarGroup({ tag: ["device-activation"], text: "Device Activation", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                  [
                    '/apis/v1/get-devices-id-activateOnResellerPlan',
                    '/apis/v1/get-devices-id-deactivate',
                  ]
                ),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["device-config"], text: "Device Configuration", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                reorder(
                  collapse(sidebarSpec1.generateSidebarGroup({ tag: ["points"], text: "Points", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                  [
                    '/apis/v1/get-devices-id-points' // Of the points, this is likely the most important..
                  ],
                ),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["readings"], text: "Readings", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["readings-gateway"], text: "Gateway readings", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["notifications"], text: "Notifications", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["geofences"], text: "Geofences", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["reports"], text: "Reports", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["rtk"], text: "RTK", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["device-misc"], text: "Device Misc", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
              ],
            },
          ]
        }
      ],
      '/apps/cloud': [
        {
          text: 'Cloud',
          link: '/apps/cloud/',
          items: [
            { text: 'Creating Account', link: '/apps/cloud/creating-account' },
            {
              text: 'The Map',
              link: '/apps/cloud/map/',
              collapsed: true,
              items: [
                {text: 'Controls', link: '/apps/cloud/map/controls'},
                {text: 'Device list', link: '/apps/cloud/map/device-list'},
                {text: 'Device view', link: '/apps/cloud/map/device-view'},
              ],
            },
            {
              text: 'Account',
              link: '/apps/cloud/account/',
              collapsed: true,
              items: [
                { text: 'Details', link: '/apps/cloud/account/details' },
                { text: 'Preferences', link: '/apps/cloud/account/preferences' },
                { text: 'Notifications', link: '/apps/cloud/account/notifications' },
                { text: 'Geofences', link: '/apps/cloud/account/geofences.html' },
              ],
            },
            {
              text: 'Devices',
              link: '/apps/cloud/device-overview',
              collapsed: true,
              items: [
                {
                  text: 'Settings',
                  link: '/apps/cloud/device-settings/',
                  items: [
                    {
                      text: 'Configuration',
                      link: '/apps/cloud/device-settings/',
                      items: [
                        { text: 'Modes', link: '/apps/cloud/device-settings/modes.html' },
                      ],
                    },
                    { text: 'Notifications', link: '/apps/cloud/device-settings/notifications.html' },
                    { text: 'Tags', link: '/apps/cloud/device-settings/tags.html' },
                    {
                      text: 'Data plan',
                      link: '/apps/cloud/device-settings/data-plan.html',
                      items: [
                        { text: 'Account', link: '/apps/cloud/device-settings/subscription-account.html' },
                        { text: 'Devices', link: '/apps/cloud/device-settings/subscription-devices.html' },
                      ],
                    },
                    {
                      text: 'Sharing',
                      link: '/apps/cloud/device-settings/sharing.html',
                    },
                    {
                      text: 'Schedule',
                      link: '/apps/cloud/device-settings/schedule.html',
                    },
                  ],
                },
                { text: 'Bluetooth Ranging', link: '/apps/cloud/bluetooth-ranging' },
                // { text: 'Notifications', link: '/apps/cloud/notifications' },
              ],
            },
            {
              text: 'Reports',
              link: '/apps/cloud/reports',
              collapsed: true,
              items: [
                {
                  text: 'General',
                  collapsed: true,
                  items: [
                    {text: 'Status', link: '/apps/cloud/reports/status'},
                    {text: 'Route', link: '/apps/cloud/reports/route'},
                    {text: 'Trip Summary', link: '/apps/cloud/reports/trip-summary'},
                    {text: 'Detailed Trip', link: '/apps/cloud/reports/detailed-trip'},
                    {text: 'Distance', link: '/apps/cloud/reports/distance'},
                    {text: 'Speeding', link: '/apps/cloud/reports/speeding'},
                  ]
                },
                {
                  text: 'Zones',
                  collapsed: true,
                  items: [
                    {text: 'Zone by time', link: '/apps/cloud/reports/zone-by-time'},
                    {text: 'Specific zone', link: '/apps/cloud/reports/specific-zone'},
                    {text: 'Live zones', link: '/apps/cloud/reports/live-zones'},
                    {text: 'Trip count', link: '/apps/cloud/reports/trip-count'},
                    {text: 'Zone aggregate', link: '/apps/cloud/reports/zone-aggregate'},
                    {text: 'Inventory', link: '/apps/cloud/reports/inventory'},
                  ]
                },
                {
                  text: 'Vehicle',
                  collapsed: true,
                  items: [
                    {text: 'Vehicle Activity', link: '/apps/cloud/reports/vehicle-activity'},
                    {text: 'Vehicle Summary', link: '/apps/cloud/reports/vehicle-summary'},
                    {text: 'Vehicle Events', link: '/apps/cloud/reports/vehicle-events'},
                  ]
                },
                {
                  text: 'Sensor',
                  collapsed: true,
                  items: [
                    {text: 'Temperature', link: '/apps/cloud/reports/temperature'},
                    {text: 'Proximity', link: '/apps/cloud/reports/proximity'},
                    {text: 'Battery Performance', link: '/apps/cloud/reports/battery-performance'},
                    {text: 'Motion Data Report', link: '/apps/cloud/reports/motion-data'},
                  ]
                }
              ],
            },
          ]
        }
      ],
      '/apps/admin': [
        {
          text: 'Admin',
          link: '/apps/admin/',
          items : [
            { text: 'Authentication', link: '/apps/admin/authentication', // No ending /, as the sub items are not sub pages
              items: [
                { text: 'Account Creation', link: '/apps/admin/authentication#creating-an-account' },
                { text: 'Logging In', link: '/apps/admin/authentication#logging-in' },
                { text: 'Permissions', link: '/apps/admin/authentication#permissions' },
              ]
            },
            { text: 'Devices', link: '/apps/admin/devices', // No ending /, as the sub items are not sub pages
              items: generateAdminDevicesSidebar()
            },
            { text: 'Configs', link: '/apps/admin/configs' },
            { text: 'Users', link: '/apps/admin/users' },
            // { text: 'Invoice Audit', link: '/apps/admin/invoice-audit' },
            { text: 'Plans', link: '/apps/admin/plans' },
          ],
        }
      ],
      '/onprem': [
        {
          text: 'On Premise',
        }
      ],
      '/guides': [
        {
          text: 'Guides',
          link: '/guides/',
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lightbug-io' },
      { icon: 'discord', link: 'https://chat.lightbug.io' }
    ],

    search: {
      provider: 'local'
    }
  }
}));
