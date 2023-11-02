import '../styles.css'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      // console.log('handleRouteChange', url)
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return  (
    <ThemeProvider enableSystem={false} class="light" forcedTheme="nextra-docs">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
