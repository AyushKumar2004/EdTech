import {createSlice} from "@reduxjs/toolkit"

const initialState={
    loading:false,
    signupData:null,
    token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
};

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData(state,value){
            state.signupData=value.payload
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setToken(state,value){
            state.token=value.payload;//value.payload is comming from the user in this form in redux and it is going in this state
        },
    },
});

export const {setSignupData,setLoading,setToken}=authSlice.actions;
export default authSlice.reducer;