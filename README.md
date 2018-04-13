
Remember
----------
To run, cd to this dir and just type 'gulp' in the CLI
To build the dist dir type  'gulp build' in the CLI

Everything to edit is in the app dir
This gets gulped to the dist dir

There is an image convertor, it's doing something to reduce the size by a little bit but it isn't re-sizing them or anything
https://www.npmjs.com/package/imagemin

The gulpfile.js
----------------
-* Gulp converts the sass so no need to do it in the CLI

-* useref is where the js and css is compiled and minimised

    -> Turn on/off minify css
      ```js
      // minify css
      // .pipe(gulpif('*.css', cssnano()))

      //or don't minify
      .pipe(gulpif('*.css', gulp.dest('dist/css')))
      .pipe(gulp.dest('dist'));
      ```
