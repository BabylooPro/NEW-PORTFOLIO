declare module 'react-dom' {
    import * as React from 'react';
    
    export function createPortal(
        children: React.ReactNode,
        container: Element | DocumentFragment,
        key?: null | string
    ): React.ReactPortal;

    export * from 'react-dom/client';
    export * from 'react-dom/server';
    export * from 'react-dom/test-utils';
} 
