import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { computed, nextTick, ref, watch } from 'vue';
const { patchSearch, pagefindLoadingPlugin } = require('../.vitepress/plugins/pagefind-loading.cjs');
const pluginDir = path.dirname(require.resolve('vitepress-plugin-pagefind'));
const source = fs.readFileSync(path.join(pluginDir, 'Search.vue'), 'utf8');
const deferred = () => {
  let resolve!: (value?: any) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<any>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 50; i++) await Promise.resolve(); await nextTick(); };
function setup({ development = false, importer = jest.fn(), engine = undefined as any } = {}) {
  const stops: (() => void)[] = [];
  const context: any = {
    ref, computed, nextTick,
    watch: (...args: any[]) => { const stop = (watch as any)(...args); stops.push(stop); return stop; },
    Intl, console, setTimeout, clearTimeout, window: { __pagefind__: engine },
    _searchConfig: {},
    useData: () => ({ localeIndex: ref('root'), site: ref({ base: '/docs/preview/' }), lang: ref('en') }),
    useMagicKeys: () => ({ 'Meta+K': ref(false), 'Ctrl+K': ref(false), Escape: ref(false) }),
    useRoute: () => ({ path: '/' }), useRouter: () => ({ go() {} }),
    useLocalStorage: () => ref(false), formatShowDate: () => '',
    withBase: (p: string) => '/docs/preview' + p,
    extractFuzzyKeywordsFromExcerpts: () => [], formatPagefindResult: (item: any) => [item],
    importer
  };
  const script = patchSearch(source).split('<script setup>')[1].split('</script>')[0]
    .replace(/^import .*;$/gm, '')
    .replace(/import\.meta\.env\.DEV/g, String(development))
    .replace('import(/* @vite-ignore */ url)', 'importer(url)');
  vm.createContext(context);
  vm.runInContext(script + ';globalThis.state={searchWords,searchResult,isSearching,searchError,searchRetry};', context);
  return { state: context.state, stop: () => stops.forEach(stop => stop()) };
}
const engineFor = (search = jest.fn(async () => ({ results: [] }))) => ({ init: jest.fn(async () => {}), debouncedSearch: search });
const result = (title: string) => ({ results: [{ data: async () => ({ route: '/gps', meta: { title: [title] } }) }] });

afterEach(() => jest.useRealTimers());

test('patch preserves valid Vue source and fails loudly when upstream changes', () => {
  const { parse, compileScript, compileTemplate } = require('@vue/compiler-sfc');
  const patched = patchSearch(source);
  expect(patched).not.toContain('only support after build');
  expect(patched).not.toContain('只在构建后才生效');
  const { descriptor, errors } = parse(patched);
  expect(errors).toEqual([]);
  expect(() => compileScript(descriptor, { id: 'test' })).not.toThrow();
  expect(compileTemplate({ source: descriptor.template.content, filename: 'Search.vue', id: 'test' }).errors).toEqual([]);
  expect(() => patchSearch(source.replace('watch(() => searchWords.value, async () => {', 'changed'))).toThrow();
  expect(pagefindLoadingPlugin().transform('other', '/other/Search.vue')).toBeUndefined();
});

test('slow initialization keeps loading and automatically searches only the latest query', async () => {
  const loading = deferred(); const engine = engineFor(); const importer = jest.fn(() => loading.promise);
  const { state, stop } = setup({ importer });
  state.searchWords.value = 'gps'; await flush();
  expect(state.isSearching.value).toBe(true); expect(state.searchResult.value).toEqual([]);
  expect(state.searchError.value).toBe('');
  state.searchWords.value = 'tracker'; await flush();
  loading.resolve(engine); await flush();
  expect(importer).toHaveBeenCalledTimes(1);
  expect(importer).toHaveBeenCalledWith('/docs/preview/pagefind/pagefind.js');
  expect(engine.debouncedSearch).toHaveBeenCalledTimes(1);
  expect(engine.debouncedSearch).toHaveBeenCalledWith('tracker', {}, 300);
  expect(state.isSearching.value).toBe(false); stop();
});

test('clearing while initialization is pending does not restore stale results', async () => {
  const loading = deferred(); const engine = engineFor();
  const { state, stop } = setup({ importer: jest.fn(() => loading.promise) });
  state.searchWords.value = 'gps'; await flush(); state.searchWords.value = ''; await flush();
  loading.resolve(engine); await flush();
  expect(engine.debouncedSearch).not.toHaveBeenCalled();
  expect(state.isSearching.value).toBe(false); expect(state.searchResult.value).toEqual([]); stop();
});

test('late result fragments cannot overwrite a newer query', async () => {
  const oldFragment = deferred();
  const engine = engineFor(jest.fn().mockResolvedValueOnce({ results: [{ data: () => oldFragment.promise }] }).mockResolvedValueOnce(result('new')));
  const { state, stop } = setup({ engine });
  state.searchWords.value = 'old'; await flush(); state.searchWords.value = 'new'; await flush();
  oldFragment.resolve({ route: '/old', meta: { title: ['old'] } }); await flush();
  expect(state.searchResult.value[0].meta.title).toEqual(['new']);
  expect(state.searchResult.value[0].route).toBe('/docs/preview/gps'); stop();
});

test('module failure shows an error and Retry reloads the same query', async () => {
  const engine = engineFor();
  const importer = jest.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(engine);
  const { state, stop } = setup({ importer });
  state.searchWords.value = 'gps'; await flush();
  expect(state.searchError.value).toContain('Check your connection'); expect(state.isSearching.value).toBe(false);
  state.searchRetry.value++; await flush();
  expect(importer).toHaveBeenLastCalledWith('/docs/preview/pagefind/pagefind.js?retry=1');
  expect(state.searchError.value).toBe(''); expect(engine.debouncedSearch).toHaveBeenCalledWith('gps', {}, 300); stop();
});

test('initialization timeout is an error rather than an endless spinner', async () => {
  jest.useFakeTimers();
  const { state, stop } = setup({ importer: jest.fn(() => new Promise(() => {})) });
  state.searchWords.value = 'gps'; await flush(); jest.advanceTimersByTime(15000); await flush();
  expect(state.searchError.value).toContain('Search could not load'); expect(state.isSearching.value).toBe(false); stop();
});

test('index and fragment errors retry with a fresh engine, not cached rejected promises', async () => {
  const indexError = engineFor(jest.fn().mockRejectedValue(new Error('index failure')));
  const fragmentError = engineFor(jest.fn().mockResolvedValue({ results: [{ data: async () => { throw Error('fragment failure'); } }] }));
  const healthy = engineFor();
  const importer = jest.fn().mockResolvedValueOnce(fragmentError).mockResolvedValueOnce(healthy);
  const { state, stop } = setup({ engine: indexError, importer });
  state.searchWords.value = 'gps'; await flush(); expect(state.searchError.value).not.toBe('');
  state.searchRetry.value++; await flush(); expect(state.searchError.value).not.toBe('');
  state.searchRetry.value++; await flush(); expect(state.searchError.value).toBe('');
  expect(indexError.debouncedSearch).toHaveBeenCalledTimes(1);
  expect(fragmentError.debouncedSearch).toHaveBeenCalledTimes(1);
  expect(healthy.debouncedSearch).toHaveBeenCalledTimes(1);
  expect(state.searchResult.value).toEqual([]); expect(state.isSearching.value).toBe(false); stop();
});

test('realistic init resolving before a hung index/search still times out and retries', async () => {
  jest.useFakeTimers();
  const stalled = deferred();
  const broken = engineFor(jest.fn(() => stalled.promise));
  const healthy = engineFor(jest.fn().mockResolvedValue(result('recovered')));
  const importer = jest.fn().mockResolvedValue(healthy);
  const { state, stop } = setup({ engine: broken, importer });
  state.searchWords.value = 'gps'; await flush();
  expect(broken.init).toHaveBeenCalled();
  jest.advanceTimersByTime(15000); await flush();
  expect(state.searchError.value).not.toBe(''); expect(state.isSearching.value).toBe(false);
  state.searchRetry.value++; await flush();
  expect(state.searchResult.value[0].meta.title).toEqual(['recovered']);
  stalled.resolve(result('late')); await flush();
  expect(state.searchResult.value[0].meta.title).toEqual(['recovered']); stop();
});

test('development shows an English build notice without importing an absent index', async () => {
  const importer = jest.fn(); const { state, stop } = setup({ development: true, importer });
  state.searchWords.value = 'gps'; await flush();
  expect(state.searchError.value).toBe('Search is available in the built site preview.');
  expect(importer).not.toHaveBeenCalled(); stop();
});
