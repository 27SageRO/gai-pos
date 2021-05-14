import {AnyAction} from 'redux';
import {getActionName} from './reducer';

export const getInProgress = (
  state: ReduxState,
  ...actionsToCheck: Array<AnyAction>
) => {
  const actionNames = actionsToCheck.map((i) => getActionName(i.type));
  return state.interactions.actionsInProgress.some((action) =>
    actionNames.includes(action),
  );
};

export const getError = (state: ReduxState, actionToCheck: AnyAction) => {
  const actionName = getActionName(actionToCheck.type);
  return state.interactions.actionsInError.find(
    (o) => o.actionName === actionName,
  );
};
