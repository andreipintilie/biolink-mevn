<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-12 px-4"
  >
    <!-- Header with Logo -->
    <div class="mb-10 text-center">
      <div class="p-3 bg-green-500 rounded-xl shadow-lg inline-block mb-4">
        <LinkIcon class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">BioLink</h1>
      <p class="text-xl mb-8 text-gray-600 max-w-md mx-auto">
        Your all-in-one platform for creating beautiful link pages
      </p>
    </div>

    <!-- Example Profile Card (Linktree Style) -->
    <div class="w-full max-w-md mx-auto mb-10">
      <div
        class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center mb-6"
      >
        <div class="relative mb-6">
          <div
            class="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-xl"
          >
            <span class="text-white text-3xl font-bold">B</span>
          </div>
          <div
            class="absolute -bottom-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-4 border-white shadow-lg"
          ></div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">@username</h2>
        <p class="text-gray-600 mb-6">Share all your links in one place</p>
      </div>

      <!-- Example Links (Linktree Style) -->
      <div class="space-y-4">
        <a
          href="#"
          class="block w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-xl transition-colors duration-200 shadow-md border border-gray-100 text-center"
        >
          Personal Website
        </a>
        <a
          href="#"
          class="block w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-xl transition-colors duration-200 shadow-md border border-gray-100 text-center"
        >
          Instagram
        </a>
        <a
          href="#"
          class="block w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-xl transition-colors duration-200 shadow-md border border-gray-100 text-center"
        >
          Twitter
        </a>
        <a
          href="#"
          class="block w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-xl transition-colors duration-200 shadow-md border border-gray-100 text-center"
        >
          YouTube Channel
        </a>
      </div>
    </div>

    <!-- Call to Action -->
    <div
      class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold text-gray-900 mb-4">
        Create Your Own BioLink
      </h3>
      <p class="text-gray-600 mb-6">
        Join thousands of creators who use BioLink to share everything they
        create, curate and sell online.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/register"
          class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg"
        >
          Get Started
        </router-link>
        <router-link
          to="/login"
          class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors duration-200 border border-gray-200"
        >
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LinkIcon } from '@heroicons/vue/24/outline';
// No additional logic needed for the home page
</script>
