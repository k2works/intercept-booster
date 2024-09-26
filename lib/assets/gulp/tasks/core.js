const { series, parallel, watch, src, dest } = require("gulp");
const { default: rimraf } = require("rimraf");
const browserSync = require('browser-sync').create();
const shell = require('gulp-shell');
const kroki = require("asciidoctor-kroki");
const fs = require("fs");
const {marpCli} = require("@marp-team/marp-cli");
const webpackConfig = require("../../webpack.config");

const asciidoctor = {
    clean: async (cb) => {
        await rimraf("./public/docs");
        cb();
    },
    build: (cb) => {
        const fs = require("fs");
        const asciidoctor = require("@asciidoctor/core")();
        const kroki = require("asciidoctor-kroki");

        const krokiRegister = () => {
            const registry = asciidoctor.Extensions.create();
            kroki.register(registry);
            return registry;
        };

        const inputRootDir = "./docs";
        const outputRootDir = "./public/docs";

        const fileNameList = fs.readdirSync(inputRootDir);
        const docs = fileNameList.filter(RegExp.prototype.test, /.*\.adoc$/);

        docs.map((input) => {
            const file = `${inputRootDir}/${input}`;
            asciidoctor.convertFile(file, {
                safe: "safe",
                extension_registry: krokiRegister(),
                to_dir: outputRootDir,
                mkdirs: true,
            });
        });

        src(`${inputRootDir}/images/*.*`).pipe(dest(`${outputRootDir}/images`));

        cb();
    },
    watch: (cb) => {
        watch("./docs/**/*.adoc", asciidoctor.build);
        cb();
    },
    server: (cb) => {
        browserSync.init({
            server: {
                baseDir: "./public",
            },
        });
        watch("./public/**/*.html").on("change", browserSync.reload);
        cb();
    },
}

const marp = {
    build: (cb) => {
        const { marpCli } = require('@marp-team/marp-cli')
        const inputRootDir = "./docs/slides";
        const outputRootDir = "./public/docs/slides";

        marpCli([
            `${inputRootDir}/PITCHME.md`,
            "--html",
            "--output",
            `${outputRootDir}/index.html`,
        ])
            .then((exitStatus) => {
                if (exitStatus > 0) {
                    console.error(`Failure (Exit status: ${exitStatus})`);
                } else {
                    console.log("Success");
                }
            })
            .catch(console.error);

        src(`${inputRootDir}/images/*.*`).pipe(dest(`${outputRootDir}/images`));

        cb();
    },
    clean: async (cb) => {
        await rimraf("./public/docs/slides");
        cb();
    },
    watch: (cb) => {
        watch("./docs/slides/**/*.md", marp.build);
        cb();
    }
}

const webpack = {
    clean: async (cb) => {
        await rimraf("./public");
        cb();
    },
    build: (cb) => {
        const webpack = require("webpack");
        webpack(webpackConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err);
            }
            cb();
        });
    },
    watch: (cb) => {
        const webpack = require("webpack");
        const compiler = webpack(webpackConfig);
        compiler.watch({}, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err);
            }
        });
        cb();
    },
    server: (cb) => {
        const webpack = require("webpack");
        const compiler = webpack(webpackConfig);
        const WebpackDevServer = require("webpack-dev-server");
        const devServerOptions = Object.assign({}, webpackConfig.devServer, {
            open: false,
        });
        const server = new WebpackDevServer(compiler, devServerOptions);
        server.start(devServerOptions.port, devServerOptions.host, () => {
            console.log("Starting server on http://localhost:8080");
        });
        cb();
    },
}

const jest = {
    test: (cb) => {
        const jest = require("jest");
        jest.run(["--coverage"]);
        cb();
    },
    watch: (cb) => {
        const jest = require("jest");
        jest.run(["--watchAll"]);
        cb();
    },
}

const prettier = {
    format: (cb) => {
        const prettier = require('gulp-prettier');
        return src("./src/**/*.{js,jsx,ts,tsx,json,css,scss,md}")
            .pipe(prettier(
                {
                    "semi": true,
                    "trailingComma": "all",
                    "singleQuote": false,
                    "printWidth": 80,
                    "tabWidth": 2
                }
            ))
            .pipe(dest('src'));
    },
    watch: (cb) => {
        watch("./src/**/*.{js,jsx,ts,tsx,json,css,scss,md}", prettier.format);
        cb();
    },
};

exports.prettier = prettier;
exports.jest = jest;
exports.webpack = webpack;
exports.asciidoctor = asciidoctor;
exports.marp = marp;

exports.webpackBuildTasks = () => {
    return series(webpack.clean, webpack.build);
}

exports.asciidoctorBuildTasks = () => {
    return series(asciidoctor.clean, asciidoctor.build);
}

exports.marpBuildTasks = () => {
    return series(marp.clean, marp.build);
}
