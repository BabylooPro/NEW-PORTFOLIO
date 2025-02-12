import { useState } from "react";

export function DevOpsDemo() {
    const [deployStatus, setDeployStatus] = useState<'pending' | 'running' | 'completed' | 'failed'>('pending');
    const [logs, setLogs] = useState<string[]>([]);
    const [activeService, setActiveService] = useState<'backend' | 'frontend' | 'mobile'>('backend');

    const simulateDeploy = () => {
        setDeployStatus('running');
        setLogs([]);

        const deploySteps = {
            backend: [
                "📝 Running .NET tests...",
                "✅ All tests passed successfully",
                "🏗️ Building .NET Lambda function...",
                "📦 Creating deployment package...",
                "⬆️ Uploading to AWS Lambda...",
                "🚀 Updating API Gateway...",
                "✨ API deployed to AWS Lambda!"
            ],
            frontend: [
                "🧪 Running React tests...",
                "✅ Tests completed",
                "🏗️ Building React application...",
                "📦 Optimizing build...",
                "⬆️ Uploading to AWS Amplify...",
                "🚀 Deploying to CDN...",
                "✨ Website is live!"
            ],
            mobile: [
                "🧪 Running Swift tests...",
                "✅ Tests passed",
                "🏗️ Building iOS app...",
                "📱 Archiving for App Store...",
                "📦 Processing for TestFlight...",
                "⬆️ Uploading to App Store Connect...",
                "✨ Build ready for review!"
            ]
        };

        const steps = deploySteps[activeService];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setLogs(prev => [...prev, step]);
                if (index === steps.length - 1) {
                    setDeployStatus('completed');
                }
            }, (index + 1) * 1000);
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md font-mono text-sm">
            <div className="flex gap-2">
                {(['backend', 'frontend', 'mobile'] as const).map(service => (
                    <button
                        key={service}
                        onClick={() => {
                            setActiveService(service);
                            setDeployStatus('pending');
                            setLogs([]);
                        }}
                        className={`px-3 py-1 rounded ${activeService === service
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deployStatus === 'pending' ? 'bg-gray-500' :
                    deployStatus === 'running' ? 'bg-yellow-500' :
                        deployStatus === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                <span>Deployment status: {deployStatus}</span>
            </div>

            <button
                onClick={simulateDeploy}
                disabled={deployStatus === 'running'}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Deploy {activeService.charAt(0).toUpperCase() + activeService.slice(1)}
            </button>

            <div className="bg-black text-green-400 p-4 rounded-lg h-[200px] overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className="whitespace-pre">
                        $ {log}
                    </div>
                ))}
                {deployStatus === 'running' && (
                    <div className="animate-pulse">$ _</div>
                )}
            </div>
        </div>
    );
} 
