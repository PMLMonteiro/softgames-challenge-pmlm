import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import { checkBoardGames } from "./features/flow/slice"
import Modal from "./features/board_games/Modal"
import Header from "./features/board_games/Header"
import Table from "./features/board_games/Table"

const App = () => {
  const dispatch = useAppDispatch()

  /* use effect to update board games */
  useEffect(() => {
    dispatch(checkBoardGames())
  })

  return (
    <>
      <div className="flex flex-col h-screen lg:h-auto">
        {/* Header for searching, resetting and adding board games */}
        <Header />
        {/* Table that shows existent board games. Also allows for edition and deletion. */}
        <Table />
      </div>
      {/* Modal for adding and editing board games */}
      <Modal />
    </>
  )
}

export default App
