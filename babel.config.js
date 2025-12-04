// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/design-system': './src/design-system',
          '@/assets/images': './src/assets/images',
          '@/hooks': './src/hooks'
        },
      },
    ],
  ],
};