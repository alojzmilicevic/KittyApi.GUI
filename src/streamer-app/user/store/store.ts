import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/store";

interface UsersState {
    users: string[],
}

const initialState: UsersState = {
    users: [],
}

export const users = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<{ userId: string }>) => {
            state.users.push(action.payload.userId);
        },
        removeUser: (state, action: PayloadAction<{ userId: string }>) => {
            state.users = state.users.filter(x => x !== action.payload.userId)
        }
    },
})

export const getUsers = (state: RootState) => state.users.users;

// Action creators are generated for each case reducer function
export const { addUser, removeUser } = users.actions;
