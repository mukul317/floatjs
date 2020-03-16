"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectDisplayDecorator {
    constructor(subject) {
        this.subject = subject;
    }
    add(view, type) {
        switch (type) {
            case "chips":
                return this.chips(view);
            // case "text":
            //     return this.textView(view);
            // // case "makeItGlow" : return this.makeItGlow(view);
            case "roundedChips":
                return this.roundedChips(view);
            default:
                return view;
        }
    }
    roundedChips(view) {
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
                        selection: [
                            ...this.subject.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(deleteId, 10))
                        ]
                    };
                    this.subject.setData(result);
                }
            }
        });
        return view;
    }
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
                        selection: [
                            ...this.subject.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(deleteId, 10))
                        ]
                    };
                    this.subject.setData(result);
                }
            }
        });
        return view;
    }
}
exports.SelectDisplayDecorator = SelectDisplayDecorator;
//# sourceMappingURL=decorator.js.map