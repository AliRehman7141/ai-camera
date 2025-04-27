// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);


const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
    resolver: {
        assetExts: [...getDefaultConfig(__dirname).resolver.assetExts, 'bin'], // Ensure other default extensions remain
    },
};

const defaultConfig = getDefaultConfig(__dirname);

// Merge the default config with your custom config
module.exports = mergeConfig(defaultConfig, config);
