import { createSlice } from "@reduxjs/toolkit";

const FeedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeedItem: (state, action) => {
      if (!state) {
        return state;
      }

      return state.filter((user) => user._id !== action.payload);
    },
    removeFeed: (state, action) => null,
  },
});
export const { addFeed, removeFeed, removeFeedItem } = FeedSlice.actions;
export default FeedSlice.reducer;
