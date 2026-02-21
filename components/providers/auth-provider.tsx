'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { setCookie, getCookie } from 'cookies-next';
import { useUserStore, type User } from "@/app/store/userStore";
import AxiosInstance from '@/app/api/axiosInstance';
import Loading from '@/app/loading';
import logger from '@/lib/logger';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setUser, logout, user } = useUserStore();
  const [isVerifying, setIsVerifying] = useState(true);

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace('/?reason=session_expired');
  }, [logout, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("auth-unauthorized", handleUnauthorized);
    }

    const initAuth = async () => {
      try {
        const tokenFromUrl = searchParams.get('auth_token');

        if (tokenFromUrl) {
          setCookie('userAuth', tokenFromUrl, { maxAge: 60 * 60 * 24 * 7 });
          const params = new URLSearchParams(searchParams.toString());
          params.delete('auth_token');
          const cleanUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
          window.history.replaceState(null, '', cleanUrl);
        }

        const token = getCookie('userAuth');

        if (!token) {
          if (pathname !== '/') router.replace('/');
          setIsVerifying(false);
          return;
        }

        if (!user) {
          const { data: userData } = await AxiosInstance.get('/users/me');
          setUser(userData);
          checkNavigation(userData);
        } else {
          checkNavigation(user);
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (pathname !== '/') router.replace('/');
      } finally {
        setIsVerifying(false);
      }
    };

    const checkNavigation = (u: User) => {
      const isComplete = !!(u.birthDate && u.latitude && u.longitude);

      if (isComplete) {
        if (['/', '/setup'].includes(pathname)) {
          router.replace('/reports');
        }
      } else {
        if (pathname !== '/setup') {
          router.replace('/setup');
        }
      }
    };

    initAuth();

    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, [pathname, searchParams, setUser, user, handleUnauthorized, router]);

  const shouldShowContent = useMemo(() => {
    if (isVerifying) return false;
    if (!user && pathname !== '/') return false;

    const isComplete = !!(user?.birthDate && user?.latitude && user?.longitude);
    if (isComplete && ['/', '/setup'].includes(pathname)) return false;
    if (!isComplete && user && pathname !== '/setup') return false;

    return true;
  }, [isVerifying, user, pathname]);

  if (!shouldShowContent) {
    return <Loading />;
  }
  logger.info({ user: user }, 'User -> AuthProvider');
  return <>{children}</>;
};