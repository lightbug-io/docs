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

import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import cpp from 'highlight.js/lib/languages/cpp';
import go from 'highlight.js/lib/languages/go';
// import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('go', go);

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

export default {
    ...DefaultTheme, Layout,
    enhanceApp({ app, router, siteData }) {
        app.use(vuetify)
        // app.use(hljsVuePlugin)

        enhanceAppWithTabs(app)

        // Setup Theme
        const themeConfig = useTheme()
        themeConfig.setLocale('en') // en or es
        themeConfig.setResponseCodeSelector('select')
        theme.enhanceApp({ app })
    }
} satisfies Theme
