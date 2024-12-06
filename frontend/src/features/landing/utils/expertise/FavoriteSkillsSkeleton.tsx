import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowInfo } from "@/components/ui/show-info";

export const FavoriteSkillsSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <ShowInfo wrapMode key={i}>
          <ShowInfo.Content>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6" /> {/* ICON */}
              <Skeleton className="h-5 w-24" /> {/* NAME */}
            </div>
          </ShowInfo.Content>
        </ShowInfo>
      ))}
    </>
  );
}; 
