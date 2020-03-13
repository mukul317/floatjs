"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectDisplayDecorator {
    constructor(subject) {
        this.subject = subject;
    }
    add(view, type) {
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
    chips(view) {
        const list = view.querySelectorAll("li");
        list.forEach((li) => {
            const chipJsonString = li.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};
            const crossIcon = document.createElement("SPAN");
            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);
            li.appendChild(crossIcon);
        });
        /** TODO */
        view.addEventListener("click", (e) => {
            if (e.target) {
                const deleteId = e.target.getAttribute("data-id");
                if (deleteId) {
                    const result = {
                        hasListUpdated: false,
                        list: [...this.subject.resultSet.list],
                        selection: [...this.subject.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(deleteId, 10))]
                    };
                    this.subject.setData(result);
                }
            }
        });
        return view;
    }
}
exports.SelectDisplayDecorator = SelectDisplayDecorator;
//# sourceMappingURL=default.decorator.js.map