const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs files
config.resolver.sourceExts.push('cjs');

// Disable package exports for Expo Go compatibility with Firebase v9
config.resolver.unstable_enablePackageExports = false;

module.exports = config;