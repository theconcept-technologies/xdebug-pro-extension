import browser from 'webextension-polyfill';
import type { Tabs } from 'webextension-polyfill';
import { CookieInfo, sanitizeDomain, IDEProfile, createDomainState } from './types';
import { updateXdebugCookie } from './utils/cookie';
import { getDomainState, updateDomainState } from './utils/storage';

declare const chrome: any;

// Icon paths
const ICON_PATHS = {
  active: {
    '16': 'icons/icon-active-16.png',
    '32': 'icons/icon-active-32.png',
    '48': 'icons/icon-active-48.png',
    '128': 'icons/icon-active-128.png'
  },
  inactive: {
    '16': 'icons/icon-inactive-16.png',
    '32': 'icons/icon-inactive-32.png',
    '48': 'icons/icon-inactive-48.png',
    '128': 'icons/icon-inactive-128.png'
  }
};

/**
 * Updates the extension icon based on xDebug status
 */
async function updateIcon(tabId: number, isActive: boolean): Promise<void> {
  try {
    console.log(`Updating icon for tab ${tabId}, active: ${isActive}`);
    console.log('Using icon paths:', isActive ? ICON_PATHS.active : ICON_PATHS.inactive);
    
    // Use Chrome's API directly for icon updates
    await chrome.action.setIcon({
      tabId,
      path: isActive ? ICON_PATHS.active : ICON_PATHS.inactive
    });
    console.log('Icon update successful');
  } catch (error) {
    console.error('Failed to update icon:', error);
  }
}

/**
 * Checks xDebug status for a tab and updates the icon
 */
async function checkXdebugStatus(tabId: number, url: string): Promise<void> {
  try {
    console.log(`Checking xDebug status for tab ${tabId}, url: ${url}`);
    const domain = sanitizeDomain(url);
    console.log('Sanitized domain:', domain);

    const state = await getDomainState(domain);
    console.log('Domain state:', state);

    // Update icon based on state
    await updateIcon(tabId, state?.enabled || false);

    // Also update badge text to show mode
    if (state?.enabled) {
      chrome.action.setBadgeText({
        tabId,
        text: state.mode === 'debug' ? 'D' : state.mode === 'profile' ? 'P' : 'T'
      });
      chrome.action.setBadgeBackgroundColor({
        tabId,
        color: '#F6A623'
      });
      console.log(`Badge updated for mode: ${state.mode}`);
    } else {
      chrome.action.setBadgeText({
        tabId,
        text: ''
      });
      console.log('Badge cleared');
    }
  } catch (error) {
    console.error('Failed to check xDebug status:', error);
    await updateIcon(tabId, false);
    chrome.action.setBadgeText({
      tabId,
      text: ''
    });
  }
}

/**
 * Handles tab updates to manage Xdebug session state
 */
async function handleTabUpdate(
  tabId: number,
  changeInfo: Tabs.OnUpdatedChangeInfoType,
  tab: Tabs.Tab
): Promise<void> {
  console.log(`Tab update - tabId: ${tabId}, changeInfo:`, changeInfo);

  // Check if this is a page reload or navigation
  if (changeInfo.status === 'loading' && tab.url) {
    console.log('Page is loading, updating state');
    try {
      const domain = sanitizeDomain(tab.url);
      console.log('Processing domain:', domain);

      const state = await getDomainState(domain);
      console.log('Current domain state:', state);

      // Always update cookie and icon state on page load
      if (state) {
        await updateXdebugCookie(domain, state);
        console.log('Cookie updated');
      }

      // Update icon immediately on page load
      await checkXdebugStatus(tabId, tab.url);
    } catch (error) {
      console.error('Failed to handle tab update:', error);
    }
  }
}

/**
 * Handles cookie changes to sync state
 */
async function handleCookieChange({ cookie, removed }: CookieInfo): Promise<void> {
  if (cookie.name === 'XDEBUG_SESSION') {
    console.log(`Cookie change - ${cookie.name}, removed: ${removed}`);
    try {
      const domain = cookie.domain.replace(/^\./, '');
      console.log('Processing domain:', domain);

      let state = await getDomainState(domain);
      console.log('Current state:', state);

      if (!state) {
        state = createDomainState();
        console.log('Created new state');
      }

      if (removed && state.enabled) {
        state.enabled = false;
        await updateDomainState(domain, state);
        console.log('State updated - disabled');
      } else if (!removed && !state.enabled) {
        const profile = cookie.value as IDEProfile;
        if (profile === 'phpstorm' || profile === 'vscode' || profile === 'custom') {
          state.profile = profile;
          state.enabled = true;
          await updateDomainState(domain, state);
          console.log('State updated - enabled');
        }
      }

      // Update icon for all tabs with this domain
      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        if (tab.id && tab.url && tab.url.includes(domain)) {
          await checkXdebugStatus(tab.id, tab.url);
        }
      }
    } catch (error) {
      console.error('Failed to handle cookie change:', error);
    }
  }
}

// Handle initial tab state
browser.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo);
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {
    await checkXdebugStatus(activeInfo.tabId, tab.url);
  }
});

// Handle navigation state changes
browser.webNavigation.onCommitted.addListener(async (details) => {
  console.log('Navigation committed:', details);
  if (details.frameId === 0) { // Only handle main frame navigation
    const tab = await browser.tabs.get(details.tabId);
    if (tab.url) {
      await checkXdebugStatus(details.tabId, tab.url);
    }
  }
});

// Register listeners
browser.tabs.onUpdated.addListener(handleTabUpdate);
browser.cookies.onChanged.addListener(handleCookieChange);

/**
 * Checks all open tabs and updates their icons based on xDebug state
 */
async function syncAllTabIcons(): Promise<void> {
  try {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url) {
        const domain = sanitizeDomain(tab.url);
        const state = await getDomainState(domain);
        if (state?.enabled) {
          await updateIcon(tab.id, true);
        } else {
          await updateIcon(tab.id, false);
        }
      }
    }
  } catch (error) {
    console.error('Failed to sync all tab icons:', error);
  }
}

// Sync icons on startup
browser.runtime.onStartup.addListener(() => {
  console.log('Extension started, syncing icons...');
  syncAllTabIcons();
});

syncAllTabIcons();