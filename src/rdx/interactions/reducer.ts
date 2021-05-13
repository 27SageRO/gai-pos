import update from 'immutability-helper';
import actions from 'rdx/rootActions';

import type {InteractionError} from './actions';

const initialState: InteractionState = {
  actionsInProgress: [],
  actionsInError: [],
};

export default (
  state: InteractionState = initialState,
  action: any,
): InteractionState => {
  const type: string = action.type;

  // what is the purpose
  // and we act based on that
  const purpose = getActionPurpose(type);
  const isBegin = purpose === 'begin';
  const isSuccess = purpose === 'success';

  if (isBegin) {
    return interactionStartReducer(state, action);
  } else if (isSuccess) {
    return interactionStopReducer(state, action);
  }

  switch (type) {
    case actions.interactionError.type:
      return actionErrorReducer(state, action);
    case actions.userLogout.type:
      return initialState;
    default:
      return state;
  }
};

/**
 * This will get the exact
 * name of the action type
 * for example:
 * get/manga/begin => get/manga
 */
export function getActionName(actionType: string) {
  return actionType.split('/').slice(0, -1).join('/');
}

/**
 * This will get the exact
 * purpose of the action
 * for example:
 * get/manga/begin => begin
 */
export function getActionPurpose(actionType: string) {
  return actionType.split('/').slice(-1).join('');
}

const interactionStartReducer = (
  state: InteractionState,
  action: any,
): InteractionState => {
  const actionName = getActionName(action.type);
  return update(state, {
    actionsInProgress: {$set: [...state.actionsInProgress, actionName]},
    actionsInError: {
      $set: state.actionsInError.filter((o) => o.actionName !== actionName),
    },
  });
};

const interactionStopReducer = (
  state: InteractionState,
  action: any,
): InteractionState => {
  const actionName = getActionName(action.type);
  return update(state, {
    actionsInProgress: {
      $set: state.actionsInProgress.filter((o) => o !== actionName),
    },
  });
};

const actionErrorReducer = (
  state: InteractionState,
  action: InteractionError,
): InteractionState => {
  const {payload} = action;
  const actionName = getActionName(payload.actionType);

  return update(state, {
    actionsInProgress: {
      $set: state.actionsInProgress.filter((o) => o !== actionName),
    },
    actionsInError: {
      $set: [
        ...state.actionsInError.filter((o) => o.actionName !== actionName),
        {
          actionName: getActionName(payload.actionType),
          message: payload.message,
        },
      ],
    },
  });
};
