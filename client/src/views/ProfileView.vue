<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 animate-pulse animation-delay-2000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400 rounded-full opacity-10 animate-pulse animation-delay-4000"
      ></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div
        class="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-700 text-lg">Loading profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-screen"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4 border border-gray-100"
      >
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <ExclamationCircleIcon class="w-8 h-8 text-red-500" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link
          to="/login"
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium inline-block"
        >
          Go to Login
        </router-link>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="relative z-10 container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link
          to="/login"
          class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 mb-6"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Back to Login
        </router-link>
      </div>

      <!-- Profile Card -->
      <div class="max-w-md mx-auto mb-8">
        <div
          class="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div class="relative mb-6">
            <div
              class="w-28 h-28 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl"
            >
              <span class="text-white text-3xl font-bold">
                {{ profile.user.username.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-3">
            {{ profile.user.username }}
          </h1>
          <p v-if="profile.user.bio" class="text-gray-600 mb-4 leading-relaxed">
            {{ profile.user.bio }}
          </p>
          <p v-else class="text-gray-500 mb-4 italic">No bio available</p>
        </div>
      </div>

      <!-- Links Section -->
      <div class="max-w-md mx-auto">
        <div
          class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            Links
          </h2>

          <!-- Links List -->
          <div
            v-if="profile.links && profile.links.length > 0"
            class="space-y-4"
          >
            <a
              v-for="link in profile.links"
              :key="link._id"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              @click="incrementClick(link)"
              class="block bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200 group hover:scale-[1.02] hover:shadow-lg"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3
                    class="font-semibold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-200"
                  >
                    {{ link.title }}
                  </h3>
                </div>
                <ArrowTopRightOnSquareIcon
                  class="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors duration-200"
                />
              </div>
            </a>
          </div>

          <!-- Empty State -->
          <div
            v-if="!profile.links || profile.links.length === 0"
            class="text-center py-12"
          >
            <div
              class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <LinkIcon class="w-8 h-8 text-gray-500" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p class="text-gray-600">
              This user hasn't added any links to their profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ax from '../utils/axios';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline';

interface Link {
  _id: string;
  title: string;
  url: string;
  clicks: number;
}

interface User {
  _id: string;
  username: string;
  bio: string;
}

interface ProfileData {
  user: User;
  links: Link[];
}

const route = useRoute();
const loading = ref(true);
const error = ref('');
const profile = ref<ProfileData | null>(null);

const fetchProfile = async () => {
  try {
    loading.value = true;
    error.value = '';

    const username = route.params.username as string;
    console.log('Fetching profile for username:', username);

    // Use the full path to ensure correct routing
    const response = await ax.get(`/users/profile/${username}`);
    console.log('Profile data received:', response.data);

    // Ensure we're handling the response data structure correctly
    if (response.data && response.data.user) {
      profile.value = response.data;
    } else {
      console.error('Unexpected response data structure:', response.data);
      error.value = 'Failed to load profile. Unexpected data format.';
    }
  } catch (err: any) {
    console.error('Error fetching profile:', err);
    console.error('Error details:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      url: err.config?.url,
    });

    if (err.response?.status === 404) {
      error.value = 'User not found. Please check the username and try again.';
    } else {
      error.value = 'Failed to load profile. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
};

const incrementClick = async (link: Link) => {
  // Optimistically increment the click count
  link.clicks += 1;

  try {
    await ax.patch(`/links/${link._id}/click`);
  } catch (err) {
    console.error('Error incrementing click:', err);
    link.clicks -= 1;
  }
};

onMounted(() => {
  console.log('ProfileView mounted, route params:', route.params);
  fetchProfile();
});

// Watch for route changes to reload profile when navigating between profiles
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      console.log(
        'Username changed in route, reloading profile for:',
        newUsername
      );
      fetchProfile();
    }
  }
);
</script>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
