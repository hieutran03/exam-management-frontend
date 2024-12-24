import { User } from "@/interface";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
	user: User;
}
export const initialStateAuth: AuthState = {
	user: localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user") || "")
		: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState: initialStateAuth,
	reducers: {
		login: (
			state,
			action: PayloadAction<{
				user: User;
			}>,
		) => {
			const newState: AuthState = {
				...state,
				user: action.payload.user,
			};
			localStorage.setItem("user", JSON.stringify(action.payload.user));

			return newState;
		},
		logout: (state) => {
			localStorage.removeItem("user");
			return {
				...state,
				user: {
					id: 0,
					name: "",
					username: "",
					role: { name: "", permissions: [] },
				},
			};
		},
		update: (
			state,
			action: PayloadAction<{
				user: User;
			}>,
		) => {
			const newState: AuthState = {
				...state,
				user: action.payload.user,
			};
			localStorage.setItem("user", JSON.stringify(action.payload.user));

			return newState;
		},
	},
});

export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
