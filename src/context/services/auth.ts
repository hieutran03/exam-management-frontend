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
					role: { id: 0, name: "", permissions: [] },
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

			if (state.user.role.id === action.payload.user.role.id) {
				const updatedUser = {
					...state.user,
					role: action.payload.user.role,
				};
				localStorage.setItem("user", JSON.stringify(updatedUser));
				newState.user = updatedUser;
			}

			return newState;
		},
	},
});

export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
