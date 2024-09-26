const { series, parallel } = require('gulp');
const core = require('./gulp/tasks/core');

exports.default = core.tasks.task1;
exports.docs = series(
    core.asciidoctorBuildTasks(),
    core.marpBuildTasks(),
    parallel(core.asciidoctor.server, core.asciidoctor.watch, core.marp.watch),
);
exports.slides = series(core.marp.build);

exports.server = core.vite.server;
