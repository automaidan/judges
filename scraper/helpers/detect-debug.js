Object.defineProperty(global, "isDebugging", {
    value: (typeof v8debug !== "undefined" && v8debug !== null) || process.execArgv.indexOf("--debug") > -1 || process.execArgv.indexOf("--debug-brk") > -1,
    writable: false,
    enumerable: true,
    configurable: true
});
