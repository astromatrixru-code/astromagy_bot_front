"use client";

import { useEffect, useState } from "react";

const WebAppSettings = () => {
    const [platform, setPlatform] = useState<string>("unknown");

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Dynamically import and initialize WebApp only on client side
        import('@twa-dev/sdk').then((module) => {
            const WebApp = module.default;
            setPlatform(WebApp.platform);

            // Debug: log WebApp version and available methods
            console.log('WebApp:', WebApp);
            console.log('WebApp version:', WebApp.version);
            console.log('WebApp.requestFullscreen available:', typeof WebApp.requestFullscreen);
            console.log('WebApp.isFullscreen:', WebApp.isFullscreen);

            WebApp.ready();

            // Try to use fullscreen mode (requires version 7.7+)
            if (WebApp.isVersionAtLeast('7.7') && typeof WebApp.requestFullscreen === 'function') {
                try {
                    WebApp.requestFullscreen();
                    console.log('Fullscreen requested successfully');
                } catch (error) {
                    console.warn('Fullscreen request failed, using expand:', error);
                    WebApp.expand();
                }
            } else {
                // Fallback for older versions
                console.log('Fullscreen not supported (version < 7.7), using expand()');
                WebApp.expand();
            }

            WebApp.setHeaderColor('bg_color');

            // Only enable closing confirmation if supported (version 6.2+)
            if (WebApp.isVersionAtLeast('6.2')) {
                WebApp.enableClosingConfirmation();
            }
        }).catch((error) => {
            console.warn('Failed to initialize Telegram WebApp:', error);
        });

        const updateViewportHeight = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
        };

        updateViewportHeight();
        window.addEventListener('resize', updateViewportHeight);
        return () => window.removeEventListener('resize', updateViewportHeight);
    }, []);

    const shouldShowDialog = !["android", "ios", "unknown"].includes(platform);

    return <>{shouldShowDialog && ' '}</>;
}

export default WebAppSettings;