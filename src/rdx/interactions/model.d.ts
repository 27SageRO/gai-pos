type InteractionState = {
  actionsInProgress: Array<string>;
  actionsInError: Array<ActionError>;
};

type ActionError = {
  actionName: string;
  message: string;
};
