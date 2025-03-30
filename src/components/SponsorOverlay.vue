<!-- SponsorOverlay.vue -->
<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Modal panel -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <!-- Close button -->
          <div class="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="text-center">
            <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
              Loving xDebug Pro?
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                You've enabled xDebug {{ activationCount }} times. Consider supporting future development 💛
              </p>
            </div>
          </div>

          <div class="mt-5 flex flex-col gap-3">
            <a
              href="https://buymeacoffee.com/theconcepttechnologies"
              target="_blank"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <img src="@/assets/buymeacoffee.png" alt="Buy Me A Coffee" class="w-4 h-4 mr-2" />
              Buy us a coffee
            </a>
            <a
              href="https://github.com/sponsors/theconcept-technologies"
              target="_blank"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <img src="@/assets/github-mark.png" alt="GitHub" class="w-4 h-4 mr-2" />
              Sponsor on GitHub
            </a>
            <button
              type="button"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              @click="$emit('remindLater')"
            >
              Remind me later
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  activationCount: number;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'remindLater'): void;
}>();
</script> 