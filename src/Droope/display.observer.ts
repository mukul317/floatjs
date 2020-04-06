import { TSubject, TObserver, TData, TState } from "./interface";

class SelectDisplay implements TObserver {
    public subject: TSubject;
    private view: HTMLElement;
    private isNodeList: boolean = false;

    constructor(subject: TSubject) {
        this.subject = subject;
        this.subject.registerObserver(this);
        this.view = document.createElement("UL");
        this.isNodeList = subject.config.displayElement instanceof NodeList;
        if (this.subject.config.tagSelectedValues) {
            this.onCrossClick();
        }
    }

    public generateDisplayHtml(selectedValues: TData[]): HTMLElement {
        const { tagSelectedValues } = this.subject.config;
        try {
            /** @todo: Object vs DOM difffing */
            this.view.innerHTML = "";
            selectedValues.forEach((item: TData) => {
                const listItem: HTMLElement = document.createElement("LI");
                listItem.textContent = item.name;
                listItem.classList.add("selection-item");
                listItem.setAttribute("data-obj", JSON.stringify(item));
                if (tagSelectedValues) {
                    this.tagDecorator(listItem);
                }
                this.view.appendChild(listItem);
            });
            return this.view;
        } catch (err) {
            console.warn(err);
            return this.view;
        }
    }

    public appendMarkup(selectedHtml: HTMLElement): void {
        try {
            const { displayElement } = this.subject.config;

            const populateMarkUp = (element: HTMLElement): void => {
                try {
                    element.innerHTML = "";
                    element.appendChild(selectedHtml.cloneNode(true));
                } catch (err) {
                    console.warn(err.message);
                }
            };

            if (displayElement) {
                this.isNodeList
                    ? (displayElement as NodeList).forEach((element: Node) => populateMarkUp((element as HTMLElement)))
                    : populateMarkUp((displayElement as HTMLElement));
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    public update(state: TState): void {
        try {
            const { selection, hasSelectionUpdated } = state;
            if (hasSelectionUpdated === true) {
                const selectedHtml: HTMLElement = this.generateDisplayHtml(selection);
                this.appendMarkup(selectedHtml);

                console.info("[Notified]: Droope Select Observer with UPDATE");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public tagDecorator(listItem: HTMLElement): HTMLElement {
        try {
            const chipJsonString = listItem.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};
            const crossIcon: HTMLElement = document.createElement("SPAN");

            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);
            listItem.classList.add("tag");
            listItem.appendChild(crossIcon);

            return listItem;
        } catch (err) {
            console.warn(err.message);
            return listItem;
        }
    }

    public onCrossClick(): void {
        try {
            const { displayElement } = this.subject.config;
            const attachCrossEvent = (element: HTMLElement): void => {
                element.addEventListener("click", (e: MouseEvent) => {
                    if (e.target) {
                        try {
                            const toBeDeletedId = (e.target as HTMLElement).getAttribute("data-id");
                            if (toBeDeletedId && toBeDeletedId !== "") {
                                this.subject.removeSelection(toBeDeletedId);
                            }
                        } catch (err) {
                            console.warn(err.message);
                        }
                    }
                });
            };
            if (displayElement) {
                this.isNodeList === false
                    ? attachCrossEvent((displayElement as HTMLElement))
                    : (displayElement as NodeList).forEach((element: Node) => attachCrossEvent((element as HTMLElement)));
            }
        } catch (err) {
            console.warn(err);
        }
    }
}

export default SelectDisplay;
