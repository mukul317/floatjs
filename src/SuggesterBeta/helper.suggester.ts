import suggesterConfig from "./config.suggester";
import { TPayload, TResponse, TSugOptions } from "./interface";

class Helper {
    private static sugCache = CacheFactory.getCache("sgtr");
    /**
     * This method is responsible for sending an ajax request to fetch suggestions for the typed query
     * @param url : url for ajax hit
     * @param payload : Contains an Object for paramets to be passed in the url
     */
    static sendXhr = async (url: string, payload: TPayload | null): Promise<any> => {
        return new Promise((resolve, reject) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            try {
                if (!url) {
                    throw Error("Received empty payload/url to send request");
                }
                if (payload && !payload.query) {
                    throw Error("Received empty query");
                }

                const { appId } = suggesterConfig;
                const finalPayload: any = {
                    ...payload,
                    appId,
                    limit: suggesterConfig.maxSuggestions
                };

                const params = Object.keys(finalPayload).map((key) => key + "=" + finalPayload[key]).join("&");
                //   fetch(url + params).then(function (response) {
                //       if (response.status !== 200) {
                //           throw new Error("Looks like there was a problem. Status Code: " + response.status);
                //       }
                //   });
                xhr.open("GET", url + params, true);

    static prefetchData = (options: TSugOptions) => {
            const url = suggesterConfig.urls.prefetch + Math.random();
            Helper.sendXhr(url, null).then(function () {
                // set response in LS
            });
        }

  /**
   * This method detects if text enetred is english or arabic
   * @param query : Text entered in suggester
   * @returns
   * a)'EN' for English
   * b)'AR' for Arabic
   *
   */
  public static detectLang(query: string): string {
            if(!query) return "EN";
            const englishRegEx = /[A-Za-z0-9]/;
            const specialCharRegEx = /[\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\-\\{\\}\\[\\\]\\;\\'\\,\\.\\/\\:\\"\\<\\>\\?\\|\\_]/;

            return englishRegEx.test(query) ? "EN" : specialCharRegEx.test(query) ? "SC" : "AR";
        }

  /**
   * This method identifies if the text provided is a special character or not.
   * @param query
   */
  public static isSpecialCharacter(query: string): boolean {
            if(query) {
                // const specialCharRegEx = /[\!\@\#\$\%\^\&\*\(\)\-\+\=\-\{\}\[\]\;\'\,\.\/\:\"\<\>\?\|\\\_]/;
                const specialCharRegEx = /[\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\-\\{\\}\\[\\\]\\;\\'\\,\\.\\/\\:\\"\\<\\>\\?\\|\\_]/;
                return specialCharRegEx.test(query);
            }
      return false;
        }

  public static setInStorage(key: string, value: Record<string, any>): void {
            this.sugCache && this.sugCache.setItem(key, value);
        }

  public static getFromStorage(key: string) {
            return this.sugCache && this.sugCache.getItem(key);
        }
}

export { Helper };
