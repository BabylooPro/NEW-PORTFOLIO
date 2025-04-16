'use client';

import { useEffect, useState } from 'react';
import { Video } from '../components/what-i-do-v2/types/videos';

interface StrapiVideo {
    id: number;
    documentId: string;
    customId: string;
    title: string;
    project?: string;
    recap?: string;
    description: string;
    date?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    src?: {
        url: string;
    };
}

interface StrapiResponse {
    data: StrapiVideo[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

export const useShowcaseVideos = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);

    // FETCH VIDEOS FROM STRAPI
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`/api/strapi?path=showcase-videos&populate=src`);

                // CHECK IF RESPONSE IS OK
                if (!response.ok) {
                    throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`);
                }

                const result: StrapiResponse = await response.json();

                // TRANSFORM STRAPI RESPONSE TO MATCH THE EXPECTED VIDEO STRUCTURE
                const transformedVideos: Video[] = result.data.map(item => ({
                    id: item.customId,
                    title: item.title,
                    project: item.project,
                    // USE DIRECT URL FROM S3 WITHOUT PREPENDING STRAPI_URL
                    src: item.src?.url ? item.src.url : undefined,
                    recap: item.recap,
                    description: item.description,
                    date: item.date
                }));

                setVideos(transformedVideos);
            } catch (err) {
                console.error('Error fetching showcase videos:', err);
                setError(err instanceof Error ? err : new Error(String(err)));
                // NO FALLBACK - RELY ONLY ON CMS DATA
                setVideos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return { data: videos, isLoading, error };
}; 
