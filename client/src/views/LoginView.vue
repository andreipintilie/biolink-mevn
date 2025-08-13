<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 shadow-lg"
        >
          <LinkIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Biolink</h1>
        <p class="text-gray-600">Welcome back! Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-lg"
          >
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="flex items-center space-x-2">
              <ArrowPathIcon class="animate-spin w-5 h-5 text-white" />
              <span>Signing in...</span>
            </span>
          </button>

          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
          >
            <ExclamationCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0" />
            <span class="text-red-700 text-sm">{{ error }}</span>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm">
            Don't have an account?
            <router-link
              to="/register"
              class="text-green-500 hover:text-green-600 font-medium ml-1 transition-colors duration-200"
            >
              Create one
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { LinkIcon } from '@heroicons/vue/24/outline';
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
};
</script>
