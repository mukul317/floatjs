import { TSugConfig, TData, TState, TSubject, TObserver, TRecentSearchResponse, TSuggesterResponse, TResponse } from "./interface";
import { Model } from "./suggester.model";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TSugConfig = {
    urls: {
        autoComplete: "/suggest/autosuggest?invoker=ng&",
        caching: "/suggest/prefetch?invoker=ng&",
        checkVersion: "/suggest/v?",
        relatedConcept: "/suggest/autoconcepts?invoker=ng&",
        prefetch: "/suggest/prefetch?invoker=ng&",
        trackingURL: "/suggestlg.naukrigulf.com/logger/log?invoker=ng&"
    },
    category: "top",
    appId: 2050,
    version: "1.2.0",
    source: "server",
    maxSuggestions: 15,
    edge: 0,
    invoker: "ng",
    storageKey: { // It is used to store prefetched data against pretetchKey and version value against versionKey in localStorage.
        prefetchKey: "__suggest_prefetch",
        versionKey: "__suggest_versions"
    },
    domId: "",
    inputElement: null,
    listingElement: null,
    displayElement: null,
    listLimit: 10,
    selectLimit: 1,
    displayListOnFocus: true,
    displayDecorationList: ["chips"],
    noResultErrorMessage: "No result for your query",
    tagSelectedValues: false,
    specialCharactersAllowedList: [],
    sanitiseString: false,
    checkboxes: true,
    suggesterHeadingElementText: "Suggestions",
    relatedConceptsHeadingElementText: "Related Concepts",
    debounceTimeout: 500
};

class SelectBoxInput implements TSubject {
    public state: TState = {
        list: [],
        selection: [],
        hasListUpdated: false,
        hasSelectionUpdated: false,
        query: ""
    };

    /**
  * Debounce timer variable used for debouncing the user input
  */
    public debounceTimer: NodeJS.Timeout | null = null;

    public noResultErrorMessage: boolean = true;
    public noResultElement: HTMLElement = document.createElement("p");
    public headingElement: HTMLElement = document.createElement("p");
    public arrowCodisplayunter: number = -1;
    public config: TSugConfig = defaultConfig;

    public dataSet: TData[] = [];
    public listObserverCollection: TObserver[] = [];
    public arrowCounter: number = -1;
    public modelInstance: Model | null = null;

    constructor(options: TSugConfig) {
        try {
            this.config = { ...this.config, ...options };

            this.registerListEvents();
            this.registerInputEvents();
            this.createNoResultFragment();
            this.initialiseHeadingElement();
            this.modelInstance = new Model(this.config);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public initialiseHeadingElement(): void {
        try {
            this.headingElement.classList.add("no-result");
        } catch (e) {
            console.warn("Errors occurred while initialising heading element");
        }
    }

    /**
     * Sets the heading element based on the current listing that is being shown.
     * @param listingType : type of listing that is being shown if its suggester or related searches
     */
    public setHeadingElement(listingType: string): void {
        try {
            console.log("inside set Heading element");
            const { config } = this;
            if (listingType && this.headingElement) {
                switch (listingType) {
                case "rc":
                    this.headingElement.style.display = "block";
                    this.headingElement.innerHTML = config.relatedConceptsHeadingElementText ? config.relatedConceptsHeadingElementText : "Related Concepts";
                    break;
                case "sug":
                    console.log("in this case");
                    this.headingElement.style.display = "block";
                    this.headingElement.innerHTML = config.suggesterHeadingElementText ? config.suggesterHeadingElementText : "Suggestions";
                    break;
                }
                console.log("heading element", this.headingElement);
            } else {
                throw new Error("Listing type is not available");
            }
        } catch (e) {
            console.warn("Error occurred while setting heading element");
        }
    }

    public registerInputEvents(): void {
        try {
            const { config } = this;
            if (config.inputElement) {
                config.inputElement.addEventListener("keydown", (e) => this.onBackspace(e));
                config.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
                if (config.displayListOnFocus === true) {
                    document.addEventListener("click", (e) => this.handleDocumentBlur(e));
                    config.inputElement.addEventListener("focus", (e) => this.emulateEventOnListObserver(e.type));
                    // Close listing on initialization
                    this.emulateEventOnListObserver("focusout");
                }
            } else {
                throw new Error("Suggester input element undefined");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerListEvents(): void {
        try {
            const { config } = this;
            if (config.listingElement) {
                config.listingElement.addEventListener("click", (e: MouseEvent) => {
                    const target: HTMLElement | null = (e.target as HTMLElement);
                    if (target) {
                        this.onSelect(target);
                    }
                });
            } else {
                throw new Error("Droope list element undefined");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleDocumentBlur(e: MouseEvent): void {
        try {
            const target: HTMLElement = (e.target as HTMLElement);
            if (target) {
                const { config } = this;
                const hasClickedOnInput: boolean = config.inputElement === target;
                const hasClickedOnListItem: boolean = target.classList ? target.classList.contains("list-item") : false;
                if (hasClickedOnListItem === false && hasClickedOnInput === false) {
                    this.emulateEventOnListObserver("focusout");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public emulateEventOnListObserver(eventType: string): void {
        try {
            const { config } = this;
            if (config.listingElement) {
                config.listingElement.style.display = eventType === "focus" ? "block" : "none";
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    // public onSelect(target: HTMLElement): void {
    //     try {
    //         const { config } = this;
    //         const dataObjFromDom: string | null = target.getAttribute("data-obj");
    //         const parentOfTarget: HTMLElement | null = target.parentElement;
    //         const selectedObjStr: string | null = dataObjFromDom || (parentOfTarget ? parentOfTarget.getAttribute("data-obj") : null);
    //         const selectedObj: TData = selectedObjStr ? JSON.parse(selectedObjStr) : null;

    //         if (selectedObj && config.selectLimit) {
    //             const selectionLimitExceeded: boolean = config.selectLimit > 1 ? this.state.selection.length + 1 > config.selectLimit : false;
    //             const isDuplicate: boolean = this.state.selection.filter((item) => item.id === selectedObj.id).length > 0;

    //             if (isDuplicate === true) {
    //                 if (config.checkboxes === true) {
    //                     this.removeSelection(selectedObj.id);
    //                 }
    //             } else {
    //                 this.onLastSelection();
    //                 if (selectionLimitExceeded === true) {
    //                     throw new Error(`Maximum select limit reached. Configured limit droope id "${config.domId}" is ${config.selectLimit}`);
    //                 } else {
    //                     this.addSelection(selectedObj);
    //                 }
    //             }
    //         } else {
    //             throw new Error("On select callback trigged. No selection json found. No mutation in state possible");
    //         }
    //     } catch (err) {
    //         console.warn(err.message);
    //     }
    // }

    /**
     * Handle Select set the selected object by picking the item from the data-obj attribute of the selected
     * listing element.
     * @param target
     * @returns { void }
     */
    public onSelect(target: HTMLElement): void {
        try {
            const selectedObjStr: string = target.getAttribute("data-obj") || "";
            const selectedObj: TData = JSON.parse(selectedObjStr);
            this.setSelectedValues(selectedObj);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Deletes the query on backspace and updates the query in the input feilds and also deletes the selected values
     * and updates the lsiting element based on that.
     * @access public
     * @param e : keyboardEvent
     * @returns void
     */
    public onBackspace(e: KeyboardEvent): void {
        try {
            const which = e.which;
            const query = (e.target as HTMLInputElement).value.trim();
            const isQueryEmpty: boolean = query === "";

            if (which === 8) {
                const lastIndexOfSelection: number = this.state.selection.length - 1;
                const lastId: number | null = lastIndexOfSelection >= 0 ? this.state.selection[lastIndexOfSelection].id : null;
                if (isQueryEmpty === true && lastId !== null) {
                    this.removeSelection(lastId);
                    this.emulateEventOnListObserver("focus");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Handles the keyUp event attached to the suggester input field.It does different functionalities
     * when the event is being  done. Covers a lot of cases for different keys presses that are as follows:
     * case 9: Tabs Pressed
     * Handles the Listing Display State and sets to blur
     * case 13: Enter pressed
     * finds the current active listing element and then Selects that listing element into the display and
     * pass the state on
     * case 38: Up Arrow
     * handles the UpArrow case by making the listing element above current active listing element as active
     * case 40: Down Arrow
     * handles the Down Arrow cases by the listing element below the current active listing element as active
     * @param e : KeyBoardEvent
     * @returns {void}
     */
    public onKeyUp(e: KeyboardEvent): void {
        try {
            if (e) {
                const query: string =
                    e && e.target && (e.target as HTMLInputElement).value
                        ? this.sanitiseQuery((e.target as HTMLInputElement).value.trim())
                        : "";
                this.state.query = query;
                const which: number = e.which;
                const { config } = this;
                const category = config.category ? config.category : "top";
                const debounceTimeout = config.debounceTimeout ? config.debounceTimeout : 500;
                switch (which) {
                case 9: // Tab pressed
                    this.emulateEventOnListObserver("focusout");
                    return;

                case 13: {
                    const { config } = this;
                    const listItem: HTMLElement | null = config.listingElement && config.listingElement.querySelector(".active");
                    if (listItem) {
                        this.onSelect(listItem);
                    }
                    return;
                }

                case 38: // Up arrow
                    this.onArrowPress("up");
                    return;

                case 40: // Down arrow
                    this.onArrowPress("down");
                    return;
                case 188:
                    this.initialiseRelatedSearch(query);
                    return;

                default:
                    this.debounceRequest(debounceTimeout).then(() => { this.sendSuggesterRequest(query, category); });
                }
            } else {
                throw new Error("Event not happened Event Object Missing");
            }
        } catch (e) {
            console.error("Error found: " + e);
        }
    }

    /**
     * Sanitises the String By removing Special Characters by matching with regex that is passed for
     * whitelisting the special characters as well. This custom characters whitelisting is being provided
     * by passing a specialcharacterallowedlist into the config.
     * @param query : {String}
     * @access public
     * @returns string
     */
    public sanitiseQuery(query: string): string {
        try {
            const { config } = this;
            if (query) {
                if (query.length === 1 && query === ",") {
                    return "";
                }
                const patr = new RegExp("[^a-zA-Z0-9,\\s" + config.specialCharactersAllowedList + "]", "g");
                return query.replace(patr, "");
            } else {
                throw new Error("Query not found that is to be sanitised");
            }
        } catch (e) {
            console.log("Exception Occurred while Sanitising Query");
        }
        return "";
    }

    /*
     * Debouncing Request for avoiding multiple requests being hit repetitively as user types quickly.
     * When user types quickly then at the same instant multiple requests are being fired. To avoid those
     * multiple requests we have added debouncing so that once user is done typing the query then only hit
     * for the suggestions will go for the suggestions. This avoid multiple hits on the server on the same
     * time. Here we define timeout of debouncing i.e. if in this time user types again then the previous
     * request will not be fired and it will be fired only when user does not type during that interval.
     * @param requestFunction : Function on which debouncing is to be done
     * @param debounceInterval : Interval of debouncing after which request should be done
     * @access public
     * @returns Promise<void>
     */

    public debounceRequest(debounceInterval: number): Promise<void> {
        try {
            if (this.debounceTimer) { clearTimeout(this.debounceTimer); }
            return new Promise((resolve: Function): void => {
                this.debounceTimer = setTimeout(
                    (): void => resolve(),
                    debounceInterval
                );
            });
        } catch (e) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject();
        }
    }

    /**
 * Handles the comma being entered by the user in the query . This also sanitises the Query String.
 * @param query : {String}: Query being entered by the User in the Suggester Input feild
 * @param selectedObj : {TData}:Selected Object being Selected by clicking on the Listing element
 */

    public initialiseRelatedSearch(query: string): void {
        try {
            const selectedObj: TData = { id: 0, name: "", displayTextEn: "" };
            if (query.length > 1) {
                selectedObj.id = 0;
                selectedObj.name = query.split(",")[0];
                selectedObj.displayTextEn = selectedObj.name;

                this.setSelectedValues(selectedObj);
            } else {
                throw new Error("Query not passed in the function");
            }
        } catch (e) {
            console.log("Exception Occurred :" + e);
        }
    }

    /**
     * This sets the selected object values into the result set
     * @access public
     * @param selectedObj
     * @returns void
     */
    public setSelectedValues(selectedObj: TData): void {
        try {
            const { config } = this;
            if (selectedObj && config.selectLimit) {
                // rishabh changes here
                this.sendRelatedSearchRequest(selectedObj);
                // rishabh changes here
                const { config } = this;
                const selectionLimitExceeded: boolean = config.selectLimit && config.selectLimit > 1 ? this.state.selection.length + 1 > config.selectLimit : false;
                const isDuplicate: boolean = this.state.selection.filter((item) => item.id === selectedObj.id).length > 0;

                if (isDuplicate === true) {
                    if (config.checkboxes === true) {
                        this.removeSelection(selectedObj.id);
                    }
                } else {
                    this.onLastSelection();
                    if (selectionLimitExceeded === true) {
                        throw new Error(`Maximum select limit reached. Configured limit droope id "${config.domId}" is ${config.selectLimit}`);
                    } else {
                        this.addSelection(selectedObj);
                    }
                }
                this.setQueryInInputFeild();
            } else {
                throw new Error();
            }
        } catch (e) {
            throw new Error("Error in selecting target in here" + e);
        }
    }

    /**
     * This empties the input feilds values
     * @returns{void}
     */
    public setQueryInInputFeild(): void {
        try {
            if (this.config.inputElement) {
                this.config.inputElement.value = this.state.query ? this.state.query : "";
            } else {
                throw new Error("Input Element not being set");
            }
        } catch (e) {
            console.error("Emptying input feilds");
        }
    }

    public sendSuggesterRequest(query: string, category: string): void {
        try {
            if (query && this.modelInstance) {
                if (this.config.urls && this.config.urls.autoComplete) {
                    const xhrPromise: Promise<TResponse> = this.modelInstance.sendXhr(this.config.urls.autoComplete, {
                        query,
                        category
                    });
                    this.handleApiResponse(
                        xhrPromise,
                        "sug"
                    );
                } else {
                    throw new Error("Config urls not set for suggester autocomplete request ");
                }
            } else {
                throw new Error("Query is not passed into the function");
            }
        } catch (e) {
            console.warn("Suggester Request function resulted in an issue", e);
        }
    }

    /**
        * Initiates related search functionality that takes selectedObject selected by clicking on the listing
        * element . The resposibility of this function is to fetch the selectedObject query and then send the
        * ajax request to get more related  searches .
        * @param selectedObject: TData : Selected Object from the Listing element being clicked
        * @returns {return}
        * @throws {null}
        *
        */
    public sendRelatedSearchRequest(selectedObject: TData): void {
        try {
            if (selectedObject && selectedObject.displayTextEn && this.modelInstance) {
                if (this.config.urls && this.config.urls.relatedConcept) {
                    const query = selectedObject.displayTextEn.toLowerCase();
                    const category = "top";
                    const xhrPromise: Promise<TResponse> = this.modelInstance.sendXhr(this.config.urls.relatedConcept, {
                        query,
                        category
                    });
                    this.handleApiResponse(
                        xhrPromise,
                        "rc"
                    );
                } else {
                    throw new Error("Config urls are not present for the related concepts");
                }
            } else {
                throw new Error("Error in the selectedObject");
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Handles the related Search results returned from the api .This function initiates the filtering and fill data
     * into listing by calling the function filterAndFillDataIntoListing
     * @param resp: TRecentSearchResponse : Related Search results returned from the related search api
     * @param category: String : category of results for which suggester is visible
     * @returns {void}
     */
    // public handleRelatedSearchResponseData(resp: TRecentSearchResponse, category: string): void {
    //     try {
    //         if (resp && category) {
    //             this.dataSet = resp.resultConcepts[category];
    //             const emptyQuery = ""; // to disable filtering in case of rc selected
    //             this.filterAndFillDataIntoListing(emptyQuery, category, "rc");
    //         } else {
    //             throw new Error("resp and category not found - param not found");
    //         }
    //     } catch (e) {
    //         console.error("Error occurred while handling RCData:" + e);
    //     }
    // }

    /**
     * Fills the lisitng element by filtering the result set based on the query of the input feild. The result
     * list is filtered first on the basis of the query and then the data is being set into the listing element.
     * @param query: {string} : Query of the input feild being entered in the suggester input
     * @returns {void}
     */
    public filterAndFillDataIntoListing(listingType: string): void {
        try {
            const { config } = this;
            const query: string = this.state.query;
            const category = config.category;
            if (query || category) {
                const filteredList = this.dataSet.filter((item: TData): boolean | void => {
                    if (item && item.displayTextEn) {
                        item.name = item.displayTextEn;
                        const lowerItem = item.displayTextEn.toLowerCase();
                        const lowerQuery = query.toLowerCase();
                        const includesSupported = (Array.prototype as any).includes !== undefined;
                        return includesSupported
                            ? lowerItem.includes(lowerQuery)
                            : lowerItem.indexOf(lowerQuery) !== -1;
                    }
                });

                const hasResults = filteredList.length !== 0;
                const result: TState = {
                    hasListUpdated: true,
                    list: hasResults ? filteredList : this.dataSet,
                    selection: [...this.state.selection],
                    hasSelectionUpdated: true,
                    query: ""
                };
                console.log("result TState", result);
                this.setHeadingElement(listingType);
                this.setData(result);

                this.arrowCounter = -1;
                this.showNoResultMessage(hasResults);
            } else {
                throw new Error("param not found: query");
            }
        } catch (e) {
            console.log("Error occurred while entering data into Listing:", e.message);
        }
    }

    /**
     * Handles the Suggester Search results returned from the api.This function initiates the filtering and fill data
     * into listing by calling the function filterAndFillDataIntoListing
     * @param resp: {TSuggesterResponse} : Response of Suggester Search api
     * @param category: {String} : category of results for which the suggester is visible
     * @param query: {String} : Query that is put inside the input feild
     * @returns{void}
     */
    // public handleSuggesterResponseData(resp: TSuggesterResponse, category: string, query: string): void {
    //     try {
    //         if (resp && category && query) {
    //             this.dataSet = resp.resultList[category];
    //             this.filterAndFillDataIntoListing(query, category, "sug");
    //         } else {
    //             throw new Error("param not found: resp , category, query");
    //         }
    //     } catch (e) {
    //         console.error("Error while handling Suggester respone data:" + e);
    //     }
    // }

    /**
     * Handles API response returned from Suggester API and inititate the intended functionality for the suggester
     * as well as related searches taken both together based on the listing type.
     * @param promise :{TResponse} : promise returned from the suggester api hit function
     * @param category :{String} : category of results for which the suggester is visible
     * @param query : {String} : Query of the input feild
     * @param listingType :{String} : Listing  type that can be recent search and suggester suggestions
     * @returns {void}
     */
    public handleApiResponse(
        promise: Promise<TResponse>,
        listingType: string
    ): void {
        try {
            if (promise) {
                promise.then((resp: TRecentSearchResponse | TSuggesterResponse) => {
                    if (resp) {
                        const { config } = this;
                        const category = config.category;
                        if (listingType && category) {
                            switch (listingType) {
                            case "rc":
                                this.dataSet = resp.resultConcepts[category];
                                this.state.query = "";
                                break;
                            case "sug":
                                this.dataSet = resp.resultList[category];
                                break;
                            }
                            this.filterAndFillDataIntoListing(listingType);
                        } else {
                            throw new Error("listingType not passed as a param");
                        }
                    } else {
                        throw new Error("Promise resulted in Error - sendXHR-helper.ts");
                    }
                });
            } else {
                throw new Error("Promise expected as parameter - Not Found");
            }
        } catch (e) {
            console.error("Error occured in handle Response" + e);
        }
    }

    /**
     * Hides the no result message present on the listing element
     * when no results are there in the listing element
     * @param {hasResults} : {boolean} : Boolean flag that checks whether results are there or not
     * @returns: {void}
     */
    public hidesNoResultMessage(hasResults: boolean): void {
        this.noResultElement.style.display = hasResults ? "block" : "none";
    }

    /**
     * Shows the no result message present on the listing element
     * when there are results in the listing element
     * @param {hasResults} : {boolean}
     * @returns: {void}
     */
    public showNoResultMessage(hasResults: boolean): void {
        this.hideHeading(hasResults);
        this.noResultElement.style.display = hasResults ? "none" : "block";
    }

    public hideHeading(hasResults: boolean): void{
        this.headingElement.style.display = hasResults ? "block" : "none";
    }

    public onArrowPress(direction: string): void {
        try {
            /** get list of all li items */
            const { config } = this;
            const listItems = config.listingElement ? config.listingElement.querySelectorAll("li") : null;

            /** determine the direction */
            const isGoingUp = direction === "up";
            const isGoingDown = direction === "down";

            if (isGoingDown === true && listItems) {
                /** counter is by default at -1 for first selection i.e. index 0 */
                const currentElement: HTMLElement = listItems[this.arrowCounter + 1];

                if (currentElement) {
                    // add active class to
                    currentElement.classList.add("active");
                    const prevElement = currentElement.previousElementSibling;
                    if (prevElement) {
                        prevElement.classList.remove("active");
                    }
                }
                if (this.arrowCounter < listItems.length - 1) {
                    this.arrowCounter++;
                }
            }

            if (isGoingUp === true && listItems) {
                const currentElement = listItems[this.arrowCounter];
                if (currentElement) {
                    currentElement.classList.remove("active");
                    const prevElement = currentElement.previousElementSibling;
                    if (prevElement) {
                        prevElement.classList.add("active");
                    }
                }
                if (this.arrowCounter > -1) {
                    this.arrowCounter--;
                }
            }
            console.log(this.arrowCounter);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Controls the state of subject. This is pivot function for notifying observers.
     * Fn `notifyObservers` can be invoked directly. However, `setData` acts as a controller
     * to manipulate state before notifying observers.
     *
     * It is also responsible for constructing the droope after every observer is registered.
     * It consumes addtional parameter in `TSetState` i.e. `construct: {boolean}`
     * that notifies the oberveres for the first time. 'construct` param is primarily required
     * to populate `List Observer`.
     *
     * Can act as developer API to update state. However that is not recommended.
     * Methods like `addSelection`, `removeSelection`, `replaceListing` and `updateLisiting`
     * are recommended
     *
     * @access{public}
     * @returns {void}
     * @param newData {TSetState}
     */
    public setData(newData: TSetState): void {
        try {
            // This logic executes when SelectBox is provided with the data first time
            const isDataForFirstTime = newData.construct;
            if (isDataForFirstTime) {
                this.dataSet = newData.list;
                newData.hasListUpdated = true;
            }

            this.state = {
                list: newData.list || [],
                selection: newData.selection || [],
                hasListUpdated: newData.hasListUpdated,
                hasSelectionUpdated: newData.hasSelectionUpdated,
                query: ""
            };

            this.notifyObservers();
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Registers an observer to updates of subject state
     *
     * @returns {void}
     * @param o {TObserver}
     */
    public registerObserver(o: TObserver): void {
        try {
            this.listObserverCollection.push(o);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Removes an observer from the updates of subject state
     *
     * @returns {void}
     * @param o {TObserver}
     */
    public unregisterObserver(o: TObserver): void {
        try {
            const index = this.listObserverCollection.indexOf(o);
            this.listObserverCollection.splice(index, 1);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Iterates over the list of observers
     * and notifies them with the new state of subject
     *
     * @access public
     * @returns {void}
     */
    public notifyObservers(): void {
        try {
            for (const observer of this.listObserverCollection) {
                console.log("state in herer", this.state);
                observer.update(this.state);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * replaces old list elements in the droope by mutating the state object.
     * Every replacement in listing shall be driven by this function acting as a developer API
     *
     * @access public
     * @param selectedObj {TData}
     * @returns {void}
     */
    public replaceListing(newList: TData[]): void {
        try {
            const result: TState = {
                hasListUpdated: true,
                list: newList,
                selection: this.state.selection,
                hasSelectionUpdated: false,
                query: ""
            };
            this.setData(result);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Adds new list elemts in the droope by mutating the state object.
     * Every addition in listing shall be driven by this function acting as a developer API
     *
     * @access public
     * @param selectedObj {TData}
     * @returns {void}
     */
    public updateLising(newList: TData[]): void {
        try {
            const result: TState = {
                hasListUpdated: true,
                list: [...this.state.list, ...newList],
                selection: this.state.selection,
                hasSelectionUpdated: false,
                query: ""
            };
            this.setData(result);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Removes an item from the droope by mutating the state object.
     * Every removal shall be driven by this function acting as a developer API
     *
     * @access public
     * @param id {string}
     * @returns {void}
     */
    public removeSelection(id: number): void {
        try {
            console.log("id", id, this.state);
            const result: TState = {
                hasListUpdated: false,
                hasSelectionUpdated: true,
                list: this.state.list,
                query: this.state.selection.filter((item) => item.id === id)[0].name,
                selection: [...this.state.selection.filter((item) => item.id !== id)]

            };
            this.setData(result);
        } catch (err) {
            console.warn(`Could not delete the select id: ${id}`);
            console.warn(err.message);
        }
    }

    /**
     * Adds new item in the droope by mutating the state object.
     * Every addition shall be driven by this function acting as a developer API
     *
     * @access public
     * @param selectedObj {TData}
     * @returns {void}
     */
    public addSelection(selectedObj: TData): void {
        try {
            const selection = this.config.selectLimit === 1 ? [selectedObj] : [...this.state.selection, selectedObj];
            const result: TState = {
                hasListUpdated: false,
                hasSelectionUpdated: true,
                list: this.state.list,
                selection,
                query: ""
            };
            this.setData(result);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Emulates focusout when last selection is made.
     * Last selection is determined by `selectLimit` configuration.
     * This function acts as a listener when `onSelect` executes
     *
     * @access protected
     * @returns {void}
     */
    protected onLastSelection(): void {
        try {
            if (this.config.selectLimit) {
                const isLastSelectionNow: boolean = this.state.selection.length + 1 >= this.config.selectLimit;
                if (isLastSelectionNow) {
                    this.emulateEventOnListObserver("focusout");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Creates markup for no result message
     * @returns {void}
     */
    public createNoResultFragment(): void {
        try {
            const { config } = this;
            if (config.noResultErrorMessage) {
                this.noResultElement.classList.add("no-result");
                this.noResultElement.style.display = "none";
                this.noResultElement.textContent = config.noResultErrorMessage;
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Devloper's API to access full internal state of Droope i.e including `LIST`.
     * For individual access to state properties like selection. Recommended way is to
     * access `DroopeInstance.state.selection`
     *
     * @access public
     * @returns {TState | null}
     * @returns {void}
     */
    public getCompleteState(): TState | null {
        try {
            return this.state;
        } catch (err) {
            console.warn(err.message);
            return null;
        }
    }
}

export default SelectBoxInput;
