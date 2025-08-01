import { configureStore } from '@reduxjs/toolkit'
import adminSlice from './features/adminSlice'
import cartSlice from './features/cartSlice'
import userSlice from './features/userSlice'

const store = configureStore({
    reducer: {
        admin: adminSlice,
        cart: cartSlice,
        user: userSlice
    }
})
export default store