/**
 * do not remove any variables from this file
 */

const domain = "http://suggest.naukrigulf.com/";

const suggesterConfig = {
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
    invoker: "ng",
    storageKey: { // It is used to store prefetched data against pretetchKey and version value against versionKey in localStorage.
        prefetchKey: "__suggest_prefetch",
        versionKey: "__suggest_versions"
    }
};

export default suggesterConfig;
