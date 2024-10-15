import axios from "axios";
import { onRequest } from "firebase-functions/v2/https";

import { BoardGame } from "./interfaces";
import { DocumentSnapshot } from "firebase-functions/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

initializeApp();

/* Populates database based on external provider */
const populateBoardGames = onRequest(
  { region: "europe-west1", cors: true },
  async (request, response) => {
    try {
      const db = getFirestore();
      /* get data */
      let { data: boardGames } = await axios.get(
        "https://getboardgames-jxxjux7fua-ey.a.run.app/"
      );
      /* mapping original data to more suitable structure */
      boardGames = boardGames.map((boardGame: BoardGame) => {
        const { players, ...toStore } = boardGame;
        return {
          ...toStore,
          expansions:
            /* expansions now have id and name */
            boardGame.expansions?.map((expansion) => ({
              id: expansion,
              name:
                boardGames.find((bg: BoardGame) => bg.id === expansion)?.name ||
                "",
            })) || [],
          /* max and min players split into separate fields */
          max_players: players.max || null,
          min_players: players.min || null,
        };
      });
      /* update firestore */
      await Promise.all(
        boardGames.map(async (boardGame: BoardGame) => {
          const { id, ...toStore } = boardGame;
          await db.collection("board_games").doc(id).set(toStore);
        })
      );
      /* notify client of success */
      response.send({ message: "Database populated successfully." });
    } catch (error) {
      /* notify client of error */
      console.log(error);
      response.status(500).send({
        message: "Internal error fetching data from external provider.",
        error,
      });
    }
  }
);

/* Gets existent board games from firestore */
const getBoardGames = onRequest(
  { region: "europe-west1", cors: true },
  async (request, response) => {
    try {
      const db = getFirestore();
      const board_games = (await db.collection("board_games").get()).docs.map(
        (doc: DocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id,
        })
      );
      response.send({ board_games });
    } catch (error) {
      /* notify client of error */
      console.log(error);
      response.status(500).send({
        message: "Internal error fetching data from the database.",
        error,
      });
    }
  }
);

const addBoardGame = onRequest(
  { region: "europe-west1", cors: true },
  async (request, response) => {
    /* ignores request if not post */
    if (request.method !== "POST") {
      response.status(400).send({
        message: "Bad Request. Needs to be a POST.",
      });
      return Promise.resolve();
    }
    try {
      const {
        data: { board_game },
      } = request.body;
      const db = getFirestore();
      /* adds new board game */
      const { id } = await db.collection("board_games").add(board_game);

      /* updates newly added doc with id */
      await db.collection("board_games").doc(id).update({ id });
      if (board_game.baseGame !== "-1") {
        /* if this is an expansion, update base game */
        await db
          .collection("board_games")
          .doc(board_game.baseGame)
          .update({
            expansions: FieldValue.arrayUnion({ id, name: board_game.name }),
          });
      }
      response.status(204).send();
    } catch (error) {
      /* notify client of error */
      console.log(error);
      response.status(500).send({
        message: "Internal error adding data to the database.",
        error,
      });
    }
  }
);

const editBoardGame = onRequest(
  { region: "europe-west1", cors: true },
  async (request, response) => {
    /* ignores request if not put */
    if (request.method !== "PUT") {
      response.status(400).send({
        message: "Bad Request. Needs to be a PUT.",
      });
      return Promise.resolve();
    }
    try {
      const {
        data: { board_game },
      } = request.body;
      const db = getFirestore();
      /* updates board game */
      await db.collection("board_games").doc(board_game.id).set(board_game);
      response.status(204).send();
    } catch (error) {
      /* notify client of error */
      console.log(error);
      response.status(500).send({
        message: "Internal error adding data to the database.",
        error,
      });
    }
  }
);

const deleteBoardGame = onRequest(
  { region: "europe-west1", cors: true },
  async (request, response) => {
    /* ignores request if not delete */
    if (request.method !== "DELETE") {
      response.status(400).send({
        message: "Bad Request. Needs to be a DELETE.",
      });
      return Promise.resolve();
    }
    const { id } = request.body;
    try {
      const db = getFirestore();
      await db.collection("board_games").doc(`${id}`).delete();
      /* update base games of existing board games */
      const base_games_to_update = (
        await db
          .collection("board_games")
          .where("expansions", "array-contains", id)
          .get()
      ).docs.map(
        (d: DocumentSnapshot) => ({ id: d.id, ...d.data() } as BoardGame)
      );

      await Promise.all(
        base_games_to_update.map(async (game: BoardGame) => {
          await db
            .collection("board_games")
            .doc(game.id)
            .update({
              expansions:
                game.expansions?.filter((expansion) => expansion !== id) || [],
            });
        })
      );
      /* update expansions of existent board games */
      const expansions_to_update = (
        await db.collection("board_games").where("baseGame", "==", id).get()
      ).docs.map(
        (d: DocumentSnapshot) => ({ id: d.id, ...d.data() } as BoardGame)
      );
      await Promise.all(
        expansions_to_update.map(async (game: BoardGame) => {
          await db.collection("board_games").doc(game.id).update({
            baseGame: null,
          });
        })
      );
      response.status(204).send();
    } catch (error) {
      /* notify client of error */
      console.log(error);
      response.status(500).send({
        message: "Internal error deleting data from the database.",
        error,
      });
    }
  }
);

export {
  addBoardGame as post,
  getBoardGames as get,
  editBoardGame as put,
  deleteBoardGame as delete,
  populateBoardGames as populate,
};
