import { TSugConfig, TData, TState, TSubject, TObserver, TRecentSearchResponse, TSuggesterResponse, TResponse } from "./interface";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TSugConfig = {
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
    headingElement: null
};
class SelectBoxInput implements TSubject {
    public state: TState = {
        list: [],
        selection: [],
        hasListUpdated: false,
        hasSelectionUpdated: false
    };

    /**
  * Debounce timer variable used for debouncing the user input
  */
    public debounceTimer: NodeJS.Timeout | null = null;

    public noResultErrorMessage: boolean = true;
    public noResultElement: HTMLElement = document.createElement("p");
    public arrowCodisplayunter: number = -1;
    public config: TSugConfig = defaultConfig;

    private dataSet: TData[] = [];
    private listObserverCollection: TObserver[] = [];
    private arrowCounter: number = -1;

    constructor(options: TSugConfig) {
        try {
            this.config = { ...this.config, ...options };

            this.registerListEvents();
            this.registerInputEvents();
            this.createNoResultFragment();
            this.initialiseHeadingElement();
        } catch (err) {
            console.warn(err.message);
        }
    }



    public initialiseHeadingElement(): void {
        const { config } = this;
        config.headingElement = document.createElement("P");
        try {
            config.headingElement.classList.add("no-result");
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
            var { config } = this;
            if (listingType && config.headingElement) {
                switch (listingType) {
                    case "rc":
                        config.headingElement.style.display = "block";
                        config.headingElement.textContent = "Related Searches";
                        break;
                    case "sug":
                        config.headingElement.style.display = "block";
                        config.headingElement.textContent = "Suggestions";
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
                throw new Error("Droope input element undefined");
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

    public onSelect(target: HTMLElement): void {
        try {
            const { config } = this;
            const dataObjFromDom: string | null = target.getAttribute("data-obj");
            const parentOfTarget: HTMLElement | null = target.parentElement;
            const selectedObjStr: string | null = dataObjFromDom || (parentOfTarget ? parentOfTarget.getAttribute("data-obj") : null);
            const selectedObj: TData = selectedObjStr ? JSON.parse(selectedObjStr) : null;

            if (selectedObj && config.selectLimit) {
                const selectionLimitExceeded: boolean = config.selectLimit > 1 ? this.state.selection.length + 1 > config.selectLimit : false;
                const isDuplicate: boolean = this.state.selection.filter((item) => item.id === selectedObj.id).length > 0;

                if (isDuplicate === true) {
                    if (config.checkboxes === true) {
                        this.removeSelection(selectedObj.id.toString());
                    }
                } else {
                    this.onLastSelection();
                    if (selectionLimitExceeded === true) {
                        throw new Error(`Maximum select limit reached. Configured limit droope id "${config.domId}" is ${config.selectLimit}`);
                    } else {
                        this.addSelection(selectedObj);
                    }
                }
            } else {
                throw new Error("On select callback trigged. No selection json found. No mutation in state possible");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public onBackspace(e: KeyboardEvent): void {
        try {
            const which = e.which;
            const query = (e.target as HTMLInputElement).value.trim();
            const isQueryEmpty: boolean = query === "";

            if (which === 8) {
                const lastIndexOfSelection: number = this.state.selection.length - 1;
                const lastId: string | null = lastIndexOfSelection >= 0 ? this.state.selection[lastIndexOfSelection].id : null;
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
                const which: number = e.which;
                const category = "top";
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
                        this.debounceRequest(500).then(() => { this.sendSuggesterRequest(query, category); });
                }
            } else {
                throw new Error("Event not happened Event Object Missing");
            }
        } catch (e) {
            console.error("Error found: " + e);
        }

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
        if (this.debounceTimer) { clearTimeout(this.debounceTimer); }
        return new Promise((resolve: Function): void => {
            this.debounceTimer = setTimeout(
                (): void => resolve(),
                debounceInterval
            );
        });
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
            if (selectedObj) {
                // rishabh changes here
                this.sendRelatedSearchRequest(selectedObj);
                // rishabh changes here
                const { config } = this;
                if (config.selectLimit) {

                    const selectionLimitExceeded: boolean =
                        config.selectLimit && config.selectLimit > 1
                            ? this.state.selection.length >= config.selectLimit
                            : false;
                    const isLastSelectionNow: boolean =
                        this.state.selection.length + 1 >= config.selectLimit;
                    const isDuplicate: boolean =
                        this.resultSet.selection.filter((item) => item.name === selectedObj.name)
                            .length > 0;
                    if (selectedObj && isDuplicate === false) {
                        if (selectionLimitExceeded === false) {
                            const selection =
                                this.selectLimit === 1
                                    ? [selectedObj]
                                    : [...this.resultSet.selection, selectedObj];
                            const result: TState = {
                                hasListUpdated: false,
                                list: [...this.config.resultSet.list],
                                selection
                            };
                            this.emptyInputFeilds();
                            this.setData(result);
                        }
                        if (isLastSelectionNow) {
                            this.emulateEventOnListObserver("focusout");
                        }
                    }
                }
            }
            else {
                throw new Error()
            }
        } catch (e) {
            throw new Error("Error in selecting target in here" + e);
        }
    }


    public sendSuggesterRequest(query: string, category: string): void {
        try {
            console.log("query in here", query);
            if (query) {
                this.handleApiResponse(
                    Helper.sendXhr(suggesterConfig.urls.autoComplete, {
                        query,
                        category
                    }),
                    category,
                    query,
                    "sug"
                );
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
            if (selectedObject && selectedObject.displayTextEn) {
                const query = selectedObject.displayTextEn.toLowerCase();
                const category = "top";

                this.handleApiResponse(
                    Helper.sendXhr(suggesterConfig.urls.relatedConcept, {
                        query,
                        category
                    }),
                    category,
                    query,
                    "rc"
                );
            } else {
                throw Error("Error in the selectedObject");
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
    public handleRelatedSearchResponseData(resp: TRecentSearchResponse, category: string): void {
        try {
            if (resp && category) {
                this.dataSet = resp.resultConcepts[category];
                const emptyQuery = ""; // to disable filtering in case of rc selected
                this.filterAndFillDataIntoListing(emptyQuery, category, "rc");
            } else {
                throw new Error("resp and category not found - param not found");
            }
        } catch (e) {
            console.error("Error occurred while handling RCData:" + e);
        }
    }

    /**
     * Fills the lisitng element by filtering the result set based on the query of the input feild. The result
     * list is filtered first on the basis of the query and then the data is being set into the listing element.
     * @param query: {string} : Query of the input feild being entered in the suggester input
     * @returns {void}
     */
    public filterAndFillDataIntoListing(query: string, category: string, listingType: string): void {
        try {
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
                };
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
    public handleSuggesterResponseData(resp: TSuggesterResponse, category: string, query: string): void {
        try {
            if (resp && category && query) {
                this.dataSet = resp.resultList[category];
                this.filterAndFillDataIntoListing(query, category, "sug");
            } else {
                throw new Error("param not found: resp , category, query");
            }
        } catch (e) {
            console.error("Error while handling Suggester respone data:" + e);
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
        category: string,
        query: string,
        listingType: string
    ): void {
        try {
            if (promise) {
                promise.then((resp: TRecentSearchResponse | TSuggesterResponse) => {
                    if (resp) {
                        if (listingType) {
                            switch (listingType) {
                                case "rc":
                                    this.handleRelatedSearchResponseData(resp, category);
                                    break;
                                case "sug":
                                    this.handleSuggesterResponseData(resp, category, query);
                                    break;
                            }
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
        this.noResultElement.style.display = hasResults ? "none" : "block";
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
                hasSelectionUpdated: newData.hasSelectionUpdated
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
                hasSelectionUpdated: false
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
                hasSelectionUpdated: false
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
    public removeSelection(id: string): void {
        try {
            const result: TState = {
                hasListUpdated: false,
                hasSelectionUpdated: true,
                list: this.state.list,
                selection: [...this.state.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]
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
                selection
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
