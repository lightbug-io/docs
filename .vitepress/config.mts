import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { defineConfig } from 'vitepress';
import { useSidebar } from 'vitepress-openapi';
import { loadSpec } from '../swagger/load';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { pagefindPlugin } from 'vitepress-plugin-pagefind';
import { withMermaid } from "vitepress-plugin-mermaid";


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
  return files
    .filter(file => file !== 'index.md')
    .map(file => {
      const name = file.replace('.md', '')
      const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
      return {
        text: displayName,
        link: `${dir}/${name}`
      }
    })
}

const sidebarSpec1 = useSidebar({ spec: loadSpec(1) });
const sidebarSpec2 = useSidebar({ spec: loadSpec(2) });

// Function to make a sidebar group be collapsed
function collapse(group) {
  group.collapsed = true;
  return group;
}

function reorder(group: { items: { link: string }[] }, orderedLinks: string[]) {
  const ordered: { link: string }[] = []
  const unordered: { link: string }[] = []
  for (const item of group.items) {
    if (orderedLinks.includes(item.link)) {
      ordered.push(item)
    } else {
      unordered.push(item)
    }
  }
  group.items = ordered.concat(unordered)
  return group
}

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Lightbug Documentation",
  description: "home for everything Lightbug",
  lang: 'en-GB',
  cleanUrls: true,
  rewrites: {
    '/onprem/' : '/silos/',
  },
  vite: {
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
    },
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
          { text: 'Shop', link: 'https://lightbug.io/shop/' },
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
                { text: 'IoT', link: '/terminology/iot' },
                { text: 'Positioning', link: '/terminology/positioning' },
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
                {
                  text: 'RTK',
                  link: '/devices/rtk/',
                },
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
              text: 'History',
              link: '/devices/history',
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
              text: 'Structure',
              collapsed: true,
              link: '/devices/api/structure',
              items: [
                {
                  text: 'Prefix',
                  link: '/devices/api/structure#prefix',
                },
                {
                  text: 'Message',
                  link: '/devices/api/structure#message',
                },
                {
                  text: 'Examples',
                  link: '/devices/api/structure#examples',
                },
              ]
            },
            {
              text: 'Headers',
              link: '/devices/api/headers',
            },
            {
              text: 'Messages',
              collapsed: true,
              link: '/devices/api/messages',
              items: protocolMenuItems,
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
            {
              text: 'SDKs',
              collapsed: true,
              items: [
                {
                  text: 'Toit',
                  link: '/devices/api/sdks/toit/',
                  items: [
                    { text: 'Getting Started', link: '/devices/api/sdks/toit/getting-started' },
                    {
                      text: 'Examples',
                      link: '/devices/api/sdks/toit/examples',
                      items: [
                        { text: 'EInk Hello World', link: '/devices/api/sdks/toit/examples/eink' },
                      ]
                    },
                  ],
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
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["plans"],
                  text: "Plans",
                  linkPrefix: '/apis/v2/',
                  addedOperations: new Set(),
                })),
                collapse(sidebarSpec2.generateSidebarGroup({
                  tag: ["devices"],
                  text: "Devices",
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
                  link: '/apis/v1/glossary/',
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
                {text: 'Filtering', link: '/apis/v1/filtering/'},
                {text: 'SDKs', link: '/apis/v1/sdks/'},
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
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["mqtt"], text: "MQTT", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
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
            {
              text: 'Notifications',
              link: '/apps/cloud/notifications',
            },
          ]
        }
      ],
      '/apps/admin': [
        {
          text: 'Admin',
          link: '/apps/admin/',
          items : [
            { text: 'Creating Account', link: '/apps/admin/creating-account' },
            { text: 'Permissions', link: '/apps/admin/permissions' },
            { text: 'Devices', link: '/apps/admin/devices' },
            { text: 'Configs', link: '/apps/admin/configs' },
            { text: 'Users', link: '/apps/admin/users' },
            { text: 'Invoice Audit', link: '/apps/admin/invoice-audit' },
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
