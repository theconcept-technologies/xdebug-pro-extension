import browser from 'webextension-polyfill';
import { StorageData, DomainState, IDEProfile } from '../types';

// Default storage data
const defaultStorageData: StorageData = {
  defaultProfile: 'phpstorm',
  domains: {},
  defaultMode: 'debug'
};

// Create a new domain state
export function createDomainState(profile: IDEProfile = 'phpstorm', enabled: boolean = false, customKey?: string): DomainState {
  return {
    enabled,
    profile,
    customKey,
    mode: 'debug'
  };
}

/**
 * Get storage data
 */
export async function getStorageData(): Promise<StorageData> {
  try {
    const result = await browser.storage.local.get('xdebugPro');
    const data = result.xdebugPro as StorageData | undefined;
    return data || defaultStorageData;
  } catch (error) {
    console.error('Failed to get storage data:', error);
    return defaultStorageData;
  }
}

/**
 * Get domain state
 */
export async function getDomainState(domain: string): Promise<DomainState | undefined> {
  const data = await getStorageData();
  return data.domains[domain];
}

/**
 * Update domain state
 */
export async function updateDomainState(domain: string, state: DomainState): Promise<void> {
  try {
    const data = await getStorageData();
    data.domains[domain] = state;
    await browser.storage.local.set({ xdebugPro: data });
  } catch (error) {
    console.error('Failed to update domain state:', error);
    throw error;
  }
}

/**
 * Remove domain state
 */
export async function removeDomainState(domain: string): Promise<void> {
  try {
    const data = await getStorageData();
    delete data.domains[domain];
    await browser.storage.local.set({ xdebugPro: data });
  } catch (error) {
    console.error('Failed to remove domain state:', error);
    throw error;
  }
}

/**
 * Get active domains
 */
export async function getActiveDomains(): Promise<Array<[string, DomainState]>> {
  const data = await getStorageData();
  return Object.entries(data.domains)
    .filter(([_, state]) => state.enabled)
    .sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * Get or create domain state
 */
export async function getOrCreateDomainState(domain: string): Promise<DomainState> {
  const data = await getStorageData();
  if (!data.domains[domain]) {
    const state: DomainState = {
      enabled: false,
      profile: data.defaultProfile,
      mode: data.defaultMode,
      ...(data.defaultProfile === 'custom' ? { customKey: data.defaultCustomKey } : {})
    };
    data.domains[domain] = state;
    await browser.storage.local.set({ xdebugPro: data });
  }
  return data.domains[domain];
}

/**
 * Update default profile
 */
export async function updateDefaultProfile(profile: IDEProfile, customKey?: string): Promise<void> {
  try {
    const data = await getStorageData();
    data.defaultProfile = profile;
    data.defaultCustomKey = customKey;
    await browser.storage.local.set({ xdebugPro: data });
  } catch (error) {
    console.error('Failed to update default profile:', error);
    throw error;
  }
} 