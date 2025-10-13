import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import { theme, useTheme } from 'vitepress-openapi/client'
import type { Theme } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'eva-icons/style/eva-icons.css'
import * as eva from 'eva-icons'
import { createVCodeBlock } from '@wdns/vue-code-block';

import 'vitepress-openapi/dist/style.css'

import './custom.css'

// Import all components globally
const componentModules = import.meta.glob('../../components/**/*.vue', { eager: true })

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

        // Only initialize VCodeBlock on client side
        if (typeof window !== 'undefined') {
            app.use(VCodeBlock);
        }

        enhanceAppWithTabs(app)

        // Initialize Eva Icons
        if (typeof window !== 'undefined') {
            eva.replace()
        }

        // Setup Theme
        const themeConfig = useTheme()
        themeConfig.setI18nConfig({ locale: 'en' })
        themeConfig.setResponseCodeSelector('select')
        theme.enhanceApp({ app, router, siteData })

        // Register all components globally
        for (const path in componentModules) {
            const component = (componentModules[path] as any).default
            const name = path.split('/').pop()!.replace('.vue', '')
            app.component(name, component)
        }
    }
} satisfies Theme
