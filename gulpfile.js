const gulp = require('gulp');
const packs = require('./utils/packs.js');

exports.cleanPacks = gulp.series(packs.clean);
exports.compilePacks = gulp.series(packs.compile);
exports.extractPacks = gulp.series(packs.extract);

exports.buildAll = gulp.parallel(
  packs.compile
);