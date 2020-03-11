"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_suggester_1 = __importDefault(require("./config.suggester"));
var Helper = /** @class */ (function () {
    function Helper() {
    }
    /**
     * This method detects if text enetred is english,arabic or a special character
     * @param query : Text entered in suggester
     * @returns
     * a)'EN' for English
     * b)'AR' for Arabic
     * c)'SC' for Special Character
     *
     */
    Helper.prototype.detectLang = function (query) {
        if (!query)
            return "EN";
        var englishRegEx = /[A-Za-z0-9]/;
        var specialCharRegEx = /[\!\@\#\$\%\^\&\*\(\)\-\+\=\-\{\}\[\]\;\'\,\.\/\:\"\<\>\?\|\\\_]/;
        return englishRegEx.test(query)
            ? "EN"
            : specialCharRegEx.test(query)
                ? "SC"
                : "AR";
    };
    /**
     * This method is responsible for sending an ajax request to fetch the suggestions for the typed query
     * @param url : url for ajax hit
     * @param payload : Contains an Object for paramets to be passed in the url
     */
    Helper.sendXhr = function (url, payload) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            try {
                if (!payload || !url) {
                    throw Error("Received empty payload/url to send request");
                }
                if (!payload.query) {
                    throw Error("Received empty query");
                }
                var appId = config_suggester_1.default.appId;
                var finalPayload_1 = __assign(__assign({}, payload), { appId: appId, limit: config_suggester_1.default.maxSuggestions });
                var params = Object.keys(finalPayload_1)
                    .map(function (key) { return key + "=" + finalPayload_1[key]; })
                    .join("&");
                xhr.open("GET", url + params, true);
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        xhr.response && resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = function () { return reject(xhr.statusText); };
                xhr.send();
                return xhr;
            }
            catch (data) {
                console.error(data);
                return xhr;
            }
        });
    };
    Helper.prefetchData = function () {
        var url = config_suggester_1.default.urls.prefetch + Math.random();
        console.log(url);
        Helper.sendXhr(url, null).then(function () {
            // set response in LS
        });
    };
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=helper.suggester.js.map