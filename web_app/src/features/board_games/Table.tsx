import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  deleteBoardGame,
  selectFilteredBoardGames,
  selectSortDirection,
  selectSortField,
  selectStatus,
  sortBoardGames,
  updateModalType,
} from "./slice"
import {
  BoardGamesTypes,
  DataFetchStatus,
  ModalTypes,
  SortDirections,
} from "./enums"
import { LuTrash2, LuPencil } from "react-icons/lu"
import { FaSort } from "react-icons/fa"
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md"

const Table = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const sort_field = useAppSelector(selectSortField)
  const sort_direction = useAppSelector(selectSortDirection)
  const filtered_board_games = useAppSelector(selectFilteredBoardGames)

  if (status === DataFetchStatus.LOADING) {
    return <div className="flex justify-center py-8">Loading</div>
  }

  if (status === DataFetchStatus.IDLE && filtered_board_games.length === 0) {
    return (
      <div className="flex justify-center py-8">No board games were found.</div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:grid grid-cols-9 bg-white sticky top-[68px]">
        <div className="grid grid-cols-7 col-span-7 col-start-2 items-center py-4 text-base">
          <div className="col-span-1 flex justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("name"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Name
              {/* change icon based on current sort field and direction */}
              {sort_field !== "name" && <FaSort />}
              {sort_field === "name" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "name" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("releaseYear"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Release Year
              {/* change icon based on current sort field and direction */}
              {sort_field !== "releaseYear" && <FaSort />}
              {sort_field === "releaseYear" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "releaseYear" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("publisher"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Publisher
              {/* change icon based on current sort field and direction */}
              {sort_field !== "publisher" && <FaSort />}
              {sort_field === "publisher" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "publisher" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className="col-span-1 flex flex-1 flex-col items-center">
            <div>
              <p className="font-semibold">Players</p>
            </div>
            <div className="flex w-full">
              <div className="flex flex-1 justify-center">
                <button
                  onClick={() => dispatch(sortBoardGames("max_players"))}
                  className="flex items-center gap-2 font-semibold hover:text-main-color"
                >
                  Max
                  {sort_field !== "max_players" && <FaSort />}
                  {sort_field === "max_players" &&
                    sort_direction === SortDirections.ASCENDING && (
                      <MdOutlineKeyboardArrowUp />
                    )}
                  {sort_field === "max_players" &&
                    sort_direction === SortDirections.DESCENDING && (
                      <MdOutlineKeyboardArrowDown />
                    )}
                </button>
              </div>
              <div className="flex flex-1 justify-center">
                <button
                  onClick={() => dispatch(sortBoardGames("min_players"))}
                  className="flex items-center gap-2 font-semibold hover:text-main-color"
                >
                  Min
                  {sort_field !== "min_players" && <FaSort />}
                  {sort_field === "min_players" &&
                    sort_direction === SortDirections.ASCENDING && (
                      <MdOutlineKeyboardArrowUp />
                    )}
                  {sort_field === "min_players" &&
                    sort_direction === SortDirections.DESCENDING && (
                      <MdOutlineKeyboardArrowDown />
                    )}
                </button>
              </div>
            </div>
          </div>
          {/* Neither expansions nor standalone fields are sortable */}
          <div className="col-span-1 flex justify-center">
            <p className="font-semibold">Expansions</p>
          </div>
          <div className="col-span-1 flex justify-center">
            <p className="font-semibold">Standalone</p>
          </div>
        </div>
      </div>
      {filtered_board_games.map((board_game, idx) => (
        <div
          key={board_game.id}
          className={`${idx % 2 ? "bg-main-color/10" : "bg-main-color/5"} hidden lg:grid grid-cols-9`}
        >
          <div className="grid grid-cols-7 col-span-7 col-start-2 items-center py-5 text-sm">
            <div className="col-span-1 flex justify-center text-center items-center">
              {board_game.name}
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {board_game.releaseYear || "-"}
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {board_game.publisher || "-"}
            </div>
            <div className="col-span-1 flex items-center">
              <div className="flex flex-1 justify-center">
                {board_game.max_players || "-"}
              </div>
              <div className="flex flex-1 justify-center">
                {board_game.min_players || "-"}
              </div>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center">
              {board_game.expansions?.map(expansion => (
                <div
                  className="flex justify-center items-center text-center"
                  key={expansion.id}
                >
                  {expansion.name}
                </div>
              ))}
            </div>
            <div className="col-span-1 flex justify-center">
              {board_game.type === BoardGamesTypes.EXPANSION
                ? board_game.standalone
                  ? "Yes"
                  : "No"
                : "-"}
            </div>
            <div className="col-span-1 flex gap-2 justify-center">
              {/* Opens model in edition mode */}
              <button
                onClick={() =>
                  dispatch(
                    updateModalType({
                      type: ModalTypes.EDIT,
                      id: board_game.id,
                    }),
                  )
                }
                className="p-2 hover:text-main-color"
              >
                <LuPencil size={20} />
              </button>
              {/* Deletes board game */}
              <button
                onClick={() => dispatch(deleteBoardGame(board_game.id))}
                className="p-2 hover:text-red-700"
              >
                <LuTrash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* Mobile Table */}
      <div className="lg:hidden grid auto-cols-auto h-full text-xs grid-flow-col overflow-x-auto">
        <div className="col-span-1 min-w-[80px] max-w-[80px] flex flex-col">
          <div className="flex flex-1 justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("name"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Name
              {/* change icon based on current sort field and direction */}
              {sort_field !== "name" && <FaSort />}
              {sort_field === "name" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "name" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("releaseYear"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Release
              <br />
              Year
              {/* change icon based on current sort field and direction */}
              {sort_field !== "releaseYear" && <FaSort />}
              {sort_field === "releaseYear" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "releaseYear" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className=" flex-1  flex justify-center">
            <button
              onClick={() => dispatch(sortBoardGames("publisher"))}
              className="flex items-center gap-2 font-semibold hover:text-main-color"
            >
              Publisher
              {/* change icon based on current sort field and direction */}
              {sort_field !== "publisher" && <FaSort />}
              {sort_field === "publisher" &&
                sort_direction === SortDirections.ASCENDING && (
                  <MdOutlineKeyboardArrowUp />
                )}
              {sort_field === "publisher" &&
                sort_direction === SortDirections.DESCENDING && (
                  <MdOutlineKeyboardArrowDown />
                )}
            </button>
          </div>
          <div className="flex flex-1">
            <div className="flex items-center">
              <p className="font-semibold -rotate-90">Players</p>
            </div>
            <div className="flex flex-col justify-between ">
              <div className="flex flex-1 justify-center">
                <button
                  onClick={() => dispatch(sortBoardGames("max_players"))}
                  className="flex items-center gap-2 font-semibold hover:text-main-color"
                >
                  Max
                  {/* change icon based on current sort field and direction */}
                  {sort_field !== "max_players" && <FaSort />}
                  {sort_field === "max_players" &&
                    sort_direction === SortDirections.ASCENDING && (
                      <MdOutlineKeyboardArrowUp />
                    )}
                  {sort_field === "max_players" &&
                    sort_direction === SortDirections.DESCENDING && (
                      <MdOutlineKeyboardArrowDown />
                    )}
                </button>
              </div>
              <div className="flex flex-1 justify-center">
                <button
                  onClick={() => dispatch(sortBoardGames("min_players"))}
                  className="flex items-center gap-2 font-semibold hover:text-main-color"
                >
                  Min
                  {/* change icon based on current sort field and direction */}
                  {sort_field !== "min_players" && <FaSort />}
                  {sort_field === "min_players" &&
                    sort_direction === SortDirections.ASCENDING && (
                      <MdOutlineKeyboardArrowUp />
                    )}
                  {sort_field === "min_players" &&
                    sort_direction === SortDirections.DESCENDING && (
                      <MdOutlineKeyboardArrowDown />
                    )}
                </button>
              </div>
            </div>
          </div>
          {/* Neither expansions nor standalone fields are sortable */}
          <div className=" flex-1  flex items-center justify-center">
            <p className="font-semibold">Expansions</p>
          </div>
          <div className=" flex-1 flex items-center justify-center">
            <p className="font-semibold">Standalone</p>
          </div>
          <div className=" flex-1 flex items-center justify-center" />
        </div>
        {filtered_board_games.map((board_game, idx) => (
          <div
            key={board_game.id}
            className={`${idx % 2 ? "bg-main-color/10" : "bg-main-color/5"} min-w-[80px]  max-w-[80px] col-span-1 flex flex-1 flex-col`}
          >
            <div className="flex flex-1 justify-center text-center items-center px-2">
              {board_game.name}
            </div>
            <div className="flex flex-1 justify-center text-center items-center px-2">
              {board_game.releaseYear || "-"}
            </div>
            <div className="flex flex-1 justify-center text-center items-center px-2">
              {board_game.publisher || "-"}
            </div>
            <div className="flex flex-1 flex-col justify-center text-center items-center px-2">
              <div className="flex flex-1 items-center justify-center">
                {board_game.max_players || "-"}
              </div>
              <div className="flex flex-1 items-center justify-center">
                {board_game.min_players || "-"}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center text-center items-center px-2">
              {board_game.expansions?.map(expansion => (
                <div
                  className="flex justify-center items-center text-center"
                  key={expansion.id}
                >
                  {expansion.name}
                </div>
              ))}
            </div>
            <div className="flex flex-1 flex-col justify-center text-center items-center px-2">
              {board_game.type === BoardGamesTypes.EXPANSION
                ? board_game.standalone
                  ? "Yes"
                  : "No"
                : "-"}
            </div>
            <div className="flex flex-1 justify-center text-center items-center px-2">
              {/* Opens modal in edition mode*/}
              <button
                onClick={() =>
                  dispatch(
                    updateModalType({
                      type: ModalTypes.EDIT,
                      id: board_game.id,
                    }),
                  )
                }
                className="p-2 hover:text-main-color"
              >
                <LuPencil size={20} />
              </button>
              {/* Deletes board game */}
              <button
                onClick={() => dispatch(deleteBoardGame(board_game.id))}
                className="p-2 hover:text-red-700"
              >
                <LuTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Table
