import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    isActive: boolean;
    recap?: string;
    project?: string;
    onEnded?: () => void;
    initialTime?: number;
    loop?: boolean;
    resetVideo?: boolean;
    debug?: boolean;
    advancedDebug?: boolean;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(({ src, isActive, recap, onEnded, initialTime = 0, loop = false, resetVideo = false, debug = false, advancedDebug = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(initialTime);
    const [duration, setDuration] = useState(0);
    const hasEndedRef = useRef(false);
    const previousSrcRef = useRef(src);
    const [fps, setFps] = useState(0);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(0);

    // ADVANCED DEBUG STATS
    const [advancedStats, setAdvancedStats] = useState({
        videoId: src.split('/').pop() || 'unknown',
        resolution: '0x0',
        currentRes: '0x0',
        optimalRes: '0x0',
        volume: '0%',
        normalizedVolume: '0%',
        codecs: 'unknown',
        color: 'unknown',
        connectionSpeed: '0 Kbps',
        networkActivity: '0 KB',
        bufferHealth: '0s',
        droppedFrames: 0,
        totalFrames: 0
    });

    // FPS TRACKING LOGIC
    useEffect(() => {
        if (!debug) return; // IF NOT DEBUG, RETURN

        let animationFrameId: number;

        // UPDATE FPS ONCE PER SECOND
        const updateFPS = (timestamp: number) => {
            frameCountRef.current++;
            if (timestamp - lastTimeRef.current >= 1000) {
                setFps(frameCountRef.current);
                frameCountRef.current = 0;
                lastTimeRef.current = timestamp;
            }

            // REQUEST ANIMATION FRAME
            animationFrameId = requestAnimationFrame(updateFPS);
        };

        // START FPS TRACKING
        animationFrameId = requestAnimationFrame(updateFPS);

        // CLEAN UP ANIMATION FRAME
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [debug]);

    // ADVANCED DEBUG STATS TRACKING
    useEffect(() => {
        if (!advancedDebug || !videoRef.current) return;

        const updateAdvancedStats = () => {
            if (!videoRef.current) return; // IF NO VIDEO, RETURN

            const video = videoRef.current; // GET VIDEO

            // GET TECHNICAL INFORMATION ABOUT VIDEO
            const width = video.videoWidth;
            const height = video.videoHeight;
            const volume = Math.round(video.volume * 100);

            // ESTIMATE CONNECTION SPEED BASED ON BUFFER RATE
            let connectionSpeed = '0 Kbps';
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const loadTime = performance.now() / 1000; // SECONDS SINCE PAGE LOAD
                if (loadTime > 0) {
                    // ROUGH ESTIMATE: ASSUMING VIDEO IS 5MBPS QUALITY
                    const estimatedBitrate = Math.round((bufferedEnd / loadTime) * 5000);
                    connectionSpeed = `${estimatedBitrate} Kbps`;
                }
            }

            // GET BUFFER HEALTH
            let bufferHealth = '0s';
            if (video.buffered.length > 0) {
                const currentBufferEnd = video.buffered.end(video.buffered.length - 1);
                const bufferedAhead = currentBufferEnd - video.currentTime;
                bufferHealth = `${bufferedAhead.toFixed(2)}s`;
            }

            // UPDATE ADVANCED STATS
            setAdvancedStats(prev => ({
                ...prev,
                resolution: `${width}x${height}`,
                currentRes: `${width}x${height}@${fps}`,
                optimalRes: `${width}x${height}@30`,
                volume: `${volume}%`,
                normalizedVolume: `${volume}% (content loudness est.)`,
                connectionSpeed,
                bufferHealth,
                droppedFrames: prev.droppedFrames + (Math.random() > 0.8 ? 1 : 0),
                totalFrames: prev.totalFrames + fps
            }));
        };

        const statsInterval = setInterval(updateAdvancedStats, 1000); // UPDATE ADVANCED STATS EVERY SECOND

        return () => {
            clearInterval(statsInterval);
        };
    }, [advancedDebug, fps, videoRef]);

    // HANDLE VIDEO RESETS ON MANUAL SELECTION
    useEffect(() => {
        if (!videoRef.current) return; // IF NO VIDEO, RETURN

        if (resetVideo) {
            videoRef.current.currentTime = 0;
            setCurrentTime(0);
            hasEndedRef.current = false;

            if (isActive) {
                videoRef.current.play().catch(err => console.error("Reset play error:", err));
            }
        }
    }, [resetVideo, isActive]);

    // HANDLE VIDEO RESETS ON SRC CHANGE
    useEffect(() => {
        if (!videoRef.current) return; // IF NO VIDEO, RETURN

        // ONLY RESET TIME WHEN SRC CHANGES
        if (previousSrcRef.current !== src) {
            videoRef.current.currentTime = initialTime;
            setCurrentTime(initialTime);
            hasEndedRef.current = false; // RESET ENDED STATE WHEN SRC CHANGES
            previousSrcRef.current = src;
        }

        // PLAY VIDEO IF ACTIVE
        if (isActive) {
            videoRef.current.play().catch(err => console.error("Video play error:", err));
        } else {
            videoRef.current.pause();
        }
    }, [isActive, src, initialTime]);

    // HANDLE FORWARDING THE REF
    useEffect(() => {
        if (!videoRef.current) return; // IF NO VIDEO, RETURN

        // FORWARD THE REF TO PARENT COMPONENT
        if (typeof ref === 'function') {
            ref(videoRef.current);
        } else if (ref) {
            ref.current = videoRef.current;
        }
    }, [ref]);

    // TOGGLE MUTE VIDEO PLAYER
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
    };

    // HANDLE TIME UPDATE
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    // HANDLE LOADED METADATA
    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    // HANDLE VIDEO ENDED
    const handleVideoEnded = () => {
        if (hasEndedRef.current) return; // PREVENT MULTIPLE TRIGGERS
        hasEndedRef.current = true;
        if (onEnded) onEnded();
    };

    // FORMAT TIME
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="relative w-full h-full">
            {/* VIDEO */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                src={src}
                controls={false}
                playsInline
                muted={isMuted}
                loop={loop}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
            />
            {recap && (
                <div className="absolute top-4 left-4 z-20 bg-black/60 text-white p-2 rounded-md max-w-[80%]">
                    <p className="text-sm font-mono">{recap}</p>
                </div>
            )}

            {/* TIME AND MUTE */}
            <div className="absolute bottom-4 right-4 max-sm:left-4 max-sm:mb-20 z-20 flex items-center gap-2">
                <div className="bg-black/60 text-white text-sm py-1 px-2 rounded-md">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <button
                    onClick={toggleMute}
                    className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors max-sm:absolute max-sm:top-20 max-sm:-right-1"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            {/* FPS DEBUG */}
            {debug && (
                <div className="absolute top-4 right-4 z-20 bg-red-600/80 text-white p-1 rounded-md">
                    <p className="text-sm font-mono">{fps} FPS</p>
                </div>
            )}

            {/* ADVANCED DEBUG STATS */}
            {advancedDebug && (
                <div className="absolute top-4 left-4 right-4 z-30 bg-black/80 text-white p-2 rounded-md font-mono text-xs">
                    <table className="w-full">
                        <tbody>
                            {/* VIDEO ID */}
                            <tr>
                                <td className="text-right pr-2 w-1/3">Video ID</td>
                                <td>{advancedStats.videoId}</td>
                            </tr>

                            {/* VIEWPORT / FRAMES */}
                            <tr>
                                <td className="text-right pr-2">Viewport / Frames</td>
                                <td>{advancedStats.resolution} / {advancedStats.droppedFrames} dropped of {advancedStats.totalFrames}</td>
                            </tr>

                            {/* CURRENT / OPTIMAL RES */}
                            <tr>
                                <td className="text-right pr-2">Current / Optimal Res</td>
                                <td>{advancedStats.currentRes} / {advancedStats.optimalRes}</td>
                            </tr>

                            {/* VOLUME / NORMALIZED */}
                            <tr>
                                <td className="text-right pr-2">Volume / Normalized</td>
                                <td>{advancedStats.volume} / {advancedStats.normalizedVolume}</td>
                            </tr>

                            {/* CODECS */}
                            <tr>
                                <td className="text-right pr-2">Codecs</td>
                                <td>HTML5 / {navigator.userAgent.includes('Chrome') ? 'VP9' : 'H.264'}</td>
                            </tr>

                            {/* COLOR */}
                            <tr>
                                <td className="text-right pr-2">Color</td>
                                <td>bt709 / bt709</td>
                            </tr>

                            {/* CONNECTION SPEED */}
                            <tr>
                                <td className="text-right pr-2">Connection Speed</td>
                                <td>
                                    <div className="w-full bg-green-500 h-2 rounded"></div>
                                    {advancedStats.connectionSpeed}
                                </td>
                            </tr>

                            {/* NETWORK ACTIVITY */}
                            <tr>
                                <td className="text-right pr-2">Network Activity</td>
                                <td>
                                    <div className="flex gap-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                        ))}
                                    </div>
                                    0 KB
                                </td>
                            </tr>

                            {/* BUFFER HEALTH */}
                            <tr>
                                <td className="text-right pr-2">Buffer Health</td>
                                <td>
                                    <div className="w-full bg-yellow-500 h-2 rounded"></div>
                                    {advancedStats.bufferHealth}
                                </td>
                            </tr>

                            {/* MYSTERY TEXT */}
                            <tr>
                                <td className="text-right pr-2">Mystery Text</td>
                                <td>PLAYER, s:3.00 t:{currentTime.toFixed(2)} b:{advancedStats.bufferHealth}</td>
                            </tr>

                            {/* DATE */}
                            <tr>
                                <td className="text-right pr-2">Date</td>
                                <td>{new Date().toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer; 
