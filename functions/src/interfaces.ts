/* possible board games types */
enum BoardGamesType {
  BASE_GAME = "BaseGame",
  EXPANSION = "Expansion",
}

type BoardGameID = string;

/* board game interface */
export interface BoardGame {
  id: BoardGameID;
  name: string;
  releaseYear: number;
  players: {
    min: number;
    max: number;
  };
  baseGame?: BoardGameID;
  standalone?: boolean;
  publisher: string;
  expansions?: string[];
  type: BoardGamesType;
}
