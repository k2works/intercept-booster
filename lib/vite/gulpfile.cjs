const { series, parallel } = require('gulp');
const core = require('./gulp/tasks/core');

exports.docs = series(
    core.asciidoctorBuildTasks(),
    core.marpBuildTasks(),
    parallel(core.asciidoctor.server, core.asciidoctor.watch, core.marp.watch),
);
exports.slides = series(core.marp.build);

exports.server = core.vite.server;

exports.default = series(
    core.webpackBuildTasks(),
    series(
        parallel(core.webpack.server, core.asciidoctor.server),
        parallel(core.webpack.watch, core.asciidoctor.watch, core.marp.watch),
    )
);

exports.build = series(
    core.webpackBuildTasks(),
    parallel(core.webpack.build, core.asciidoctor.build, core.marp.build),
);
