import { createSlice } from '@reduxjs/toolkit';

let savedCart = null;
try {
    savedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;
} catch {
    savedCart = null;
}

const initialState = savedCart
    ? { ...savedCart, paymentMethod: savedCart.paymentMethod === 'Razorpay' ? 'COD' : (savedCart.paymentMethod || 'COD') }
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'COD' };

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const updateCart = (state) => {
    // Calculate total MRP (incl. of all taxes)
    const totalMrp = state.cartItems.reduce((acc, item) => {
        const mrp = (item.mrp && Number(item.mrp) > Number(item.price)) ? Number(item.mrp) : Number(item.price);
        return acc + mrp * item.qty;
    }, 0);
    state.mrpPrice = addDecimals(totalMrp);

    // Calculate items selling price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

    // Calculate discount on MRP
    const discount = Math.max(0, totalMrp - Number(state.itemsPrice));
    state.discountPrice = addDecimals(discount);

    // Calculate shipping price based on product-level shipping charges set by admin
    state.shippingPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + (Number(item.shippingCharge) || 0), 0)
    );

    // Calculate tax price based on product-level GST percent set by admin
    state.taxPrice = addDecimals(
        state.cartItems.reduce((acc, item) => {
            const gst = Number(item.gstPercent) || 0;
            return acc + (item.price * item.qty * gst) / 100;
        }, 0)
    );

    // Calculate total fees (shipping + tax)
    state.feesPrice = addDecimals(Number(state.shippingPrice) + Number(state.taxPrice));

    // Calculate total payable price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    // Calculate total savings (MRP - Total Price)
    state.totalSavings = Math.max(0, Math.round(totalMrp - Number(state.totalPrice)));

    localStorage.setItem('cart', JSON.stringify(state));
};

if (initialState.cartItems && initialState.cartItems.length > 0) {
    updateCart(initialState);
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
