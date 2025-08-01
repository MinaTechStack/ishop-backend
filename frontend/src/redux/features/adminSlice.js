import { createSlice } from '@reduxjs/toolkit'

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        data: null,
        loginAt: null
    },
    reducers: {
        setAdmin: (state, current) => {
            state.data = current.payload.admin;
            state.loginAt = current.payload.loginAt;
        },
        removeAdmin: (state) => {
            state.data = null
            state.loginAt = null
            localStorage.removeItem("admin")
            localStorage.removeItem("loginAt")

        }

    }
})

export const { setAdmin, removeAdmin } = adminSlice.actions

export default adminSlice.reducer