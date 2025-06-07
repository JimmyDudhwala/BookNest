import { User } from "@/lib/types/type";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

// Define a proper User interface instead of using 'any'


interface UserState {
    user: User | null; // Fixed: Replaced 'any' with proper User type
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;        
}

const initialState: UserState={
    user:null,
    isEmailVerified:false,
    isLoginDialogOpen:false,
    isLoggedIn:false 
}

const userSlice  = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state, action:PayloadAction<User>) =>{ // Fixed: Changed from UserState to User
            state.user = action.payload;
            state.isLoggedIn = true; // Set logged in when user is set
        },
        setEmailVerified:(state, action:PayloadAction<boolean>) =>{
            state.isEmailVerified = action.payload
        },
        logout:(state)=>{
            state.user= null;
            state.isEmailVerified= false;
            state.isLoggedIn=false;
            state.isLoginDialogOpen=false; // Close login dialog on logout
        },
        toggleLoginDialog:(state)=>{
            state.isLoginDialogOpen = !state.isLoginDialogOpen
        },
        authState:(state) =>{
            state.isLoggedIn= true
        },
    }
})

export const {setUser , setEmailVerified, logout, toggleLoginDialog, authState } = userSlice.actions;
export default userSlice.reducer