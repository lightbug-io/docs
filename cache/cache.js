// From https://bionicjulia.com/blog/add-search-functionality-nextjs-markdown-blog-part-1

import fs from 'fs'
import { cachedSiteData } from '@/lib/utils'

// First step
const content = await cachedSiteData('site')

// Second step
function createSiteCache(filename) {
  fs.writeFile(`./cache/${filename}.js`, content, function (err) {
    if (err) {
      console.log(err)
    }
    console.log('Site cache file written')
  })
}

createSiteCache('blog')
