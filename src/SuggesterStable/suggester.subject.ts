import { TSugConfig, TData, TState, TSubject, TObserver, TRecentSearchResponse, TSuggesterResponse, TResponse, TLanguage, TPayload } from "./interface";
import { Model } from "./suggester.model";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TSugConfig = {
    urls: {
        autoComplete: "http://suggest.naukrigulf.com/suggest/autosuggest?invoker=ng&",
        caching: "http://suggest.naukrigulf.com/suggest/prefetch?invoker=ng&",
        checkVersion: "http://suggest.naukrigulf.com/suggest/v?",
        relatedConcept: "http://suggest.naukrigulf.com/suggest/autoconcepts?invoker=ng&",
        prefetch: "http://suggest.naukrigulf.com/suggest/prefetch?invoker=ng&",
        trackingURL: "http://suggest.naukrigulf.com/suggestlg.naukrigulf.com/logger/log?invoker=ng&"
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
    debounceTimeout: 500,
    selectionType: "string"
};

class SelectBoxInput implements TSubject {
    public state: TState = {
        list: [],
        selection: [],
        hasListUpdated: false,
        hasSelectionUpdated: false,
        query: ""
    }

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
    private userLanguage: TLanguage = "EN";

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
            const { config } = this;
            if (listingType && this.headingElement) {
                switch (listingType) {
                case "rc":
                    this.headingElement.style.display = "block";
                    this.headingElement.innerHTML = config.relatedConceptsHeadingElementText ? config.relatedConceptsHeadingElementText : "Related Concepts";
                    break;
                case "sug":
                    this.headingElement.style.display = "block";
                    this.headingElement.innerHTML = config.suggesterHeadingElementText ? config.suggesterHeadingElementText : "Suggestions";
                    break;
                }
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

    /**
     * Handle Select set the selected object by picking the item from the data-obj attribute of the selected
     * listing element.
     * @param target
     * @returns { void }
     */
    public onSelect(target: HTMLElement): void {
        try {
            const selectedDisplayText: string = target.getAttribute("data-displayTextEn") || "";
            console.log("selected Display text", selectedDisplayText);
            if (selectedDisplayText) {
                this.sendRelatedSearchRequest(selectedDisplayText);
                this.onAfterRCRequest(selectedDisplayText);
            }
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
            const { config } = this;
            const selectionType: string = config.selectionType ? config.selectionType : "";
            if (selectionType === "string" && which === 8 && config.inputElement) {
                this.state.query = this.extractQuery(config.inputElement.value, 8);
            }
            const query = this.state.query;
            console.log("state in backspace", this.state);
            const isQueryEmpty: boolean = query === "";

            console.log("backspace detected in here", which);
            if (which === 8) {
                const lastIndexOfSelection: number = this.state.selection.length - 1;
                if (selectionType === "object" && this.state.selection) {
                    const lastId: number | null | undefined = lastIndexOfSelection >= 0 ? (this.state.selection as TData[])[lastIndexOfSelection].id : null;
                    if (isQueryEmpty === true && lastId !== null && lastId !== undefined) {
                        this.removeSelection(lastId);
                        this.emulateEventOnListObserver("focus");
                    }
                } else if (selectionType === "string") {
                    const lastSelectionDisplayText: string = lastIndexOfSelection >= 0 ? (this.state.selection as string[])[lastIndexOfSelection] : "";
                    console.log("lastSelectionDisplayText before", lastSelectionDisplayText, isQueryEmpty);
                    if (isQueryEmpty === true && lastSelectionDisplayText !== "") {
                        console.log("lastSelectionDisplayText", lastSelectionDisplayText);
                        this.removeSelectionString(lastSelectionDisplayText);
                        this.emulateEventOnListObserver("focus");
                    }
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
   * This method detects if text enetred is english,arabic or a special character
   * @access public
   * @param query
   * @returns {TLanguage}
   *
   */
    public detectLanguage(): void {
        try {
            const { query } = this.state;
            const englishRegEx = /[A-Za-z0-9]/;
            // eslint-disable-next-line no-useless-escape
            const specialCharRegEx = /[\!\@\#\$\%\^\&\*\(\)\-\+\=\-\{\}\[\]\;\'\,\.\/\:\"\<\>\?\|\\\_]/;
            this.userLanguage = englishRegEx.test(query) ? "EN" : specialCharRegEx.test(query) ? "SC" : "AR";
        } catch (err) {
            console.warn(err);
            this.userLanguage = "EN";
        }
    }

    /**
     * Extract query is used for extracting the query from the value of the input feild of the suggester that
     * extracts the query from the value of the input feild value. Acts as a query handler and is useful in case
     * of when the user enters the comma then it does not return query as null but the whole query that was fetched
     * from the input value is returned.
     * @acces public
     * @param query
     * @param e
     */
    public extractQuery(query: string, keyCode: number): string {
        try {
            if (query) {
                const regex: RegExp = /\s*([^,]+$)/g;
                const matches: RegExpExecArray | null = regex.exec(query);
                if (!matches && keyCode === 188) {
                    return query;
                }
                if (matches) {
                    return matches[1];
                }
                return "";
            } else {
                throw new Error("Query not found that is to be sanitised");
            }
        } catch (e) {
            console.log("Exception Occurred while Sanitising Query");
        }
        return "";
    }

    public setQueryToState(target: HTMLInputElement | null, keyCode: number): void {
        try {
            if (target) {
                const value: string = target.value;
                const query = this.extractQuery(value.trim(), keyCode);
                this.state.query = this.userLanguage === "AR" ? query : this.sanitiseQuery(query);
            } else {
                throw new Error(`Could not set query in state. target : ${target}, keyCode: ${keyCode}`);
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
                const which: number = e.which;
                const target: HTMLInputElement | null = (e.target as HTMLInputElement);
                this.detectLanguage();
                this.setQueryToState(target, which);

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
                    this.initialiseRelatedSearch(this.state.query);
                    return;

                default:
                    this.debounceRequest(this.config.debounceTimeout).then(() => this.sendSuggesterRequest());
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
     *
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

    public debounceRequest(debounceInterval: number = 0): Promise<void> {
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
            const { config } = this;
            if (config.selectionType === "object") {
                const selectedObj: TData = { id: 0, name: "", displayTextEn: "" };
                if (query.length > 1) {
                    selectedObj.id = this.state.selection.length;
                    selectedObj.name = query.split(",")[this.state.selection.length];
                    selectedObj.displayTextEn = selectedObj.name;
                    if (selectedObj.name) {
                        this.sendRelatedSearchRequest(selectedObj);
                        this.onAfterRCRequest(selectedObj);
                    }
                } else {
                    throw new Error("Query not passed in the function");
                }
            } else if (config.selectionType === "string") {
                if (query.length > 1) {
                    const selectedDisplayText: string = query.split(",")[this.state.selection.length];
                    if (selectedDisplayText) {
                        this.sendRelatedSearchRequest(selectedDisplayText);
                        this.onAfterRCRequest(selectedDisplayText);
                    }
                } else {
                    throw new Error("Query not passed in the function");
                }
            }
        } catch (e) {
            console.log("Exception Occurred :" + e);
        }
    }

    public checkIfSelectionEligible(selectedObj: TData | string): boolean {
        try {
            const { config } = this;
            if (typeof selectedObj === "object") {
                const selectionLimitExceeded: boolean = config.selectLimit && config.selectLimit > 1 ? this.state.selection.length + 1 > config.selectLimit : false;
                const isDuplicate: boolean = this.checkIfDuplicate(selectedObj);
                return !isDuplicate && !selectionLimitExceeded;
            } else if (typeof selectedObj === "string") {
                const selectionLimitExceeded: boolean = config.selectLimit && config.selectLimit > 1 ? this.state.selection.length + 1 > config.selectLimit : false;
                const isDuplicate: boolean = this.checkIfDuplicate(selectedObj);
                return !isDuplicate && !selectionLimitExceeded;
            }
            return false;
        } catch (e) {
            console.warn("Error occurred while checking the eligibility of selection:", e);
            return false;
        }
    }

    /**
     * This sets the selected object values into the result set
     * @access public
     * @param selectedObj
     * @returns void
     */
    public onAfterRCRequest(selectedObj: TData | string): void {
        try {
            const { config } = this;
            if (typeof selectedObj === "object") {
                if (selectedObj && config.selectLimit) {
                    const isUpdateEligible: boolean = this.checkIfSelectionEligible(selectedObj);
                    if (isUpdateEligible && selectedObj.id) {
                        this.removeSelection(selectedObj.id);
                        this.onLastSelection();
                        selectedObj.id = this.state.selection.length;
                        this.addSelection(selectedObj);
                    }
                    this.setQueryInInputFeild();
                } else {
                    throw new Error();
                }
            } else if (typeof selectedObj === "string") {
                if (selectedObj && config.selectLimit) {
                    const isUpdateEligible: boolean = this.checkIfSelectionEligible(selectedObj);
                    console.log("isUpdate eligible", isUpdateEligible);
                    if (isUpdateEligible) {
                        // this.removeSelectionString(selectedObj);
                        this.onLastSelection();
                        this.addSelectionString(selectedObj);
                    }
                    // this.setQueryInInputFeild();
                } else {
                    throw new Error();
                }
            }
        } catch (e) {
            throw console.warn("Error in selecting target in here" + e);
        }
    }

    public checkIfDuplicate(selectedObj: TData | string): boolean {
        try {
            if (typeof selectedObj === "object") { return (this.state.selection as TData[]).filter((item) => (item.id === selectedObj.id || item.name === selectedObj.name)).length > 0; } else if (typeof selectedObj === "string") { return (this.state.selection as string[]).indexOf(selectedObj) !== -1; }
            return false;
        } catch (e) {
            console.warn("some error in checking duplicated:", e);
            return false;
        }
    }

    /**
     * This empties the input feilds values
     * @returns{void}
     */
    public setQueryInInputFeild(): void {
        try {
            if (this.config.inputElement) {
                console.log("setting query in input feild", this.state);
                this.config.inputElement.value = this.state.query ? this.state.query : "";
            } else {
                throw new Error("Input Element not being set");
            }
        } catch (e) {
            console.error("Emptying input feilds");
        }
    }

    public sendSuggesterRequest(): void {
        try {
            const query = this.state.query;
            const { config } = this;
            const category = config.category ? config.category : "top";
            if (query && this.modelInstance) {
                if (this.config.urls && this.config.urls.autoComplete) {
                    const basePayload: TPayload = {
                        query,
                        category
                    };

                    const payload: TPayload = this.userLanguage === "AR"
                        ? { ...basePayload, locale: "ar_AR", additionalfields: "textsuggest" }
                        : basePayload;

                    console.log("Payload", payload);

                    const xhrPromise: Promise<TResponse> = this.modelInstance.sendXhr(this.config.urls.autoComplete, payload);
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
    public sendRelatedSearchRequest(selectedObject: TData | string): void {
        try {
            if (selectedObject && (selectedObject as TData).displayTextEn && this.modelInstance) {
                if (this.config.urls && this.config.urls.relatedConcept) {
                    const query = (selectedObject as TData).displayTextEn.toLowerCase();
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
            } else if (typeof selectedObject === "string") {
                if (this.config.urls && this.config.urls.relatedConcept && this.modelInstance) {
                    const query = selectedObject.toLowerCase();
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
     * Fills the lisitng element by filtering the result set based on the query of the input feild. The result
     * list is filtered first on the basis of the query and then the data is being set into the listing element.
     * @param query: {string} : Query of the input feild being entered in the suggester input
     * @returns {void}
     */
    public filterAndFillDataIntoListing(listingType: string): void {
        try {
            const { config } = this;
            const query: string = listingType === "rc" ? "" : this.state.query;
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
                    selection: this.state.selection,
                    hasSelectionUpdated: true,
                    query: query
                };

                console.log("state in filter and fill listing", result);
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

    public hideHeading(hasResults: boolean): void {
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
                query: newData.query
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
                query: this.state.query
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
                query: this.state.query
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
            const result: TState = {
                hasListUpdated: false,
                hasSelectionUpdated: true,
                list: this.state.list,
                query: (this.state.selection as TData[]).filter((item: TData) => item.id === id)[0].name || "",
                selection: [...(this.state.selection as TData[]).filter((item: TData) => item.id !== id)]

            };
            this.setData(result);
        } catch (err) {
            console.warn(`Could not delete the select id: ${id}`);
            console.warn(err.message);
        }
    }

    public removeSelectionString(displayTextEn: string): void {
        try {
            const result: TState = {
                hasListUpdated: false,
                hasSelectionUpdated: true,
                list: this.state.list,
                query: (this.state.selection as string[]).splice((this.state.selection as string[]).indexOf(displayTextEn), 1)[0],
                selection: this.state.selection
            };
            console.log("in remove selection checking the new state", result);
            this.setData(result);
        } catch (err) {
            console.warn("Could not delete the select id: ");
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
            const selection = this.config.selectLimit === 1 ? [selectedObj] : [...(this.state.selection as TData[]), selectedObj];
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
     * Adds new item in the droope by mutating the state object.
     * Every addition shall be driven by this function acting as a developer API
     *
     * @access public
     * @param selectedObj {TData}
     * @returns {void}
     */
    public addSelectionString(displayTextEn: string): void {
        try {
            console.log("displaytext en in add selection", this.state, displayTextEn);
            const selection = this.config.selectLimit === 1 ? [displayTextEn] : [...(this.state.selection as string[]), displayTextEn];
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
