import React, { useReducer } from "react";
import deepCopy from "../util/deepCopy";

type Notice = [string | null, string | null, string | null]

export type RegistrationState = {
  selectedAvatar: number;
  fieldsCompleted: boolean | null;
  notice: Notice
}

const initialState: RegistrationState = {
  selectedAvatar: -1,
  fieldsCompleted: null,
  notice: [null, null, null]
}

export enum ActionsRegistration {
  SELECT_AVATAR = 'SELECT_AVATAR',
  CHECK_FIELDS = 'CHECK_FIELDS',
  SET_FIELDS_COMPLETED = 'SET_FIELDS_COMPLETED',
  RESET_NOTICE = 'RESET_NOTICE'
}

export type ActionsRegistrationApp =
| { type: ActionsRegistration.SELECT_AVATAR; payload: { index: number }}
| { type: ActionsRegistration.CHECK_FIELDS; payload: { name: string, password: string, available: boolean }}
| { type: ActionsRegistration.SET_FIELDS_COMPLETED; payload: { isFieldsCompleted: boolean | null}}
| { type: ActionsRegistration.RESET_NOTICE }

export function registrationReducer(state: RegistrationState, action: ActionsRegistrationApp) {
  const newState = deepCopy(state);

  switch(action.type) {
    case ActionsRegistration.SELECT_AVATAR:
      newState.selectedAvatar = action.payload.index;

      return newState;

    case ActionsRegistration.SET_FIELDS_COMPLETED:
      newState.fieldsCompleted = action.payload.isFieldsCompleted;

      return newState;

    case ActionsRegistration.RESET_NOTICE:
      newState.notice = [null, null, null];

      return newState;

    case ActionsRegistration.CHECK_FIELDS:
      const newNotice: Notice = [null, null, null];

      if (!action.payload.available) {
        newNotice[0] = 'Name not available.';
        newState.fieldsCompleted = false;
      }
      else {
        if (action.payload.name.length < 5 || action.payload.name.length > 20) {
          newNotice[0] = 'Please enter a name between 6 and 20 characters.';
          newState.fieldsCompleted = false;
        }
      }

      if (action.payload.password.length < 5) {
        newNotice[1] = 'Password should be at least 6 characters long.';
        newState.fieldsCompleted = false;
      }

      if (newState.selectedAvatar === -1) {
        newNotice[2] = 'You must select and avatar.';
        newState.fieldsCompleted = false;
      }

      if (action.payload.name.length >= 6 && action.payload.name.length <= 20 && action.payload.password.length >= 6 && 
        newState.selectedAvatar !== -1 && action.payload.available) {
        newState.fieldsCompleted = true;
      }

      if (!newState.fieldsCompleted) newState.notice = newNotice;

      return newState;
  }
}

export function useRegistration(): [RegistrationState, React.Dispatch<ActionsRegistrationApp>] {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  return [state, dispatch];
}
