/* Possible board game types */
export enum BoardGamesTypes {
  BASE_GAME = "BaseGame",
  EXPANSION = "Expansion",
}

/* Possible sort directions */
export enum SortDirections {
  ASCENDING,
  DESCENDING,
}

/* Data fetch status possible values */
export enum DataFetchStatus {
  IDLE,
  LOADING,
  FAILED,
}

/* Modal modes */
export enum ModalTypes {
  NONE,
  ADD,
  EDIT,
  DELETE
}