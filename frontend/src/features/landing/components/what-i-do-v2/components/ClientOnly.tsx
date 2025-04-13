import React, { useState, useEffect, Suspense } from "react";

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
                <div className="text-center text-neutral-400">
                    <p>Video content will load when in view</p>
                </div>
            </div>
        );
    }

    // RETURN SUSPENSE FALLBACK
    return (
        <Suspense fallback={
            <div className="h-[600px] w-full flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <p>Loading video...</p>
                </div>
            </div>
        }>
            {children}
        </Suspense>
    );
};

export default ClientOnly; 
