import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        final_total: 0,
        original_total: 0
    },
    reducers: {
        addItem: (state, current) => {
            const { final_price, original_price, productId } = current.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                state.items.push({ productId, qty: 1 });
            }
            state.original_total += original_price;
            state.final_total += final_price;
            localStorage.setItem("cart", JSON.stringify(state))
        },
        emptyCart: (state) => {
            state.items = [];
            state.final_total = 0;
            state.original_total = 0;
            localStorage.removeItem("cart");
        },
        qtyHandler: (state, action) => {
            const { productId, type, final_price, original_price } = action.payload;
            const item = state.items.find(i => i.productId === productId);
            if (!item) return;

            if (type === 'increment') {
                item.qty += 1;
                state.original_total += original_price;
                state.final_total += final_price;
            } else if (type === 'decrement') {
                if (item.qty > 1) {
                    item.qty -= 1;
                    state.original_total -= original_price;
                    state.final_total -= final_price;
                } else {
                    // Remove item completely when qty reaches 1 and user decrements
                    state.items = state.items.filter(i => i.productId !== productId);
                    state.original_total -= original_price;
                    state.final_total -= final_price;
                }
            }

            localStorage.setItem("cart", JSON.stringify(state));
        },
        lsToCart(state, current) {
            const lsCart = JSON.parse(localStorage.getItem("cart"));
            if (lsCart) {
                state.items = lsCart.items;
                state.final_total = lsCart.final_total;
                state.original_total = lsCart.original_total;
            }
        }
    }
})

export const { addItem, emptyCart, qtyHandler, lsToCart } = cartSlice.actions

export default cartSlice.reducer;
