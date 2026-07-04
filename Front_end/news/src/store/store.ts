import { configureStore } from "@reduxjs/toolkit";
import cateReducer from "./cateReducer";

export const store = configureStore({
    reducer: {
        cate: cateReducer,
    },
});

// Kiểu state toàn bộ store
export type RootState = ReturnType<typeof store.getState>;

// Kiểu dispatch
export type AppDispatch = typeof store.dispatch;
