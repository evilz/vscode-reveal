"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Verbose"] = 1] = "Verbose";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor(logLevel, appendLine) {
        this.logLevel = logLevel;
        this.appendLine = appendLine;
    }
    error(message) {
        this.appendLine(`[error - ${new Date().toLocaleTimeString()}] ${message}`);
    }
    log(message) {
        if (this.logLevel === LogLevel.Verbose) {
            this.appendLine(`[info - ${new Date().toLocaleTimeString()}] ${message}`);
        }
    }
    get LogLevel() {
        return this.logLevel;
    }
    set LogLevel(level) {
        this.logLevel = level;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map