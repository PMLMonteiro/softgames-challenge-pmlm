import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { AppThunk, RootState } from "../../app/store"

import { AppFlowStates } from "./enums"
import { getBoardGames } from "../board_games/slice"

export interface FlowState {
  flow_state: AppFlowStates
}

const initialState: FlowState = {
  flow_state: AppFlowStates.GET_BOARD_GAMES,
}

export const flowSlice = createAppSlice({
  name: "flow",
  initialState,
  reducers: create => ({
    /* updates the current state of the app */
    updateFlowState: create.reducer(
      (state, action: PayloadAction<AppFlowStates>) => {
        state.flow_state = action.payload
      },
    ),
  }),
  selectors: {
    selectFlowState: state => state.flow_state,
  },
})

export const { updateFlowState } = flowSlice.actions

export const { selectFlowState } = flowSlice.selectors

export const checkBoardGames = (): AppThunk => (dispatch, getState) => {
  const flow_state = selectFlowState(getState() as RootState)
  /* only check board games if app state is currently set for getting board games */
  if (flow_state === AppFlowStates.GET_BOARD_GAMES) {
    dispatch(getBoardGames())
    dispatch(updateFlowState(AppFlowStates.READY))
  }
}
