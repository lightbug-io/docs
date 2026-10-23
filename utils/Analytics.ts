// All documentation analytics go through this opt-in boundary. Never queue
// events from before consent, and never enable analytics on a preview origin.
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: any[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};
let measurementId = '';
let enabled = false;
let loaded = false;

export function configureAnalytics(id: string, deployment: string, preview: boolean): void {
  measurementId = !preview && /^(Production|Next)$/.test(deployment) && /^G-[A-Z0-9]+$/.test(id)
    ? id : '';
}

export function setAnalyticsConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as AnalyticsWindow;
  const allowedHost = ['docs.lightbug.io', 'docs-next.lightbug.io'].includes(window.location.hostname);
  enabled = accepted && !!measurementId && allowedHost;
  if (measurementId) w[`ga-disable-${measurementId}`] = !enabled;
  if (!enabled) {
    clearAnalyticsCookies();
    if (loaded) {
      // Removing a script cannot unload its listeners. Disable sends immediately,
      // discard queued events, then reload with the newly saved denied choice.
      w.gtag = () => {};
      w.dataLayer = [];
      document.getElementById('docs-analytics')?.remove();
      window.location.reload();
    }
    return;
  }
  if (loaded) return;
  loaded = true;
  w.dataLayer = [];
  w.gtag = function () { w.dataLayer!.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_domain: window.location.hostname,
    page_location: window.location.origin + window.location.pathname,
    page_referrer: '',
  });
  const script = document.createElement('script');
  script.id = 'docs-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function trackProtocolEvent(name: 'parse_message' | 'generate_message', details: {
  message_type: number; message_name: string; bytes_length: number;
}): void {
  if (!enabled || typeof window === 'undefined') return;
  (window as unknown as AnalyticsWindow).gtag?.('event', name, details);
}

export function clearAnalyticsCookies(): void {
  if (typeof document === 'undefined' || !['docs.lightbug.io', 'docs-next.lightbug.io'].includes(window.location.hostname)) return;
  const domains = ['', window.location.hostname, '.lightbug.io'];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
    }
  }
}
