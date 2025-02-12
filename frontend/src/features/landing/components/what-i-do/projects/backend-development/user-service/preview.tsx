import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Users, Plus, PlayCircle } from 'lucide-react';

interface Request {
    method: string;
    endpoint: string;
    body?: string;
    description: string;
}

type ResponseMap = {
    [key: string]: string;
};

const REQUESTS: Request[] = [
    {
        method: 'GET',
        endpoint: '/api/users/1',
        description: 'Get User by ID',
    },
    {
        method: 'GET',
        endpoint: '/api/users',
        description: 'Get All Users',
    },
    {
        method: 'POST',
        endpoint: '/api/users',
        body: JSON.stringify({
            email: "john@example.com",
            password: "********",
            firstName: "John",
            lastName: "Doe"
        }, null, 2),
        description: 'Create New User',
    }
];

const PostmanDemo = () => {
    const [selectedRequest, setSelectedRequest] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    const simulateRequest = useCallback(() => {
        setIsLoading(true);
        setResponse(null);

        setTimeout(() => {
            setIsLoading(false);
            const responses: ResponseMap = {
                '/api/users/1': JSON.stringify({
                    id: 1,
                    email: "john@example.com",
                    profile: {
                        firstName: "John",
                        lastName: "Doe"
                    }
                }, null, 2),
                '/api/users': JSON.stringify([
                    {
                        id: 1,
                        email: "john@example.com",
                        profile: { firstName: "John", lastName: "Doe" }
                    },
                    {
                        id: 2,
                        email: "jane@example.com",
                        profile: { firstName: "Jane", lastName: "Smith" }
                    }
                ], null, 2),
                'default': JSON.stringify({
                    id: 3,
                    email: "john@example.com",
                    profile: {
                        firstName: "John",
                        lastName: "Doe"
                    }
                }, null, 2)
            };

            setResponse(responses[REQUESTS[selectedRequest].endpoint] || responses.default);
        }, 1000);
    }, [selectedRequest]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSelectedRequest((prev) => (prev + 1) % REQUESTS.length);
            simulateRequest();
        }, 4000);
        return () => clearInterval(timer);
    }, [simulateRequest]);

    const getMethodColor = (method: string) => {
        const colors = {
            GET: 'text-emerald-500 dark:text-emerald-400',
            POST: 'text-blue-500 dark:text-blue-400',
            PUT: 'text-amber-500 dark:text-amber-400',
            DELETE: 'text-red-500 dark:text-red-400'
        };
        return colors[method as keyof typeof colors] || 'text-neutral-500';
    };

    const getIcon = (description: string) => {
        if (description.includes('All')) return Users;
        if (description.includes('Create')) return Plus;
        return User;
    };

    const currentRequest = REQUESTS[selectedRequest];
    const RequestIcon = getIcon(currentRequest.description);

    return (
        <div className="w-full max-w-3xl mx-auto p-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <span className={`font-mono font-bold ${getMethodColor(currentRequest.method)}`}>
                                {currentRequest.method}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {currentRequest.endpoint}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <RequestIcon size={16} />
                            <span>{currentRequest.description}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-800">
                    <div className="p-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Request Body</div>
                        <div className="font-mono text-xs bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg text-neutral-800 dark:text-neutral-300 overflow-auto max-h-[200px]">
                            {currentRequest.body || 'No body required'}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Response</div>
                        <div className="font-mono text-xs bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg text-neutral-800 dark:text-neutral-300 overflow-auto max-h-[200px]">
                            {isLoading ? (
                                <motion.div
                                    className="flex items-center gap-2 text-neutral-400"
                                    animate={{ opacity: [0.5, 1] }}
                                    transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <PlayCircle size={14} />
                                    <span>Loading response...</span>
                                </motion.div>
                            ) : response}
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        whileTap={{ scale: 0.98 }}
                        onClick={simulateRequest}
                    >
                        <Send size={14} />
                        Send Request
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

const preview = {
    type: "component" as const,
    content: PostmanDemo
};

export { preview }; 
