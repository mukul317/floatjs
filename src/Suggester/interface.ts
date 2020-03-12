interface TData {
  id: number;
  name: string;
  displayTextEn?: string;
}

interface TSubject {
  lisitingElement: HTMLElement;
  displayElement: HTMLElement;
  noResultElement: HTMLElement;
  arrowCounter: number;
  resultSet: TState;
  registerObserver(o: TObserver): void;
  unregisterObserver(o: TObserver): void;
  notifyObservers(): void;
  deleteSelection(id: string): void;
  setData(data: TState): void;
}

interface TState {
  list: TData[];
  selection: TData[];
  hasListUpdated: boolean;
}

interface TObserver {
  update(arrayOfObjects: TState): void;
}
interface TPayload {
  query: string;
  category: any;
  vertical?: string;
  source?: string;
  appId?: string;
  edge?: number;
}

interface TOptions {
  inputElement: HTMLInputElement;
  lisitingElement: HTMLElement;
  displayElement: HTMLElement;
  selectLimit?: number;
  displayListOnFocus?: boolean;
  displayDecorationList?: string[];
  noResultErrorMessage?: string;
}

interface TSuggesterResponse {
  resultList: any;
}

interface TRecentSearchResponse {
  resultConcepts: any;
}

interface TResponse {
  any: any;
}

export { TData, TSubject, TState, TObserver, TOptions, TResponse, TSuggesterResponse, TPayload, TRecentSearchResponse };
