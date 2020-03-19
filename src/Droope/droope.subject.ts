import { TObserver, TData, TState, TSubject, TDroopeConfig } from "./interface";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TDroopeConfig = {
    domId: "",
    inputElement: null,
    lisitingElement: null,
    displayElement: null,
    listLimit: 10,
    selectLimit: 1,
    displayListOnFocus: true,
    displayDecorationList: ["chips"],
    noResultErrorMessage: "No result for your query",
    tagSelectedValues: false,
    checkboxes: true
};
class SelectBoxInput implements TSubject {
    public state: TState = {
        list: [],
        selection: [],
        hasListUpdated: true
    };

    public noResultErrorMessage: boolean = true;
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
            this.registerNoResultElement();
        } catch (err) {
            console.warn(err.message);
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

    public registerNoResultElement(): void {
        try {
            const { config } = this;
            if (config.noResultErrorMessage) {
                this.noResultElement.classList.add("no-result");
                this.noResultElement.style.display = "none";
                this.noResultElement.textContent = config.noResultErrorMessage || "";
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
                const isDuplicate: boolean = this.state.selection.filter((item) => item.id === selectedObj.id).length > 0;

                if (isDuplicate === true) {
                    if (config.checkboxes === true) {
                        this.deleteSelection(selectedObj.id);
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
                throw new Error("On select callback trigged. No selection json found. Making no update");
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
                    this.deleteSelection(lastId);
                    this.emulateEventOnListObserver("focus");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public onKeyUp(e: KeyboardEvent): void {
        try {
            const query: string = e && e.target && (e.target as HTMLInputElement).value ? (e.target as HTMLInputElement).value.trim() : "";
            const which: number = e.which;

            switch (which) {
            case 9: { // Tab pressed
                this.emulateEventOnListObserver("focusout");
                return;
            }
            // ENter
            case 13: {
                const { config } = this;
                const listItem: HTMLElement | null = config.lisitingElement && config.lisitingElement.querySelector(".active");
                if (listItem) {
                    this.onSelect(listItem);
                }
                return;
            }

            case 38: // Up arrow
                this.onArrowPress("up");
                return;

            case 40: {
                // Down arrow
                this.onArrowPress("down");
                return;
            }

            default: {
                // Default filtering logic
                const filteredList = this.dataSet.filter((item) => {
                    const lowerItem = item.name.toLowerCase();
                    const lowerQuery = query.toLowerCase();
                    const includesSupported = Array.prototype.includes !== undefined;
                    return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;
                });

                const hasResults = filteredList.length !== 0;
                const result: TState = {
                    hasListUpdated: true,
                    list: hasResults ? filteredList : this.dataSet,
                    selection: [...this.state.selection]
                };
                this.setData(result);
                // Reset counter for arrow keys
                this.arrowCounter = -1;
                this.showNoResultMessage(hasResults);
            }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public showNoResultMessage(hasResults: boolean): void {
        try {
            this.noResultElement.style.display = hasResults ? "none" : "block";
        } catch (err) {
            console.warn(err.message);
        }
    }

    public onArrowPress(direction: string): void {
        try {
            /** get list of all li items */
            const { config } = this;
            const listItems = config.lisitingElement ? config.lisitingElement.querySelectorAll("li") : null;

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
                hasListUpdated: newData.hasListUpdated
            };

            this.notifyObservers();
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerObserver(o: TObserver): void {
        try {
            this.listObserverCollection.push(o);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public unregisterObserver(o: TObserver): void {
        try {
            const index = this.listObserverCollection.indexOf(o);
            this.listObserverCollection.splice(index, 1);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public notifyObservers(): void {
        try {
            for (const observer of this.listObserverCollection) {
                observer.update(this.state);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public deleteSelection(id: string): void {
        try {
            const result: TState = {
                hasListUpdated: false,
                list: [...this.state.list],
                selection: [...this.state.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]
            };
            this.setData(result);
        } catch (err) {
            console.warn(`Could not delete the select id: ${id}`);
            console.warn(err.message);
        }
    }

    public addSelection(selectedObj: TData): void {
        try {
            const selection = this.config.selectLimit === 1 ? [selectedObj] : [...this.state.selection, selectedObj];
            const result: TState = {
                hasListUpdated: false,
                list: [...this.state.list],
                selection
            };
            this.setData(result);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public onLastSelection(): void {
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
}

export default SelectBoxInput;
