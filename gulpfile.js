var gulp = require("gulp"),
	gutil = require("gulp-util"),
	coffee = require("gulp-coffee");

gulp.task("coffee", function() {
	gulp.src("./**/*.coffee")
		.pipe(coffee({bare: false}).on("error", gutil.log))
		.pipe(gulp.dest("./"));
});

gulp.task("default", ["coffee"]);