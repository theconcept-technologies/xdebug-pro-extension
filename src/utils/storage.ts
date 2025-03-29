import browser from 'webextension-polyfill';
import { DomainState, IDEProfile, createDomainState } from '../types';

interface StorageData {
  domains: Record<string, DomainState>;
  defaultProfile: IDEProfile;
  defaultCustomKey?: string;
}

// Default storage data
const DEFAULT_STORAGE_DATA: StorageData = {
  domains: {},
  defaultProfile: 'phpstorm',
  defaultCustomKey: undefined,
};

/**
 * Get storage data
 */
export async function getStorageData(): Promise<StorageData> {
  const data = await browser.storage.local.get(DEFAULT_STORAGE_DATA) as StorageData;
  return {
    domains: data.domains || {},
    defaultProfile: data.defaultProfile || DEFAULT_STORAGE_DATA.defaultProfile,
    defaultCustomKey: data.defaultCustomKey,
  };
}

/**
 * Update storage data
 */
export async function updateStorageData(data: Partial<StorageData>) {
  await browser.storage.local.set(data);
}

/**
 * Get domain state
 */
export async function getDomainState(domain: string): Promise<DomainState | null> {
  const data = await getStorageData();
  return data.domains[domain] || null;
}

/**
 * Update domain state
 */
export async function updateDomainState(
  domain: string,
  state: DomainState
): Promise<void> {
  const data = await getStorageData();
  data.domains[domain] = {
    ...state,
    lastModified: Date.now(),
  };
  await updateStorageData({ domains: data.domains });
}

/**
 * Remove domain state
 */
export async function removeDomainState(domain: string): Promise<void> {
  const data = await getStorageData();
  delete data.domains[domain];
  await updateStorageData({ domains: data.domains });
}

/**
 * Get active domains
 */
export async function getActiveDomains(): Promise<[string, DomainState][]> {
  const data = await getStorageData();
  return Object.entries(data.domains)
    .filter(([_, state]) => state.enabled)
    .sort((a, b) => b[1].lastModified - a[1].lastModified);
}

/**
 * Get or create domain state
 */
export async function getOrCreateDomainState(domain: string): Promise<DomainState> {
  const data = await getStorageData();
  return (
    data.domains[domain] ||
    createDomainState(false, data.defaultProfile, data.defaultCustomKey)
  );
}

/**
 * Update default profile
 */
export async function updateDefaultProfile(
  profile: IDEProfile,
  customKey?: string
): Promise<void> {
  await updateStorageData({
    defaultProfile: profile,
    defaultCustomKey: customKey,
  });
} 