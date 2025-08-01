import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        loginAt: null,
        token: null
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.data = payload.data;
            state.loginAt = new Date().toISOString();
            state.token = payload.token;

            localStorage.setItem("user", JSON.stringify(state));
        },

        lsToUser: (state) => {
            const lsUser = JSON.parse(localStorage.getItem("user"));
            if (lsUser) {
                state.data = lsUser.data;
                state.token = lsUser.token;
                state.loginAt = lsUser.loginAt;
            }


        },
        logoutUser: (state) => {
            state.data = null;
            state.token = null;
            state.loginAt = null;

            localStorage.removeItem("user")

        }

    }
})

// Action creators are generated for each case reducer function
export const { setUser, lsToUser, logoutUser } = userSlice.actions

export default userSlice.reducer