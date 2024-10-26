import { useCallback, useMemo, useState } from "react";

export interface UseStateHistoryHandlers<T> {
	set: (value: T) => void;
	back: (steps?: number) => void;
	forward: (steps?: number) => void;
}

export interface StateHistory<T> {
	history: T[];
	current: number;
}

export function useStateHistory<T>(
	initialValue: T
): [T, UseStateHistoryHandlers<T>, StateHistory<T>] {
	// INITIALIZE STATE
	const [state, setState] = useState<StateHistory<T>>({
		history: [initialValue],
		current: 0,
	});

	// SET STATE
	const set = useCallback(
		(val: T) =>
			setState((currentState) => {
				const nextState = [...currentState.history.slice(0, currentState.current + 1), val];
				return {
					history: nextState,
					current: nextState.length - 1,
				};
			}),
		[]
	);

	// BACK
	const back = useCallback(
		(steps = 1) =>
			setState((currentState) => ({
				history: currentState.history,
				current: Math.max(0, currentState.current - steps),
			})),
		[]
	);

	// FORWARD
	const forward = useCallback(
		(steps = 1) =>
			setState((currentState) => ({
				history: currentState.history,
				current: Math.min(currentState.history.length - 1, currentState.current + steps),
			})),
		[]
	);

	// HANDLERS MEMOIZED
	const handlers = useMemo(() => ({ set, forward, back }), [set, forward, back]);

	// RETURN STATE
	return [state.history[state.current], handlers, state];
}
