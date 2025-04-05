import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
const initialState = {
  dashbaordoverviewList: [],
  dashbaordcommentsList: [],
  dashbaordBarchart: [],
  dashbaordCommentList: [],
  loading: "",
};

// router.get("/dashboard/overview", auth, getTotalPostCount);
// router.get("/dashboard/overview/comments", auth, gotOverview);
// router.get("/dashboard/posts/barchart", auth, getPostsBarChart);
export const getDashbaordOverview = createAsyncThunk(
  "getDashbaordOverview",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/dashboard/overview");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const getDashbaordComments = createAsyncThunk(
  "getDashbaordComments",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/dashboard/overview/comments");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getDashbaordBarchart = createAsyncThunk(
  "getDashbaordBarchart",
  async (filterType, thunkAPI) => {
    try {
      const response = await api.get(
        `/admin/dashboard/posts/barchart?filterType=${filterType}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getDashbaordCommentList = createAsyncThunk(
  "getDashbaordCommentList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/admin/dashboard/ads/recentComments?perPage=5&currentPage=1`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashbaordOverview.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getDashbaordOverview.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.dashbaordoverviewList = action?.payload?.data;
    });
    builder.addCase(getDashbaordOverview.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getDashbaordComments.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getDashbaordComments.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.dashbaordcommentsList = action?.payload?.data;
    });
    builder.addCase(getDashbaordComments.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getDashbaordBarchart.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getDashbaordBarchart.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.dashbaordBarchart = action?.payload?.data;
    });
    builder.addCase(getDashbaordBarchart.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getDashbaordCommentList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getDashbaordCommentList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.dashbaordCommentList = action?.payload?.data;
    });
    builder.addCase(getDashbaordCommentList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
