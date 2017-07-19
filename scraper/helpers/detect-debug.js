Object.defineProperty(global, 'isDebugging', {
    value: (typeof global.v8debug !== 'undefined' && global.v8debug !== null) || global.process.execArgv.indexOf('--debug') > -1 || global.process.execArgv.indexOf('--debug-brk') > -1,
    writable: false,
    enumerable: true,
    configurable: true
});
