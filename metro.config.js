const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// RTK Query subpath exports (`@reduxjs/toolkit/query/react`) need these
// conditions or Metro fails with "Unable to resolve".
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "react-native",
  "browser",
  "require",
  "import",
];

module.exports = config;
