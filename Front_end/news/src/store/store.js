import {configureStore} from "@reduxjs/toolkit";
import {cateSlice} from "./cateReducer";

export const store = configureStore({
    reducer : {
        cate: cateSlice.reducer,
    }
})
// Kiểu state toàn bộ store
export type RootState = ReturnType<typeof store.getState>;

// Kiểu dispatch
export type AppDispatch = typeof store.dispatch;