import React, { useReducer } from "react";
import { Statistics } from "./userReducer";
import { randomPhrase } from "../util/setText";
import { words } from "../assets/words";

export type GameState = {
  name: string | null,
  avatar: string | null,
  statistics: Statistics[],

  numWords: number,
  wrongWords: number,
  accuracy: number,
  speed: number,
  maxSpeed: number,

  word: string[] | string | null,
  page: PagesRoutes,
  index: number,
  time: number,
  gameWords: [string | null, boolean | null, number?][];
  initialTime: number,
  gameEnds: boolean,
  gameType: number,
  timerType: number,
  isStopWatch: boolean,
  wordsForGame: { word: string | null, isCorrect: boolean | null, time?: number }[],
  isNotDisabled: boolean,
  topSpace: number,
}

export enum PagesRoutes {
  SIGNUP = 'SIGNUP',
  SIGNIN = 'SIGNIN',
  TYPING_APP = 'TYPING_APP',
  STATISTICS = 'STATISTICS',
}

export const initialState: GameState = {
  name: null,
  avatar: null,
  statistics: [],
  numWords: 0,
  wrongWords: 0,
  word: null,
  index: 0,
  time: 10,
  gameWords: [],
  initialTime: 0,
  gameEnds: false,
  gameType: 1,
  timerType: 1,
  accuracy: 0,
  speed: 0,
  maxSpeed: 0,
  page: PagesRoutes.SIGNUP,
  isStopWatch: false,
  wordsForGame: [],
  isNotDisabled: true,
  topSpace: 0,
}

export enum ActionsGame {
  GAME_START = 'GAME_START',
  GAME_ENDS = 'GAME_ENDS',

  CURRENT_USER = 'CURRENT_USER',
  RESET_USER = 'RESET_USER',
  CHANGE_PAGE = 'CHANGE_PAGE',
  SET_WORD = 'SET_WORD',
  SET_INDEX = 'SET_INDEX',
  SET_TIME = 'SET_TIME',
  INITIAL_TIME = 'INITIAL_TIME',
  SET_GAME_ENDS = 'SET_GAME_ENDS',
  SET_GAME_TYPE = 'SET_GAME_TYPE',
  SET_TIMER_TYPE = 'SET_TIMER_TYPE',
  SET_MAX_SPEED = 'SET_MAX_SPEED',
  SET_IS_STOPWATCH = 'SET_IS_STOPWATCH',
  SET_WORDS_OF_THE_GAME = 'SET_WORDS_OF_THE_GAME',
  SET_WORD_ISCORRECT = 'SET_WORD_ISCORRECT',
  SET_IS_NOT_DISABLED = 'SET_IS_NOT_DISABLED',
  SET_TOP_SPACE = 'SET_TOP_SPACE',
} 

export type ActionsGameApp = 
  | { type: ActionsGame.GAME_START, payload?: undefined }
  | { type: ActionsGame.GAME_ENDS, payload: { time: number }}

  | { type: ActionsGame.CURRENT_USER, payload: { name: string, avatar: string, 
    statistics: Statistics[] }}
  | { type: ActionsGame.RESET_USER, payload?: undefined }
  | { type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes }}
  | { type: ActionsGame.SET_WORD, payload: { word: string | string[] }}
  | { type: ActionsGame.SET_INDEX, payload: { index: number }}
  | { type: ActionsGame.SET_TIME, payload: { time: number }}
  | { type: ActionsGame.INITIAL_TIME, payload: { time: number }}
  | { type: ActionsGame.SET_GAME_ENDS, payload: { isEnded: boolean }}
  | { type: ActionsGame.SET_GAME_TYPE, payload: { type: number }}
  | { type: ActionsGame.SET_TIMER_TYPE, payload: { type: number }}
  | { type: ActionsGame.SET_MAX_SPEED, payload?: undefined}
  | { type: ActionsGame.SET_IS_STOPWATCH, payload: { is: boolean }}
  | { type: ActionsGame.SET_WORDS_OF_THE_GAME, payload?: undefined }
  | { type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: number, isCorrect: boolean | null }}
  | { type: ActionsGame.SET_IS_NOT_DISABLED, payload?: undefined }
  | { type: ActionsGame.SET_TOP_SPACE, payload: { space: number }}

export function gameReducer(state: GameState, { type, payload }: ActionsGameApp): GameState {
  let newState = { ...state };

  switch(type) {
    case ActionsGame.GAME_START:
      newState.numWords = 0;
      newState.wrongWords = 0;
      newState.maxSpeed = 0;
      newState.index = 0;
      newState.initialTime = new Date().getTime();
      newState.gameEnds = false;
      newState.gameWords = [];
      newState.topSpace = 0;

      return newState;

    case ActionsGame.GAME_ENDS:
      let numWords = 0;
      let wrongWords = 0;

      for (let i = 0; i < newState.wordsForGame.length; i++) {
        if (newState.wordsForGame[i].isCorrect !== null) {
          if (newState.wordsForGame[i].isCorrect === true) {
            numWords++;
          }
          if (newState.wordsForGame[i].isCorrect === false) {
            wrongWords++;
          }
        }
        else break;
      }

      const statistics = {
        timeStamp: new Date().getTime(),  
        numWords: numWords,
        wrongWords: wrongWords,
        speed: (numWords * 60) / newState.time,
        accuracy: numWords === 0 && wrongWords === 0 ? 0 : Number(((numWords / (numWords + wrongWords)) * 100).toFixed(2)),
        fast: newState.isStopWatch ? payload.time + 1 : payload.time,
        maxSpeed: newState.maxSpeed
      }

      newState.numWords = numWords;
      newState.wrongWords = wrongWords;
      newState.speed = statistics.speed;
      newState.accuracy = statistics.accuracy;
      newState.statistics = [...newState.statistics, statistics];
      newState.gameEnds = true;

      return newState;

    case ActionsGame.CURRENT_USER:
      newState.name = payload.name;
      newState.avatar = payload.avatar;
      newState.statistics = payload.statistics;

      return newState;

    case ActionsGame.RESET_USER:
      newState.name = null;
      newState.avatar = null;

      return newState;
//--------------------------------------------------------------------------------
   case ActionsGame.SET_WORDS_OF_THE_GAME:
      const wArr = randomPhrase(words, newState.gameType === 1 ? 150 : 12);

      const wObj: { word: string, isCorrect: boolean | null, time: number }[] = wArr.map(el => {
        return { word: el, isCorrect: null, time: 0 }
      });

      newState.word = wArr;
      newState.wordsForGame = wObj;

      return newState;

    case ActionsGame.SET_WORD_ISCORRECT:
      newState.wordsForGame[payload.index].isCorrect = payload.isCorrect;

      return newState;

    case ActionsGame.SET_WORD:
      newState.word = payload.word;

      return newState;

    case ActionsGame.SET_INDEX:
      newState.index = payload.index;

      return newState;

    case ActionsGame.SET_TOP_SPACE:
      newState.topSpace = payload.space;

      return newState;

    case ActionsGame.SET_TIME:
      newState.time = payload.time;
  
      return newState;

    case ActionsGame.SET_GAME_ENDS:
      newState.gameEnds = payload.isEnded;

      return newState;
    
    case ActionsGame.INITIAL_TIME:
      newState.initialTime = payload.time;

      return newState;

    case ActionsGame.SET_GAME_TYPE:
      newState.gameType = payload.type;

      return newState;

    case ActionsGame.SET_TIMER_TYPE:
      newState.timerType = payload.type;

      return newState;

    case ActionsGame.SET_MAX_SPEED:
      if(newState.initialTime !== 0) {
        const deltaTime = ((new Date().getTime()) - newState.initialTime) / 1000;
        const speed = 60 / deltaTime;

        if(speed > newState.maxSpeed) newState.maxSpeed = Number(speed.toFixed(2));
      }
      
      newState.initialTime = new Date().getTime();

      return newState;

    case ActionsGame.SET_IS_STOPWATCH:
      newState.isStopWatch = payload.is;

      return newState;

    case ActionsGame.CHANGE_PAGE:
      newState.page = payload.page;

      return newState;

    case ActionsGame.SET_IS_NOT_DISABLED:
      newState.isNotDisabled = newState.isNotDisabled ? false : true;

      return newState;

    default:
      return state;
  }
}

export function useGame(): [GameState,  React.Dispatch<ActionsGameApp>] {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return [state, dispatch];
}