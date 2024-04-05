import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  darkMode: false, // Disable the switch for dark mode
  logo: (
    <div>
      <img style={{ marginLeft: '.5em', width: '17px', height: '30px', display: 'inline-block'}} src="https://lightbug.io/images/logo-orange_hudcdce2ead9cbe2715b5cf652e648439f_53864_17x30_fit_q95_h2_box_3.webp" alt="Logo" />
      <span style={{ marginLeft: '.5em', fontSize: "150%", verticalAlign: "bottom" }}>Lightbug</span>
    </div>
  ),
  logoLink: 'https://lightbug.io/',
  head: (
    <>
      <link rel="icon" type="image/x-icon" href="https://lightbug.io/favicon.ico"></link>
    </>
  ),
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
  },
  // project: {
  //   link: 'https://github.com/lightbug-io',
  // },
  chat: {
    link: '',
    icon: '',
  },
  // docsRepositoryBase: 'https://github.com/lightbug-io/docs',
  // Ideally we could remove the edit link for now.. but we can't so link to support..
  docsRepositoryBase: 'https://support.lightbug.cloud/support/tickets/new?docs_page=',
  footer: {
    text: 'Lightbug Documentation',
  },
  feedback: {
    content: "Report an issue",
    useLink: () => {
      return 'https://support.lightbug.cloud/support/tickets/new'
    }
  },
  useNextSeoProps: () => ({ titleTemplate: '%s – Lightbug Documentation' })
}

export default config
