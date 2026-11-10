// Temporary compatibility patch for vitepress-plugin-pagefind 0.4.25.
// Keep the upstream UI/indexer; replace only its racy search lifecycle.
// Fail loudly if an upgrade changes the replacement points.
const lifecycle = `
const isDevelopment = import.meta.env.DEV;
const searchError = ref("");
const searchRetry = ref(0);
let pagefindReady;
let loadAttempt = 0;
function loadPagefind() {
  if (!pagefindReady) {
    const attempt = loadAttempt++;
    const url = withBase("/pagefind/pagefind.js") + (attempt ? "?retry=" + attempt : "");
    let timeout;
    const loading = Promise.resolve().then(async () => {
      const engine = (attempt === 0 && window.__pagefind__) || await import(/* @vite-ignore */ url);
      await engine.init();
      if (attempt === loadAttempt - 1) window.__pagefind__ = engine;
      return engine;
    });
    pagefindReady = Promise.race([
      loading,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Search initialization timed out")), 15000);
      })
    ]).finally(() => clearTimeout(timeout)).catch((error) => {
      pagefindReady = undefined;
      throw error;
    });
  }
  return pagefindReady;
}
function withSearchTimeout(operation) {
  let timeout;
  return Promise.race([
    operation(),
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error("Search timed out")), 15000);
    })
  ]).finally(() => clearTimeout(timeout));
}
watch([searchWords, searchRetry], async ([words], _, onCleanup) => {
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  searchError.value = "";
  searchResult.value = [];
  isSearching.value = !!words;
  if (!words) return;
  if (import.meta.env.DEV) {
    searchError.value = "Search is available in the built site preview.";
    isSearching.value = false;
    return;
  }
  try {
    await withSearchTimeout(async () => {
      const engine = await loadPagefind();
      if (cancelled) return;
      const searchText = typeof finalSearchConfig.value.customSearchQuery === "function"
        ? finalSearchConfig.value.customSearchQuery(words)
        : /\\p{Ideo}/u.test(words) ? chineseSearchOptimize(words) : words;
      const result = await engine.debouncedSearch(searchText, {}, searchDelayTime.value);
      if (cancelled || result === null) return;
      const pagefindResults = await Promise.all(result.results.map((item) => item.data()));
      if (cancelled) return;
      const keywords = extractFuzzyKeywordsFromExcerpts(pagefindResults, searchText);
      const formatted = pagefindResults.flatMap((item) => {
        const results = formatPagefindResult(item, finalSearchConfig.value.pageResultCount || 1, keywords);
        results.forEach((entry) => {
          entry.route = entry.route.startsWith(site.value.base) ? entry.route : withBase(entry.route);
        });
        return results;
      }).filter((entry) => ignorePublish.value || entry.meta.publish !== false);
      if (finalSearchConfig.value.sort) formatted.sort(finalSearchConfig.value.sort);
      searchResult.value = formatted.filter(finalSearchConfig.value.filter ?? (() => true));
    });
  } catch {
    if (!cancelled) {
      // Pagefind caches failed resource promises. A retry needs a fresh module.
      pagefindReady = undefined;
      cancelled = true;
      isSearching.value = false;
      searchResult.value = [];
      searchError.value = "Search could not load. Check your connection and try again.";
    }
  } finally {
    if (!cancelled) isSearching.value = false;
  }
});
`;

function replaceOnce(source, original, replacement) {
  if (!source.includes(original) || source.indexOf(original) !== source.lastIndexOf(original)) {
    throw new Error('Pagefind loading patch needs review for this plugin version');
  }
  return source.replace(original, replacement);
}

function patchSearch(source) {
  const start = source.indexOf('watch(() => searchWords.value, async () => {');
  const end = source.indexOf('// 避免按住搜索框', start);
  if (start < 0 || end < 0) throw new Error('Pagefind search watcher changed; review loading patch');
  source = source.slice(0, start) + lifecycle + source.slice(end);
  // The build-only stub is never a result on the deployed site.
  const stubStart = source.indexOf('function inlineSearch() {');
  const stubEnd = source.indexOf('const chineseRegex', stubStart);
  if (stubStart < 0 || stubEnd < 0) throw new Error('Pagefind fallback changed; review loading patch');
  source = source.slice(0, stubStart) + source.slice(stubEnd);
  source = replaceOnce(source, '<div v-if="isSearching" class="search-loading">', `<div v-if="searchError" role="alert" class="search-loading">
                  <span>{{ searchError }}</span>
                  <button v-if="!isDevelopment" type="button" @click="searchRetry++">Retry</button>
                </div>
                <div v-else-if="isSearching" role="status" class="search-loading">`);
  return source;
}

module.exports = {
  patchSearch,
  pagefindLoadingPlugin() {
    return {
      name: 'pagefind-loading-state',
      enforce: 'pre',
      transform(source, id) {
        if (!id.replaceAll('\\', '/').endsWith('/vitepress-plugin-pagefind/dist/Search.vue')) return;
        return { code: patchSearch(source), map: null };
      }
    };
  }
};
