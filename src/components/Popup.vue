<template>
  <div class="min-w-[320px] bg-white">
    <!-- Header -->
    <div class="bg-[#F6A623] p-4 shadow-md">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span class="text-[#F6A623] font-bold text-xl">X</span>
        </div>
        <h1 class="text-xl font-bold text-white">xDebug Pro</h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-3 space-y-3">
      <!-- IDE Profile Section -->
      <div class="space-y-1.5">
        <label class="block text-sm font-semibold text-gray-700">IDE Profile</label>
        <select
          v-model="selectedProfile"
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F6A623] focus:border-[#F6A623]"
        >
          <option value="phpstorm">PHPStorm</option>
          <option value="vscode">VS Code</option>
          <option value="custom">Custom</option>
        </select>

        <!-- Custom Key Input -->
        <div v-if="selectedProfile === 'custom'" class="mt-2">
          <input
            v-model="customKey"
            type="text"
            placeholder="Enter custom Xdebug key"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F6A623] focus:border-[#F6A623]"
          />
        </div>
      </div>

      <!-- xDebug Mode Section -->
      <div class="space-y-1.5">
        <label class="block text-sm font-semibold text-gray-700">Mode</label>
        <div class="grid grid-cols-3 gap-2">
          <!-- Debug Mode -->
          <button
            @click="selectedMode = 'debug'"
            :class="[
              'flex flex-col items-center p-3 rounded-lg border transition-all duration-200',
              selectedMode === 'debug'
                ? 'border-[#F6A623] bg-[#FFF8EC] text-[#F6A623]'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <BugAntIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Debug</span>
          </button>

          <!-- Profile Mode -->
          <button
            @click="selectedMode = 'profile'"
            :class="[
              'flex flex-col items-center p-3 rounded-lg border transition-all duration-200',
              selectedMode === 'profile'
                ? 'border-[#F6A623] bg-[#FFF8EC] text-[#F6A623]'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <ChartBarIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Profile</span>
          </button>

          <!-- Trace Mode -->
          <button
            @click="selectedMode = 'trace'"
            :class="[
              'flex flex-col items-center p-3 rounded-lg border transition-all duration-200',
              selectedMode === 'trace'
                ? 'border-[#F6A623] bg-[#FFF8EC] text-[#F6A623]'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <ArrowPathIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Trace</span>
          </button>
        </div>

        <!-- Mode Description -->
        <p class="text-xs text-gray-500 mt-2">
          <template v-if="selectedMode === 'debug'">
            Start an interactive debugging session
          </template>
          <template v-else-if="selectedMode === 'profile'">
            Profile the PHP code execution
          </template>
          <template v-else-if="selectedMode === 'trace'">
            Generate detailed execution trace
          </template>
        </p>
      </div>

      <!-- Current Domain Section -->
      <div class="space-y-1.5">
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-semibold text-gray-700 whitespace-nowrap">Current Domain</h2>
          <div class="group relative">
            <span class="text-xs text-gray-500 ml-2 truncate max-w-[180px]">{{ currentDomain || 'No active domain' }}</span>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {{ currentDomain || 'No active domain' }}
              <div class="absolute left-1/2 -translate-x-1/2 top-full -mt-2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
        <button
          @click="toggleCurrentDomain"
          :disabled="!currentDomain"
          :class="[
            'relative w-full px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden',
            isEnabled
              ? 'bg-[#F6A623] text-white hover:bg-[#E59512] focus:ring-[#F6A623] animate-pulse-subtle'
              : !currentDomain
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 shimmer-button'
          ]"
        >
          <span class="relative z-10">{{ isEnabled ? 'Disable xDebug' : 'Enable xDebug' }}</span>
          <div
            v-if="!isEnabled && currentDomain"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 -translate-x-full animate-shimmer"
            style="background-size: 200% 100%;"
          ></div>
        </button>

        <!-- Debug Status -->
        <div class="mt-2 text-xs">
          <div class="flex items-center justify-between p-2 bg-gray-50 rounded hidden">
            <span class="text-gray-600">Debug Cookie:</span>
            <span :class="[
              'font-mono',
              isEnabled ? 'text-green-600' : 'text-red-600'
            ]">
              {{ isEnabled 
                ? `XDEBUG_SESSION=${selectedProfile === 'custom' ? customKey : selectedProfile}` 
                : 'XDEBUG_TRIGGER=0' }}
            </span>
          </div>
          <div class="flex items-center justify-between mt-1">
            <button
              v-if="!isEnabled"
              @click="showDebugHelp = true"
              class="text-[#F6A623] hover:text-[#E59512] flex items-center"
            >
              <QuestionMarkCircleIcon class="h-4 w-4 mr-1" />
              Debug disabled
            </button>
            <button
              v-else
              @click="showDebugHelp = true"
              class="text-[#F6A623] hover:text-[#E59512] flex items-center"
            >
              <QuestionMarkCircleIcon class="h-4 w-4 mr-1" />
              Not working?
            </button>
          </div>
        </div>
      </div>

      <!-- Active Domains Section -->
      <div class="space-y-1.5">
        <h2 class="text-sm font-semibold text-gray-700">Active Domains</h2>
        <div v-if="activeDomains.length === 0" class="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
          No active domains
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="domain in activeDomains"
            :key="domain.name"
            class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
          >
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">{{ domain.name }}</div>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xs text-gray-500">{{ domain.profile }}</span>
                <span class="text-gray-300">•</span>
                <div class="flex items-center text-xs text-gray-500">
                  <component
                    :is="getModeIcon(domain.mode)"
                    class="w-3.5 h-3.5 mr-1"
                  />
                  {{ domain.mode }}
                </div>
              </div>
            </div>
            <button
              @click="removeDomain(domain.name)"
              class="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200 p-3">
      <div class="flex flex-col space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img src="@/assets/tc_logo.png" alt="theconcept technologies" class="h-5 w-auto" />
            <span class="text-xs text-gray-500">© {{ new Date().getFullYear() }} theconcept technologies</span>
          </div>
          <button
            @click="showCompanyInfo = true"
            class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
            title="About theconcept technologies"
          >
            <QuestionMarkCircleIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="flex items-center justify-center space-x-2">
          <a 
            href="https://buymeacoffee.com/theconcepttechnologies" 
            target="_blank"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <img src="@/assets/buymeacoffee.png" alt="Buy Me A Coffee" class="w-4 h-4 mr-1.5" />
            Buy us a coffee
          </a>
          <a 
            href="https://github.com/sponsors/theconcept-technologies" 
            target="_blank"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <img src="@/assets/github-mark.png" alt="GitHub" class="w-4 h-4 mr-1.5" />
            Sponsor on GitHub
          </a>
        </div>
      </div>

      <!-- Company Info Modal -->
      <div
        v-if="showCompanyInfo"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showCompanyInfo = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 relative">
          <button
            @click="showCompanyInfo = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
          
          <!-- Fixed header -->
          <div class="mb-3">
            <div class="flex items-center space-x-3 mb-3">
              <img src="@/assets/tc_logo.png" alt="theconcept technologies" class="h-8 w-auto" />
              <h3 class="text-lg font-semibold text-gray-900">theconcept technologies</h3>
            </div>
            
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-1">About Us</h4>
              <p class="text-sm text-gray-600">
                Leading AI and Web Development company specializing in innovative solutions for businesses.
                We create cutting-edge applications and provide expert consulting services.
              </p>
            </div>
          </div>

          <!-- Scrollable content -->
          <div class="max-h-[200px] overflow-y-auto pr-2 space-y-3">
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Debug Configuration</h4>
              <div class="text-sm text-gray-600 space-y-2">
                <template v-if="selectedProfile === 'phpstorm'">
                  <p>For PHPStorm users:</p>
                  <ul class="list-disc pl-4 space-y-1">
                    <li>Debug port: 9003 (or 9000 for older versions)</li>
                    <li>Enable "Can accept external connections"</li>
                    <li>Set max. simultaneous connections to 3 or higher</li>
                    <li>Go to Settings → PHP → Debug</li>
                    <li>Check "Allow connections with localhost IPv6 address"</li>
                  </ul>
                  <p class="mt-2">
                    Make sure Xdebug is installed and configured on your web server. 
                    Validate the configuration using PHPStorm's built-in validator.
                  </p>
                </template>

                <template v-else-if="selectedProfile === 'vscode'">
                  <p>For VS Code users:</p>
                  <ul class="list-disc pl-4 space-y-1">
                    <li>Install PHP Debug extension</li>
                    <li>Add this to launch.json:</li>
                    <pre class="bg-gray-50 p-2 rounded mt-1 text-xs">
{
  "version": "0.2.0",
  "configurations": [{
    "name": "Listen for Xdebug",
    "type": "php",
    "request": "launch",
    "port": 9003
  }]
}</pre>
                    <li>Start debugging (F5)</li>
                    <li>Set breakpoints in your code</li>
                  </ul>
                  <p class="mt-2">
                    Ensure your php.ini has Xdebug configured with client_host and client_port.
                  </p>
                </template>

                <template v-else>
                  <p>For custom IDE setup:</p>
                  <ul class="list-disc pl-4 space-y-1">
                    <li>Configure your IDE to listen on port 9003</li>
                    <li>Set up path mappings if needed</li>
                    <li>Configure Xdebug in php.ini</li>
                  </ul>
                  <p class="mt-2">
                    Use the custom key you specified for the IDE session name.
                  </p>
                </template>
              </div>
            </div>
          </div>

          <!-- Fixed footer -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <a
              href="https://theconcept-technologies.com"
              target="_blank"
              class="inline-block text-sm text-[#F6A623] hover:text-[#E59512] font-medium"
            >
              Visit our website →
            </a>
          </div>
        </div>
      </div>

      <!-- Debug Help Modal -->
      <div
        v-if="showDebugHelp"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showDebugHelp = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 relative">
          <button
            @click="showDebugHelp = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
          
          <!-- Fixed header -->
          <div class="mb-3">
            <h3 class="text-lg font-semibold text-gray-900">Debug Session Troubleshooting</h3>
            <p class="text-sm text-gray-600 mt-1">
              Follow these steps to troubleshoot your debug session.
            </p>
          </div>
          
          <!-- Scrollable content -->
          <div class="max-h-[200px] overflow-y-auto pr-2 space-y-4">
            <div>
              <h4 class="font-medium text-gray-900">1. Verify Cookie</h4>
              <p class="text-gray-600">Check if XDEBUG_SESSION cookie is set:</p>
              <ol class="list-decimal ml-4 mt-1 text-gray-600">
                <li>Open Chrome DevTools (F12)</li>
                <li>Go to Application → Cookies</li>
                <li>Look for XDEBUG_SESSION=phpstorm</li>
              </ol>
            </div>

            <div>
              <h4 class="font-medium text-gray-900">2. Check PHPStorm</h4>
              <ul class="list-disc ml-4 text-gray-600">
                <li>Ensure "Start Listen for PHP Debug Connections" is enabled (phone icon)</li>
                <li>Check Debug port in Settings → PHP → Debug (default: 9003)</li>
                <li>Verify "Can accept external connections" is checked</li>
              </ul>
            </div>

            <div>
              <h4 class="font-medium text-gray-900">3. Verify Xdebug</h4>
              <p class="text-gray-600">Add this code to your PHP file to check Xdebug:</p>
              <pre class="bg-gray-50 p-2 rounded mt-1 text-xs">
&lt;?php
var_dump(xdebug_info());</pre>
              <p class="text-gray-600 mt-1">This will show Xdebug configuration and status.</p>
            </div>

            <div>
              <h4 class="font-medium text-gray-900">4. Common Issues</h4>
              <ul class="list-disc ml-4 text-gray-600">
                <li>Firewall blocking port 9003</li>
                <li>Wrong client_host in php.ini</li>
                <li>xdebug.mode not including "debug"</li>
                <li>PHPStorm not listening for connections</li>
              </ul>
            </div>

            <div>
              <h4 class="font-medium text-gray-900">5. PHP Configuration</h4>
              <p class="text-gray-600">Required php.ini settings:</p>
              <pre class="bg-gray-50 p-2 rounded mt-1 text-xs">
xdebug.mode = debug
xdebug.client_host = localhost
xdebug.client_port = 9003
xdebug.start_with_request = trigger</pre>
            </div>
          </div>

          <!-- Fixed footer -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Still having issues? Check the 
              <a 
                href="https://xdebug.org/docs/step_debug" 
                target="_blank" 
                class="text-[#F6A623] hover:text-[#E59512]"
              >
                Xdebug documentation
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <SponsorOverlay
      :show="showSponsorOverlay"
      :activation-count="activationCount"
      @close="handleSponsorOverlayClose"
      @remind-later="handleRemindLater"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { DomainState, IDEProfile, XDebugMode } from '../types';
import {
  getStorageData,
  updateDomainState,
  removeDomainState,
  getOrCreateDomainState,
  updateDefaultProfile
} from '../utils/storage';
import { updateXdebugCookie } from '../utils/cookie';
import {
  BugAntIcon,
  ChartBarIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import SponsorOverlay from './SponsorOverlay.vue';
import { incrementActivationCount, markMilestoneShown, deferOverlay } from '../utils/sponsorStorage';

declare const chrome: typeof import('chrome');

const selectedProfile = ref<IDEProfile>('phpstorm');
const selectedMode = ref<XDebugMode>('debug');
const customKey = ref('');
const currentDomain = ref('');
const isEnabled = ref(false);
const activeDomains = ref<Array<{ name: string; profile: string; mode: XDebugMode }>>([]);
const error = ref<string | null>(null);
const showCompanyInfo = ref(false);
const showDebugHelp = ref(false);
const showSponsorOverlay = ref(false);
const currentMilestone = ref<number | undefined>();
const activationCount = ref(0);

// Get domain from URL
function getDomainFromUrl(url: string): string {
  try {
    // Handle localhost URLs
    if (url.includes('localhost') || url.match(/^(127\.0\.0\.1|::1)/)) {
      // Extract hostname and optional port
      const matches = url.match(/^(?:https?:\/\/)?([^/?#]+)/) || [];
      const hostWithPort = matches[1] || 'localhost';
      
      // Keep port number for localhost
      return hostWithPort;
    }

    // Add protocol if not present
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    const urlObj = new URL(url);
    // For non-localhost, include port only if it's non-standard
    const port = urlObj.port;
    const includePort = port && port !== '80' && port !== '443';
    return includePort ? `${urlObj.hostname}:${port}` : urlObj.hostname;
  } catch (e) {
    console.error('Failed to parse URL:', e);
    // If URL parsing fails but contains localhost, return localhost
    if (url.includes('localhost')) {
      return url.split('/')[0] || 'localhost';
    }
    return url;
  }
}

// Initialize the popup
async function initializePopup() {
  try {
    error.value = null;
    const data = await getStorageData();
    selectedProfile.value = data.defaultProfile;
    selectedMode.value = data.defaultMode || 'debug';
    customKey.value = data.defaultCustomKey || '';

    // Get current tab domain
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    if (currentTab?.url) {
      currentDomain.value = getDomainFromUrl(currentTab.url);
      const state = await getOrCreateDomainState(currentDomain.value);
      isEnabled.value = state.enabled;
      selectedMode.value = state.mode || 'debug';
    }

    // Load active domains
    await loadActiveDomains();
  } catch (e) {
    error.value = 'Failed to initialize: ' + (e instanceof Error ? e.message : String(e));
    console.error('Initialization error:', e);
  }
}

// Load active domains
async function loadActiveDomains() {
  try {
    error.value = null;
    const data = await getStorageData();
    activeDomains.value = Object.entries(data.domains || {})
      .filter(([_, state]) => state.enabled)
      .map(([domain, state]) => ({
        name: domain,
        profile: state.profile === 'custom' ? state.customKey || 'custom' : state.profile,
        mode: state.mode || 'debug'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    error.value = 'Failed to load domains: ' + (e instanceof Error ? e.message : String(e));
    console.error('Load domains error:', e);
  }
}

// Toggle xDebug for current domain
async function toggleCurrentDomain() {
  if (!currentDomain.value) return;

  try {
    error.value = null;
    const state = await getOrCreateDomainState(currentDomain.value);
    
    // If we're enabling debugging, increment the activation count
    if (!state.enabled) {
      const { count, shouldShowOverlay, milestone } = await incrementActivationCount();
      if (shouldShowOverlay && milestone) {
        showSponsorOverlay.value = true;
        currentMilestone.value = milestone;
        activationCount.value = count;
      }
    }
    
    state.enabled = !state.enabled;
    state.profile = selectedProfile.value;
    state.mode = selectedMode.value;
    if (selectedProfile.value === 'custom') {
      state.customKey = customKey.value;
    }

    await updateDomainState(currentDomain.value, state);
    await updateXdebugCookie(currentDomain.value, state);
    isEnabled.value = state.enabled;
    await loadActiveDomains();
  } catch (e) {
    error.value = 'Failed to toggle xDebug: ' + (e instanceof Error ? e.message : String(e));
    console.error('Toggle domain error:', e);
  }
}

// Remove domain
async function removeDomain(domain: string) {
  try {
    error.value = null;
    await removeDomainState(domain);
    await updateXdebugCookie(domain, { enabled: false, profile: selectedProfile.value });
    
    // Update current domain state if it matches the removed domain
    if (domain === currentDomain.value) {
      isEnabled.value = false;
    }
    
    await loadActiveDomains();
  } catch (e) {
    error.value = 'Failed to remove domain: ' + (e instanceof Error ? e.message : String(e));
    console.error('Remove domain error:', e);
  }
}

// Watch for profile changes
watch(selectedProfile, async (newProfile) => {
  try {
    error.value = null;
    await updateDefaultProfile(newProfile, newProfile === 'custom' ? customKey.value : undefined);
  } catch (e) {
    error.value = 'Failed to update profile: ' + (e instanceof Error ? e.message : String(e));
    console.error('Profile change error:', e);
  }
});

// Watch for custom key changes
watch(customKey, async (newKey) => {
  try {
    error.value = null;
    if (selectedProfile.value === 'custom') {
      await updateDefaultProfile('custom', newKey);
    }
  } catch (e) {
    error.value = 'Failed to update custom key: ' + (e instanceof Error ? e.message : String(e));
    console.error('Custom key change error:', e);
  }
});

// Watch for mode changes
watch(selectedMode, async (newMode) => {
  try {
    error.value = null;
    if (currentDomain.value) {
      const state = await getOrCreateDomainState(currentDomain.value);
      state.mode = newMode;
      await updateDomainState(currentDomain.value, state);
      await updateXdebugCookie(currentDomain.value, state);
    }
  } catch (e) {
    error.value = 'Failed to update mode: ' + (e instanceof Error ? e.message : String(e));
    console.error('Mode change error:', e);
  }
});

// Get mode icon component
function getModeIcon(mode: XDebugMode) {
  switch (mode) {
    case 'debug':
      return BugAntIcon;
    case 'profile':
      return ChartBarIcon;
    case 'trace':
      return ArrowPathIcon;
    default:
      return BugAntIcon;
  }
}

// Add sponsor overlay handlers
async function handleSponsorOverlayClose() {
  if (currentMilestone.value) {
    await markMilestoneShown(currentMilestone.value);
  }
  showSponsorOverlay.value = false;
}

async function handleRemindLater() {
  await deferOverlay();
  showSponsorOverlay.value = false;
}

// Initialize on mount
onMounted(initializePopup);
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

.shimmer-button {
  position: relative;
  overflow: hidden;
}

.animate-shimmer {
  animation: shimmer 3.5s ease-in-out infinite;
}
</style> 