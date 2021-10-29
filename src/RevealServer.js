"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevealServer = void 0;
const Koa = require("koa");
const render = require("koa-ejs");
const koalogger = require("koa-logger");
const serve = require("koa-static-server");
const path = require("path");
const Markdown_it_1 = require("./Markdown-it");
const ExportHTML_1 = require("./ExportHTML");
class RevealServer {
    constructor(logger, getRootDir, getSlides, getConfiguration, extensionPath, isInExport, getExportPath) {
        this.logger = logger;
        this.getRootDir = getRootDir;
        this.getSlides = getSlides;
        this.getConfiguration = getConfiguration;
        this.extensionPath = extensionPath;
        this.isInExport = isInExport;
        this.getExportPath = getExportPath;
        this.app = new Koa();
        this.server = null;
        this.host = 'localhost';
        this.exportMiddleware = (exportfn, isInExport) => {
            return async (ctx, next) => {
                await next();
                if (isInExport()) {
                    const exportPath = this.getExportPath();
                    const opts = typeof ctx.body === 'string'
                        ? { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: null, data: ctx.body }
                        : { folderPath: exportPath, url: ctx.originalUrl.split('?')[0], srcFilePath: ctx.body.path, data: null };
                    await exportfn(opts);
                }
            };
        };
    }
    get isListening() {
        return this.server ? this.server.listening : false;
    }
    stop() {
        if (this.isListening && this.server) {
            this.server.close();
        }
    }
    get uri() {
        if (!this.isListening || this.server === null) {
            return null;
        }
        const addr = this.server.address();
        return typeof addr === 'string' ? addr : `http://${this.host}:${addr.port}/`;
    }
    start() {
        try {
            if (!this.isListening && this.getRootDir()) {
                this.configure();
                this.server = this.app.listen(0);
            }
        }
        catch (err) {
            throw new Error(`Cannot start server: ${err}`);
        }
    }
    configure() {
        const app = this.app;
        // LOG REQUEST
        app.use(koalogger((str, args) => {
            this.logger.log(str);
        }));
        // EXPORT
        app.use(this.exportMiddleware(ExportHTML_1.exportHTML, () => this.isInExport()));
        // EJS VIEW engine
        render(app, {
            root: path.resolve(this.extensionPath, 'views'),
            layout: 'template.4.1.3',
            viewExt: 'ejs',
            cache: false,
            debug: true,
        });
        // MAIN FILE
        app.use(async (ctx, next) => {
            if (ctx.path !== '/') {
                return next();
            }
            const markdown = Markdown_it_1.default(this.getConfiguration());
            const htmlSlides = this.getSlides().map((s) => ({
                ...s,
                html: markdown.render(s.text),
                children: s.verticalChildren.map((c) => ({ ...c, html: markdown.render(c.text) })),
            }));
            ctx.state = { slides: htmlSlides, ...this.getConfiguration() };
            await ctx.render('reveal');
        });
        // STATIC LIBS
        const libsPAth = path.join(this.extensionPath, 'libs');
        app.use(serve({ rootDir: libsPAth, rootPath: '/libs' }));
        // STATIC RELATIVE TO MD FILE
        const rootDir = this.getRootDir();
        if (rootDir) {
            app.use(serve({ rootDir, rootPath: '/' }));
        }
        // ERROR HANDLER
        app.on('error', (err) => {
            this.logger.error(err);
        });
        this.server = app.listen();
    }
}
exports.RevealServer = RevealServer;
//# sourceMappingURL=RevealServer.js.map