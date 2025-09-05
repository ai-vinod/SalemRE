const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed');
} catch (error) {
  console.error('❌ Netlify CLI is not installed. Please install it first with: npm install -g netlify-cli');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('⚠️ .env file not found. Creating from example...');
  if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    fs.copyFileSync(path.join(__dirname, '.env.example'), path.join(__dirname, '.env'));
    console.log('✅ Created .env file from .env.example');
  } else {
    console.error('❌ .env.example file not found. Please create .env file manually.');
    process.exit(1);
  }
}

// Deploy to Netlify
console.log('🚀 Deploying to Netlify...');

try {
  // Login to Netlify (if not already logged in)
  execSync('netlify status', { stdio: 'ignore' });
  console.log('✅ Already logged in to Netlify');
} catch (error) {
  console.log('⚠️ Not logged in to Netlify. Please login:');
  execSync('netlify login', { stdio: 'inherit' });
}

// Build the project
console.log('🔨 Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Initialize Netlify site if not already initialized
if (!fs.existsSync(path.join(__dirname, '.netlify'))) {
  console.log('⚠️ Netlify site not initialized. Initializing...');
  execSync('netlify init', { stdio: 'inherit' });
} else {
  console.log('✅ Netlify site already initialized');
}

// Deploy to Netlify
console.log('🚀 Deploying to Netlify...');
execSync('netlify deploy --prod', { stdio: 'inherit' });

console.log('✅ Deployment complete!');