"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helper_suggester_1 = require("./helper.suggester");
var config_suggester_1 = __importDefault(require("./config.suggester"));
var SelectBoxInput = /** @class */ (function () {
    function SelectBoxInput(options) {
        var _this = this;
        this.resultSet = {
            list: [],
            selection: [],
            hasListUpdated: true
        };
        this.arrowCounter = -1;
        this.dataSet = [];
        this.listObserverCollection = [];
        this.displayListOnFocus = false;
        this.inputElement = options.inputElement;
        this.displayElement = options.displayElement;
        this.lisitingElement = options.lisitingElement;
        this.selectLimit = options.selectLimit || 1;
        this.displayListOnFocus = options.displayListOnFocus || false;
        this.inputElement.addEventListener("keydown", function (e) { return _this.handleBackspace(e); });
        this.inputElement.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        this.lisitingElement.addEventListener("click", function (e) {
            return _this.handleSelect(e.target);
        });
        if (this.displayListOnFocus === true) {
            document.addEventListener("click", function (e) { return _this.handleDocumentBlur(e); });
            this.inputElement.addEventListener("focus", function (e) {
                return _this.handleListingDisplayStateOn(e.type);
            });
            // Close listing on initialization
            this.handleListingDisplayStateOn("blur");
        }
        if (options.noResultErrorMessage) {
            this.noResultElement = document.createElement("P");
            this.noResultElement.classList.add("no-result");
            this.noResultElement.style.display = "none";
            this.noResultElement.textContent = options.noResultErrorMessage || "";
        }
    }
    SelectBoxInput.prototype.handleDocumentBlur = function (event) {
        var eventPath = event.path;
        var hasNotClickedOnListing = eventPath.indexOf(this.lisitingElement) === -1;
        var hasNotClickedOnInput = eventPath.indexOf(this.inputElement) === -1;
        if (hasNotClickedOnListing && hasNotClickedOnInput) {
            this.handleListingDisplayStateOn("blur");
        }
    };
    SelectBoxInput.prototype.handleListingDisplayStateOn = function (eventType) {
        this.lisitingElement.style.display =
            eventType === "focus" ? "block" : "none";
    };
    SelectBoxInput.prototype.handleSelect = function (target) {
        var selectedObj = JSON.parse(target.getAttribute("data-obj"));
        if (selectedObj) {
            var selectionLimitExceeded = this.selectLimit > 1
                ? this.resultSet.selection.length + 1 > this.selectLimit
                : false;
            var isLastSelectionNow = this.resultSet.selection.length + 1 >= this.selectLimit;
            var isDuplicate = this.resultSet.selection.filter(function (item) { return item.id === selectedObj.id; })
                .length > 0;
            if (selectedObj && isDuplicate === false) {
                if (selectionLimitExceeded === false) {
                    var selection = this.selectLimit === 1
                        ? [selectedObj]
                        : __spread(this.resultSet.selection, [selectedObj]);
                    var result = {
                        hasListUpdated: false,
                        list: __spread(this.resultSet.list),
                        selection: selection
                    };
                    this.setData(result);
                }
                if (isLastSelectionNow) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        }
    };
    SelectBoxInput.prototype.handleBackspace = function (e) {
        var which = e.which;
        var query = e.target.value.trim();
        var isQueryEmpty = query === "";
        if (which === 8) {
            var lastIndexOfSelection = this.resultSet.selection.length - 1;
            var lastId = lastIndexOfSelection >= 0
                ? this.resultSet.selection[lastIndexOfSelection].id
                : null;
            if (isQueryEmpty === true && lastId !== null) {
                this.deleteSelection(lastId);
                this.handleListingDisplayStateOn("focus");
            }
        }
    };
    SelectBoxInput.prototype.onKeyUp = function (e) {
        var query = e && e.target && e.target.value
            ? e.target.value.trim()
            : "";
        var which = e.which;
        var category = "top";
        switch (which) {
            case 9: // Tab pressed
                this.handleListingDisplayStateOn("blur");
                return;
            case 13: // Enter
                // eslint-disable-next-line no-case-declarations
                var listItem = this.lisitingElement.querySelector(".active");
                if (listItem) {
                    this.handleSelect(listItem);
                }
                return;
            case 38: // Up arrow
                this.handleArrow("up");
                return;
            case 40: // Down arrow
                this.handleArrow("down");
                return;
            default:
                this.handleResponse(helper_suggester_1.Helper.sendXhr(config_suggester_1.default.urls.autoComplete, {
                    query: query,
                    category: category
                }), category, query, "sug");
        }
    };
    // rishabh code here starts
    SelectBoxInput.prototype.initRcs = function (selectedObject) {
        if (selectedObject && selectedObject.displayTextEn) {
            try {
                var query = selectedObject.displayTextEn.toLowerCase();
                var category = "top";
                this.handleResponse(helper_suggester_1.Helper.sendXhr(config_suggester_1.default.urls.relatedConcept, {
                    query: query,
                    category: category
                }), category, query, "rc");
            }
            catch (e) {
                throw new Error("selected item issue:" + e);
            }
        }
    };
    SelectBoxInput.prototype.handleRcData = function (resp, category, query) {
        this.dataSet = resp.resultConcepts[category];
        this.fillDataIntoList(query);
    };
    SelectBoxInput.prototype.fillDataIntoList = function (query) {
        var filteredList = this.dataSet.filter(function (item) {
            if (item && item.name && item.displayTextEn) {
                item.name = item.displayTextEn;
                var lowerItem = item.displayTextEn.toLowerCase();
                var lowerQuery = query.toLowerCase();
                var includesSupported = Array.prototype.includes !== undefined;
                return includesSupported
                    ? lowerItem.includes(lowerQuery)
                    : lowerItem.indexOf(lowerQuery) !== -1;
            }
        });
        var hasResults = filteredList.length !== 0;
        var result = {
            hasListUpdated: true,
            list: hasResults ? filteredList : this.dataSet,
            selection: __spread(this.resultSet.selection)
        };
        this.setData(result);
        // Reset counter for arrow keys
        this.arrowCounter = -1;
        this.showNoResultMessage(hasResults);
    };
    SelectBoxInput.prototype.handleSugData = function (resp, category, query) {
        this.dataSet = resp.resultList[category];
        this.fillDataIntoList(query);
    };
    SelectBoxInput.prototype.handleResponse = function (promise, category, query, resolvedData) {
        var _this = this;
        promise.then(function (resp) {
            switch (resolvedData) {
                case "rc":
                    _this.handleRcData(resp, category, query);
                    break;
                case "sug":
                    _this.handleSugData(resp, category, query);
                    break;
            }
        });
    };
    // rishabh code here ends
    SelectBoxInput.prototype.showNoResultMessage = function (hasResults) {
        this.noResultElement.style.display = hasResults ? "none" : "block";
    };
    SelectBoxInput.prototype.handleArrow = function (direction) {
        /** get list of all li items */
        var listItems = this.lisitingElement.querySelectorAll("li");
        /** determine the direction */
        var isGoingUp = direction === "up";
        var isGoingDown = direction === "down";
        if (isGoingDown === true) {
            /** counter is by default at -1 for first selection i.e. index 0 */
            var currentElement = listItems[this.arrowCounter + 1];
            if (currentElement) {
                // add active class to
                currentElement.classList.add("active");
                var prevElement = currentElement.previousElementSibling;
                if (prevElement) {
                    prevElement.classList.remove("active");
                }
            }
            if (this.arrowCounter < listItems.length - 1) {
                this.arrowCounter++;
            }
        }
        if (isGoingUp === true) {
            var currentElement = listItems[this.arrowCounter];
            if (currentElement) {
                currentElement.classList.remove("active");
                var prevElement = currentElement.previousElementSibling;
                if (prevElement) {
                    prevElement.classList.add("active");
                }
            }
            if (this.arrowCounter > -1) {
                this.arrowCounter--;
            }
        }
        console.log(this.arrowCounter);
    };
    SelectBoxInput.prototype.setData = function (newData) {
        // This logic executes when SelectBox is provided with the data first time
        // eslint-disable-next-line no-prototype-builtins
        var isDataForFirstTime = newData.hasOwnProperty("construct");
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
    };
    SelectBoxInput.prototype.registerObserver = function (o) {
        this.listObserverCollection.push(o);
    };
    SelectBoxInput.prototype.unregisterObserver = function (o) {
        var index = this.listObserverCollection.indexOf(o);
        this.listObserverCollection.splice(index, 1);
    };
    SelectBoxInput.prototype.notifyObservers = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.listObserverCollection), _c = _b.next(); !_c.done; _c = _b.next()) {
                var observer = _c.value;
                observer.update(this.resultSet);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SelectBoxInput.prototype.deleteSelection = function (id) {
        var result = {
            hasListUpdated: false,
            list: __spread(this.resultSet.list),
            selection: __spread(this.resultSet.selection.filter(function (item) { return parseInt(item.id, 10) !== parseInt(id, 10); }))
        };
        this.setData(result);
    };
    return SelectBoxInput;
}());
exports.default = SelectBoxInput;
//# sourceMappingURL=suggester.subject.js.map