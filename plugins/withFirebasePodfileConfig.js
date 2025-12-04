const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin para aplicar el workaround de headers no modulares
 * para @react-native-firebase/app en iOS.
 * 
 * Este plugin añade use_modular_headers! y modifica el post_install hook
 * necesario para compilar con useFrameworks: "static".
 */
module.exports = function withFirebasePodfileConfig(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');

      // 1. Añadir use_modular_headers! justo después de "target 'xxx' do"
      if (!podfileContent.includes('use_modular_headers!')) {
        podfileContent = podfileContent.replace(
          /target ['"].*?['"] do\n/,
          (match) => `${match}  use_modular_headers!\n`
        );
      }

      // 2. Añadir workaround después de react_native_post_install
      const workaroundCode = `
    # Workaround para @react-native-firebase/app con useFrameworks: "static"
    # https://github.com/expo/expo/issues/39607
    installer.pods_project.targets.each do |target|
      if target.name == 'RNFBApp' || target.name == 'RNFBAuth'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        end
      end
    end`;

      // Insertar justo después del cierre de react_native_post_install y antes del end del post_install
      if (podfileContent.includes('post_install do |installer|') && !podfileContent.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES')) {
        podfileContent = podfileContent.replace(
          /(\s+\))\n(\s*end\nend)/m,
          `$1${workaroundCode}\n$2`
        );
      }

      fs.writeFileSync(podfilePath, podfileContent, 'utf-8');

      return config;
    },
  ]);
};

