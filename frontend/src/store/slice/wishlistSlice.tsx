import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface  WishListItem{
    _id:string;
    products:string[];
}

interface WishListState{
    items:WishListItem[];

}

const initialState : WishListState = {
    items:[ ],
}


const wishlistSlice = createSlice({
    name:"whishlist",
    initialState,
    reducers:{
        setWishlist:(state, action:PayloadAction<WishListItem>)=>{
            state.items = [action.payload]
        },
        clearWishlist:(state)=>{
            state.items = []
        },
        addToWishlist:(state, action:PayloadAction<WishListItem>)=>{
            const existingItemsIndex = state.items.findIndex(item => item._id === action.payload._id)
            if(existingItemsIndex !==-1){
                state.items[existingItemsIndex] = action.payload
            }else{
                state.items.push(action.payload)
            }
        },
        removeFromWishlist:(state, action:PayloadAction<string>)=>{
            state.items = state.items
                .map((item) => ({
                    ...item,
                    products: item.products.filter(productId => productId !== action.payload)
                }))
                .filter(item => item.products.length > 0)
        }

    }
})


export const {setWishlist, clearWishlist, addToWishlist, removeFromWishlist} = wishlistSlice.actions
export default wishlistSlice.reducer