import React, { useState, useRef, useEffect } from "react";
import WaveAnimation from "./AudioWaveAnimation";

interface AudioReaderProps {
    src: string;
    onError?: (error: Error) => void;
}

const AudioReader: React.FC<AudioReaderProps> = ({ src, onError }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    // PROCESS THE AUDIO URL - IF IT'S A CLOUDFRONT URL, PROXY IT
    const audioUrl = src.includes('cloudfront.net')
        ? `/api/proxy?url=${encodeURIComponent(src)}`
        : src;

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener("ended", () => {
                setIsPlaying(false);
                setIsEnded(true);
            });
        }
        return () => {
            if (audio) {
                audio.removeEventListener("ended", () => {
                    setIsPlaying(false);
                    setIsEnded(true);
                });
            }
        };
    }, []);

    const initAudioContext = () => {
        if (!audioContext) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            setAudioContext(newContext);
        }
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                initAudioContext();
                audio
                    .play()
                    .then(() => {
                        if (audioContext && audioContext.state === "suspended") {
                            audioContext.resume();
                        }
                        setIsEnded(false);
                    })
                    .catch((error) => console.error("AUDIO PLAY ERROR:", error));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div>
            <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="hidden"
                onError={(e) => {
                    console.error("Audio loading error:", e);
                    onError?.(new Error("Failed to load audio"));
                }}
                crossOrigin="anonymous"
            >
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <button onClick={togglePlayPause}>
                <WaveAnimation
                    isPlaying={isPlaying}
                    isEnded={isEnded}
                    audioRef={audioRef}
                    audioContext={audioContext}
                />
            </button>
        </div>
    );
};

export default AudioReader;
