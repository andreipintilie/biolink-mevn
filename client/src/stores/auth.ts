import ax from '../utils/axios.js';
import { defineStore } from 'pinia';
import type { IUser } from '@/shared/index';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthState {
  user: IUser | null;
  status: AuthStatus;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    status: 'idle',
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean =>
      state.status === 'authenticated' && !!state.user,
  },

  actions: {
    async login(payload: {
      email: string;
      password: string;
    }): Promise<{ success: boolean; message: string }> {
      this.status = 'loading';
      this.error = null;

      try {
        await ax.post('/auth/login', payload);
        await this.checkAuth();
        this.status = 'authenticated';
        return { success: true, message: '' };
      } catch (err: any) {
        this.status = 'error';
        const message = err.response?.data?.message || 'Login failed';
        this.error = message;
        return { success: false, message };
      }
    },

    async register(payload: {
      username: string;
      email: string;
      password: string;
    }): Promise<{ success: boolean; message: string }> {
      this.status = 'loading';
      this.error = null;

      try {
        await ax.post('/auth/register', payload);
        await this.checkAuth();
        this.status = 'authenticated';
        return { success: true, message: '' };
      } catch (err: any) {
        this.status = 'error';
        const message = err.response?.data?.msg || 'Registration failed';
        this.error = message;
        return { success: false, message };
      }
    },

    async checkAuth() {
      try {
        const { data } = await ax.get<IUser>('/users/me');

        this.user = data;
        this.status = 'authenticated';
      } catch (error) {
        this.user = null;
        this.status = 'idle';
        console.log(error);
      }
    },

    async logout() {
      try {
        await ax.get('/auth/logout');
      } finally {
        this.user = null;
        this.status = 'idle';
      }
    },

    async updateUserProfile(profileData: {
      bio?: string;
      displayName?: string;
      profilePicture?: string;
    }): Promise<{ success: boolean; message: string }> {
      try {
        const { data } = await ax.patch('/users/profile', profileData);

        // Update the user in the store
        if (this.user) {
          // Update only the fields that were returned
          if (data.bio !== undefined) this.user.bio = data.bio;
          if (data.username !== undefined) this.user.username = data.username;
          // if (data.profilePicture !== undefined) this.user.profilePicture = data.profilePicture;
        }

        return { success: true, message: 'Profile updated successfully' };
      } catch (err: any) {
        const message = err.response?.data?.msg || 'Failed to update profile';
        console.error('Error updating profile:', message);
        return { success: false, message };
      }
    },

    // Keep for backward compatibility
    async updateBio(
      bio: string
    ): Promise<{ success: boolean; message: string }> {
      return this.updateUserProfile({ bio });
    },
  },
});
