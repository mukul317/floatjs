import { TSubject, TObserver, TData, TState } from "./interface";

class SelectDisplay implements TObserver {
    public subject: TSubject;

    constructor (subject: TSubject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }

    public generateDisplayHtml (selectedValues: TData[]): HTMLElement {
        const view: HTMLElement = document.createElement("UL");
        const { tagSelectedValues } = this.subject.config;
        try {
            selectedValues.forEach((item: TData) => {
                const listItem: HTMLElement = document.createElement("LI");
                listItem.textContent = item.name;
                listItem.classList.add("selection-item");
                listItem.setAttribute("data-obj", JSON.stringify(item));
                if (tagSelectedValues) {
                    this.tagDecorator(listItem);
                }
                view.appendChild(listItem);
            });
            return view;
        } catch (err) {
            console.warn(err);
            return view;
        }
    }

    public appendDisplayHtml (selectedHtml: HTMLElement): void {
        try {
            const { displayElement } = this.subject.config;
            if (displayElement) {
                displayElement.innerHTML = "";
                displayElement.appendChild(selectedHtml);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    public update (state: TState): void {
        try {
            const { selection } = state;
            const selectedHtml: HTMLElement = this.generateDisplayHtml(selection);
            this.appendDisplayHtml(selectedHtml);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public tagDecorator (listItem: HTMLElement): HTMLElement {
        if (listItem) {
            const chipJsonString = listItem.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};

            const crossIcon: HTMLElement = document.createElement("SPAN");
            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);
            listItem.appendChild(crossIcon);
        }

        /** TODO */
        listItem.addEventListener("click", (e: MouseEvent) => {
            if (e.target) {
                const deleteId = (e.target as HTMLElement).getAttribute("data-id");
                if (deleteId) {
                    const result: TState = {
                        hasListUpdated: false,
                        list: [...this.subject.state.list],
                        selection: [...this.subject.state.selection.filter((item) => parseInt(item.id, 10) !== parseInt(deleteId, 10))]
                    };
                    this.subject.setData(result);
                }
            }
        });

        return listItem;
    }
}

export default SelectDisplay;
