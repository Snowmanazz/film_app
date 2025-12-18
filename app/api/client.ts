import {
  MOCK_BANNERS, MOCK_HOT_MOVIES, MOCK_RECENT_UPDATES,
  MOCK_CONFIG, MOCK_VIDEO_LIST, MOCK_VIDEO_DETAIL,
  MOCK_COMMENTS, MOCK_USER_PROFILE, MOCK_USER_HISTORY, MOCK_USER_FAVORITES
} from './mockData';

const API_HOST = 'http://localhost:8080'; // Changed to http for local dev
const USE_MOCK = false; // Set to false when backend is ready

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ... (keep mockRequest as is) ...

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_HOST}${endpoint}`;

  if (USE_MOCK) {
    const res = await mockRequest(endpoint, options.method || 'GET');
    if (res.code !== 0) throw new Error(res.message);
    return res.data;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const resJson: ApiResponse<T> = await response.json();
    if (resJson.code !== 0) {
      throw new Error(resJson.message || 'API Error');
    }

    return resJson.data;
  } catch (error) {
    console.warn(`[API Error] ${endpoint}:`, error);
    // Fallback to mock to prevent app crash during dev/demo if backend is unreachable
    console.log("Falling back to mock data due to error.");
    const mockRes = await mockRequest(endpoint, options.method || 'GET');
    return mockRes.data;
  }
}
