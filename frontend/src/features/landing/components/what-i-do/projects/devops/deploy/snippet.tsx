const code = `# Multi-Service Deployment Workflow
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
          api-key: \${{ secrets.APP_STORE_CONNECT_API_KEY }}`;

export const snippet = code; 
