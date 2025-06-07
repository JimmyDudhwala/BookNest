import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface checkoutState{
    step:"cart" | "addresses" | 'payment',
    orderId:string | null,
    orderAmount:number | null
}

const  initialState: checkoutState = {
    step:"cart",
    orderId: null,
    orderAmount: null
}

const checkoutSlice = createSlice({
    name:"checkout",
    initialState,
    reducers:{
        setCheckoutStep : (state,action:PayloadAction<"cart" | "addresses" | 'payment'>) => {
                state.step = action.payload
        },
        setOrderId: (state,action:PayloadAction<string | null>) => {
            state.orderId = action.payload
        },

        setOrderAmount: (state,action:PayloadAction<number | null>) => {
            state.orderAmount = action.payload
        },
        resetCheckout : (state) => {
            state.step = "cart"; // Fixed: Changed comma to semicolon
            state.orderAmount = null;
            state.orderId = null; // Added: Reset orderId as well for complete reset
        }
    }
    
})

export const {setCheckoutStep,setOrderId,setOrderAmount,resetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer