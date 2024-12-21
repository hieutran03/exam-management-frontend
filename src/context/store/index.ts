import { configureStore } from "@reduxjs/toolkit";

import loader from "../services/loading";
import auth from "../services/auth";

export const store = configureStore({
	reducer: {
		loader,
		auth,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
