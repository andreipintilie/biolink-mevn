<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    <!-- Header -->
    <Header :user="authStore.user" @logout="handleLogout" />

    <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div
            class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div class="text-center">
              <div class="relative mb-6">
                <div
                  class="w-28 h-28 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl"
                >
                  <span class="text-white text-3xl font-bold">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div
                  class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"
                ></div>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">
                {{ authStore.user?.username }}
              </h2>
              <p class="text-gray-600 mb-6 leading-relaxed">
                {{ userProfile.bio || 'Add your bio here' }}
              </p>
              <div class="space-y-3">
                <button
                  @click="showProfileEdit = true"
                  class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg font-medium"
                >
                  Edit Profile
                </button>
                <button
                  @click="copyProfileLink"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl transition-colors duration-200 border border-gray-200 font-medium"
                >
                  Copy Profile Link
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Links Management -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900">Your Links</h3>
              <button
                @click="showAddLink = true"
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center shadow-lg font-medium"
              >
                <PlusIcon class="w-5 h-5 mr-2" />
                Add Link
              </button>
            </div>

            <!-- Links List -->
            <div class="space-y-4">
              <div
                v-for="link in links"
                :key="link._id || link.id"
                class="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 text-lg mb-2">
                      {{ link.title }}
                    </h4>
                    <p class="text-gray-600 truncate mb-3 text-sm">
                      {{ link.url }}
                    </p>
                    <div class="flex items-center text-sm text-gray-500">
                      <div
                        class="flex items-center bg-gray-200 rounded-full px-3 py-1"
                      >
                        <EyeIcon class="w-4 h-4 mr-2" />
                        <span class="font-medium"
                          >{{ link.clicks || 0 }} clicks</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <button
                      @click="openLink(link.url)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                      title="View Link"
                    >
                      <EyeIcon class="w-5 h-5" />
                      <!-- Removed commented out path -->
                    </button>
                    <button
                      @click="editLink(link)"
                      class="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors duration-200"
                      title="Edit Link"
                    >
                      <PencilIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="deleteLink(link)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                      title="Delete Link"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="links.length === 0" class="text-center py-16">
                <div class="mb-6">
                  <LinkIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  No links yet
                </h3>
                <p class="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  Start building your link tree by adding your first link and
                  share your digital presence.
                </p>
                <button
                  @click="showAddLink = true"
                  class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl transition-colors duration-200 shadow-lg font-medium"
                >
                  Add Your First Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Link Modal -->
    <div
      v-if="showAddLink || editingLink"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          {{ editingLink ? 'Edit Link' : 'Add New Link' }}
        </h3>
        <form @submit.prevent="saveLink">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="linkForm.title"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              placeholder="My Awesome Link"
              required
            />
          </div>
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >URL</label
            >
            <input
              v-model="linkForm.url"
              type="url"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              placeholder="https://example.com"
              required
            />
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg font-medium"
            >
              {{ editingLink ? 'Update Link' : 'Add Link' }}
            </button>
            <button
              type="button"
              @click="cancelLinkForm"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Profile Edit Modal -->
    <div
      v-if="showProfileEdit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Edit Bio</h3>
        <form @submit.prevent="saveProfile">
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Bio</label
            >
            <textarea
              v-model="profileForm.bio"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
              rows="4"
              placeholder="Tell people about yourself..."
            ></textarea>
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg font-medium"
            >
              Save Profile
            </button>
            <button
              type="button"
              @click="showProfileEdit = false"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useLinksStore } from '../stores/links';
import Header from '../components/Header.vue';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const linksStore = useLinksStore();
const router = useRouter();

// Reactive data
const showAddLink = ref(false);
const showProfileEdit = ref(false);
const editingLink = ref(false);
const editingLinkId = ref(null);

const userProfile = reactive({
  bio: '',
});

const linkForm = reactive({
  title: '',
  url: '',
});

const profileForm = reactive({
  bio: userProfile.bio,
});

// Computed properties
const links = computed(() => linksStore.links);

// Load links and initialize profile on component mount
onMounted(async () => {
  await linksStore.fetchLinks();

  // Initialize bio from user data
  if (authStore.user && authStore.user.bio) {
    userProfile.bio = authStore.user.bio;
    profileForm.bio = authStore.user.bio;
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const saveLink = async () => {
  try {
    if (editingLink.value && editingLinkId.value) {
      // Update existing link
      const result = await linksStore.updateLink(editingLinkId.value, {
        title: linkForm.title,
        url: linkForm.url,
      });

      if (!result.success) {
        console.error(`Error updating link: ${result.message}`);
        return;
      }
    } else {
      // Add new link
      const result = await linksStore.createLink({
        title: linkForm.title,
        url: linkForm.url,
      });

      if (!result.success) {
        console.error(`Error creating link: ${result.message}`);
        return;
      }
    }

    cancelLinkForm();
  } catch (error) {
    console.error('Error in saveLink:', error);
  }
};

const editLink = (link) => {
  editingLink.value = true;
  editingLinkId.value = link._id || null;
  linkForm.title = link.title;
  linkForm.url = link.url;
  showAddLink.value = true;
};

const deleteLink = async (link) => {
  if (confirm('Are you sure you want to delete this link?')) {
    if (link._id) {
      try {
        await linksStore.deleteLink(link._id);
        await linksStore.fetchLinks();
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  }
};

const cancelLinkForm = () => {
  showAddLink.value = false;
  editingLink.value = false;
  editingLinkId.value = null;
  linkForm.title = '';
  linkForm.url = '';
};

const saveProfile = async () => {
  try {
    const result = await authStore.updateUserProfile({
      bio: profileForm.bio,
      // In the future, you can add more fields here:
      // displayName: profileForm.displayName,
      // profilePicture: profileForm.profilePicture
    });

    if (result.success) {
      userProfile.bio = profileForm.bio;
      showProfileEdit.value = false;
    } else {
      console.error(`Error updating profile: ${result.message}`);
    }
  } catch (error) {
    console.error('Error in saveProfile:', error);
  }
};

const openLink = (url) => {
  window.open(url, '_blank');
};

const copyProfileLink = async () => {
  const profileUrl = `${window.location.origin}/${authStore.user?.username}`;
  try {
    await navigator.clipboard.writeText(profileUrl);
    console.log('Profile link copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>
