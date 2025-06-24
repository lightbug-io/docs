---
aside: false
outline: false
sidebar: false
---


# Browser Hard Refresh Guide

If you have been told by Lightbug to perform a hard refresh, this guide will help you understand what it is, why it's necessary, and how to do it across different browsers and operating systems.

## Browser Detection

<div id="browser-detection" style="padding: 15px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
  <strong>Your detected browser:</strong> <span id="detected-browser">Detecting...</span><br>
  <strong>Your operating system:</strong> <span id="detected-os">Detecting...</span><br>
  <strong>Recommended shortcut:</strong> <span id="recommended-shortcut">Loading...</span>
</div>

<script>
function detectBrowserAndOS() {
  console.log('Detecting browser and OS...');
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Microsoft Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'Unknown';
  if (platform.includes('Win')) {
    os = 'Windows';
  } else if (platform.includes('Mac')) {
    os = 'macOS';
  } else if (platform.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  // Determine shortcut
  let shortcut = '';
  if (os === 'macOS') {
    if (browser === 'Safari') {
      shortcut = '⌘ + Option + R';
    } else {
      shortcut = '⌘ + Shift + R';
    }
  } else if (os === 'Windows' || os === 'Linux') {
    shortcut = 'Ctrl + Shift + R';
  } else if (os === 'iOS' || os === 'Android') {
    shortcut = 'Pull down to refresh or use browser menu';
  }

  // If there isn't an element to get, defer
    if (!document.getElementById('detected-browser')) {
        setTimeout(detectBrowserAndOS, 250);
        return;
    }

  document.getElementById('detected-browser').textContent = browser;
  document.getElementById('detected-os').textContent = os;
  document.getElementById('recommended-shortcut').textContent = shortcut;

  // Highlight the appropriate row in the quick reference table
  highlightBrowserRow(browser);
}

function highlightBrowserRow(browser) {
  // Remove any existing highlights
  const allRows = document.querySelectorAll('.browser-table tbody tr');
  allRows.forEach(row => row.classList.remove('highlighted'));

  // Map browser names to row IDs
  const browserRowMap = {
    'Chrome': 'chrome-row',
    'Firefox': 'firefox-row',
    'Safari': 'safari-row',
    'Microsoft Edge': 'edge-row',
    'Opera': 'opera-row'
  };

  // Highlight the matching row
  const rowId = browserRowMap[browser];
  if (rowId) {
    const row = document.getElementById(rowId);
    if (row) {
      row.classList.add('highlighted');
    }
  }
}

// Run detection when page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', detectBrowserAndOS);

  // Additional fallback with a small delay
  setTimeout(detectBrowserAndOS, 100);
}
</script>

## Quick Reference Table

<style>
.browser-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.browser-table th,
.browser-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.browser-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.browser-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.browser-table tr.highlighted {
  background-color: #e8f5e8 !important;
  border: 2px solid #4caf50;
}

.browser-table tr.highlighted td {
  font-weight: bold;
}
</style>

<table class="browser-table">
  <thead>
    <tr>
      <th>Browser</th>
      <th>Windows/Linux</th>
      <th>macOS</th>
    </tr>
  </thead>
  <tbody>
    <tr id="chrome-row">
      <td>Chrome</td>
      <td><code>Ctrl + Shift + R</code></td>
      <td><code>⌘ + Shift + R</code></td>
    </tr>
    <tr id="firefox-row">
      <td>Firefox</td>
      <td><code>Ctrl + Shift + R</code></td>
      <td><code>⌘ + Shift + R</code></td>
    </tr>
    <tr id="safari-row">
      <td>Safari</td>
      <td>N/A</td>
      <td><code>⌘ + Option + R</code></td>
    </tr>
    <tr id="edge-row">
      <td>Microsoft Edge</td>
      <td><code>Ctrl + Shift + R</code></td>
      <td><code>⌘ + Shift + R</code></td>
    </tr>
    <tr id="opera-row">
      <td>Opera</td>
      <td><code>Ctrl + Shift + R</code></td>
      <td><code>⌘ + Shift + R</code></td>
    </tr>
  </tbody>
</table>


## What is a Hard Refresh?

A hard refresh forces your browser to reload a page and all its resources (CSS, JavaScript, images) from the server, bypassing the local cache. This is useful when:

- The page appears outdated or shows old data
- New features or updates aren't visible
- The page layout appears broken
- You're troubleshooting display issues

## Instructions by Browser and Operating System

### Google Chrome

#### Windows & Linux
- **Keyboard shortcut:** `Ctrl + Shift + R`
- **Alternative:** `Ctrl + F5`
- **Menu method:**
  1. Right-click the refresh button
  2. Select "Hard Reload"

#### macOS
- **Keyboard shortcut:** `⌘ + Shift + R`
- **Menu method:**
  1. Right-click the refresh button
  2. Select "Hard Reload"

### Mozilla Firefox

#### Windows & Linux
- **Keyboard shortcut:** `Ctrl + Shift + R`
- **Alternative:** `Ctrl + F5`
- **Menu method:**
  1. Hold `Shift` and click the refresh button

#### macOS
- **Keyboard shortcut:** `⌘ + Shift + R`
- **Menu method:**
  1. Hold `Shift` and click the refresh button

### Safari

#### macOS
- **Keyboard shortcut:** `⌘ + Option + R`
- **Menu method:**
  1. Go to Develop menu → Empty Caches
  2. Then refresh normally with `⌘ + R`

::: tip Enable Developer Menu
If you don't see the Develop menu:
1. Go to Safari → Preferences
2. Click Advanced tab
3. Check "Show Develop menu in menu bar"
:::

#### iOS (iPhone/iPad)
- **Pull to refresh:** Pull down on the page
- **Settings method:**
  1. Go to Settings → Safari
  2. Tap "Clear History and Website Data"
  3. Return to Safari and reload the page

### Microsoft Edge

#### Windows
- **Keyboard shortcut:** `Ctrl + Shift + R`
- **Alternative:** `Ctrl + F5`
- **Menu method:**
  1. Press `F12` to open Developer Tools
  2. Right-click the refresh button
  3. Select "Hard refresh"

#### macOS
- **Keyboard shortcut:** `⌘ + Shift + R`
- **Menu method:**
  1. Right-click the refresh button
  2. Select "Hard refresh"

### Opera

#### Windows & Linux
- **Keyboard shortcut:** `Ctrl + Shift + R`
- **Alternative:** `Ctrl + F5`

#### macOS
- **Keyboard shortcut:** `⌘ + Shift + R`
