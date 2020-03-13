/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Droope/data.ts":
/*!****************************!*\
  !*** ./src/Droope/data.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.default = [\r\n    { id: \"10\", name: \"Construction / Civil Engineering\" },\r\n    { id: \"7\", name: \"Banking / Financial Services / Broking\" },\r\n    { id: \"36\", name: \"Oil & Gas / Petroleum\" },\r\n    { id: \"25\", name: \"IT - Software Services\" },\r\n    { id: \"30\", name: \"Medical / Healthcare / Diagnostics / Medical Devices\" },\r\n    { id: \"20\", name: \"Hotels / Hospitality\" },\r\n    { id: \"55\", name: \"Accounting & Auditing\" },\r\n    { id: \"2\", name: \"Advertising / PR / Event Management\" },\r\n    { id: \"3\", name: \"Agriculture / Dairy / Poultry / Livestock\" },\r\n    { id: \"52\", name: \"Air Conditioning / Refrigeration / HVAC\" },\r\n    { id: \"4\", name: \"Airlines / Aviation\" },\r\n    { id: \"5\", name: \"Architecture / Interior Designing\" },\r\n    { id: \"6\", name: \"Automotive / Automobile / Auto Accessories\" },\r\n    { id: \"56\", name: \"Call Center / BPO / KPO / Outsourcing\" },\r\n    { id: \"57\", name: \"Ceramics / Sanitary ware\" },\r\n    { id: \"9\", name: \"Chemicals / Petrochemicals / Polymers / Industrial Gases\" },\r\n    { id: \"58\", name: \"Concrete / Readymix / Cement\" },\r\n    { id: \"59\", name: \"Consulting / Management Consulting / Advisory Services\" },\r\n    { id: \"11\", name: \"Consumer Durables / Consumer Electronics\" },\r\n    { id: \"14\", name: \"Defence / Military / Government\" },\r\n    { id: \"15\", name: \"Education / Training / Teaching / Academics\" },\r\n    { id: \"60\", name: \"Elevators / Escalators\" },\r\n    { id: \"61\", name: \"Engineering Design & Consulting\" },\r\n    { id: \"62\", name: \"Entertainment / Recreation / Theme Parks\" },\r\n    { id: \"63\", name: \"Facilities Management\" },\r\n    { id: \"17\", name: \"Fertilizers / Pesticides\" },\r\n    { id: \"64\", name: \"Fitness / Wellness / Gym / Salon / Spa\" },\r\n    { id: \"12\", name: \"FMCG / Foods / Beverages\" },\r\n    { id: \"18\", name: \"Fresher - No Industry Experience / Not Employed\" },\r\n    { id: \"65\", name: \"Furniture / Furnishings / Home Décor\" },\r\n    { id: \"16\", name: \"General Trading / Export / Import\" },\r\n    { id: \"66\", name: \"Glass\" },\r\n    { id: \"19\", name: \"Gold / Gems & Jewellery\" },\r\n    { id: \"21\", name: \"Industrial Products / Heavy Machinery\" },\r\n    { id: \"22\", name: \"Insurance\" },\r\n    { id: \"23\", name: \"Internet / E-commerce / Dotcom\" },\r\n    { id: \"24\", name: \"IT - Hardware & Networking\" },\r\n    { id: \"67\", name: \"Landscaping\" },\r\n    { id: \"68\", name: \"Legal / Law Firm\" },\r\n    { id: \"13\", name: \"Logistics / Transportation / Warehousing / Courier\" },\r\n    { id: \"29\", name: \"Media / Publishing / TV / Radio / Outdoor / Digital\" },\r\n    { id: \"31\", name: \"Metals / Steel / Iron / Aluminium / Fabrication\" },\r\n    { id: \"69\", name: \"Metro / Railway / Train\" },\r\n    { id: \"54\", name: \"Mining / Forestry / Fishing\" },\r\n    { id: \"32\", name: \"NGO / Social Services / Community Services / Non-Profit \" },\r\n    { id: \"34\", name: \"Office Automation / Office Equipment / Office Supplies / Stationery \" },\r\n    { id: \"70\", name: \"Oil & Gas: Consultancy, Design, FEED\" },\r\n    { id: \"71\", name: \"Oil & Gas: Exploration, Drilling, Production, Field Services\" },\r\n    { id: \"72\", name: \"Oil & Gas: Refining, Storage, Marketing, Distribution\" },\r\n    { id: \"1000\", name: \"Other\" },\r\n    { id: \"35\", name: \"Paper / Paper Pulp / Paper Mill\" },\r\n    { id: \"73\", name: \"Perfumery / Toiletries / Personal Care / Cosmetics\" },\r\n    { id: \"37\", name: \"Pharma / Biotech / Clinical Research\" },\r\n    { id: \"38\", name: \"Plastics / Rubber\" },\r\n    { id: \"39\", name: \"Power Generation / Power Distribution / Energy / Nuclear Energy\" },\r\n    { id: \"40\", name: \"Printing / Packaging\" },\r\n    { id: \"41\", name: \"Real Estate\" },\r\n    { id: \"42\", name: \"Recruitment / Placement Firm / Executive Search\" },\r\n    { id: \"53\", name: \"Restaurants / Catering / Food Services\" },\r\n    { id: \"43\", name: \"Retail\" },\r\n    { id: \"45\", name: \"Security / Law Enforcement\" },\r\n    { id: \"74\", name: \"Shipbuilding / Ship Repair / Ship Maintenance / Drydocks\" },\r\n    { id: \"46\", name: \"Shipping / Freight\" },\r\n    { id: \"47\", name: \"Telecom / ISP\" },\r\n    { id: \"75\", name: \"Testing / Inspection / Certification Services\" },\r\n    { id: \"49\", name: \"Textiles  Clothing / Apparels / Fashion / Accessories\" },\r\n    { id: \"76\", name: \"Travel / Tourism\" },\r\n    { id: \"50\", name: \"Tyres\" },\r\n    { id: \"77\", name: \"Water Treatment / De-Salination / Waste Management\" }\r\n];\r\n\n\n//# sourceURL=webpack:///./src/Droope/data.ts?");

/***/ }),

/***/ "./src/Droope/display.observer.ts":
/*!****************************************!*\
  !*** ./src/Droope/display.observer.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass SelectDisplay {\r\n    constructor(subject, displayDecorationList = []) {\r\n        this.subject = subject;\r\n        this.subject.registerObserver(this);\r\n        // this.decorator = new SelectDisplayDecorator(subject);\r\n        this.displayDecorationList = displayDecorationList;\r\n    }\r\n    buildView(newData) {\r\n        const view = document.createElement(\"UL\");\r\n        newData.map((item) => {\r\n            const listItem = document.createElement(\"LI\");\r\n            listItem.textContent = item.name;\r\n            listItem.classList.add(\"selection-item\");\r\n            listItem.setAttribute(\"data-obj\", JSON.stringify(item));\r\n            view.appendChild(listItem);\r\n        });\r\n        return view;\r\n    }\r\n    update(newData) {\r\n        const { selection } = newData;\r\n        const view = this.buildView(selection);\r\n        // this.displayDecorationList.map(decorationName => {\r\n        //     view = this.decorator.add(view, decorationName);\r\n        // });\r\n        this.subject.displayElement.innerHTML = \"\";\r\n        this.subject.displayElement.appendChild(view);\r\n    }\r\n}\r\nexports.default = SelectDisplay;\r\n\n\n//# sourceURL=webpack:///./src/Droope/display.observer.ts?");

/***/ }),

/***/ "./src/Droope/droope.subject.ts":
/*!**************************************!*\
  !*** ./src/Droope/droope.subject.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass SelectBoxInput {\r\n    constructor(options) {\r\n        this.resultSet = {\r\n            list: [],\r\n            selection: [],\r\n            hasListUpdated: true\r\n        };\r\n        this.arrowCounter = -1;\r\n        this.noResultElement = document.createElement(\"p\");\r\n        this.dataSet = [];\r\n        this.listObserverCollection = [];\r\n        this.displayListOnFocus = false;\r\n        this.inputElement = options.inputElement;\r\n        this.displayElement = options.displayElement;\r\n        this.lisitingElement = options.lisitingElement;\r\n        this.selectLimit = options.selectLimit || 1;\r\n        this.displayListOnFocus = options.displayListOnFocus || false;\r\n        this.inputElement.addEventListener(\"keydown\", (e) => this.handleBackspace(e));\r\n        this.inputElement.addEventListener(\"keyup\", (e) => this.onKeyUp(e));\r\n        this.lisitingElement.addEventListener(\"click\", (e) => {\r\n            const target = e.target;\r\n            if (target) {\r\n                this.handleSelect(target);\r\n            }\r\n        });\r\n        if (this.displayListOnFocus === true) {\r\n            document.addEventListener(\"click\", (e) => this.handleDocumentBlur(e));\r\n            this.inputElement.addEventListener(\"focus\", (e) => this.handleListingDisplayStateOn(e.type));\r\n            // Close listing on initialization\r\n            this.handleListingDisplayStateOn(\"blur\");\r\n        }\r\n        if (options.noResultErrorMessage) {\r\n            this.noResultElement.classList.add(\"no-result\");\r\n            this.noResultElement.style.display = \"none\";\r\n            this.noResultElement.textContent = options.noResultErrorMessage || \"\";\r\n        }\r\n    }\r\n    handleDocumentBlur(e) {\r\n        try {\r\n            const target = e.target;\r\n            if (target) {\r\n                const hasClickedOnInput = this.inputElement === target;\r\n                const hasClickedOnListItem = target.classList ? target.classList.contains(\"list-item\") : false;\r\n                if (hasClickedOnListItem === false && hasClickedOnInput === false) {\r\n                    this.handleListingDisplayStateOn(\"blur\");\r\n                }\r\n            }\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    handleListingDisplayStateOn(eventType) {\r\n        this.lisitingElement.style.display = eventType === \"focus\" ? \"block\" : \"none\";\r\n    }\r\n    handleSelect(target) {\r\n        const selectedObjStr = target.getAttribute(\"data-obj\") || \"\";\r\n        const selectedObj = JSON.parse(selectedObjStr);\r\n        if (selectedObj) {\r\n            const selectionLimitExceeded = this.selectLimit > 1 ? this.resultSet.selection.length + 1 > this.selectLimit : false;\r\n            const isLastSelectionNow = this.resultSet.selection.length + 1 >= this.selectLimit;\r\n            const isDuplicate = this.resultSet.selection.filter((item) => item.id === selectedObj.id).length > 0;\r\n            if (selectedObj && isDuplicate === false) {\r\n                if (selectionLimitExceeded === false) {\r\n                    const selection = this.selectLimit === 1 ? [selectedObj] : [...this.resultSet.selection, selectedObj];\r\n                    const result = {\r\n                        hasListUpdated: false,\r\n                        list: [...this.resultSet.list],\r\n                        selection\r\n                    };\r\n                    this.setData(result);\r\n                }\r\n                if (isLastSelectionNow) {\r\n                    this.handleListingDisplayStateOn(\"blur\");\r\n                }\r\n            }\r\n        }\r\n    }\r\n    handleBackspace(e) {\r\n        const which = e.which;\r\n        const query = e.target.value.trim();\r\n        const isQueryEmpty = query === \"\";\r\n        if (which === 8) {\r\n            const lastIndexOfSelection = this.resultSet.selection.length - 1;\r\n            const lastId = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].id : null;\r\n            if (isQueryEmpty === true && lastId !== null) {\r\n                this.deleteSelection(lastId);\r\n                this.handleListingDisplayStateOn(\"focus\");\r\n            }\r\n        }\r\n    }\r\n    onKeyUp(e) {\r\n        const query = e && e.target && e.target.value ? e.target.value.trim() : \"\";\r\n        const which = e.which;\r\n        switch (which) {\r\n            case 9: { // Tab pressed\r\n                this.handleListingDisplayStateOn(\"blur\");\r\n                return;\r\n            }\r\n            // ENter\r\n            case 13: {\r\n                const listItem = this.lisitingElement.querySelector(\".active\");\r\n                if (listItem) {\r\n                    this.handleSelect(listItem);\r\n                }\r\n                return;\r\n            }\r\n            case 38: // Up arrow\r\n                this.handleArrow(\"up\");\r\n                return;\r\n            case 40: {\r\n                // Down arrow\r\n                this.handleArrow(\"down\");\r\n                return;\r\n            }\r\n            default: {\r\n                // Default filtering logic\r\n                const filteredList = this.dataSet.filter((item) => {\r\n                    const lowerItem = item.name.toLowerCase();\r\n                    const lowerQuery = query.toLowerCase();\r\n                    const includesSupported = Array.prototype.includes !== undefined;\r\n                    return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;\r\n                });\r\n                const hasResults = filteredList.length !== 0;\r\n                const result = {\r\n                    hasListUpdated: true,\r\n                    list: hasResults ? filteredList : this.dataSet,\r\n                    selection: [...this.resultSet.selection]\r\n                };\r\n                this.setData(result);\r\n                // Reset counter for arrow keys\r\n                this.arrowCounter = -1;\r\n                this.showNoResultMessage(hasResults);\r\n            }\r\n        }\r\n    }\r\n    showNoResultMessage(hasResults) {\r\n        try {\r\n            this.noResultElement.style.display = hasResults ? \"none\" : \"block\";\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    handleArrow(direction) {\r\n        try {\r\n            /** get list of all li items */\r\n            const listItems = this.lisitingElement.querySelectorAll(\"li\");\r\n            /** determine the direction */\r\n            const isGoingUp = direction === \"up\";\r\n            const isGoingDown = direction === \"down\";\r\n            if (isGoingDown === true) {\r\n                /** counter is by default at -1 for first selection i.e. index 0 */\r\n                const currentElement = listItems[this.arrowCounter + 1];\r\n                if (currentElement) {\r\n                    // add active class to\r\n                    currentElement.classList.add(\"active\");\r\n                    const prevElement = currentElement.previousElementSibling;\r\n                    if (prevElement) {\r\n                        prevElement.classList.remove(\"active\");\r\n                    }\r\n                }\r\n                if (this.arrowCounter < listItems.length - 1) {\r\n                    this.arrowCounter++;\r\n                }\r\n            }\r\n            if (isGoingUp === true) {\r\n                const currentElement = listItems[this.arrowCounter];\r\n                if (currentElement) {\r\n                    currentElement.classList.remove(\"active\");\r\n                    const prevElement = currentElement.previousElementSibling;\r\n                    if (prevElement) {\r\n                        prevElement.classList.add(\"active\");\r\n                    }\r\n                }\r\n                if (this.arrowCounter > -1) {\r\n                    this.arrowCounter--;\r\n                }\r\n            }\r\n            console.log(this.arrowCounter);\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    setData(newData) {\r\n        try {\r\n            // This logic executes when SelectBox is provided with the data first time\r\n            const isDataForFirstTime = newData.construct;\r\n            if (isDataForFirstTime) {\r\n                this.dataSet = newData.list;\r\n                newData.hasListUpdated = true;\r\n            }\r\n            this.resultSet = {\r\n                list: newData.list || [],\r\n                selection: newData.selection || [],\r\n                hasListUpdated: newData.hasListUpdated\r\n            };\r\n            this.notifyObservers();\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    registerObserver(o) {\r\n        try {\r\n            this.listObserverCollection.push(o);\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    unregisterObserver(o) {\r\n        try {\r\n            const index = this.listObserverCollection.indexOf(o);\r\n            this.listObserverCollection.splice(index, 1);\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    notifyObservers() {\r\n        try {\r\n            for (const observer of this.listObserverCollection) {\r\n                observer.update(this.resultSet);\r\n            }\r\n        }\r\n        catch (err) {\r\n            console.warn(err.message);\r\n        }\r\n    }\r\n    deleteSelection(id) {\r\n        const result = {\r\n            hasListUpdated: false,\r\n            list: [...this.resultSet.list],\r\n            selection: [...this.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]\r\n        };\r\n        this.setData(result);\r\n    }\r\n}\r\nexports.default = SelectBoxInput;\r\n\n\n//# sourceURL=webpack:///./src/Droope/droope.subject.ts?");

/***/ }),

/***/ "./src/Droope/index.ts":
/*!*****************************!*\
  !*** ./src/Droope/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst droope_subject_1 = __importDefault(__webpack_require__(/*! ./droope.subject */ \"./src/Droope/droope.subject.ts\"));\r\nconst lisiting_observer_1 = __importDefault(__webpack_require__(/*! ./lisiting.observer */ \"./src/Droope/lisiting.observer.ts\"));\r\nconst display_observer_1 = __importDefault(__webpack_require__(/*! ./display.observer */ \"./src/Droope/display.observer.ts\"));\r\nconst Droope = (options, data) => {\r\n    const SelectBox = new droope_subject_1.default(options);\r\n    new lisiting_observer_1.default(SelectBox);\r\n    new display_observer_1.default(SelectBox, options.displayDecorationList);\r\n    SelectBox.setData({ list: data, construct: true, hasListUpdated: false, selection: [] });\r\n    return SelectBox;\r\n};\r\nexports.default = Droope;\r\n\n\n//# sourceURL=webpack:///./src/Droope/index.ts?");

/***/ }),

/***/ "./src/Droope/lisiting.observer.ts":
/*!*****************************************!*\
  !*** ./src/Droope/lisiting.observer.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Listing {\r\n    constructor(subject) {\r\n        this.subject = subject;\r\n        this.subject.registerObserver(this);\r\n    }\r\n    generateAndAppendList(newData) {\r\n        const ulElement = document.createElement(\"UL\");\r\n        newData.list.forEach((item) => {\r\n            const liElement = document.createElement(\"LI\");\r\n            liElement.textContent = item.name;\r\n            liElement.classList.add(\"list-item\");\r\n            liElement.setAttribute(\"data-obj\", JSON.stringify(item));\r\n            ulElement.appendChild(liElement);\r\n        });\r\n        if (this.subject.lisitingElement) {\r\n            this.subject.lisitingElement.innerHTML = \"\";\r\n            this.subject.lisitingElement.appendChild(this.subject.noResultElement);\r\n            this.subject.lisitingElement.appendChild(ulElement);\r\n        }\r\n        return ulElement;\r\n    }\r\n    update(newData) {\r\n        if (newData.hasListUpdated) {\r\n            this.generateAndAppendList(newData);\r\n        }\r\n    }\r\n}\r\nexports.default = Listing;\r\n\n\n//# sourceURL=webpack:///./src/Droope/lisiting.observer.ts?");

/***/ }),

/***/ "./src/Suggester/index.ts":
/*!********************************!*\
  !*** ./src/Suggester/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\n\n//# sourceURL=webpack:///./src/Suggester/index.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst data_1 = __importDefault(__webpack_require__(/*! ./Droope/data */ \"./src/Droope/data.ts\"));\r\nconst Droope_1 = __importDefault(__webpack_require__(/*! ./Droope */ \"./src/Droope/index.ts\"));\r\n__webpack_require__(/*! ./Suggester */ \"./src/Suggester/index.ts\");\r\n(() => {\r\n    const inputElement = document.querySelector(\".select-box-input\");\r\n    const lisitingElement = document.querySelector(\".select-box-listing\");\r\n    const displayElement = document.querySelector(\".select-box-display\");\r\n    if (inputElement && lisitingElement && displayElement) {\r\n        const options = {\r\n            inputElement,\r\n            lisitingElement,\r\n            displayElement,\r\n            selectLimit: 3,\r\n            displayListOnFocus: true,\r\n            displayDecorationList: [\"chips\"],\r\n            noResultErrorMessage: \"Sorry no result\"\r\n        };\r\n        const DroopeInstance = Droope_1.default(options, data_1.default);\r\n        console.log(DroopeInstance);\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ })

/******/ });