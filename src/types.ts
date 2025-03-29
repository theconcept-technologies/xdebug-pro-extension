import type { Tabs, Cookies } from 'webextension-polyfill';

// IDE profiles supported by the extension
export type IDEProfile = 'phpstorm' | 'vscode' | 'custom';

// Maximum length for custom IDE keys
export const MAX_CUSTOM_KEY_LENGTH = 20;

// Regular expression for validating custom IDE keys
export const CUSTOM_KEY_REGEX = /^[a-zA-Z0-9_-]+$/;

export interface DomainState {
  enabled: boolean;
  profile: IDEProfile;
  customKey?: string;
  lastModified: number;
}

export interface StorageData {
  domains: Record<string, DomainState>;
  defaultProfile: IDEProfile;
  defaultCustomKey?: string;
}

export interface CookieInfo {
  cookie: Cookies.Cookie;
  removed: boolean;
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

export function sanitizeDomain(url: string): string {
  const { hostname } = new URL(url);
  return hostname.toLowerCase();
}

export function createDomainState(
  enabled: boolean = false,
  profile: IDEProfile = 'phpstorm',
  customKey?: string
): DomainState {
  return {
    enabled,
    profile,
    customKey,
    lastModified: Date.now(),
  };
} 