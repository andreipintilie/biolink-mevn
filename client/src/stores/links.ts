import ax from '../utils/axios';
import { defineStore } from 'pinia';

interface Link {
  _id?: string;
  id?: number;
  title: string;
  url: string;
  clicks: number;
  createdAt?: string;
  updatedAt?: string;
}

type LinksStatus = 'idle' | 'loading' | 'success' | 'error';

interface LinksState {
  links: Link[];
  status: LinksStatus;
  error: string | null;
}

export const useLinksStore = defineStore('links', {
  state: (): LinksState => ({
    links: [],
    status: 'idle',
    error: null,
  }),

  getters: {
    totalClicks: (state): number => {
      return state.links.reduce((total, link) => total + link.clicks, 0);
    },
    linkCount: (state): number => state.links.length,
    isLoading: (state): boolean => state.status === 'loading',
  },

  actions: {
    async fetchLinks(): Promise<void> {
      this.status = 'loading';
      this.error = null;

      try {
        const { data } = await ax.get<Link[]>('/links');
        this.links = data;
        this.status = 'success';
      } catch (err: any) {
        this.status = 'error';
        this.error = err.response?.data?.message || 'Failed to fetch links';
        console.error('Error fetching links:', err);
      }
    },

    async createLink(linkData: { title: string; url: string }): Promise<{ success: boolean; message: string }> {
      this.status = 'loading';
      this.error = null;

      try {
        const { data } = await ax.post<{ link: Link }>('/links/create-link', linkData);
        this.links.push(data.link);
        this.status = 'success';
        return { success: true, message: 'Link created successfully' };
      } catch (err: any) {
        this.status = 'error';
        const message = err.response?.data?.message || 'Failed to create link';
        this.error = message;
        console.error('Error creating link:', err);
        return { success: false, message };
      }
    },

    async updateLink(linkId: string, linkData: { title: string; url: string }): Promise<{ success: boolean; message: string }> {
      this.status = 'loading';
      this.error = null;

      try {
        const { data } = await ax.put<{ msg: string; link: Link }>(`/links/${linkId}`, linkData);
        const index = this.links.findIndex(link => link._id === linkId);
        if (index !== -1) {
          this.links[index] = data.link;
        }
        this.status = 'success';
        return { success: true, message: 'Link updated successfully' };
      } catch (err: any) {
        this.status = 'error';
        const message = err.response?.data?.message || 'Failed to update link';
        this.error = message;
        console.error('Error updating link:', err);
        return { success: false, message };
      }
    },

    async deleteLink(linkId: string): Promise<{ success: boolean; message: string }> {
      this.status = 'loading';
      this.error = null;

      try {
        await ax.delete(`/links/${linkId}`);
        this.links = this.links.filter(link => link._id !== linkId);
        this.status = 'success';
        return { success: true, message: 'Link deleted successfully' };
      } catch (err: any) {
        this.status = 'error';
        const message = err.response?.data?.message || 'Failed to delete link';
        this.error = message;
        console.error('Error deleting link:', err);
        return { success: false, message };
      }
    },

    // Local state management methods
    addLinkLocally(link: Link): void {
      this.links.push(link);
    },

    updateLinkLocally(index: number, linkData: Partial<Link>): void {
      if (index >= 0 && index < this.links.length) {
        this.links[index] = { ...this.links[index], ...linkData };
      }
    },

    removeLinkLocally(index: number): void {
      if (index >= 0 && index < this.links.length) {
        this.links.splice(index, 1);
      }
    },

    clearError(): void {
      this.error = null;
    },

    resetStatus(): void {
      this.status = 'idle';
      this.error = null;
    },
  },
});

export type { Link };