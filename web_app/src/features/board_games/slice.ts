import { createSelector, PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

import * as api from "./api"
import { BoardGame } from "./interfaces"
import {
  BoardGamesTypes,
  DataFetchStatus,
  ModalTypes,
  SortDirections,
} from "./enums"
import { clearBoardGame, sorter } from "./utils"
import { RootState } from "../../app/store"

/* This slice interface */
export interface BoardGamesState {
  sort_field: keyof BoardGame | "none"
  sort_direction: SortDirections
  board_games: BoardGame[]
  filtered_board_games: BoardGame[]
  status: DataFetchStatus
  current_board_game: BoardGame
  modal_type: ModalTypes
  search_query: string
}
/* This slice intial state */
const initialState: BoardGamesState = {
  /* existing board games */
  board_games: [],
  /* current search query */
  search_query: "",
  /* current sort field */
  sort_field: "none",
  /* current board game being edited/created */
  current_board_game: {
    name: "",
    publisher: "",
    releaseYear: new Date().getFullYear(),
    max_players: 20,
    min_players: 1,
    type: BoardGamesTypes.BASE_GAME,
    baseGame: "-1",
    standalone: true,
  },
  /* board games filtered by the search query  */
  filtered_board_games: [],
  /* current modal mode */
  modal_type: ModalTypes.NONE,
  /* current slice status */
  status: DataFetchStatus.IDLE,
  /* current sort direction */
  sort_direction: SortDirections.ASCENDING,
}

export const boardGamesSlice = createAppSlice({
  name: "boardGames",
  initialState,
  reducers: create => ({
    /* resets all filters and sorts */
    resetFilters: create.reducer(state => {
      state.sort_direction = SortDirections.ASCENDING
      state.sort_field = "none"
      state.search_query = ""
      state.filtered_board_games = [...state.board_games]
    }),
    /* updates current search query */
    updateSearchQuery: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.search_query = action.payload
      },
    ),
    /* updates current modal type */
    updateModalType: create.reducer(
      (state, action: PayloadAction<{ type: ModalTypes; id?: string }>) => {
        const { type, id } = action.payload
        state.modal_type = type
        /* specific case of edition */
        if (id) {
          state.current_board_game =
            state.filtered_board_games.find(
              board_game => board_game.id === id,
            ) || clearBoardGame()
        }
        if (type === ModalTypes.NONE) {
          state.current_board_game = clearBoardGame()
        }
      },
    ),
    /* update current board game  */
    updateCurrentBoardGame: create.reducer(
      (
        state,
        action: PayloadAction<{
          field: keyof BoardGame
          value: number | string | boolean
        }>,
      ) => {
        const { field, value } = action.payload
        state.current_board_game = {
          ...state.current_board_game,
          [field]: value,
        }
      },
    ),
    /* sort board games */
    sortBoardGames: create.reducer(
      (state, action: PayloadAction<keyof BoardGame>) => {
        const field = action.payload
        if (field !== "expansions") {
          if (field !== state.sort_field) {
            state.sort_field = field
            state.sort_direction = SortDirections.ASCENDING
          } else {
            state.sort_direction =
              state.sort_direction === SortDirections.ASCENDING
                ? SortDirections.DESCENDING
                : SortDirections.ASCENDING
          }
          state.filtered_board_games = sorter(
            state.filtered_board_games,
            field,
            state.sort_direction,
          )
        }
      },
    ),
    /* filter board games */
    filterBoardGames: create.reducer((state, action: PayloadAction<string>) => {
      state.search_query = action.payload
      state.filtered_board_games = state.board_games.filter(board_game =>
        board_game.name.toLowerCase().includes(action.payload.toLowerCase()),
      )
      /* after filtering, sort */
      state.filtered_board_games = sorter(
        state.filtered_board_games,
        state.sort_field,
        state.sort_direction,
      )
    }),
    /* get current board games */
    getBoardGames: create.asyncThunk(async () => await api.board_games.get(), {
      pending: state => {
        state.status = DataFetchStatus.LOADING
      },
      fulfilled: (state, action) => {
        state.status = DataFetchStatus.IDLE
        state.board_games = [...action.payload]
        state.filtered_board_games = [...action.payload]
      },
      rejected: state => {
        state.status = DataFetchStatus.FAILED
      },
    }),
    /* add a new board game */
    addBoardGame: create.asyncThunk(
      async (_, { getState }) => {
        const current_board_game: BoardGame = selectCurrentBoardGame(
          getState() as RootState,
        )
        await api.board_games.add(current_board_game)
        /* after modifying board games list, update frontend */
        const board_games = await api.board_games.get()
        return { board_games }
      },
      {
        pending: state => {
          state.status = DataFetchStatus.LOADING
        },
        fulfilled: (state, action) => {
          // the updated board_games
          const { board_games } = action.payload
          state.status = DataFetchStatus.IDLE
          state.modal_type = ModalTypes.NONE
          state.current_board_game = clearBoardGame()
          state.board_games = [...board_games]
          state.filtered_board_games = [...board_games]
          if (state.search_query !== "") {
            state.filtered_board_games = state.board_games.filter(board_game =>
              board_game.name.toLowerCase().includes(state.search_query),
            )
          }
          state.filtered_board_games = sorter(
            state.filtered_board_games,
            state.sort_field,
            state.sort_direction,
          )
        },
        rejected: state => {
          state.status = DataFetchStatus.FAILED
        },
      },
    ),
    /* edit a board game */
    editBoardGame: create.asyncThunk(
      async (_, { getState }) => {
        const current_board_game: BoardGame = selectCurrentBoardGame(
          getState() as RootState,
        )
        await api.board_games.update(current_board_game)
        /* after modifying board games list, update frontend */
        const board_games = await api.board_games.get()
        return { board_games }
      },
      {
        pending: state => {
          state.status = DataFetchStatus.LOADING
        },
        fulfilled: (state, action) => {
          // the updated board_games
          const { board_games } = action.payload
          state.status = DataFetchStatus.IDLE
          state.modal_type = ModalTypes.NONE
          state.current_board_game = clearBoardGame()
          state.board_games = [...board_games]
          state.filtered_board_games = [...board_games]
          if (state.search_query !== "") {
            state.filtered_board_games = state.board_games.filter(board_game =>
              board_game.name.toLowerCase().includes(state.search_query),
            )
          }
          state.filtered_board_games = sorter(
            state.filtered_board_games,
            state.sort_field,
            state.sort_direction,
          )
        },
        rejected: state => {
          state.status = DataFetchStatus.FAILED
        },
      },
    ),
    /* delete a board game  */
    deleteBoardGame: create.asyncThunk(
      async (id: string | undefined) => {
        await api.board_games.delete(id)
        /* after modifying board games list, update frontend */
        const board_games = await api.board_games.get()
        return { board_games }
      },
      {
        pending: state => {
          state.status = DataFetchStatus.LOADING
        },
        fulfilled: (state, action) => {
          // the updated board_games
          const { board_games } = action.payload
          state.status = DataFetchStatus.IDLE
          state.board_games = [...board_games]
          state.filtered_board_games = [...board_games]
          if (state.search_query !== "") {
            state.filtered_board_games = state.board_games.filter(board_game =>
              board_game.name.toLowerCase().includes(state.search_query),
            )
          }
          state.filtered_board_games = sorter(
            state.filtered_board_games,
            state.sort_field,
            state.sort_direction,
          )
        },
        rejected: state => {
          state.status = DataFetchStatus.FAILED
        },
      },
    ),
  }),
  selectors: {
    selectStatus: state => state.status,
    selectModalType: state => state.modal_type,
    selectSortField: state => state.sort_field,
    selectBoardGames: state => state.board_games,
    selectSearchQuery: state => state.search_query,
    selectSortDirection: state => state.sort_direction,
    selectCurrentBoardGame: state => state.current_board_game,
    selectFilteredBoardGames: state => state.filtered_board_games,
  },
})

export const {
  addBoardGame,
  resetFilters,
  editBoardGame,
  getBoardGames,
  sortBoardGames,
  updateModalType,
  deleteBoardGame,
  filterBoardGames,
  updateSearchQuery,
  updateCurrentBoardGame,
} = boardGamesSlice.actions

export const selectBaseGamesOnly = createSelector(
  [boardGamesSlice.selectors.selectFilteredBoardGames],
  filtered_board_games =>
    filtered_board_games.filter(
      board_game => board_game.type === BoardGamesTypes.BASE_GAME,
    ),
)

export const {
  selectStatus,
  selectModalType,
  selectSortField,
  selectBoardGames,
  selectSearchQuery,
  selectSortDirection,
  selectCurrentBoardGame,
  selectFilteredBoardGames,
} = boardGamesSlice.selectors
