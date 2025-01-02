import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import { theme, useOpenapi, useTheme } from 'vitepress-openapi'
import type { Theme } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVCodeBlock } from '@wdns/vue-code-block';

import 'vitepress-openapi/dist/style.css'

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

const VCodeBlock = createVCodeBlock({
    // options
});

export default {
    ...DefaultTheme, Layout,
    enhanceApp({ app, router, siteData }) {
        app.use(vuetify)
        app.use(VCodeBlock);

        enhanceAppWithTabs(app)

        // Setup Theme
        const themeConfig = useTheme()
        themeConfig.setLocale('en') // en or es
        themeConfig.setResponseCodeSelector('select')
        theme.enhanceApp({ app })
    }
} satisfies Theme
