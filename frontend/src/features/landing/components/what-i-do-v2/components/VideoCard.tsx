import React, { useEffect, useRef, useState } from "react";
import type { Video } from "../types/videos";

interface VideoCardProps {
    video: Video;
    isActive: boolean;
    onClick: () => void;
    isSelected: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isSelected }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // FORMAT DATE TO A MORE READABLE FORMAT
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const formattedDate = formatDate(video.date);

    // KEEP VIDEO PAUSED AT FIRST FRAME (THUMBNAIL ONLY, NO AUTOPLAY)
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        setIsLoading(true);
        el.pause();
        if (el.currentTime !== 0) el.currentTime = 0;
    }, [video.src]);

    // HANDLE VIDEO LOADING STATE
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)

    return (
        <div
            onClick={onClick}
            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${isSelected ? 'ring-2 ring-blue-500 dark:ring-white scale-[1.02] max-sm:scale-[1]' : 'hover:scale-[1.01] hover:shadow-md'
                }`}
            style={{ height: '120px' }}
        >
            {/* DATE */}
            {formattedDate && (
                <div className="absolute top-2 left-2 z-30 bg-black/70 text-white text-xs py-1 px-2 rounded-xl">
                    {formattedDate}
                </div>
            )}

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

            {/* VIDEO CONTAINER */}
            <div className="h-full w-full relative">
                {video.src ? (
                    <>
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            src={video.src}
                            preload="metadata"
                            controls={false}
                            muted
                            playsInline
                            disablePictureInPicture
                            onLoadStart={handleLoadStart}
                            onCanPlay={handleCanPlay}
                            onWaiting={handleWaiting}
                            onPlaying={handlePlaying}
                        />

                        {/* LOADER */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-15">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                        <span className="text-xs text-white/70">No video available</span>
                    </div>
                )}
            </div>

            {/* VIDEO INFO */}
            <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                {video.project && (
                    <p className="text-xs text-white/80 mb-0.5">{video.project}</p>
                )}
                <h4 className="text-sm font-medium text-white">{video.title}</h4>
                <p className="text-xs text-white/70 truncate">{video.description}</p>
            </div>
        </div>
    );
};

export default VideoCard; 
