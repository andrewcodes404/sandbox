const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

//js compile
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');

//css compile
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

// index.html compile
const useref = require('gulp-useref');

const html2pug = require('gulp-html2pug');

//imgs
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

//clean your old distribution
const del = require('del');

// order tasks
const runSequence = require('run-sequence');


///----//// GULP TASKS ////------///
///------------------------------///

//sass
gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//useref --> this looks at the dev html and compiles the html and css
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpif('*.js', uglify()))
        //autoprefix for css
        .pipe(gulpif('*.css', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
        // minify css
        // .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});


// PUG that html

gulp.task('pug', function() {
  // Backend locales
  return gulp.src('app/*.html')
  .pipe(html2pug(/* options for html2pug such as { fragment: true } */))
  .pipe(gulp.dest('dist/pug'));
});



//images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

//fonts
//We can copy files with Gulp simply by specifying the gulp.src and gulp.dest without any plugins.
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//browsersync

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

///delete dist dir
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//if you need to clear the img cache (wherever that is???)
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})


///----/// GULP WATCHING ///-----///
///------------------------------///


gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/sass/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});


/// DEFAULT ORDER OF TASKS
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'pug', 'images', 'fonts'],
    function(){
      console.log('🏗️  🏛️  --> Build Complete <-- 🏛️  🏗️ ');
    }
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    function(){
      console.log('⌚ ⌚ ⌚ ⌚ ⌚ watching 👀 👀 👀 👀 👀');
    }
  )
})


//// now just type 'gulp'  or  'gulp build' in the CLI
