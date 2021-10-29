"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopRevealJSServer = exports.STOP_REVEALJS_SERVER = void 0;
exports.STOP_REVEALJS_SERVER = 'vscode-revealjs.stopRevealJSServer';
exports.stopRevealJSServer = (stopServer) => () => {
    stopServer();
};
//# sourceMappingURL=stopRevealJSServer.js.map