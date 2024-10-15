import { BoardGamesTypes } from "./enums"

type BoardGameID = string

/* Board Game interface */
export interface BoardGame {
  id?: BoardGameID
  name: string
  releaseYear: number
  max_players: number
  min_players: number
  baseGame?: BoardGameID
  standalone?: boolean
  publisher: string
  expansions?: { id: string; name: string }[]
  type: BoardGamesTypes
}
