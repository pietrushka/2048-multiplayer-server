import React, { useContext, createContext, useCallback } from 'react';
import { useImmerReducer } from 'use-immer';

import { initializeBoard, updateBoard, movePossible } from '../utils/board';
import { getStoredBoard, storeBoard } from '../utils/localStorage';
import {
  InitialStateInterFace,
  GameContextInterface,
  ACTIONTYPE,
} from '../types/useGame.types';

const GameContext = createContext({} as GameContextInterface);

const initialState: InitialStateInterFace = {
  gameType: undefined,
  boardSize: 4,
  board: [],
  previousBoard: undefined,
  isPlaying: false,
  gameResult: undefined,
  score: 0,
};

function reducer(draft: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'START_SINGLEPLAYER':
      draft.gameType = 'singleplayer';
      const storageData = getStoredBoard();
      if (storageData.board && storageData.score) {
        draft.board = storageData.board;
        draft.score = storageData.score;
        draft.isPlaying = true;
        return;
      }

      const initResult = initializeBoard(4);
      draft.board = initResult.board;
      draft.isPlaying = true;
      storeBoard({ board: draft.board, score: draft.score });
      return;

    case 'MAKE_MOVE':
      if (!draft.isPlaying) return;

      draft.previousBoard = draft.board;
      const moveResult = updateBoard(draft.board, action.direction);
      draft.board = moveResult.board;
      draft.score += moveResult.scoreIncrease;
      draft.scoreIncrease = moveResult.scoreIncrease;
      const isMovePossible = movePossible(draft.board);
      if (isMovePossible === false) {
        draft.isPlaying = false;
        draft.gameResult = 'defeat';
      }
      if (draft.gameType === 'singleplayer')
        storeBoard({ board: draft.board, score: draft.score });
      return;

    case 'UNDO':
      if (!draft.previousBoard) return;
      if (!draft.isPlaying) return;

      draft.board = draft.previousBoard;
      draft.previousBoard = undefined;

      if (draft.scoreIncrease) draft.score -= draft.scoreIncrease;
      if (draft.gameType === 'singleplayer')
        storeBoard({ board: draft.board, score: draft.score });
      return;

    case 'RESET':
      draft.board = initializeBoard(4).board;
      draft.previousBoard = undefined;
      draft.score = 0;
      draft.gameResult = undefined;
      if (draft.gameType === 'singleplayer')
        storeBoard({ board: draft.board, score: 0 });
      return;
    case 'SET_INITIALS':
      draft.boardSize = 4;
      draft.board = [];
      draft.previousBoard = undefined;
      draft.isPlaying = false;
      draft.gameResult = undefined;
      draft.score = 0;
      if (draft.gameType === 'multiplayer') {
        draft.gameId = undefined;
        draft.endTime = undefined;
        draft.opponentBoard = undefined;
        draft.opponentScore = undefined;
      }
      draft.gameType = undefined;
      return;

    case 'START_MULTIPLAYER':
      draft.gameType = 'multiplayer';
      draft.board = initializeBoard(4).board;
      const endTime = Date.now() + action.data.gameTime;
      draft.endTime = endTime;
      draft.gameId = action.data.gameId;
      draft.previousBoard = undefined;
      draft.score = 0;
      draft.isPlaying = true;
      console.log('START_MULTIPLAYER');
      return;

    case 'UPDATE_MULTIPLAYER':
      draft.opponentBoard = action.data.opponentBoard;
      draft.opponentScore = action.data.opponentScore;
      return;

    case 'RESULT_MULTIPLAYER':
      draft.isPlaying = false;
      if (!draft.opponentScore && draft.opponentScore !== 0) return;

      if (draft.score > draft.opponentScore) {
        draft.gameResult = 'victory';
      } else if (draft.score === draft.opponentScore) {
        draft.gameResult = 'draw';
      } else {
        draft.gameResult = 'defeat';
      }
      return;

    case 'BOMB_EVENT':
      const occupiedIdxs: number[] = [];
      draft.board.map((tile, idx) => tile > 0 && occupiedIdxs.push(idx));
      const randomIdx =
        occupiedIdxs[Math.round(Math.random() * occupiedIdxs.length) - 1];
      if (randomIdx) draft.board[randomIdx] = 0;
      return;

    case 'DECREASE_POINTS':
      draft.score -= action.cost;
      return;

    case 'TOGGLE_ISPLAYING':
      draft.isPlaying = !draft.isPlaying;
      return;
    case 'OPPONENT_LOST':
      if (!draft.isPlaying) return;
      draft.gameResult = 'victory';
      draft.isPlaying = false;
      return;
  }
}

interface GameProviderProps {
  children: React.ReactNode;
}

// TODO useCallback thing is a walkaround

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const {
    gameType,
    boardSize,
    board,
    gameResult,
    previousBoard,
    score,
    scoreIncrease,
    isPlaying,
    gameId,
    endTime,
    opponentBoard,
    opponentScore,
  } = state;

  const handleGameEvent = useCallback(
    (eventType: string) => {
      switch (eventType) {
        case 'bomb':
          return dispatch({ type: 'BOMB_EVENT' });

        case 'freeze':
          dispatch({ type: 'TOGGLE_ISPLAYING' });
          setTimeout(() => {
            dispatch({ type: 'TOGGLE_ISPLAYING' });
          }, 5000);
          return;
      }
    },
    [dispatch]
  );

  return (
    <GameContext.Provider
      value={{
        gameType,
        boardSize,
        board,
        previousBoard,
        score,
        gameResult,
        scoreIncrease,
        isPlaying,
        gameId,
        endTime,
        opponentBoard,
        opponentScore,
        startSingleplayer: useCallback(
          () => dispatch({ type: 'START_SINGLEPLAYER' }),
          [dispatch]
        ),
        makeMove: (direction) => dispatch({ type: 'MAKE_MOVE', direction }),
        undoMove: useCallback(() => dispatch({ type: 'UNDO' }), [dispatch]),
        resetGame: useCallback(() => dispatch({ type: 'RESET' }), [dispatch]),
        setInitials: useCallback(
          () => dispatch({ type: 'SET_INITIALS' }),
          [dispatch]
        ),
        startMultiplayer: useCallback(
          (data) => dispatch({ type: 'START_MULTIPLAYER', data }),
          [dispatch]
        ),
        updateMultiplayer: useCallback(
          (data) => dispatch({ type: 'UPDATE_MULTIPLAYER', data }),
          [dispatch]
        ),
        resultMultiplayer: useCallback(
          () => dispatch({ type: 'RESULT_MULTIPLAYER' }),
          [dispatch]
        ),
        handleGameEvent,
        decreasePoints: (cost) => dispatch({ type: 'DECREASE_POINTS', cost }),
        handleOpponentLost: useCallback(
          () => dispatch({ type: 'OPPONENT_LOST' }),
          [dispatch]
        ),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
