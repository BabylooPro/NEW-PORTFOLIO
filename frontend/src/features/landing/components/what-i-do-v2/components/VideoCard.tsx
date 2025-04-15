import React from "react";
import type { Video } from "../types/videos";

interface VideoCardProps {
    video: Video;
    isActive: boolean;
    onClick: () => void;
    isSelected: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isSelected }) => {
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

    return (
        <div
            onClick={onClick}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${isSelected ? 'ring-2 ring-blue-500 dark:ring-white scale-[1.02] max-sm:scale-[1]' : 'hover:scale-[1.01] hover:shadow-md'
                }`}
            style={{ height: '120px' }}
        >
            {/* DATE */}
            {formattedDate && (
                <div className="absolute top-2 left-2 z-30 bg-black/70 text-white text-xs py-1 px-2 rounded-sm">
                    {formattedDate}
                </div>
            )}

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

            {/* VIDEO CONTAINER */}
            <div className="h-full w-full">
                <video
                    className="w-full h-full object-cover"
                    src={video.src}
                    muted
                    playsInline
                />
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
