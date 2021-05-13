import {getActionName} from './reducer';

export const getInProgress = (
  state: ReduxState,
  ...actionsToCheck: Array<string>
) => {
  const actionNames = actionsToCheck.map((i) => getActionName(i));
  return state.interactions.actionsInProgress.some((action) =>
    actionNames.includes(action),
  );
};

export const getError = (state: ReduxState, actionToCheck: string) => {
  const actionName = getActionName(actionToCheck);
  return state.interactions.actionsInError.find(
    (o) => o.actionName === actionName,
  );
};
