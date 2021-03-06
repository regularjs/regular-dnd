var webpack = require('gulp-webpack');
var deploy = require("gulp-gh-pages");
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pkg = require("./package.json");
var shell = require("gulp-jshint");
var through = require('through2');
var shell = require("gulp-shell");
var gulp = require('gulp');
var path = require('path');



var wpConfig = {
  resolve: {
    alias: {
      'regularjs': './regular.js'
    }
  },
  output: {
    filename: "regular-dnd.js",
    library: "ReDnd",
    libraryTarget: "umd"
  },
  externals: {
    "regularjs": "regularjs"
  },
  module: {
    loaders: [
       { test: /\.js$/, loader: 'babel?cacheDirectory'}
   ]
  }
}

gulp.task('jshint', function(){
      // jshint
  gulp.src(['lib/**/*.js', '!lib/regular.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})


gulp.task('build', [ 'jshint'  ], function() {
  gulp.src("lib/index.js")
    .pipe(webpack(wpConfig))
    .pipe(wrap(signatrue))
    .pipe(gulp.dest('./dist'))
    .pipe(wrap(mini))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .on("error", function(err){
      throw err
    })
});


gulp.task('watch', ["build"], function(){
  gulp.watch(['lib/**' ], ['build']);
})


gulp.task('default', [ 'watch']);



gulp.task('karma', function (done) {
  var config = _.extend({}, karmaCommonConf);
  if(process.argv[3] === '--phantomjs'){
    config.browsers=["PhantomJS"]
    config.coverageReporter = {type : 'text-summary'}

    karma.start(_.extend(config, {singleRun: true}), done);

  }else if(process.argv[3] === '--browser'){
    config.browsers = null;
    karma.start(_.extend(config, {singleRun: true}), done);
  }else{
    karma.start(_.extend(config, {singleRun: true}), done);
  }
});



gulp.task('travis', ['jshint' ,'build','mocha',  'karma']);



gulp.task('deploy', function () {
  gulp.src("doc/public/**/*.*")
    .pipe(deploy({
      remoteUrl: "git@github.com:regular-ui/bootstrap",
      branch: "gh-pages"
    }))
    .on("error", function(err){
      console.log(err)
    })
});


function wrap(fn){
  return through.obj(fn);
}

function signatrue(file, enc, cb){
  var sign = '/**\n'+ '@author\t'+ pkg.author.name + '\n'+ '@version\t'+ pkg.version +
    '\n'+ '@homepage\t'+ pkg.homepage + '\n*/\n';
  file.contents =  Buffer.concat([new Buffer(sign), file.contents]);
  cb(null, file);
}

function mini(file, enc, cb){
  file.path = file.path.replace('.js', '.min.js');
  cb(null, file)
}