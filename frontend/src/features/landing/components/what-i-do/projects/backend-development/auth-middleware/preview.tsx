import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Shield, Database } from 'lucide-react';

const AuthFlowPreview = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto p-8">
            <div className="relative h-[400px] flex items-center justify-between">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[2px] bg-neutral-200 dark:bg-neutral-800" />

                <motion.div
                    className="relative z-10 w-[140px] h-[140px] bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col items-center justify-center text-neutral-900 dark:text-white font-medium shadow-xl backdrop-blur-sm"
                    animate={{
                        scale: step === 0 ? 1.05 : 1,
                        x: step === 1 ? 20 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{
                            scale: step === 0 ? 1.1 : 1,
                            opacity: step === 0 ? 1 : 0.7,
                        }}
                    >
                        <Globe2 size={48} className="mb-3 text-neutral-600 dark:text-neutral-400" strokeWidth={1.5} />
                    </motion.div>
                    <div className="text-xl mb-2">Client</div>
                    {step === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-neutral-600 dark:text-neutral-400 text-center px-2"
                        >
                            Sends JWT in Header
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="relative z-10 w-[180px] h-[180px] bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col items-center justify-center text-neutral-900 dark:text-white font-medium shadow-xl backdrop-blur-sm"
                    animate={{
                        scale: step === 1 || step === 2 ? 1.05 : 1,
                        rotate: step === 2 ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{
                        duration: 0.5,
                        rotate: { duration: 0.6, repeat: 0 }
                    }}
                >
                    <motion.div
                        animate={{
                            scale: step === 1 || step === 2 ? 1.1 : 1,
                            opacity: step === 1 || step === 2 ? 1 : 0.7,
                        }}
                    >
                        <Shield size={56} className="mb-3 text-neutral-600 dark:text-neutral-400" strokeWidth={1.5} />
                    </motion.div>
                    <div className="text-xl mb-2 text-center">JWT Middleware</div>
                    {(step === 1 || step === 2) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-neutral-600 dark:text-neutral-400 text-center px-2"
                        >
                            {step === 1 ? "Validating Token" : "Decoding User ID"}
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="relative z-10 w-[140px] h-[140px] bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col items-center justify-center text-neutral-900 dark:text-white font-medium shadow-xl backdrop-blur-sm"
                    animate={{
                        scale: step === 3 ? 1.05 : 1,
                        x: step === 3 ? -20 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{
                            scale: step === 3 ? 1.1 : 1,
                            opacity: step === 3 ? 1 : 0.7,
                        }}
                    >
                        <Database size={48} className="mb-3 text-neutral-600 dark:text-neutral-400" strokeWidth={1.5} />
                    </motion.div>
                    <div className="text-xl mb-2 text-center">User Service</div>
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-neutral-600 dark:text-neutral-400 text-center px-2"
                        >
                            Attaching User Data
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="absolute left-[25%] top-1/2 -translate-y-1/2 w-[20%] h-[3px] bg-gradient-to-r from-neutral-400 to-neutral-300 dark:from-neutral-600 dark:to-neutral-500 origin-left"
                    animate={{
                        scaleX: step === 1 ? 1 : 0,
                        opacity: step === 1 ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                />
                <motion.div
                    className="absolute right-[25%] top-1/2 -translate-y-1/2 w-[20%] h-[3px] bg-gradient-to-r from-neutral-300 to-neutral-400 dark:from-neutral-500 dark:to-neutral-600 origin-left"
                    animate={{
                        scaleX: step === 3 ? 1 : 0,
                        opacity: step === 3 ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <motion.div
                className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6"
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 0.3 }}
            >
                {step === 0 && "Client makes API request with JWT token in Authorization header"}
                {step === 1 && "Middleware extracts and validates the JWT token"}
                {step === 2 && "Token is decoded to extract the user ID"}
                {step === 3 && "User data is fetched and attached to request context"}
            </motion.div>
        </div>
    );
};

const preview = {
    type: "component" as const,
    content: AuthFlowPreview
};

export { preview }; 
