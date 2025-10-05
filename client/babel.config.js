module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This plugin allows us to import GEMINI_API_KEY from .env
      'module:react-native-dotenv',
    ],
  };
};