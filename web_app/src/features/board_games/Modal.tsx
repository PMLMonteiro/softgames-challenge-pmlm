import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addBoardGame,
  editBoardGame,
  selectBaseGamesOnly,
  selectCurrentBoardGame,
  selectModalType,
  updateCurrentBoardGame,
  updateModalType,
} from "./slice"
import { BoardGamesTypes, ModalTypes } from "./enums"
import { IoCloseSharp } from "react-icons/io5"

const Modal = () => {
  const dispatch = useAppDispatch()
  const modalType = useAppSelector(selectModalType)
  const base_games = useAppSelector(selectBaseGamesOnly)
  const current_board_game = useAppSelector(selectCurrentBoardGame)

  /* Perform specific action depending on current mode */
  const handleActionClick = () => {
    if (modalType === ModalTypes.ADD) {
      dispatch(addBoardGame())
    }
    if (modalType === ModalTypes.EDIT) {
      dispatch(editBoardGame())
    }
  }

  return (
    <div
      /* closes modal */
      onClick={() => dispatch(updateModalType({ type: ModalTypes.NONE }))}
      className={`${modalType !== ModalTypes.NONE ? "block" : "hidden"} fixed z-10 left-0 top-0 w-screen h-screen bg-opacity-40 bg-black`}
    >
      <div className="w-screen h-screen flex justify-center items-center">
        <div
          onClick={e => e.stopPropagation()}
          className="rounded-md flex flex-col bg-white w-[500px] p-4"
        >
          <div className="w-full flex justify-between items-center p-2">
            <p className="font-semibold text-base">
              {modalType === ModalTypes.ADD && "Add a new board game"}
              {modalType === ModalTypes.EDIT && "Edit board game"}
            </p>
            <button
              /* closes modal */
              onClick={() =>
                dispatch(updateModalType({ type: ModalTypes.NONE }))
              }
              className="hover:text-main-color p-2 bg-main-color/10 rounded-md"
            >
              <IoCloseSharp size={20} />
            </button>
          </div>
          <div className="h-[1px] w-full bg-main-color" />
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                /* update current board game on specific field with value */
                onChange={e =>
                  dispatch(
                    updateCurrentBoardGame({
                      field: "name",
                      value: e.target.value,
                    }),
                  )
                }
                value={current_board_game.name}
                className="px-2 py-1 bg-main-color/10 text-sm rounded-md outline-main-color"
              />
            </div>
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-6 flex flex-col gap-2">
                <label htmlFor="publisher" className="text-sm">
                  Publisher
                </label>
                <input
                  type="text"
                  id="publisher"
                  /* update current board game on specific field with value */
                  onChange={e =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "publisher",
                        value: e.target.value,
                      }),
                    )
                  }
                  value={current_board_game.publisher}
                  className="px-2 py-1 bg-main-color/10 text-sm rounded-md outline-main-color"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-2">
                <label htmlFor="release_year" className="text-sm">
                  Release Year
                </label>
                <input
                  type="number"
                  id="release_year"
                  min="1900"
                  /* update current board game on specific field with value */
                  onChange={e =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "releaseYear",
                        value: parseInt(e.target.value),
                      }),
                    )
                  }
                  value={current_board_game.releaseYear}
                  max={new Date().getFullYear()}
                  className="px-2 py-1 bg-main-color/10 text-sm rounded-md outline-main-color"
                />
              </div>
            </div>
            {/* A slider would probably be a better design */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-5 flex flex-col gap-2">
                <label htmlFor="max_players" className="text-sm">
                  Max. Players
                </label>
                <input
                  type="number"
                  id="max_players"
                  min="1"
                  max="20"
                  /* update current board game on specific field with value */
                  onChange={e =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "max_players",
                        value: parseInt(e.target.value),
                      }),
                    )
                  }
                  value={current_board_game.max_players}
                  className="px-2 py-1 bg-main-color/10 text-sm rounded-md outline-main-color"
                />
              </div>
              <div className="col-span-5 flex flex-col gap-2">
                <label htmlFor="min_players" className="text-sm">
                  Min. Players
                </label>
                <input
                  type="number"
                  id="min_players"
                  min="1"
                  max="20"
                  /* update current board game on specific field with value */
                  onChange={e =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "min_players",
                        value: parseInt(e.target.value),
                      }),
                    )
                  }
                  value={current_board_game.min_players}
                  className="px-2 py-1 bg-main-color/10 text-sm rounded-md outline-main-color"
                />
              </div>
            </div>
            {/* A switch would probably a better design */}
            <div className="flex flex-col gap-2">
              <label htmlFor="gameType" className="text-sm">
                Game Type
              </label>
              <select
                id="gameType"
                /* update current board game on specific field with value */
                onChange={e =>
                  dispatch(
                    updateCurrentBoardGame({
                      field: "type",
                      value: e.target.value,
                    }),
                  )
                }
                value={current_board_game.type}
                className="px-2 py-1 bg-main-color/10 text-sm rounded-md active:border-main-color outline-main-color"
              >
                <option value={BoardGamesTypes.BASE_GAME}>Base Game</option>
                <option value={BoardGamesTypes.EXPANSION}>Expansion</option>
              </select>
            </div>
            {/* Some (debatable) logic regarding expansions and standalone logic */}
            {current_board_game.type === BoardGamesTypes.EXPANSION && (
              <div className="flex flex-col gap-2">
                <label htmlFor="baseGame" className="text-sm">
                  Base Game
                </label>
                <select
                  id="baseGame"
                  /* update current board game on specific field with value */
                  onChange={e =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "baseGame",
                        value: e.target.value,
                      }),
                    )
                  }
                  value={current_board_game.baseGame}
                  className="px-2 py-1 bg-main-color/10 text-sm rounded-md active:border-main-color outline-main-color"
                >
                  <option value="-1">None</option>
                  {base_games.map(board_game => (
                    <option key={board_game.id} value={board_game.id}>
                      {board_game.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Some (debatable) logic regarding expansions and standalone logic */}
            {current_board_game.type === BoardGamesTypes.EXPANSION && (
              <div className="flex justify-between">
                <label htmlFor="standalone" className="text-sm">
                  Standalone
                </label>
                <input
                  id="standalone"
                  type="checkbox"
                  /* update current board game on specific field with value */
                  onChange={() =>
                    dispatch(
                      updateCurrentBoardGame({
                        field: "standalone",
                        value: !current_board_game.standalone,
                      }),
                    )
                  }
                  checked={current_board_game.standalone || false}
                />
              </div>
            )}
          </div>
          <div className="px-6 flex flex-col gap-4">
            <button
              onClick={handleActionClick}
              className="hover:text-main-color font-semibold p-1 bg-main-color/10 rounded-md"
            >
              {modalType === ModalTypes.ADD && "Add"}
              {modalType === ModalTypes.EDIT && "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
