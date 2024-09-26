const gulp = require("gulp");

// 動的に import する関数
async function loadVite() {
    const vite = await import('gulp-vite');
    return vite.default;
}

gulp.task("serve", async (cb) => {
    const vite = await loadVite();
    vite.init({
        output: "public", // default output path, from where your html files are served
        root: `${process.cwd()}`, // default root path as src directory
        ignored: [`**/src/templates/**`], // files to ignore with vite watch
        reloadPublic: false, // if html/json files should be reloaded in public dir
        reloadFiles: (file) => file.endsWith('.php') || file.endsWith('.latte'), // additional files to reload upon change
        vite: {
            // your vite config goes here
            css: {
                postcss: {
                    plugins: []
                }
            }
        }
    });
    cb();
});

exports.server = async () => {
    const vite = await loadVite();
    return vite.server;
};
exports.options = async () => {
    const vite = await loadVite();
    return vite.options;
};
exports.reload = async () => {
    const vite = await loadVite();
    return vite.reload;
};
exports.middleware = async () => {
    const vite = await loadVite();
    return vite.plugin.middleware;
};
// exports.reload = async () => {
//    const vite = await loadVite();
//    return vite.plugin.reload;
// };
