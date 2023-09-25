export async function getAllPagesWithFrontMatter(dataType: string) {
    const files = fs.readdirSync(path.join(root, 'data', dataType))
    // @ts-ignore
    return files.reduce((allPages, pageSlug) => {
      const source = fs.readFileSync(path.join(root, 'data', dataType, pageSlug), 'utf8')
      const { data } = matter(source)
      return [
        {
          frontMatter: data,
          slug: pageSlug.replace('.md', ''),
        },
        ...allPages,
      ]
    }, [])
  }

  export async function cachedSiteData(dataType: string) {
    const pages = await getAllPagesWithFrontMatter(dataType)
    return `export const cachedPages = ${JSON.stringify(pages)}`
  }
