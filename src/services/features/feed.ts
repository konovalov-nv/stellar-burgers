import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { RootState } from '../store';

interface FeedState {
  data: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  data: null,
  isLoading: true,
  error: null
};

export const getFeed = createAsyncThunk<TOrdersData>('feed/getFeed', async () =>
  getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })

      .addCase(getFeed.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })

      .addCase(getFeed.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error';
        state.isLoading = false;
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const selectFeed = (state: RootState) => state.feed.data;
export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;
