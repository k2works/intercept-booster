const { series, parallel } = require('gulp');
const core = require('./gulp/tasks/core');

exports.default = series(
    core.webpackBuildTasks(),
    core.asciidoctorBuildTasks(),
    core.marpBuildTasks(),
    core.prettier.format,
    series(
        parallel(core.webpack.server, core.asciidoctor.server),
        parallel(core.webpack.watch, core.asciidoctor.watch, core.marp.watch),
        parallel(core.jest.watch)
    )
);

exports.build = series(
    core.webpackBuildTasks(),
    core.asciidoctorBuildTasks(),
    core.marpBuildTasks(),
    core.prettier.format
);

exports.test = series(core.jest.test);

exports.format = series(core.prettier.format);

exports.slides = series(core.marp.build);

exports.docs = series(
    core.asciidoctorBuildTasks(),
    core.marpBuildTasks(),
    parallel(core.asciidoctor.server, core.asciidoctor.watch, core.marp.watch),
);

exports.watch = parallel(core.webpack.watch, core.asciidoctor.watch, core.marp.watch, core.jest.watch);
