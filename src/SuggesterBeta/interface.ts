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

interface TSugOptions {
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
  vertical?: string;
  keywords?: string;
  category?: string;
  relatedConceptCategory?: string;
}


interface TSugConfig {
  readonly source: string;
  readonly category: string;
  readonly maxSuggestions: number;
  readonly specialCharactersAllowedList: string[] | RegExp;
  readonly edge: number;
  readonly invoker: string;
  readonly version: string;
  readonly urls: { [keys: string]: string };
  readonly storageKey: { [keys: string]: string };
  readonly appId: number;
  readonly domId: string;
  readonly inputElement: HTMLInputElement | null;
  readonly listingElement: HTMLElement | null;
  readonly displayElement: HTMLElement | null;
  readonly selectLimit?: number;
  readonly displayListOnFocus?: boolean;
  readonly displayDecorationList?: string[];
  readonly noResultErrorMessage?: string;
  readonly tagSelectedValues: boolean;
  readonly listLimit?: number;
  readonly checkboxes?: boolean;
  readonly sanitiseString?: boolean;
  readonly isPrefetch?: boolean;
  readonly displayListStyle?: string;
  headingElement?: HTMLElement | null;
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
  TObject,
  TSugConfig
};