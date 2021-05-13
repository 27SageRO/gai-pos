import {createAction} from 'rdx/toolkit';

const interactionError = createAction(
  'interaction/error',
  (actionType: string, message: string) => ({payload: {actionType, message}}),
);

export type InteractionError = ReturnType<typeof interactionError>;

export default {
  interactionError,
};
