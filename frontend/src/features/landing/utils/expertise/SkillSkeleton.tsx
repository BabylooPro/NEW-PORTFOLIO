import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowInfo } from "@/components/ui/show-info";

const SkillItemSkeleton = ({ isRight = false }: { isRight?: boolean }) => {
  return (
    <ShowInfo wrapMode>
      <ShowInfo.Content>
        <div className={`flex items-center space-x-2 ${isRight ? "flex-row-reverse space-x-reverse" : ""}`}>
          <Skeleton className="h-6 w-6" /> {/* ICON */}
          <Skeleton className="h-5 w-32" /> {/* NAME */}
          <Skeleton className="h-5 w-5 rounded-full" /> {/* POTENTIAL ICON (HEART/STAR/ETC) */}
        </div>
      </ShowInfo.Content>
    </ShowInfo>
  );
};

export const SkillsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="w-full max-w-[500px]">
            <div className={`flex flex-col space-y-2 ${i % 2 !== 0 ? "items-end" : "items-start"}`}>
              {[...Array(3)].map((_, j) => (
                <SkillItemSkeleton key={j} isRight={i % 2 !== 0} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
