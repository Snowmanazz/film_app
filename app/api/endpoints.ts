import { request } from './client';

// === Home ===
export const getAppConfig = () => request<any>('/config');
export const getBanners = () => request<any[]>('/home/banners');
export const getHotMovies = (limit = 10) => request<any[]>(`/home/hot?limit=${limit}`);
export const getRecentUpdates = (limit = 10) => request<any[]>(`/home/recent?limit=${limit}`);

// === Video ===
export const searchVideos = (params: any) => {
  const query = new URLSearchParams(params).toString();
  return request<{ total: number; list: any[] }>(`/videos?${query}`);
};

export const getVideoDetail = (id: string | number) => request<any>(`/videos/${id}`);
export const getVideoComments = (id: string | number, page = 1) => request<any>(`/videos/${id}/comments?page=${page}`);

// === User ===
export const getUserProfile = () => request<any>('/user/profile');
export const getWatchHistory = () => request<any[]>('/user/history');
export const getFavorites = () => request<any[]>('/user/favorites');
