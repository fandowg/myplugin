var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch'); //4.0 可能要改寫法
var plumber = require('gulp-plumber'); //有錯會繼續進行
var postcss = require('gulp-postcss'); //css轉譯
var autoprefixer = require('autoprefixer'); //自動加上前綴
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat'); //合併檔案
var browserSync = require('browser-sync').create(); //建立本機伺服器
var cleanCSS = require('gulp-clean-css'); //壓縮css
var uglify = require('gulp-uglify'); //壓縮js 清除console
var minimist = require('minimist'); // 用字串轉換開發模式
var gulpif = require('gulp-if'); //判斷
var clean = require('gulp-clean'); //自動清除資料夾內容
var imagemin = require('gulp-imagemin'); //壓縮圖片
var ghPages = require('gulp-gh-pages'); //把發佈版本上傳 github
var envOptions = {
    string: 'env',
    default: {
        env: 'develop'
    }
}
var option = minimist(process.argv.slice(2), envOptions);

gulp.task('scss', function() {
    var plugins = [
        autoprefixer({ browsers: ['last 3 version', '>5%', 'ie 6'] })
    ];
  return gulp.src('./scss/**/*.scss')
 // return gulp.src('./scss/f-animate.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulpif(option.env === 'pro', cleanCSS()))
       // .pipe(concat('all.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
});

gulp.task('browserSync', function(done) {
    browserSync.init({
        server: {
            baseDir: "./",
            index:'animate.html'
        }
    });
    done();
});
gulp.task('imageMin', () =>
    gulp.src('./sourceimages/**/*')
    .pipe(gulpif(option.env === 'pro', imagemin()))
    .pipe(gulp.dest('./images'))
);

//gulp.task('beVendor',gulp.series(toVendor, vendorJs));
//4.0版本
gulp.task('watch', function(done) {
    gulp.watch('./scss/**/*.scss', gulp.series('scss'));
//gulp.watch('./scss/f-animate.scss', gulp.series('scss'));
     gulp.watch('./sourceimages/**/*', gulp.series('imageMin'));
    done();
});


gulp.task('default', gulp.series('scss','watch', 'browserSync'));
