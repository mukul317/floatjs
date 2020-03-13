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
      if (this.subject.lisitingElement) {
          this.subject.lisitingElement.innerHTML = "";
          this.subject.lisitingElement.appendChild(this.subject.noResultElement);
          this.subject.lisitingElement.appendChild(ulElement);
      }

      return ulElement;
  }

  public update (newData: TState): void {
      if (newData.hasListUpdated) {
          this.generateAndAppendList(newData);
      }
  }
}

export default Listing;
