import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  filterBoardGames,
  getBoardGames,
  resetFilters,
  selectSearchQuery,
  updateModalType,
} from "./slice"
import { ModalTypes } from "./enums"
import { LuPlus, LuRefreshCcw } from "react-icons/lu"

const Header = () => {
  const dispatch = useAppDispatch()

  const search_query = useAppSelector(selectSearchQuery)

  const handleReset = () => {
    dispatch(resetFilters())
    dispatch(getBoardGames())
  }

  return (
    <>
      {/* Desktop Header  */}
      <div className="hidden lg:grid grid-cols-9 lg:sticky top-0 bg-white">
        <div className="grid grid-cols-7 col-span-7 col-start-2 items-center py-4 text-base">
          <input
            onChange={e => dispatch(filterBoardGames(e.target.value))}
            value={search_query}
            placeholder="Find your board game"
            className="search-icon py-2 pr-4 pl-[42px] col-span-3 col-start-3 bg-main-color/10 text-sm rounded-md outline-main-color"
          />
          <div className="col-span-1 col-start-7 flex gap-2 justify-center">
            <button
              onClick={handleReset}
              className="hover:text-main-color bg-main-color/10 p-2 rounded-md"
            >
              <LuRefreshCcw size={20} />
            </button>
            <button
              onClick={() =>
                dispatch(updateModalType({ type: ModalTypes.ADD }))
              }
              className="hover:text-main-color bg-main-color/10 p-2 rounded-md"
            >
              <LuPlus size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col p-2 flex-1">
        <div className="grid grid-cols-6 py-2 gap-2">
          {/* Search input */}
          <input
            onChange={e => dispatch(filterBoardGames(e.target.value))}
            value={search_query}
            placeholder="Find your board game"
            className="search-icon py-2 pr-4 pl-[42px] col-span-4 bg-main-color/10 text-sm rounded-md outline-main-color"
          />
          <div className="col-span-2 col-start-5 flex gap-2 justify-end">
            <button
              onClick={handleReset}
              className="hover:text-main-color bg-main-color/10 p-2 rounded-md"
            >
              <LuRefreshCcw size={20} />
            </button>
            <button
              onClick={() =>
                dispatch(updateModalType({ type: ModalTypes.ADD }))
              }
              className="hover:text-main-color bg-main-color/10 p-2 rounded-md"
            >
              <LuPlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
