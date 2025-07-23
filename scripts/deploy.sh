#!/bin/bash

# TransferFiles - GitHub CLI Auto Deploy Script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 TransferFiles - GitHub CLI Auto Deploy"
echo "========================================"

# Check required tools
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        echo "❌ GitHub CLI (gh) not installed"
        echo "Please install: brew install gh or visit https://cli.github.com/"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI not installed"
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "✅ Dependencies check complete"
}

# Check GitHub authentication
check_github_auth() {
    echo "🔐 Checking GitHub authentication..."
    
    if ! gh auth status &> /dev/null; then
        echo "Please login to GitHub CLI first:"
        gh auth login
    fi
    
    echo "✅ GitHub authentication ready"
}

# Check Vercel authentication
check_vercel_auth() {
    echo "🔐 Checking Vercel authentication..."
    
    if ! vercel whoami &> /dev/null; then
        echo "Please login to Vercel CLI first:"
        vercel login
    fi
    
    echo "✅ Vercel authentication ready"
}

# Create or update GitHub repository
setup_github_repo() {
    echo "📦 Setting up GitHub repository..."
    
    # Check if remote repository exists
    if git remote get-url origin &> /dev/null; then
        echo "✅ Already connected to GitHub repository"
        return
    fi
    
    # Prompt user for repository name
    read -p "Enter repository name (default: transfer-files): " repo_name
    repo_name=${repo_name:-transfer-files}
    
    # Create GitHub repository
    echo "Creating GitHub repository: $repo_name"
    gh repo create "$repo_name" --public --description "Fast, secure, and direct file transfers between any devices - no installation required." --source=. --remote=origin --push
    
    echo "✅ GitHub repository created"
}

# Link Vercel project
setup_vercel_project() {
    echo "🔗 Setting up Vercel project..."
    
    # Check if project is already linked
    if [ -f ".vercel/project.json" ]; then
        echo "✅ Already linked to Vercel project"
        return
    fi
    
    # Link or create Vercel project
    vercel link --yes
    
    echo "✅ Vercel project linked"
}

# Get Vercel configuration
get_vercel_config() {
    echo "📋 Getting Vercel configuration..."
    
    if [ ! -f ".vercel/project.json" ]; then
        echo "❌ Please link Vercel project first"
        exit 1
    fi
    
    # Read configuration
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    
    echo "Organization ID: $ORG_ID"
    echo "Project ID: $PROJECT_ID"
    
    echo "✅ Vercel configuration retrieved"
}

# Setup GitHub Secrets
setup_github_secrets() {
    echo "🔑 Setting up GitHub Secrets..."
    
    # Get current repository info
    local remote_url=$(git remote get-url origin)
    local repo_owner=$(echo "$remote_url" | sed -n 's#.*[:/]\([^/]*\)/\([^/]*\)\.git#\1#p')
    local repo_name=$(echo "$remote_url" | sed -n 's#.*[:/]\([^/]*\)/\([^/]*\)\.git#\2#p')
    
    if [ -z "$repo_owner" ] || [ -z "$repo_name" ]; then
        echo "❌ Could not determine repository info"
        exit 1
    fi
    
    echo "Setting secrets for repository: $repo_owner/$repo_name"
    
    # Get Vercel Token
    echo "Please get Vercel API Token:"
    echo "1. Visit https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Enter name like 'GitHub Actions'"
    echo "4. Copy the generated token"
    echo ""
    read -s -p "Enter Vercel Token: " VERCEL_TOKEN
    echo ""
    
    # Get Google Analytics ID (optional)
    echo ""
    echo "Google Analytics ID (optional, press Enter to skip):"
    read -p "Enter Google Analytics ID: " GA_ID
    
    # Set GitHub Secrets with explicit repo
    echo "Setting up GitHub Secrets..."
    
    gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo "$repo_owner/$repo_name"
    gh secret set VERCEL_ORG_ID --body "$ORG_ID" --repo "$repo_owner/$repo_name"
    gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID" --repo "$repo_owner/$repo_name"
    
    # Set Google Analytics ID if provided
    if [ ! -z "$GA_ID" ]; then
        gh secret set NEXT_PUBLIC_GA_ID --body "$GA_ID" --repo "$repo_owner/$repo_name"
    fi
    
    echo "✅ GitHub Secrets setup complete"
}

# Deploy project
deploy_project() {
    echo "🚀 Deploying project..."
    
    # Ensure all files are committed
    git add .
    git commit -m "feat: configure auto deployment" || echo "No new changes to commit"
    
    # Push to GitHub
    git push origin main
    
    echo "✅ Code pushed, GitHub Actions will start deployment automatically"
    echo "📊 View deployment status: gh run list"
    echo "🌐 View deployment logs: gh run view --log"
}

# Show deployment status
show_deployment_status() {
    echo "📊 Deployment status monitoring..."
    
    # Get current repository info
    local remote_url=$(git remote get-url origin)
    local repo_owner=$(echo "$remote_url" | sed -n 's#.*[:/]\([^/]*\)/\([^/]*\)\.git#\1#p')
    local repo_name=$(echo "$remote_url" | sed -n 's#.*[:/]\([^/]*\)/\([^/]*\)\.git#\2#p')
    
    if [ -z "$repo_owner" ] || [ -z "$repo_name" ]; then
        echo "⚠️  Could not determine repository info from remote URL"
        echo "Current remote: $(git remote get-url origin)"
        return
    fi
    
    # Wait for GitHub Actions to start
    sleep 5
    
    # Show latest run status with explicit repo
    echo "Latest GitHub Actions runs:"
    gh run list --limit 3 --repo "$repo_owner/$repo_name" || echo "⚠️  Could not fetch GitHub Actions runs"
    
    echo ""
    echo "🔗 Useful links:"
    echo "- GitHub Actions: https://github.com/$repo_owner/$repo_name/actions"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
    echo "📝 Common commands:"
    echo "- View run status: gh run list --repo $repo_owner/$repo_name"
    echo "- View run logs: gh run view --log --repo $repo_owner/$repo_name"
    echo "- Re-run failed job: gh run rerun [run-id] --repo $repo_owner/$repo_name"
}

# Main function
main() {
    echo "Starting auto deployment process..."
    echo ""
    
    check_dependencies
    check_github_auth
    check_vercel_auth
    setup_github_repo
    setup_vercel_project
    get_vercel_config
    setup_github_secrets
    deploy_project
    show_deployment_status
    
    echo ""
    echo "🎉 Deployment configuration complete!"
    echo "Your app will be available in a few minutes."
}

# Run main function
main "$@"