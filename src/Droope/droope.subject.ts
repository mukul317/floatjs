import { TObserver, TData, TState, TSubject, TDroopeConfig, TDirection } from "./interface";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TDroopeConfig = {
    domId: `droope_${Date.now()}`,
    inputElement: null,
    lisitingElement: null,
    displayElement: null,
    listLimit: 10,
    selectLimit: 1,
    displayListOnFocus: true,
    noResultErrorMessage: "No result for your query",
    tagSelectedValues: false,
    checkboxes: true,
    listData: []
};
class SelectBoxInput implements TSubject {
    public state: TState = {
        list: [],
        selection: [],
        hasListUpdated: false,
        hasSelectionUpdated: false
    };

    public noResultElement: HTMLElement = document.createElement("p");
    public arrowCounter: number = -1;
    public config: TDroopeConfig = defaultConfig;

    private dataSet: TData[] = [];
    private listObserverCollection: TObserver[] = [];

    constructor(options: TDroopeConfig) {
        try {
            this.config = { ...this.config, ...options };

            this.registerListEvents();
            this.registerInputEvents();
            this.createNoResultFragment();
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerInputEvents(): void {
        try {
            const { config } = this;
            if (config.inputElement) {
                config.inputElement.addEventListener("keydown", (e) => { return this.onBackspace(e); });
                config.inputElement.addEventListener("keyup", (e) => { return this.onKeyUp(e); });
                if (config.displayListOnFocus === true) {
                    document.addEventListener("click", (e) => { return this.handleDocumentBlur(e); });
                    config.inputElement.addEventListener("focus", (e) => { return this.emulateEventOnListObserver(e.type); });
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
            if (config.lisitingElement) {
                config.lisitingElement.addEventListener("click", (e: MouseEvent) => {
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
            if (config.lisitingElement) {
                config.lisitingElement.style.display = eventType === "focus" ? "block" : "none";
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
                const isDuplicate: boolean = this.state.selection.filter((item) => { return item.id === selectedObj.id; }).length > 0;

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
                        this.clearInput();
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
     * Callback for keyUp event attached to the droope input field
     * case 9   : Handles the Listing Display State and sets to blur
     * case 13  : Enter
     * case 38  : Up Arrow
     * case 40  : Down Arrow
     *
     * @param e : KeyBoardEvent
     * @returns {void}
     */
    public onKeyUp(e: KeyboardEvent): void {
        try {
            const query: string = e && e.target && (e.target as HTMLInputElement).value ? (e.target as HTMLInputElement).value.trim() : "";
            const which: number = e.which;

            switch (which) {
            case 9: this.emulateEventOnListObserver("focusout"); break;
            case 13: this.onEnterPress(); break;
            case 38: this.onArrowPress("up"); break;
            case 40: this.onArrowPress("down"); break;
            default: this.initSelection(query); break;
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public onEnterPress(): void {
        try {
            const { config } = this;
            const listItem: HTMLElement | null = config.lisitingElement && config.lisitingElement.querySelector(".active");
            if (listItem) {
                this.onSelect(listItem);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public initSelection(query: string): void {
        try {
            // Default filtering logic
            const filteredList = this.dataSet.filter((item) => {
                const lowerItem = item.name.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const includesSupported = Array.prototype.includes !== undefined;
                return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;
            });
            const hasResults = filteredList.length !== 0;
            const result: TState = {
                hasSelectionUpdated: false,
                hasListUpdated: true,
                list: hasResults ? filteredList : this.dataSet,
                selection: [...this.state.selection]
            };
            this.setData(result);
            this.arrowCounter = -1;
            this.showNoResultMessage(hasResults);
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * Callback to keycode 38 && 40 which are arrow down and arrow up keys
     * on the execution of constructor the arrow counter is indexed at -1
     * this method traverses through the list item from 0 to `list.length`
     * and adds `active` class to currently active item
     *
     * @access public
     * @returns {void}
     * @param direction {TDirection}
     */
    public onArrowPress(direction: TDirection): void {
        try {
            const { lisitingElement } = this.config;
            const listItems = lisitingElement ? lisitingElement.querySelectorAll("li") : null;

            if (listItems) {
                switch (direction) {
                case "down" : {
                    // counter is by default at -1 for first selection i.e. index 0
                    const currentElement: HTMLElement = listItems[this.arrowCounter + 1];

                    if (currentElement) {
                        // add active class for highlighting
                        currentElement.classList.add("active");
                        const prevElement = currentElement.previousElementSibling;
                        if (prevElement) {
                            prevElement.classList.remove("active");
                        }
                    }
                    if (this.arrowCounter < listItems.length - 1) {
                        this.arrowCounter++;
                    }
                    break;
                }
                case "up": {
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
                    break;
                }
                }
            }
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
                selection: [...this.state.selection.filter((item) => { return parseInt(item.id, 10) !== parseInt(id, 10); })]
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
     * Clears the value of registered input element
     * Mostly invoked after a selection is made
     *
     * @access public
     * @returns {void}
     */
    public clearInput(): void {
        try {
            const { inputElement } = this.config;
            if (inputElement) {
                inputElement.value = "";
            }
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
     * Enables a banner when there in no result on user's query.
     * The no result message is based on config provided. This Fn
     * acts as a listener when filtering is executed.
     *
     * @param hasResults {boolean}
     * @returns {void}
     */
    public showNoResultMessage(hasResults: boolean): void {
        try {
            this.noResultElement.style.display = hasResults ? "none" : "block";
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

    /**
     * Constructs the droope for the first time
     * internally calls setData with `construct`: true
     * along with populating droope listing
     *
     * @returns {void}
     */
    public init(): void {
        try {
            this.setData({
                hasSelectionUpdated: false,
                hasListUpdated: false,
                construct: true,
                selection: [],
                list: this.config.listData
            });
        } catch (err) {
            console.warn(err.message);
        }
    }
}

export default SelectBoxInput;
