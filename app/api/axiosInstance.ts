import axios from 'axios';
import { getCookie as getCookieNext } from 'cookies-next';
import { useUserStore } from "@/app/store/userStore";
import logger from '@/lib/logger';

const AxiosInstance = axios.create({
  baseURL: typeof window === 'undefined'
    ? (process.env.SSR_API_URL || 'http://localhost:3001/api/v1')
    : process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 5000,
});

export const isServer = typeof window === 'undefined';

export const getCookie = async (name: string) => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  }
  return getCookieNext(name);
}

AxiosInstance.interceptors.request.use(async (config) => {
  const token = await getCookie('userAuth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (!isServer) {
        const { logout } = useUserStore.getState();
        logger.warn("🔒 401 Unauthorized: Triggering logout...");
        logout();
        window.dispatchEvent(new Event("auth-unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;