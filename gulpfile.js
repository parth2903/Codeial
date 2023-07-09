const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // to convert sass to css
const cssnano = require('gulp-cssnano'); // used in minifying
const rev = require('gulp-rev'); //used in renaming 
const imagemin = require('gulp-imagemin'); 
const uglify = require('gulp-uglify-es').default; 
const del = require('del');

gulp.task('css',function(done){
    console.log("Minifying CSS");
    gulp.src('./assets/sass/**/*.scss')    //**  means any folder or subfolder inside it 
    .pipe(sass()) //passed to sass module for sass to css
    .pipe(cssnano())  //pipe is a function which is calling all these middleware
    .pipe(gulp.dest('./assets.css'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'))

    done();
})

gulp.task('js',function(done){
    console.log("Minifying JS");
    gulp.src('./assets/**/*.js')   
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
})

gulp.task('images',function(done){
    console.log("Compressing Images");
    gulp.src('./assets/sass/**/*.+(png|jpg|gif|svg|jpeg)')    //Regex
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
})

//empty the public/assets directory (because whenever building new build remove old content)
gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
});

//created a task build to run above all 4 tasks
gulp.task('build', gulp.series('clean:assets','css','js','images'),function(done){
    console.log('Building Assets');
    done();
})