<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo / App name -->
        <div
          class="flex items-center space-x-3 cursor-pointer"
          @click="router.push('/')"
        >
          <div class="p-2 bg-green-500 rounded-xl shadow-lg">
            <LinkIcon class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Biolink</h1>
        </div>

        <!-- User info -->
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2"
          >
            <div
              class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-white text-sm font-bold">
                {{ user?.username?.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="hidden sm:inline-block font-medium text-gray-900">
              {{ user?.username }}
            </span>
          </div>

          <!-- Logout button -->
          <button
            @click="onLogout"
            class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-lg"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            <span class="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { LinkIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
const router = useRouter();

defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['logout']);

const onLogout = () => {
  emit('logout');
};
</script>
