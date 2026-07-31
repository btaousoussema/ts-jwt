module.exports = {
  transformIgnorePatterns: [
    // Transform 'uuid', but continue ignoring all other node_modules
    '/node_modules/(?!uuid)'
  ],
};