import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi, useTheme } from 'vitepress-theme-openapi'
import type { Theme } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import 'vitepress-theme-openapi/dist/style.css'

import './custom.css'

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
    },
    components: {
        ...components,
        VStepperVertical,
    },
    directives
})

export default {
    ...DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        app.use(vuetify)

        enhanceAppWithTabs(app)

        // Setup Theme
        const themeConfig = useTheme()
        themeConfig.setLocale('en') // en or es

        theme.enhanceApp({ app })
    }
} satisfies Theme
