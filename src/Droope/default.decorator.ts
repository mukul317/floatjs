import { TSubject, TState } from "./interface";
class SelectDisplayDecorator {
    public subject: TSubject;

    constructor (subject: TSubject) {
        this.subject = subject;
    }

    public add (view: HTMLElement, type: string): HTMLElement {
        switch (type) {
        case "chips": return this.chips(view);
            // case "makeItGlow" : return this.makeItGlow(view);
        default: return view;
        }
    }

    // public makeItGlow(view: HTMLElement) : HTMLElement {
    //     const list = view.querySelectorAll("li");

    //     list.forEach( (li: HTMLElement) => {
    //         li.style.boxShadow = "gold 0px 0px 10px 1px";
    //     });

    //     return view;
    // }

    public chips (view: HTMLElement): HTMLElement {
        const list = view.querySelectorAll("li");

        list.forEach((li: HTMLElement) => {
            const chipJsonString = li.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};

            const crossIcon: HTMLElement = document.createElement("SPAN");
            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);

            li.appendChild(crossIcon);
        });

        /** TODO */
        view.addEventListener("click", (e: MouseEvent) => {
            if (e.target) {
                const deleteId = (e.target as HTMLElement).getAttribute("data-id");
                if (deleteId) {
                    const result: TState = {
                        hasListUpdated: false,
                        list: [...this.subject.resultSet.list],
                        selection: [...this.subject.resultSet.selection.filter(item => parseInt(item.id, 10) !== parseInt(deleteId, 10))]
                    };
                    this.subject.setData(result);
                }
            }
        });

        return view;
    }
}

export { SelectDisplayDecorator };
