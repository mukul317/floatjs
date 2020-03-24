/**
 * do not remove any variables from this file
 */

const domain = "http://suggest.naukrigulf.com/";

const defaultConfig = {
    urls: {
        autoComplete: domain + "/suggest/autosuggest?",
        caching: domain + "/suggest/prefetch?",
        checkVersion: domain + "/suggest/v?",
        relatedConcept: domain + "/suggest/autoconcepts?",
        prefetch: domain + "/suggest/prefetch?",
        trackingURL: domain + "//suggestlg.naukrigulf.com/logger/log?"
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

export default defaultConfig;
