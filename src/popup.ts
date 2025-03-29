import browser from 'webextension-polyfill';
import { DomainState, IDEProfile, sanitizeCustomKey } from './types';
import { updateXdebugCookie } from './utils/cookie';
import {
  getStorageData,
  updateDomainState,
  removeDomainState,
  getOrCreateDomainState,
  updateDefaultProfile
} from './utils/storage';

// DOM Elements
const profileSelect = document.getElementById('profile') as HTMLSelectElement;
const customKeyInput = document.getElementById('customKey') as HTMLInputElement;
const customKeyContainer = document.getElementById('customKeyContainer') as HTMLDivElement;
const domainsList = document.getElementById('domainsList') as HTMLDivElement;

/**
 * Initialize the popup
 */
async function initializePopup() {
  const data = await getStorageData();
  
  // Set up profile selection
  profileSelect.value = data.defaultProfile;
  customKeyContainer.style.display = data.defaultProfile === 'custom' ? 'block' : 'none';
  if (data.defaultCustomKey) {
    customKeyInput.value = data.defaultCustomKey;
  }

  // Set up event listeners
  profileSelect.addEventListener('change', handleProfileChange);
  customKeyInput.addEventListener('input', handleCustomKeyInput);

  // Initial render
  await renderDomainList(data.domains);
}

/**
 * Handle profile selection change
 */
async function handleProfileChange() {
  const profile = profileSelect.value as IDEProfile;
  customKeyContainer.style.display = profile === 'custom' ? 'block' : 'none';
  
  const customKey = profile === 'custom' ? customKeyInput.value : undefined;
  await updateDefaultProfile(profile, customKey);

  // Update current tab if needed
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab.url) {
    const domain = new URL(tab.url).hostname;
    const state = await getOrCreateDomainState(domain);
    if (state.enabled) {
      state.profile = profile;
      state.customKey = customKey;
      await updateDomainState(domain, state);
      await updateXdebugCookie(domain, state);
    }
  }
}

/**
 * Handle custom key input
 */
async function handleCustomKeyInput() {
  const sanitizedKey = sanitizeCustomKey(customKeyInput.value);
  customKeyInput.value = sanitizedKey;
  
  if (profileSelect.value === 'custom') {
    await updateDefaultProfile('custom', sanitizedKey);
  }
}

/**
 * Create a domain list item
 */
function createDomainListItem(domain: string, state: DomainState): HTMLElement {
  const item = document.createElement('div');
  item.className = 'domain-item';
  
  const toggle = document.createElement('button');
  toggle.className = `toggle-button ${state.enabled ? 'enabled' : 'disabled'}`;
  toggle.textContent = state.enabled ? 'Enabled' : 'Disabled';
  toggle.onclick = async () => {
    state.enabled = !state.enabled;
    await updateDomainState(domain, state);
    await updateXdebugCookie(domain, state);
    await renderDomainList((await getStorageData()).domains);
  };

  const remove = document.createElement('button');
  remove.className = 'remove-button';
  remove.textContent = 'Remove';
  remove.onclick = async () => {
    await removeDomainState(domain);
    await updateXdebugCookie(domain, { ...state, enabled: false });
    await renderDomainList((await getStorageData()).domains);
  };

  const domainText = document.createElement('span');
  domainText.className = 'domain-text';
  domainText.textContent = domain;

  const profileBadge = document.createElement('span');
  profileBadge.className = 'profile-badge';
  profileBadge.textContent = state.profile;

  item.appendChild(domainText);
  item.appendChild(profileBadge);
  item.appendChild(toggle);
  item.appendChild(remove);

  return item;
}

/**
 * Render domain list
 */
async function renderDomainList(domains: Record<string, DomainState>): Promise<void> {
  domainsList.innerHTML = '';
  Object.entries(domains).forEach(([domain, state]) => {
    domainsList.appendChild(createDomainListItem(domain, state));
  });
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup); 