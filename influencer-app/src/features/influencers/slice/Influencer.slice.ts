import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getInfluencerList, createInfluencer } from "../api/influencerApi";
import { Influencer, InfluencerListSearch } from "../../../shared/types/models";
import { showNotification } from "../../notifications/slice/Notification.slice";
import { AppDispatch } from "../../../store";

interface InfluencerState {
  influencers: Influencer[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

const initialState: InfluencerState = {
  influencers: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
};

export const fetchInfluencers = createAsyncThunk(
  "influencers/fetchInfluencers",
  async (searchParams?: InfluencerListSearch) => {
    const response = await getInfluencerList(searchParams);
    return response;
  }
);

export const addInfluencer = createAsyncThunk<
  Influencer,
  Influencer,
  { dispatch: AppDispatch }
>("influencers/addInfluencer", async (influencer, { dispatch }) => {
  try {
    const response = await createInfluencer(influencer);
    dispatch(
      showNotification({
        type: "success",
        title: "Success!",
        message: `Influencer ${influencer.firstName} ${influencer.lastName} was created successfully.`,
      })
    );
    dispatch(setModalOpen(false));
    // const response = await getInfluencerList();
    return response;
  } catch (error) {
    dispatch(
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to create influencer. Please try again.",
      })
    );
    throw error;
  }
});

export const influencerSlice = createSlice({
  name: "influencers",
  initialState,
  reducers: {
    setInfluencers: (state, action: PayloadAction<Influencer[]>) => {
      state.influencers = action.payload;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfluencers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInfluencers.fulfilled, (state, action) => {
        state.influencers = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInfluencers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch influencers";
      })
      .addCase(addInfluencer.fulfilled, (state, action) => {
        state.influencers.push(action.payload);
      });
  },
});

export const { setInfluencers, setModalOpen } = influencerSlice.actions;
export default influencerSlice.reducer;
