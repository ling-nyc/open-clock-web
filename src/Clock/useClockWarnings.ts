import { useState, useEffect } from 'react';
import { useAssetWarnings } from './AssetWarningContext';
import { ToastData } from '../components/ToastContainer';

/**
 * Custom hook to manage clock-related warnings and toasts
 */
export const useClockWarnings = () => {
    const { warnings, addWarning, clearWarnings } = useAssetWarnings();
    const [toasts, setToasts] = useState<ToastData[]>([]);

    // Group warnings by type
    const fontWarnings = warnings
        .filter((w) => w.type === 'font')
        .map((w) => w.name);

    const imageWarnings = warnings
        .filter((w) => w.type === 'image')
        .map((w) => w.name);

    // Create toasts for warnings
    useEffect(() => {
        const newToasts: ToastData[] = [];

        // Add font warning toast
        if (fontWarnings.length > 0) {
            const fontToastExists = toasts.some(t => t.id === 'font-warnings');
            if (!fontToastExists) {
                newToasts.push({
                    id: 'font-warnings',
                    type: 'warning',
                    title: `Missing ${fontWarnings.length === 1 ? 'Font' : 'Fonts'}`,
                    items: fontWarnings,
                    onClose: () => {
                        setToasts(prev => prev.filter(t => t.id !== 'font-warnings'));
                    },
                    onUpload: (fontName: string) => {
                        // This will be handled by the parent component
                    }
                });
            }
        }

        // Add image warning toast
        if (imageWarnings.length > 0) {
            const imageToastExists = toasts.some(t => t.id === 'image-warnings');
            if (!imageToastExists) {
                newToasts.push({
                    id: 'image-warnings',
                    type: 'error',
                    title: `Missing ${imageWarnings.length === 1 ? 'Image' : 'Images'}`,
                    items: imageWarnings,
                    onClose: () => {
                        setToasts(prev => prev.filter(t => t.id !== 'image-warnings'));
                    }
                });
            }
        }

        if (newToasts.length > 0) {
            setToasts(prev => [...prev, ...newToasts]);
        }
    }, [fontWarnings.length, imageWarnings.length]);

    const clearAllWarnings = () => {
        clearWarnings();
        setToasts([]);
    };

    return {
        toasts,
        setToasts,
        addWarning,
        clearAllWarnings,
        fontWarnings,
        imageWarnings
    };
};