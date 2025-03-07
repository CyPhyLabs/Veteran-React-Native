const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Silence the warnings
config.logger = {
    warn: () => { },
};

module.exports = config;