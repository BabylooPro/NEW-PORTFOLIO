import React, { useState, useEffect, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientOnlyProps {
    children: React.ReactNode;
    id?: string;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, id }) => {
    const [hasMounted, setHasMounted] = useState(false);

    // MOUNTED STATE
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // IF NOT MOUNTED, SHOW LOADING STATE
    if (!hasMounted) {
        return (
            <div id={id} className="h-[600px] w-full flex items-center justify-center">
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    // RETURN SUSPENSE FALLBACK
    return (
        <Suspense fallback={
            <div className="h-[600px] w-full flex items-center justify-center">
                <Skeleton className="h-[600px] w-full" />
            </div>
        }>
            {children}
        </Suspense>
    );
};

export default ClientOnly; 
