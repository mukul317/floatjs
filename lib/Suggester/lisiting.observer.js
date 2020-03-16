"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listing {
    constructor(subject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }
    generateAndAppendList(newData) {
        const ulElement = document.createElement("UL");
        newData.list.forEach((item) => {
            const liElement = document.createElement("LI");
            if (item && item.name && item.displayTextEn) {
                liElement.textContent = item.name || item.displayTextEn;
            }
            liElement.setAttribute("data-obj", JSON.stringify(item));
            ulElement.appendChild(liElement);
        });
        if (this.subject.lisitingElement) {
            this.subject.lisitingElement.innerHTML = "";
            this.subject.lisitingElement.appendChild(this.subject.noResultElement);
            this.subject.lisitingElement.appendChild(ulElement);
        }
        return ulElement;
    }
    update(newData) {
        if (newData.hasListUpdated) {
            this.generateAndAppendList(newData);
        }
    }
}
exports.default = Listing;
//# sourceMappingURL=lisiting.observer.js.map