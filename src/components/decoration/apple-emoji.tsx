import React from "react";
import Image from "next/image";
import emojiData from "emoji-datasource-apple";

interface AppleEmojiProps {
	emojiShortName: string;
	size?: number;
	className?: string;
}

// INFO: SEE A CATALOG OF EMOJI DATA HERE: http://projects.iamcal.com/emoji-data/table.htm
// INFO: CURRENT VERSION SUPPORTS EMOJI v15.1 (Sept 2023)

const AppleEmoji: React.FC<AppleEmojiProps> = ({ emojiShortName, size = 24, className = "" }) => {
	const emoji = emojiData.find((e: any) => e.short_name === emojiShortName);

	if (!emoji) {
		return null;
	}

	const emojiSrc = `https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.0/img/apple/64/${emoji.image}`;

	return (
		<Image
			src={emojiSrc}
			alt={emojiShortName}
			width={size}
			height={size}
			className={`inline-block ${className}`}
		/>
	);
};

export default AppleEmoji;
