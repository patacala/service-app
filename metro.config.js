const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Soportar archivos .cjs usados por algunas librerías
config.resolver.sourceExts.push('cjs');

// No usamos opciones de servidor personalizadas no soportadas.
// Expo/Metro no reconoce `server.timeoutForConnecting`, por eso mostraba el warning.

module.exports = config;