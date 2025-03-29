<script setup lang="ts">
import { XMarkIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  show: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
<!-- Debug Help Modal -->
<div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        <QuestionMarkCircleIcon class="h-6 w-6 mr-2 text-[#F6A623]" />
        Debug Help
      </h2>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <!-- Content -->
    <div class="p-6 overflow-y-auto">
      <div class="space-y-6">
        <!-- Required Configuration -->
        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Required Xdebug Configuration</h3>
          <div class="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <p class="mb-2"># php.ini or xdebug.ini</p>
            <p>xdebug.mode = debug</p>
            <p class="bg-yellow-50 border-l-4 border-yellow-400 pl-2">xdebug.start_with_request = trigger</p>
            <p>xdebug.client_host = localhost # or your IP if remote</p>
            <p>xdebug.client_port = 9003 # default for Xdebug 3</p>
          </div>
          <div class="mt-3 text-sm">
            <div class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-3">
              <p class="font-medium text-amber-800 mb-2">⚠️ Important: xdebug.start_with_request = trigger</p>
              <p class="text-amber-700">This setting is crucial for the extension to work properly. It ensures that:</p>
              <ul class="list-disc ml-4 mt-2 space-y-1 text-amber-700">
                <li>Debugging only starts when explicitly triggered by the extension</li>
                <li>PHPStorm won't automatically start debugging every request</li>
                <li>You can properly toggle debugging on/off via the extension</li>
              </ul>
              <a href="https://xdebug.org/docs/all_settings#start_with_request#trigger" 
                 target="_blank" 
                 class="inline-flex items-center mt-2 text-amber-800 hover:text-amber-900">
                <span>Read more in Xdebug documentation</span>
                <svg class="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-600">
            <p class="flex items-center text-amber-600">
              <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
              Important: After changing Xdebug configuration, you must:
            </p>
            <ul class="list-disc ml-8 mt-2 space-y-1">
              <li>Restart your PHP service (e.g., Apache, PHP-FPM)</li>
              <li>If using Docker, restart your containers</li>
              <li>Verify changes with <code class="bg-gray-100 px-1 rounded">php -i | grep xdebug</code></li>
            </ul>
          </div>
        </section>

        <!-- IDE Setup -->
        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">IDE Setup</h3>
          <div class="space-y-3">
            <div>
              <h4 class="font-medium mb-2">PHPStorm</h4>
              <ol class="list-decimal ml-5 space-y-2 text-sm">
                <li>Go to Settings → PHP → Debug</li>
                <li>Set Debug Port to 9003 (default for Xdebug 3)</li>
                <li>Enable "Can accept external connections"</li>
                <li>Click "Start Listening for PHP Debug Connections"</li>
              </ol>
            </div>
            <div>
              <h4 class="font-medium mb-2">VS Code</h4>
              <ol class="list-decimal ml-5 space-y-2 text-sm">
                <li>Install PHP Debug extension</li>
                <li>Add debug configuration for Listen for Xdebug</li>
                <li>Set port to 9003 in launch.json</li>
                <li>Start debugging (F5)</li>
              </ol>
            </div>
          </div>
        </section>

        <!-- Troubleshooting -->
        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Troubleshooting</h3>
          <div class="space-y-3 text-sm">
            <p>If debugging is not working:</p>
            <ol class="list-decimal ml-5 space-y-2">
              <li>Verify Xdebug is installed and enabled:
                <code class="block bg-gray-50 p-2 mt-1 rounded">php -v</code>
              </li>
              <li>Check Xdebug logs for connection issues:
                <div class="bg-gray-50 p-2 mt-1 rounded">
                  <p># Add to php.ini:</p>
                  <p>xdebug.log = "/path/to/xdebug.log"</p>
                  <p>xdebug.log_level = 7</p>
                </div>
              </li>
              <li>Ensure your firewall allows connections on port 9003</li>
              <li>For Docker, ensure proper network configuration and port mapping</li>
            </ol>
          </div>
        </section>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t p-4 flex justify-end">
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  </div>
</div>
</template> 