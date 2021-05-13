/**
 * Some of these codes are extracted from
 * https://github.com/reduxjs/redux-toolkit
 * to save bundle size. I cannot use RTK
 * because i am used to the old redux implementation.
 * Why? because RTK is using immer and im not used
 * to it so i used specifically this and create my
 * own createReducer with the same idea. The main
 * goal is to reduce the boilerplate as much as
 * possible.
 */

import {Middleware, Action, AnyAction} from 'redux';

/**
 * return True if T is `any`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
type IsAny<T, True, False = never> =
  // test if we are going the left AND right path in the condition
  true | false extends (T extends never ? true : false) ? True : False;

/**
 * return True if T is `unknown`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
type IsUnknown<T, True, False = never> = unknown extends T
  ? IsAny<T, False, True>
  : False;

type FallbackIfUnknown<T, Fallback> = IsUnknown<T, Fallback, T>;

/**
 * @internal
 */
type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;

/**
 * @internal
 */
type IfVoid<P, True, False> = [void] extends [P] ? True : False;

/**
 * @internal
 */
type IsEmptyObj<T, True, False = never> = T extends any
  ? keyof T extends never
    ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>>
    : False
  : never;

/**
 * returns True if TS version is above 3.5, False if below.
 * uses feature detection to detect TS version >= 3.5
 * * versions below 3.5 will return `{}` for unresolvable interference
 * * versions above will return `unknown`
 *
 * @internal
 */
type AtLeastTS35<True, False> = [True, False][IsUnknown<
  ReturnType<<T>() => T>,
  0,
  1
>];

/**
 * @internal
 */
type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<
  IsUnknown<T, True, False>,
  IsEmptyObj<T, True, IsUnknown<T, True, False>>
>;

/**
 * Combines all dispatch signatures of all middlewares in the array `M` into
 * one intersected dispatch signature.
 */
type DispatchForMiddlewares<M> = M extends ReadonlyArray<any>
  ? UnionToIntersection<
      M[number] extends infer MiddlewareValues
        ? MiddlewareValues extends Middleware<infer DispatchExt, any, any>
          ? DispatchExt extends Function
            ? DispatchExt
            : never
          : never
        : never
    >
  : never;

/**
 * Convert a Union type `(A|B)` to and intersecion type `(A&B)`
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Helper type. Passes T out again, but boxes it in a way that it cannot
 * "widen" the type by accident if it is a generic that should be inferred
 * from elsewhere.
 *
 * @internal
 */
type NoInfer<T> = [T][T extends any ? 0 : never];

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface HasMatchFunction<T> {
  match(v: any): v is T;
}

/** @public */
type Matcher<T> = HasMatchFunction<T> | ((v: any) => v is T);

/** @public */
type ActionFromMatcher<M extends Matcher<any>> = M extends Matcher<infer T>
  ? T
  : never;

/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * prototype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 *
 * @public
 */
function isPlainObject(value: unknown): value is object {
  if (typeof value !== 'object' || value === null) return false;

  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
export type PayloadAction<
  P = void,
  T extends string = string,
  M = never,
  E = never
> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });

/**
 * A "prepare" method to be used as the second parameter of `createAction`.
 * Takes any number of arguments and returns a Flux Standard Action without
 * type (will be added later) that *must* contain a payload (might be undefined).
 *
 * @public
 */
export type PrepareAction<P> =
  | ((...args: any[]) => {payload: P})
  | ((...args: any[]) => {payload: P; meta: any})
  | ((...args: any[]) => {payload: P; error: any})
  | ((...args: any[]) => {payload: P; meta: any; error: any});

/**
 * Internal version of `ActionCreatorWithPreparedPayload`. Not to be used externally.
 *
 * @internal
 */
export type _ActionCreatorWithPreparedPayload<
  PA extends PrepareAction<any> | void,
  T extends string = string
> = PA extends PrepareAction<infer P>
  ? ActionCreatorWithPreparedPayload<
      Parameters<PA>,
      P,
      T,
      ReturnType<PA> extends {
        error: infer E;
      }
        ? E
        : never,
      ReturnType<PA> extends {
        meta: infer M;
      }
        ? M
        : never
    >
  : void;

/**
 * Basic type for all action creators.
 *
 * @inheritdoc {redux#ActionCreator}
 */
interface BaseActionCreator<P, T extends string, M = never, E = never> {
  type: T;
  match(action: Action<unknown>): action is PayloadAction<P, T, M, E>;
}

/**
 * An action creator that takes multiple arguments that are passed
 * to a `PrepareAction` method to create the final Action.
 * @typeParam Args arguments for the action creator function
 * @typeParam P `payload` type
 * @typeParam T `type` name
 * @typeParam E optional `error` type
 * @typeParam M optional `meta` type
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export interface ActionCreatorWithPreparedPayload<
  Args extends unknown[],
  P,
  T extends string = string,
  E = never,
  M = never
> extends BaseActionCreator<P, T, M, E> {
  /**
   * Calling this {@link redux#ActionCreator} with `Args` will return
   * an Action with a payload of type `P` and (depending on the `PrepareAction`
   * method used) a `meta`- and `error` property of types `M` and `E` respectively.
   */
  (...args: Args): PayloadAction<P, T, M, E>;
}

/**
 * An action creator of type `T` that takes an optional payload of type `P`.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export interface ActionCreatorWithOptionalPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload of `P`.
   * Calling it without an argument will return a PayloadAction with a payload of `undefined`.
   */
  (payload?: P): PayloadAction<P, T>;
}

/**
 * An action creator of type `T` that takes no payload.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export interface ActionCreatorWithoutPayload<T extends string = string>
  extends BaseActionCreator<undefined, T> {
  /**
   * Calling this {@link redux#ActionCreator} will
   * return a {@link PayloadAction} of type `T` with a payload of `undefined`
   */
  (): PayloadAction<undefined, T>;
}

/**
 * An action creator of type `T` that requires a payload of type P.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export interface ActionCreatorWithPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload of `P`
   */
  (payload: P): PayloadAction<P, T>;
}

/**
 * An action creator of type `T` whose `payload` type could not be inferred. Accepts everything as `payload`.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export interface ActionCreatorWithNonInferrablePayload<
  T extends string = string
> extends BaseActionCreator<unknown, T> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload
   * of exactly the type of the argument.
   */
  <PT extends unknown>(payload: PT): PayloadAction<PT, T>;
}

/**
 * An action creator that produces actions with a `payload` attribute.
 *
 * @typeParam P the `payload` type
 * @typeParam T the `type` of the resulting action
 * @typeParam PA if the resulting action is preprocessed by a `prepare` method, the signature of said method.
 *
 * @public
 */
export type PayloadActionCreator<
  P = void,
  T extends string = string,
  PA extends PrepareAction<P> | void = void
> = IfPrepareActionMethodProvided<
  PA,
  _ActionCreatorWithPreparedPayload<PA, T>,
  // else
  IsAny<
    P,
    ActionCreatorWithPayload<any, T>,
    IsUnknownOrNonInferrable<
      P,
      ActionCreatorWithNonInferrablePayload<T>,
      // else
      IfVoid<
        P,
        ActionCreatorWithoutPayload<T>,
        // else
        IfMaybeUndefined<
          P,
          ActionCreatorWithOptionalPayload<P, T>,
          // else
          ActionCreatorWithPayload<P, T>
        >
      >
    >
  >
>;

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass its arguments to this method to calculate payload & meta.
 *
 * @public
 */
export function createAction<P = void, T extends string = string>(
  type: T,
): PayloadActionCreator<P, T>;

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass its arguments to this method to calculate payload & meta.
 *
 * @public
 */
export function createAction<
  PA extends PrepareAction<any>,
  T extends string = string
>(
  type: T,
  prepareAction: PA,
): PayloadActionCreator<ReturnType<PA>['payload'], T, PA>;

export function createAction(type: string, prepareAction?: Function): any {
  function actionCreator(...args: any[]) {
    if (prepareAction) {
      let prepared = prepareAction(...args);
      if (!prepared) {
        throw new Error('prepareAction did not return an object');
      }

      return {
        type,
        payload: prepared.payload,
        ...('meta' in prepared && {meta: prepared.meta}),
        ...('error' in prepared && {error: prepared.error}),
      };
    }
    return {type, payload: args[0]};
  }

  actionCreator.toString = () => `${type}`;

  actionCreator.type = type;

  actionCreator.match = (action: Action<unknown>): action is PayloadAction =>
    action.type === type;

  return actionCreator;
}

export function isFSA(
  action: unknown,
): action is {
  type: string;
  payload?: unknown;
  error?: unknown;
  meta?: unknown;
} {
  return (
    isPlainObject(action) &&
    typeof (action as any).type === 'string' &&
    Object.keys(action).every(isValidKey)
  );
}

function isValidKey(key: string) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

/**
 * Returns the action type of the actions created by the passed
 * `createAction()`-generated action creator (arbitrary action creators
 * are not supported).
 *
 * @param action The action creator whose action type to get.
 * @returns The action type used by the action creator.
 *
 * @public
 */
export function getType<T extends string>(
  actionCreator: PayloadActionCreator<any, T>,
): T {
  return `${actionCreator}` as T;
}

// helper types for more readable typings

type IfPrepareActionMethodProvided<
  PA extends PrepareAction<any> | void,
  True,
  False
> = PA extends (...args: any[]) => any ? True : False;

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * Code below are made up only, no docs yet but will do in the future.
 * Same idea with RTK but no immer involve.
 * - Rogec
 */

export interface TypedActionCreator<Type extends string> {
  (...args: any[]): Action<Type>;
  type: Type;
}

export type CaseReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A,
) => S;

export function createReducer<S>(
  state: S,
  builder: (builder: ReducerBuilderInterface<S>) => void,
) {
  return (s = state, a: any) => {
    const b = new ReducerBuilder(s, a);
    builder(b);
    return b.build();
  };
}

interface ReducerBuilderInterface<State> {
  addCase<ActionCreator extends TypedActionCreator<string>>(
    action: ActionCreator,
    reducer: (state: State, action: ReturnType<ActionCreator>) => State,
  ): ReducerBuilderInterface<State> | undefined;
}

export class ReducerBuilder<State> implements ReducerBuilderInterface<State> {
  state: State;
  action: any;
  reducer: (state: State, action: any) => State;

  constructor(state: State, action: any) {
    this.state = state;
    this.action = action;
    this.reducer = () => this.state;
  }

  addCase<ActionCreator extends TypedActionCreator<string>>(
    action: ActionCreator,
    reducer: (state: State, action: ReturnType<ActionCreator>) => State,
  ) {
    if (action.type === this.action.type) {
      this.reducer = reducer;
    } else {
      return this;
    }
  }

  build() {
    return this.reducer(this.state, this.action);
  }
}
