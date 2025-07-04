#!/bin/bash

# Security Audit Script for Max Remy Portfolio
# This script performs basic security checks on the portfolio

echo "🔒 Security Audit for Max Remy Portfolio"
echo "======================================="
echo ""

# Check for dependency vulnerabilities
echo "📦 Checking Frontend Dependencies..."
cd frontend
npm audit --audit-level=moderate > /tmp/frontend_audit.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend: No moderate+ vulnerabilities found"
else
    echo "⚠️  Frontend: Vulnerabilities detected - see /tmp/frontend_audit.log"
    echo "   Run: cd frontend && npm audit"
fi

echo ""
echo "📦 Checking Backend Dependencies..."
cd ../cms
npm audit --audit-level=moderate > /tmp/cms_audit.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend: No moderate+ vulnerabilities found"
else
    echo "⚠️  Backend: Vulnerabilities detected - see /tmp/cms_audit.log"
    echo "   Run: cd cms && npm audit"
fi

echo ""
echo "🔍 Security Configuration Checks..."

# Check for sensitive files
echo "📁 Checking for sensitive files..."
if find . -name "*.env" -not -path "./node_modules/*" | grep -q .; then
    echo "⚠️  Environment files found (ensure they're not in git):"
    find . -name "*.env" -not -path "./node_modules/*"
else
    echo "✅ No .env files found in repository"
fi

# Check for hardcoded secrets
echo "🔐 Checking for potential hardcoded secrets..."
if grep -r -i "password\|secret\|key" --include="*.js" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules . | grep -v ".env" | grep -v "// " | grep -v "process.env" | head -5; then
    echo "⚠️  Potential hardcoded secrets found (review above)"
else
    echo "✅ No obvious hardcoded secrets found"
fi

# Check CORS configuration
echo "🌐 Checking CORS configuration..."
if grep -q "origin: \['\*'\]" cms/config/middlewares.ts; then
    echo "❌ CORS allows all origins - security risk!"
else
    echo "✅ CORS properly configured"
fi

# Check file upload limits
echo "📂 Checking file upload limits..."
if grep -q "10.*GB" cms/config/middlewares.ts; then
    echo "⚠️  Large file upload limits detected"
else
    echo "✅ File upload limits are reasonable"
fi

echo ""
echo "🎯 Security Recommendations:"
echo "   • Run 'npm audit' regularly to check for new vulnerabilities"
echo "   • Monitor logs for suspicious activity"
echo "   • Keep dependencies updated"
echo "   • Review and rotate API keys periodically"
echo "   • Ensure SSL/TLS certificates are valid"
echo ""
echo "📚 For detailed security information, see SECURITY.md"