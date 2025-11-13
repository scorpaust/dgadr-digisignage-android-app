// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("@expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("cjs");

// Configuração para suporte a UTF-8 e acentos portugueses
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  minifierConfig: {
    ...defaultConfig.transformer.minifierConfig,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

module.exports = defaultConfig;
