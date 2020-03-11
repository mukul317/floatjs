"use strict";
/**
 * do not remove any variables from this file
 */
Object.defineProperty(exports, "__esModule", { value: true });
var domain = "http://suggest.naukrigulf.com/";
var suggesterConfig = {
    urls: {
        autoComplete: domain + "/suggest/autosuggest?invoker=ng&",
        caching: domain + "/suggest/prefetch?invoker=ng&",
        checkVersion: domain + "/suggest/v?",
        relatedConcept: domain + "/suggest/autoconcepts?invoker=ng&",
        prefetch: domain + "/suggest/prefetch?invoker=ng&",
        trackingURL: domain + "//suggestlg.naukrigulf.com/logger/log?invoker=ng&"
    },
    appId: 2050,
    version: "1.2.0",
    source: "server",
    maxSuggestions: 15,
    whiteListSpecialChar: [],
    edge: 0,
    invoker: "ng"
};
exports.default = suggesterConfig;
//# sourceMappingURL=config.suggester.js.map