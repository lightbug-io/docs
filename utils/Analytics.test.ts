/** @jest-environment-options {"url":"https://docs.lightbug.io/devices/api/tools/parse?message=private#payload"} */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
let analytics: typeof import('./Analytics');
beforeEach(() => {
  jest.resetModules();
  analytics = require('./Analytics');
  document.head.innerHTML = '';
  delete (window as any).gtag;
  delete (window as any).dataLayer;
  document.cookie = '_ga=; Max-Age=0; path=/';
});
test('starts off and drops pre-consent protocol events', () => {
  analytics.configureAnalytics('G-TEST123', 'Production', false);
  analytics.trackProtocolEvent('parse_message', { message_type: 1, message_name: 'test', bytes_length: 4 });
  expect(document.querySelector('script')).toBeNull();
  expect((window as any).dataLayer).toBeUndefined();
  analytics.setAnalyticsConsent(false);
  expect(document.querySelector('script')).toBeNull();
});
test.each([
  ['G-TEST123', 'Preview', true], ['G-TEST123', 'Production', true],
  ['G-TEST123', '', false], ['', 'Production', false],
  ['undefined', 'Production', false], ["G-TEST';alert(1)", 'Production', false],
])('fails closed for ID %s / deployment %s / preview %s', (id, deployment, preview) => {
  analytics.configureAnalytics(id, deployment, preview);
  analytics.setAnalyticsConsent(true);
  expect(document.querySelector('script')).toBeNull();
  expect((window as any).gtag).toBeUndefined();
});
test('explicit consent loads once and only sends existing tool metadata', () => {
  analytics.configureAnalytics('G-TEST123', 'Production', false);
  analytics.setAnalyticsConsent(true);
  analytics.setAnalyticsConsent(true);
  expect(document.querySelectorAll('#docs-analytics')).toHaveLength(1);
  expect((window as any)['ga-disable-G-TEST123']).toBe(false);
  const queue = (window as any).dataLayer.map((entry: IArguments) => Array.from(entry));
  expect(queue[1][2].page_location).toBe('https://docs.lightbug.io/devices/api/tools/parse');
  expect(queue[1][2].allow_google_signals).toBe(false);
  analytics.trackProtocolEvent('generate_message', { message_type: 1, message_name: 'test', bytes_length: 4 });
  expect((window as any).dataLayer).toHaveLength(3);
});
test('withdrawal disables sends, discards queue and removes script/cookies', () => {
  // jsdom logs its unsupported navigation; the production reload is intentional.
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  analytics.configureAnalytics('G-TEST123', 'Production', false);
  analytics.setAnalyticsConsent(true);
  document.cookie = '_ga=example; path=/';
  document.cookie = 'docs_consent=keep; path=/';
  analytics.setAnalyticsConsent(false);
  analytics.trackProtocolEvent('parse_message', { message_type: 1, message_name: 'test', bytes_length: 4 });
  expect((window as any)['ga-disable-G-TEST123']).toBe(true);
  expect((window as any).dataLayer).toEqual([]);
  expect(document.querySelector('#docs-analytics')).toBeNull();
  expect(document.cookie).not.toContain('_ga=');
  expect(document.cookie).toContain('docs_consent=keep');
  log.mockRestore();
});
