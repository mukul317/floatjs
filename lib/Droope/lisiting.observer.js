"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Listing = /** @class */ (function () {
    function Listing(subject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }
    Listing.prototype.generateAndAppendList = function (newData) {
        var ulElement = document.createElement("UL");
        newData.list.forEach(function (item) {
            var liElement = document.createElement("LI");
            liElement.textContent = item.name;
            liElement.setAttribute("data-obj", JSON.stringify(item));
            ulElement.appendChild(liElement);
        });
        if (this.subject.lisitingElement) {
            this.subject.lisitingElement.innerHTML = "";
            this.subject.lisitingElement.appendChild(this.subject.noResultElement);
            this.subject.lisitingElement.appendChild(ulElement);
        }
        return ulElement;
    };
    Listing.prototype.update = function (newData) {
        if (newData.hasListUpdated) {
            this.generateAndAppendList(newData);
        }
    };
    return Listing;
}());
exports.default = Listing;
//# sourceMappingURL=lisiting.observer.js.map