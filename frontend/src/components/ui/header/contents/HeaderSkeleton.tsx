import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { HEADER_ANIMATION } from "./HeaderAnimation";

export const HeaderSkeleton = () => {
  return (
    <motion.header
      {...HEADER_ANIMATION}
      className="sticky z-[98] flex items-center justify-center max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md mt-0 p-6"
    >
      <div className="flex flex-col items-center w-full space-y-4">
        <div className="flex items-center space-x-4 w-full justify-center">
          {/* AVATAR SKELETON */}
          <Skeleton className="w-14 h-14 rounded-full" />
          
          {/* TEXT CONTENT SKELETON */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* SEPARATOR SKELETON */}
        <Skeleton className="h-px w-full" />

        {/* SOCIAL LINKS SKELETON */}
        <div className="flex space-x-2 justify-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </motion.header>
  );
}; 
