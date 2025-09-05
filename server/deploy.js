const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Heroku CLI is installed
try {
  execSync('heroku --version', { stdio: 'ignore' });
  console.log('✅ Heroku CLI is installed');
} catch (error) {
  console.error('❌ Heroku CLI is not installed. Please install it first.');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.error('❌ .env file not found. Please create it first.');
  process.exit(1);
}

// Deploy to Heroku
console.log('🚀 Deploying to Heroku...');

try {
  // Login to Heroku (if not already logged in)
  execSync('heroku auth:whoami', { stdio: 'ignore' });
  console.log('✅ Already logged in to Heroku');
} catch (error) {
  console.log('⚠️ Not logged in to Heroku. Please login:');
  execSync('heroku login', { stdio: 'inherit' });
}

// Check if app exists or create it
let appName = 'salemre-api';
try {
  execSync(`heroku apps:info ${appName}`, { stdio: 'ignore' });
  console.log(`✅ Heroku app ${appName} already exists`);
} catch (error) {
  console.log(`⚠️ Creating Heroku app ${appName}...`);
  execSync(`heroku create ${appName}`, { stdio: 'inherit' });
}

// Set environment variables from .env file
console.log('📝 Setting environment variables...');
require('dotenv').config();
const envVars = [
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

for (const envVar of envVars) {
  if (process.env[envVar]) {
    execSync(`heroku config:set ${envVar}=${process.env[envVar]} --app ${appName}`, { stdio: 'ignore' });
    console.log(`✅ Set ${envVar}`);
  } else {
    console.warn(`⚠️ ${envVar} not found in .env file`);
  }
}

// Add PostgreSQL addon if not already added
try {
  execSync(`heroku addons:info postgresql --app ${appName}`, { stdio: 'ignore' });
  console.log('✅ PostgreSQL addon already exists');
} catch (error) {
  console.log('⚠️ Adding PostgreSQL addon...');
  execSync(`heroku addons:create heroku-postgresql:hobby-dev --app ${appName}`, { stdio: 'inherit' });
}

// Deploy to Heroku
console.log('🚀 Deploying to Heroku...');
execSync(`git push heroku main`, { stdio: 'inherit' });

console.log('✅ Deployment complete!');
console.log(`🌐 Your API is now available at: https://${appName}.herokuapp.com`);