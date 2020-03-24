import suggesterConfig from "./config.suggester";
import { TPayload, TResponse, TSugOptions } from "./interface";

class Helper {
    /**
     * This method is responsible for sending an ajax request to fetch the suggestions for the typed query
     * @param url : url for ajax hit
     * @param payload : Contains an Object for paramets to be passed in the url
     */
    static sendXhr = (url: string, payload: TPayload | null): Promise<TResponse> => {
        return new Promise((resolve: Function, reject: Function) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            try {
                if (!payload || !url) {
                    throw Error("Received empty payload/url to send request");
                }
                if (!payload.query) {
                    throw Error("Received empty query");
                }

                const { appId } = suggesterConfig;
                const finalPayload: any = {
                    ...payload,
                    appId,
                    limit: suggesterConfig.maxSuggestions
                };
                const params = Object.keys(finalPayload)
                    .map((key) => key + "=" + finalPayload[key])
                    .join("&");
                xhr.open("GET", url + params, true);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        xhr.response && resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
                return xhr;
            } catch (data) {
                // console.error(data);
                return xhr;
            }
        });
    }

    static prefetchData = (options: TSugOptions) => {
        const url = suggesterConfig.urls.prefetch + Math.random();
        Helper.sendXhr(url, null).then(function () {
            // set response in LS
        });
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
    //   private detectLang (query: string): boolean | string {
    //       if (!query) return "EN";
    //       const englishRegEx = /[A-Za-z0-9]/;
    //       const specialCharRegEx = /[\!\@\#\$\%\^\&\*\(\)\-\+\=\-\{\}\[\]\;\'\,\.\/\:\"\<\>\?\|\\\_]/;

    //       return englishRegEx.test(query)
    //           ? "EN"
    //           : specialCharRegEx.test(query)
    //               ? "SC"
    //               : "AR";
    //   }
    // }
}

export { Helper };
