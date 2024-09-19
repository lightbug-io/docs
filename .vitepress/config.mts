import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-theme-openapi'
import { loadSpec } from '../swagger/load'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

const sidebarSpec1 = useSidebar({ spec: loadSpec(1) })
const sidebarSpec2 = useSidebar({ spec: loadSpec(2) })

// Function to make a sidebar group be collapsed
function collapse(group) {
  group.collapsed = true
  return group
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lightbug Documentation",
  description: "home for everything Lightbug",
  lang: 'en-GB',
  vite: {
    ssr: {
      noExternal: ["vuetify"]
    },
    plugins: [pagefindPlugin()],
  },
  markdown: {
    config: (md) => {
      md.use(tabsMarkdownPlugin)
    },
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
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Concepts',
        link: '/concepts/index.html',
      },
      { text: 'Devices', link: '/devices/' },
      {
        text: 'APIs',
        items: [
          { text: 'Overview', link: '/apis/' },
          { text: 'Version 2', link: '/apis/v2/' },
          { text: 'Version 1', link: '/apis/v1/' },
        ],
      },
      {
        text: 'Apps',
        items: [
          { text: 'Cloud', link: '/apps/cloud/' },
          { text: 'Admin', link: '/apps/admin/' },
        ]
      },
      { text: 'Silos', link: '/silos/' },
      { text: 'Guides', link: '/guides/' },
      {
        text: 'Company',
        items: [
          { text: 'About', link: 'https://lightbug.io/about/' },
          { text: 'Support', link: 'https://support.lightbug.cloud/' },
          { text: 'Shop', link: 'https://lightbug.io/shop/' },
        ]
      }
    ],
    sidebar: {
      '/concepts': [
        {
          text: 'Concepts',
          link: '/concepts/',
          items: [
            {
              text: 'General',
              items: [
                { text: 'IoT', link: '/concepts/iot' },
                { text: 'Positioning', link: '/concepts/positioning' },
                { text: 'Observability', link: '/concepts/observability' },
              ]
            },
            { text: 'Device', link: '/concepts/device' },
            { text: 'Point', link: '/concepts/point' },
            { text: 'Reading', link: '/concepts/reading' },
          ],
        },
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
                    { text: 'Installation', link: '/devices/vehicle/installation.html' },
                  ]
                },
                {
                  text: 'Enviro',
                  link: '/devices/enviro/',
                },
              ]
            },
            {
              text: 'Custom',
              link: '/devices/custom',
            },
            {
              text: 'Legacy',
              link: '/devices/legacy',
            }
          ]
        }
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
                  tag: ["users", "published"],
                  text: "Authentication",
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
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["devices"], text: "Devices", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["device-config"], text: "Device Configuration", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["points"], text: "Points", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["readings"], text: "Readings", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["readings-gateway"], text: "Gateway readings", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["notifications"], text: "Notifications", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
                collapse(sidebarSpec1.generateSidebarGroup({ tag: ["geofences"], text: "Geofences", linkPrefix: '/apis/v1/', addedOperations: new Set(),})),
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
                { text: 'More', link: '/apps/cloud/account/more' },
              ],
            },
            {
              text: 'Devices',
              link: '/apps/cloud/device-overview',
              collapsed: true,
              items: [
                {
                  text: 'Configuration',
                  link: '/apps/cloud/device-configuration/',
                  items: [
                    { text: 'Modes', link: '/apps/cloud/device-configuration/modes.html' },
                    { text: 'Notifications', link: '/apps/cloud/device-configuration/notifications.html' },
                    { text: 'Tags', link: '/apps/cloud/device-configuration/tags.html' },
                    { text: 'Data plan', link: '/apps/cloud/device-configuration/data-plan.html' },
                    { text: 'Activations', link: '/apps/cloud/device-configuration/activations.html' },
                    { text: 'Geofences', link: '/apps/cloud/device-configuration/geofences.html' },
                  ],
                },
                { text: 'Bluetooth Ranging', link: '/apps/cloud/bluetooth-ranging' },
                // { text: 'Notifications', link: '/apps/cloud/notifications' },
              ],
            },
            {
              text: 'Reports',
              link: '/apps/cloud/reports',
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
          ],
        }
      ],
      '/silos': [
        {
          text: 'Silos',
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
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local'
    }
  }
})
