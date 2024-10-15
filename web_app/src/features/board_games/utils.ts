import { BoardGame } from "./interfaces"
import { BoardGamesTypes, SortDirections } from "./enums"

/* Utility function to naturally sort strings using numeric values */
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
})

/* Utility function to reset board game data */
const clearBoardGame = () => ({
  name: "",
  publisher: "",
  releaseYear: new Date().getFullYear(),
  max_players: 20,
  min_players: 1,
  type: BoardGamesTypes.BASE_GAME,
  baseGame: "-1",
  standalone: true,
})

/* Utility function to sort board games based on field and direction */
const sorter = (
  to_sort: BoardGame[],
  field: keyof BoardGame | "none",
  sort_direction: SortDirections,
) => {
  const temp = [...to_sort]

  /* if there is a field selected */
  if (field !== "none") {
    temp.sort((a, b) =>
      /* if we are sorting ascending */
      sort_direction === SortDirections.ASCENDING
        ? collator.compare(
            (a[field] || "-") as string,
            (b[field] || "-") as string,
          )
        : /* if we sorting descending */
          collator.compare(
            (b[field] || "-") as string,
            (a[field] || "-") as string,
          ),
    )
  }
  return temp
}

export { sorter, clearBoardGame }
