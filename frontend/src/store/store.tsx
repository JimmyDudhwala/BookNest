import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER} from 'redux-persist'
import  userReducer  from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from './slice/wishlistSlice'
import checkoutReducer from './slice/checkoutSlice'
import {api} from "./api"

//Persist Configuration for user 

const userPersistConfig = {key:'user', storage, whiteList:['user', 'isEmailVerified', 'isLoggedIn']}
const cartPersistConfig = {key:'cart', storage, whiteList:['items']}
const wishlistPersistConfig = {key:'wishlist', storage}
const checkoutPersistConfig = {key:'checkout', storage}

//wrap reducers with persist config

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer)
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer)

export const store = configureStore({
    reducer:{
        [api.reducerPath]: api.reducer,
        user:persistedUserReducer,
        cart:persistedCartReducer,
        wishlist:persistedWishlistReducer,
        checkout:persistedCheckoutReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(api.middleware)
});

//setup the listener for RTK Query
setupListeners(store.dispatch)

//create a persister
export const persister =  persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.getState