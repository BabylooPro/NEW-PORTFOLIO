import { ProjectData } from "./types";
import { useState } from "react";

function DevOpsDemo() {
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

export const devops: ProjectData = {
    title: "DevOps & Cloud",
    file: "deploy.yml",
    language: "yaml",
    terminal: true,
    snippetHeight: 500,
    project: {
        name: "Development/Infrastructure",
        branch: "deployments"
    },
    terminalCommands: [
        {
            command: 'git status',
            output: 'On branch main\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n        modified:   .github/workflows/deploy-all.yml\n        modified:   infrastructure/main.tf\n        modified:   README.md',
            delay: 800
        },
        {
            command: 'git add .',
            output: '',
            delay: 500
        },
        {
            command: 'git commit -m "added: gitHub actions workflow for aws and appstore deployments"',
            output: '[main 8e7d23f] added: gitHub actions workflow for aws deployments\n 3 files changed, 89 insertions(+), 12 deletions(-)',
            delay: 1000
        },
        {
            command: 'git push origin main',
            output: 'Enumerating objects: 9, done.\nCounting objects: 100% (9/9), done.\nDelta compression using up to 10 threads\nCompressing objects: 100% (5/5), done.\nWriting objects: 100% (5/5), 1.52 KiB | 1.52 MiB/s, done.\nTotal 5 (delta 3), reused 0 (delta 0), pack-reused 0\nTo github.com:username/project.git\n   e3d9076..8e7d23f  main -> main',
            delay: 2000
        }
    ],
    snippet: `

# Multi-Service Deployment Workflow
name: Deploy All Services
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # DEPLOY BACKEND SERVICE ON AWS LAMBDA
  deploy-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '7.0.x'

      - name: Build and Test
        run: |
          dotnet restore
          dotnet build --no-restore
          dotnet test --no-build

      - name: Deploy to Lambda
        uses: aws-actions/aws-lambda-deploy-function@v1
        with:
          function-name: api-backend
          zip-file: publish.zip
          
  # DEPLOY FRONTEND SERVICE ON AWS AMPLIFY
  deploy-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Build React App
        run: |
          npm ci
          npm run build
          
      - name: Deploy to Amplify
        uses: aws-actions/amplify-cli-action@master
        with:
          amplify_command: publish
          amplify_env: production

  # DEPLOY MOBILE APP TO APP STORE CONNECT
  deploy-mobile:
    runs-on: macos-latest
    defaults:
      run:
        working-directory: ./mobile
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '14.x'
          
      - name: Install Certificates
        uses: apple-actions/import-codesign-certs@v1
        with:
          p12-file-base64: \${{ secrets.CERTIFICATES_P12 }}
          p12-password: \${{ secrets.CERTIFICATES_P12_PASSWORD }}
          
      - name: Build and Archive
        run: |
          xcodebuild archive \\
            -scheme "MyApp" \\
            -archivePath MyApp.xcarchive
            
      - name: Upload to TestFlight
        uses: apple-actions/upload-testflight-build@v1
        with:
          app-path: MyApp.xcarchive
          api-key: \${{ secrets.APP_STORE_CONNECT_API_KEY }}`,
    preview: {
        type: "component",
        content: DevOpsDemo
    }
};
