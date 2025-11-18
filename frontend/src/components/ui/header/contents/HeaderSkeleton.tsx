import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { HEADER_ANIMATION } from "./HeaderAnimation";

// ANIMATION VARIANTS FOR STAGGERED ANIMATION
const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
            duration: 0.5,
        }
    }
};

const itemAnimation = {
    hidden: { opacity: 0, y: 5 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const
        }
    }
};

export const HeaderSkeleton = () => {
    return (
        <motion.header
            {...HEADER_ANIMATION}
            className="sticky z-[98] flex items-center justify-center max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md mt-0 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="flex flex-col items-center w-full space-y-4"
                variants={containerAnimation}
                initial="hidden"
                animate="show"
            >
                <motion.div className="flex items-center space-x-4 w-full justify-center" variants={itemAnimation}>
                    {/* AVATAR SKELETON */}
                    <Skeleton className="w-14 h-14 rounded-full" />

                    {/* TEXT CONTENT SKELETON */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </motion.div>

                {/* SEPARATOR SKELETON */}
                <motion.div variants={itemAnimation}>
                    <Skeleton className="h-px w-[50%]" />
                </motion.div>

                {/* SOCIAL LINKS SKELETON */}
                <motion.div className="flex space-x-2 justify-center" variants={itemAnimation}>
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </motion.div>
            </motion.div>
        </motion.header>
    );
}; 
