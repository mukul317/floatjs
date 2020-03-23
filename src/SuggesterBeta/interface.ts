interface TData {
  id: number;
  name: string;
  displayTextEn?: string;
}

interface TSubject {
  listingElement: HTMLElement;
  displayElement: HTMLElement;
  noResultElement: HTMLElement;
  headingElement: HTMLElement;
  displayListStyle: string;
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
  construct?: boolean;
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

interface TSugOptions{
  inputElement: HTMLInputElement;
  listingElement: HTMLElement;
  displayElement: HTMLElement;
  selectLimit?: number;
  displayListOnFocus?: boolean;
  displayDecorationList?: string[];
  selectedDecorator: string;
  noResultErrorMessage?: string;
  displayListStyle?: string;
  sanitiseString?: boolean;
  specialCharactersAllowedList: string[];
  isPrefetch?: boolean;
  vertical? : string;
  keywords? : string;
  category?: string;
  relatedConceptCategory?: string;
}
interface TSuggesterResponse extends TResponse {
  resultList: any;
}

interface TRecentSearchResponse extends TResponse {
  resultConcepts: any;
}

interface TResponse {
  [key: string]: any;
  resultConcepts: any;
  resultList: any;
}

type TObject = Record<string, string>

interface TVersionResponse {
  "suggester_v": string;
  "prefetch_v": string;
  "autocorrect_v": string;
  "relatedconcepts_v": string;
}

export {
    TData,
    TSubject,
    TState,
    TObserver,
    TResponse,
    TSuggesterResponse,
    TPayload,
    TRecentSearchResponse,
    TSugOptions,
    TVersionResponse,
    TObject
};
