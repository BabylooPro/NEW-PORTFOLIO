import { useEffect, useState } from 'react';

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

export const useHeaderSection = () => {
  const [data, setData] = useState<HeaderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/strapi?path=header-section');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch header data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}; 
