import { TSubject, TObserver, TState } from "./interface";
class Listing implements TObserver {
  private subject: TSubject

  constructor (subject: TSubject) {
      this.subject = subject;
      this.subject.registerObserver(this);
  }

  public generateAndAppendList (newData: TState): HTMLElement {
      const ulElement: HTMLElement = document.createElement("UL");

      newData.list.forEach((item) => {
          const liElement: HTMLElement = document.createElement("LI");
          if (item && item.name && item.displayTextEn) {
              liElement.textContent = item.name || item.displayTextEn;
          }
          liElement.setAttribute("data-obj", JSON.stringify(item));
          ulElement.appendChild(liElement);
      });
      this.appendListingItems(this.subject.listingElement, ulElement);

      return ulElement;
  }

  public appendListingItems (listingElement: HTMLElement, ulElement: HTMLElement): void {
    try {
       if (listingElement) {
          listingElement.innerHTML = "";
          listingElement.appendChild(this.subject.noResultElement);
          listingElement.appendChild(this.subject.headingElement);
          listingElement.appendChild(ulElement);
        } else {
            throw new Error("Listing element not being passed in the function");
        }
    } catch (e) {
        console.warn("Listing item not being passed in the function:", e);
    }
  }

  public update (newData: TState): void {
      if (newData.hasListUpdated) {
          this.generateAndAppendList(newData);
      }
  }
}

export default Listing;
