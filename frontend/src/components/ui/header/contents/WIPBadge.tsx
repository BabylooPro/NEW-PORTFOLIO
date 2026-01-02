"use client";

import { Badge } from "@/components/ui/badge";
import { ShowInfo } from "@/components/ui/show-info";
import AppleEmoji from "@/components/decoration/apple-emoji";
import { DevTools } from "@/lib/dev-tools";
import { useState, useEffect } from "react";

const IS_PROD = process.env.NODE_ENV === "production";

interface WIPBadgeProps {
    showDebugButton: boolean;
    lastCommitInfo: {
        date: string;
        message: string;
        hiddenDate: string;
    } | null;
}

export const WIPBadge = ({ showDebugButton, lastCommitInfo }: WIPBadgeProps) => {
    // START WITH NOT MOUNTED TO AVOID HYDRATION MISMATCH
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ONLY RENDER CONTENT CLIENT-SIDE
    if (IS_PROD || !isMounted) return null;

    return (
        <div className="fixed top-2 left-2 flex items-center gap-2 z-[9999]">
            <ShowInfo wrapMode>
                <ShowInfo.Title>Work In Progress</ShowInfo.Title>
                <ShowInfo.Description>
                    This project is currently under active development. <br />
                    Features and content may change frequently.
                    {lastCommitInfo && (
                        <>
                            <br />
                            <br />
                            <strong>Last Update :</strong> {lastCommitInfo.date}
                            <br />
                            <strong>Latest Change :</strong> {lastCommitInfo.message}
                        </>
                    )}
                </ShowInfo.Description>
                <ShowInfo.Content>
                    {showDebugButton ? (
                        <div className="z-[9999] w-full h-7 flex items-center gap-1 cursor-pointer">
                            <DevTools />
                        </div>
                    ) : (
                        <Badge className="z-[9999] w-full h-7 flex items-center gap-1">
                            <AppleEmoji emojiShortName="construction" size={16} />
                            <span>WIP</span>
                            <AppleEmoji emojiShortName="construction" size={16} />
                        </Badge>
                    )}
                </ShowInfo.Content>
            </ShowInfo>
        </div>
    );
}; 
