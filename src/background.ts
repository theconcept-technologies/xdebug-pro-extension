import browser from 'webextension-polyfill';
import type { Tabs } from 'webextension-polyfill';
import { CookieInfo, sanitizeDomain, IDEProfile, createDomainState } from './types';
import { updateXdebugCookie } from './utils/cookie';
import { getDomainState, updateDomainState } from './utils/storage';

/**
 * Handles tab updates to manage Xdebug session state
 */
async function handleTabUpdate(
  _tabId: number,
  changeInfo: Tabs.OnUpdatedChangeInfoType,
  tab: Tabs.Tab
): Promise<void> {
  // Only process if URL changed and is complete
  if (!changeInfo.url || !tab.url) {
    return;
  }

  try {
    const domain = sanitizeDomain(tab.url);
    const state = await getDomainState(domain);
    if (state) {
      await updateXdebugCookie(domain, state);
    }
  } catch (error) {
    console.error('Failed to handle tab update:', error);
  }
}

/**
 * Handles cookie changes to sync state
 */
async function handleCookieChange({ cookie, removed }: CookieInfo): Promise<void> {
  if (cookie.name === 'XDEBUG_SESSION') {
    try {
      const domain = cookie.domain.replace(/^\./, '');
      let state = await getDomainState(domain);

      if (!state) {
        state = createDomainState();
      }

      if (removed && state.enabled) {
        state.enabled = false;
        await updateDomainState(domain, state);
      } else if (!removed && !state.enabled) {
        const profile = cookie.value as IDEProfile;
        if (profile === 'phpstorm' || profile === 'vscode' || profile === 'custom') {
          state.profile = profile;
          state.enabled = true;
          await updateDomainState(domain, state);
        }
      }
    } catch (error) {
      console.error('Failed to handle cookie change:', error);
    }
  }
}

// Register listeners
browser.tabs.onUpdated.addListener(handleTabUpdate);
browser.cookies.onChanged.addListener(handleCookieChange); 