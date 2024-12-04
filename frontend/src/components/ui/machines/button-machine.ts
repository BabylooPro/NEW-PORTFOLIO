import { assign, setup } from "xstate";

const progressButtonMachine = setup({
	types: {
		context: {} as {
			progress: number;
		},
		events: {} as
			| { type: "click" }
			| { type: "complete" }
			| { type: "setProgress"; progress: number }
			| { type: "reset" }
			| { type: "error" },
	},
}).createMachine({
	context: {
		progress: 0,
	},
	id: "progressButton",
	initial: "idle",

	states: {
		idle: {
			on: {
				click: "inProgress",
				reset: {
					target: "idle",
					actions: assign(() => ({
						progress: 0,
					})),
				},
			},
		},
		inProgress: {
			on: {
				setProgress: {
					actions: assign(({ event }) => ({
						progress: event.progress,
					})),
				},
				complete: "success",
				error: "error",
				reset: {
					target: "idle",
					actions: assign(() => ({
						progress: 0,
					})),
				},
			},
		},
		success: {
			after: {
				1500: "successFadeOut",
			},
			on: {
				reset: {
					target: "idle",
					actions: assign(() => ({
						progress: 0,
					})),
				},
			},
		},
		successFadeOut: {
			after: {
				10: "idle",
			},
		},
		error: {
			on: {
				reset: {
					target: "idle",
					actions: assign(() => ({
						progress: 0,
					})),
				},
			},
		},
	},
});

export { progressButtonMachine };
