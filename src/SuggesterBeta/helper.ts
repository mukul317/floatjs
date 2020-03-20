import suggesterConfig from "./config";
import { CacheFactory } from "../Storage/CacheFactory";
import { TResponse } from "./interface";

interface TPayload {
  query: string;
  category: any;
  vertical?: string;
  source?: string;
  appId?: string;
  edge?: number;
}

class Helper {
    private static sugCache = CacheFactory.getCache("sgtr");
  /**
   * This method is responsible for sending an ajax request to fetch suggestions for the typed query
   * @param url : url for ajax hit
   * @param payload : Contains an Object for paramets to be passed in the url
   */
  static sendXhr = async (url: string, payload: TPayload | null): Promise<TResponse> => {
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
              console.error(data);
              return xhr;
          }
      });
  };

  /**
   * To check the version of suggester apis to be used.
   * Must be called only once on page load even if page has multiple suggesters.
   * Sets the version number received in the storage.
   * This version no must be passed in later api calls to fetch suggestions.
   */
  public static fetchVersion = () => {
      const url = suggesterConfig.urls.checkVersion + Math.random();
      return Helper.sendXhr(url, null).then(function () {
          //   Helper.setInStorage(suggesterConfig.storageKey.versionKey, response);
      // set response in LS
      });
  };

  /**
   * If 'isPrefetch' value is received as true in suggester then following method must be called.
   * It prefetches some suggestions and then stores them in storage.
   * Condition : Prefetching happens only if storage has no pre fetched data
   */
  public static prefetchData = (): void => {
      const url = suggesterConfig.urls.prefetch + Math.random();
      Helper.fetchVersion().then((response) => {
          //   Helper.setInStorage(suggesterConfig.storageKey.versionKey, response);
          console.log(response);
          if (Helper.getFromStorage(suggesterConfig.storageKey.prefetchKey) === null) { // todo:logic for when to fetch next
              Helper.sendXhr(url, null).then(function (resp) {
                  Helper.setInStorage(suggesterConfig.storageKey.prefetchKey, resp);
              });
          }
      });
  };

  /**
   * This method detects if text enetred is english or arabic
   * @param query : Text entered in suggester
   * @returns
   * a)'EN' for English
   * b)'AR' for Arabic
   *
   */
  public static detectLang (query: string): string {
      if (!query) return "EN";
      const englishRegEx = /[A-Za-z0-9]/;
      const specialCharRegEx = /[\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\-\\{\\}\\[\\\]\\;\\'\\,\\.\\/\\:\\"\\<\\>\\?\\|\\_]/;

      return englishRegEx.test(query) ? "EN" : specialCharRegEx.test(query) ? "SC" : "AR";
  }

  /**
   * This method identifies if the text provided is a special character or not.
   * @param query
   */
  public static isSpecialCharacter (query: string): boolean {
      if (query) {
          // const specialCharRegEx = /[\!\@\#\$\%\^\&\*\(\)\-\+\=\-\{\}\[\]\;\'\,\.\/\:\"\<\>\?\|\\\_]/;
          const specialCharRegEx = /[\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\-\\+\\=\\-\\{\\}\\[\\\]\\;\\'\\,\\.\\/\\:\\"\\<\\>\\?\\|\\_]/;
          return specialCharRegEx.test(query);
      }
      return false;
  }

  public static setInStorage (key: string, value: Record<string, any>): void {
      this.sugCache && this.sugCache.setItem(key, value);
  }

  public static getFromStorage (key: string) {
      return this.sugCache && this.sugCache.getItem(key);
  }
}

export { Helper };
