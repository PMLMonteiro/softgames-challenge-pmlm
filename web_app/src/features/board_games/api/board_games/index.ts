import axios from "axios"
import { BoardGame } from "../../interfaces"

/* Endpoint for getting all board games */
const getBoardGames = async () => {
  try {
    const {
      data: { board_games },
    } = await axios.get(
      `${import.meta.env.VITE_API_URL}database-get`,
    )
    return board_games
  } catch (error) {
    console.log(error)
    throw { error }
  }
}

/* Endpoint for adding a new board game */
const addBoardGame = async (board_game: BoardGame) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}database-post`,
      { data: { board_game } },
    )
  } catch (error) {
    console.log(error)
    throw { error }
  }
}

/* Endpoint for updating a board game */
const updateBoardGame = async (board_game: BoardGame) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}database-put`,
      { data: { board_game } },
    )
  } catch (error) {
    console.log(error)
    throw { error }
  }
}

/* Endpoint for deleting a board game */
const deleteBoardGame = async (id: string | undefined) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}database-delete`,
      { data: { id } },
    )
  } catch (error) {
    console.log(error)
    throw { error }
  }
}

export {
  addBoardGame as add,
  getBoardGames as get,
  updateBoardGame as update,
  deleteBoardGame as delete,
}
