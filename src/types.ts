/// <reference types="chrome"/>

import browser from 'webextension-polyfill';
import type { Tabs } from 'webextension-polyfill';

// IDE profiles supported by the extension
export type IDEProfile = 'phpstorm' | 'vscode' | 'custom';

// xDebug modes
export type XDebugMode = 'debug' | 'profile' | 'trace' | 'off';

// Maximum length for custom IDE keys
export const MAX_CUSTOM_KEY_LENGTH = 20;

// Regular expression for validating custom IDE keys
export const CUSTOM_KEY_REGEX = /^[a-zA-Z0-9_-]+$/;

// Domain state interface
export interface DomainState {
  enabled: boolean;
  profile: IDEProfile;
  customKey?: string;
  mode: XDebugMode;
}

// Storage data interface
export interface StorageData {
  domains: Record<string, DomainState>;
  defaultProfile: IDEProfile;
  defaultCustomKey?: string;
  defaultMode: XDebugMode;
}

// Cookie change info
export interface CookieInfo {
  cookie: browser.Cookies.Cookie;
  removed: boolean;
  cause?: string;
}

export interface TabUpdateInfo {
  tabId: number;
  changeInfo: Tabs.OnUpdatedChangeInfoType;
  tab: Tabs.Tab;
}

// Utility functions
export function isValidCustomKey(key: string): boolean {
  return (
    key.length > 0 &&
    key.length <= MAX_CUSTOM_KEY_LENGTH &&
    CUSTOM_KEY_REGEX.test(key)
  );
}

export function sanitizeCustomKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, MAX_CUSTOM_KEY_LENGTH);
}

// Create default domain state
export function createDomainState(): DomainState {
  return {
    enabled: false,
    profile: 'phpstorm',
    mode: 'debug'
  };
}

// Sanitize domain
export function sanitizeDomain(url: string): string {
  try {
    // Handle URLs without protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    const urlObj = new URL(url);
    
    // For localhost or IP-based URLs, include the port
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname === '127.0.0.1' || 
        urlObj.hostname === '::1') {
      return urlObj.port ? `${urlObj.hostname}:${urlObj.port}` : urlObj.hostname;
    }

    // For other domains, include port only if it's non-standard
    const port = urlObj.port;
    const includePort = port && port !== '80' && port !== '443';
    return includePort ? `${urlObj.hostname}:${port}` : urlObj.hostname;
  } catch {
    // If URL parsing fails but contains localhost, try to extract hostname and port
    if (url.includes('localhost')) {
      const matches = url.match(/^(?:https?:\/\/)?([^/?#]+)/) || [];
      return matches[1] || url;
    }
    return url;
  }
} 