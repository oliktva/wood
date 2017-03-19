"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var pug = require("gulp-pug");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var cheerio = require("gulp-cheerio");
var replace = require("gulp-replace");
var ghPages = require('gulp-gh-pages');

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
  .pipe(cheerio({
    run: function ($) {
      $("[fill]").removeAttr("fill");
      $("[stroke]").removeAttr("stroke");
      $("[style]").removeAttr("style");
    },
    parserOptions: {xmlMode: true}
   }))
   .pipe(replace("&gt;", ">"))
   .pipe(svgmin())
   .pipe(svgstore({
      inlineSvg: true
    }))
   .pipe(rename("symbols.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task('pug', function buildHTML() {
  return gulp.src('template/*.pug')
  .pipe(pug())
  .pipe(gulp.dest("build"))
  .pipe(server.reload({stream: true}));
});

gulp.task("serve", function() {
  server.init({
    server: "build"
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("template/**/*.{pug}", ["pug"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("copy", function() {
 return gulp.src([
 "font/**/*.{woff,woff2}",
 "img/**",
 "js/**"
 ], {
 base: "."
 })
 .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
 return del("build");
});

gulp.task("build", function(fn) {
  run("clean",
  "pug",
  "style",
   "copy",
   "images",
   "symbols",
    fn
  );
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
