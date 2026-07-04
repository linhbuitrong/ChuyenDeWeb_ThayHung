import { createSlice } from "@reduxjs/toolkit";

const initState = {
    cates: []
};

export const cateSlice = createSlice({
    name: "cate",
    initialState: initState,
    reducers: {
        loadCate: (state, action) => {
            state.cates = action.payload;  // Thay thế luôn, tránh trùng lặp
        }
    }
});

// Export action creator
export const { loadCate } = cateSlice.actions;

// BỔ SUNG: export reducer để dùng trong store
export default cateSlice.reducer;
