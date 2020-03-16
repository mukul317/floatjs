import { TObserver, TData, TState, TSubject, TDroopeConfig } from "./interface";
interface TSetState extends TState {
    construct?: boolean;
}

const defaultConfig: TDroopeConfig = {
    inputElement: null,
    lisitingElement: null,
    displayElement: null,
    selectLimit: 1,
    displayListOnFocus: true,
    displayDecorationList: ["chips"],
    noResultErrorMessage: "Sorry no result"
};
class SelectBoxInput implements TSubject {
    public resultSet: TState = {
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
    private displayListOnFocus = false;

    constructor (options: TDroopeConfig) {
        try {
            this.config = { ...this.config, ...options };

            this.registerListEvents();
            this.registerInputEvents();
            this.registerNoResultElement();
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerInputEvents (): void {
        try {
            const { config } = this;
            if (config.inputElement) {
                config.inputElement.addEventListener("keydown", (e) => this.handleBackspace(e));
                config.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
                if (this.displayListOnFocus === true) {
                    document.addEventListener("click", (e) => this.handleDocumentBlur(e));
                    config.inputElement.addEventListener("focus", (e) => this.handleListingDisplayStateOn(e.type));
                    // Close listing on initialization
                    this.handleListingDisplayStateOn("blur");
                }
            }
            throw new Error("Droope input element undefine");
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerListEvents (): void {
        try {
            const { config } = this;
            if (config.lisitingElement) {
                config.lisitingElement.addEventListener("click", (e: MouseEvent) => {
                    const target: HTMLElement | null = (e.target as HTMLElement);
                    if (target) {
                        this.handleSelect(target);
                    }
                });
            }
            throw new Error("Droope List element undefine");
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerNoResultElement (): void {
        try {
            const { config } = this;
            if (config.noResultErrorMessage) {
                this.noResultElement.classList.add("no-result");
                this.noResultElement.style.display = "none";
                this.noResultElement.textContent = config.noResultErrorMessage || "";
            }
        } catch (error) {
            console.warn(error.message);
        }
    }

    public handleDocumentBlur (e: MouseEvent): void {
        try {
            const target: HTMLElement = (e.target as HTMLElement);
            if (target) {
                const { config } = this;
                const hasClickedOnInput: boolean = config.inputElement === target;
                const hasClickedOnListItem: boolean = target.classList ? target.classList.contains("list-item") : false;

                if (hasClickedOnListItem === false && hasClickedOnInput === false) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleListingDisplayStateOn (eventType: string): void {
        try {
            const { config } = this;
            if (config.lisitingElement) {
                config.lisitingElement.style.display = eventType === "focus" ? "block" : "none";
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleSelect (target: HTMLElement): void {
        const { config } = this;
        const selectedObjStr: string = target.getAttribute("data-obj") || "";
        const selectedObj: TData = JSON.parse(selectedObjStr);
        if (selectedObj && config.selectLimit) {
            const selectionLimitExceeded: boolean = config.selectLimit > 1 ? this.resultSet.selection.length + 1 > config.selectLimit : false;
            const isLastSelectionNow: boolean = this.resultSet.selection.length + 1 >= config.selectLimit;
            const isDuplicate: boolean = this.resultSet.selection.filter((item) => item.id === selectedObj.id).length > 0;

            if (selectedObj && isDuplicate === false) {
                if (selectionLimitExceeded === false) {
                    const selection = config.selectLimit === 1 ? [selectedObj] : [...this.resultSet.selection, selectedObj];
                    const result: TState = {
                        hasListUpdated: false,
                        list: [...this.resultSet.list],
                        selection
                    };
                    this.setData(result);
                }
                if (isLastSelectionNow) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        }
    }

    public handleBackspace (e: KeyboardEvent): void {
        const which = e.which;
        const query = (e.target as HTMLInputElement).value.trim();
        const isQueryEmpty: boolean = query === "";

        if (which === 8) {
            const lastIndexOfSelection: number = this.resultSet.selection.length - 1;
            const lastId: string | null = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].id : null;
            if (isQueryEmpty === true && lastId !== null) {
                this.deleteSelection(lastId);
                this.handleListingDisplayStateOn("focus");
            }
        }
    }

    public onKeyUp (e: KeyboardEvent): void {
        const query: string = e && e.target && (e.target as HTMLInputElement).value ? (e.target as HTMLInputElement).value.trim() : "";
        const which: number = e.which;

        switch (which) {
        case 9: { // Tab pressed
            this.handleListingDisplayStateOn("blur");
            return;
        }
        // ENter
        case 13: {
            const { config } = this;
            const listItem: HTMLElement | null = config.lisitingElement && config.lisitingElement.querySelector(".active");
            if (listItem) {
                this.handleSelect(listItem);
            }
            return;
        }

        case 38: // Up arrow
            this.handleArrow("up");
            return;

        case 40: {
            // Down arrow
            this.handleArrow("down");
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
                selection: [...this.resultSet.selection]
            };
            this.setData(result);
            // Reset counter for arrow keys
            this.arrowCounter = -1;
            this.showNoResultMessage(hasResults);
        }
        }
    }

    public showNoResultMessage (hasResults: boolean): void {
        try {
            this.noResultElement.style.display = hasResults ? "none" : "block";
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleArrow (direction: string): void {
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

    public setData (newData: TSetState): void {
        try {
            // This logic executes when SelectBox is provided with the data first time
            const isDataForFirstTime = newData.construct;
            if (isDataForFirstTime) {
                this.dataSet = newData.list;
                newData.hasListUpdated = true;
            }

            this.resultSet = {
                list: newData.list || [],
                selection: newData.selection || [],
                hasListUpdated: newData.hasListUpdated
            };

            this.notifyObservers();
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerObserver (o: TObserver): void {
        try {
            this.listObserverCollection.push(o);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public unregisterObserver (o: TObserver): void {
        try {
            const index = this.listObserverCollection.indexOf(o);
            this.listObserverCollection.splice(index, 1);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public notifyObservers (): void {
        try {
            for (const observer of this.listObserverCollection) {
                observer.update(this.resultSet);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public deleteSelection (id: string): void {
        const result: TState = {
            hasListUpdated: false,
            list: [...this.resultSet.list],
            selection: [...this.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]
        };
        this.setData(result);
    }
}

export default SelectBoxInput;
