import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// DECLARE CUSTOM WINDOW PROPERTY
declare global {
    interface Window {
        __headerFetchAttempts: number;
    }
}

interface ProfileTitle {
    order: number;
    id: number;
    title: string;
}

interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    size: number;
    width: number;
    height: number;
}

interface AvatarData {
    id: number;
    name: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail: ImageFormat;
    };
    url: string;
    mime: string;
}

interface Profile {
    id: number;
    name: string;
    titles: ProfileTitle[];
    avatar: AvatarData;
}

interface SocialLink {
    id: number;
    title: string;
    href: string;
    target: string;
    iconType: string;
}

interface HeaderData {
    profile: Profile;
    socialLinks: SocialLink[];
}

const HEADER_QUERY_KEY = ['headerSection'];

// DIRECT API CALL AS FALLBACK FOR CHROME
/* eslint-disable @typescript-eslint/no-explicit-any */
const fetchWithXHR = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Expires', '0');
        xhr.responseType = 'json';

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`XHR request failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error with XHR request'));
        xhr.send();
    });
};

// CHECK LOCAL STORAGE FOR CACHED DATA
const getLocalStorageData = (): HeaderData | null => {
    if (typeof window === 'undefined') return null;

    try {
        const storedData = localStorage.getItem('headerData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // VERIFY DATA STRUCTURE IS VALID
            if (parsedData?.profile && parsedData?.socialLinks) {
                return parsedData;
            }
        }
    } catch (error) {
        console.error('Error reading from localStorage', error);
    }

    return null;
};

// SAVE DATA TO LOCAL STORAGE
const saveToLocalStorage = (data: HeaderData) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('headerData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage', error);
    }
};

// FALLBACK EMPTY DATA FOR EMERGENCY SITUATIONS
const FALLBACK_DATA: HeaderData = {
    profile: {
        id: 0,
        name: "",
        titles: [
            { id: 1, order: 1, title: "" }
        ],
        avatar: {
            id: 0,
            name: "avatar",
            alternativeText: null,
            width: 150,
            height: 150,
            formats: {
                thumbnail: {
                    ext: "",
                    url: "",
                    hash: "",
                    mime: "",
                    name: "",
                    size: 0,
                    width: 150,
                    height: 150
                }
            },
            url: "",
            mime: ""
        }
    },
    socialLinks: [
        { id: 1, title: "", href: "", target: "_blank", iconType: "" },
        { id: 2, title: "", href: "", target: "_blank", iconType: "linkedin" }
    ]
};

const fetchHeaderData = async (): Promise<HeaderData> => {
    // TRACK FETCH ATTEMPTS FOR THIS SESSION
    if (typeof window !== 'undefined' && !window.__headerFetchAttempts) {
        window.__headerFetchAttempts = 0;
    }

    try {
        // USE DIRECT OPTIONS FOR CONSISTENT BEHAVIOR ACROSS BROWSERS
        const timestamp = Date.now(); // ADD CACHE BUSTING
        const response = await fetch(`/api/strapi?path=header-section&no-cache=true&_=${timestamp}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch header data: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // VALIDATE DATA STRUCTURE
        if (!result.data || !result.data.profile || !result.data.socialLinks) {
            console.error('Invalid header data structure:', result);
            throw new Error('Invalid header data structure');
        }

        if (typeof window !== 'undefined') {
            window.__headerFetchAttempts = 0; // RESET ATTEMPTS ON SUCCESS
        }

        // SAVE TO LOCAL STORAGE FOR FASTER INITIAL RENDERS
        saveToLocalStorage(result.data);
        return result.data;
    } catch (error) {
        console.error('Error fetching header data with fetch, trying XHR:', error);

        try {
            // INCREMENT FETCH ATTEMPTS
            if (typeof window !== 'undefined') {
                window.__headerFetchAttempts = (window.__headerFetchAttempts || 0) + 1;
            }

            // TRY XHR AS FALLBACK WITH CACHE BUSTING
            const timestamp = Date.now();
            const result = await fetchWithXHR(`/api/strapi?path=header-section&no-cache=true&_=${timestamp}`);

            if (result?.data && result.data.profile && result.data.socialLinks) {
                saveToLocalStorage(result.data);
                return result.data;
            }

            throw new Error('XHR data validation failed');
        } catch (xhrError) {
            console.error('XHR fallback also failed:', xhrError);

            // FALLBACK TO LOCALSTORAGE IF FETCH FAILS
            const localStorageData = getLocalStorageData();
            if (localStorageData) {
                return localStorageData;
            }

            // ONLY LOG AFTER MULTIPLE ATTEMPTS
            if (typeof window !== 'undefined' && window.__headerFetchAttempts > 2) {
                console.error('Header data fetch failed multiple times - using fallback data');
            }

            // LAST RESORT - USE HARDCODED FALLBACK DATA
            return FALLBACK_DATA;
        }
    }
};

export const useHeaderSection = () => {
    const queryClient = useQueryClient();

    // PRELOAD DATA ON INITIAL RENDER REGARDLESS OF BROWSER
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // FORCE IMMEDIATE DATA FETCH ON COMPONENT MOUNT FOR ALL BROWSERS
            fetchHeaderData()
                .then(data => {
                    queryClient.setQueryData(HEADER_QUERY_KEY, data);
                })
                .catch(err => console.error('Failed to prefetch header data:', err));
        }
    }, [queryClient]);

    // GET DATA FROM DIFFERENT SOURCES IN ORDER OF PRIORITY
    const cachedData = queryClient.getQueryData<HeaderData>(HEADER_QUERY_KEY);
    const localStorageData = getLocalStorageData();
    const initialData = cachedData || localStorageData || FALLBACK_DATA;

    const { data, isLoading, error } = useQuery({
        queryKey: HEADER_QUERY_KEY,
        queryFn: fetchHeaderData,
        staleTime: 5 * 60 * 1000, // DATA STAYS FRESH FOR 5 MINUTES
        gcTime: 60 * 60 * 1000, // KEEP IN CACHE FOR 1 HOUR
        retry: 3, // INCREASE RETRY ATTEMPTS
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // EXPONENTIAL BACKOFF
        // USE PLACEHOLDER DATA TO AVOID SKELETON FLICKER
        placeholderData: initialData,
        // USE INITIAL DATA IF AVAILABLE
        initialData: initialData,
    });

    // UPDATE LOCAL STORAGE WHEN WE GET NEW DATA
    useEffect(() => {
        if (data && Object.keys(data.profile || {}).length > 0) {
            saveToLocalStorage(data);
        }
    }, [data]);

    // ALWAYS RETURN DATA, NEVER NULL
    return {
        data: data || initialData,
        isLoading: isLoading && !data && !initialData,
        error
    };
}; 
