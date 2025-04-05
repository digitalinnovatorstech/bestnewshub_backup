import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  advisementList: [],
  advisementDetails: {},
  googleAdsList: [],
  googleAdsDetails: {},
  loading: "",
};

export const getadvisementList = createAsyncThunk(
  "getadvisementList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/advertisement/getAll", {
        params: _.params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getadvisementDetails = createAsyncThunk(
  "getadvisementDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/advertisement/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteAdvertisement = createAsyncThunk(
  "deleteAdvertisement",
  async ({ advisementId }, thunkAPI) => {
    try {
      const response = await api.delete(
        `/admin/advertisement/delete/${advisementId}`
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const BulkAdvertisementDelete = createAsyncThunk(
  "BulkAdvertisementDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("admin/advertisement/delete/bulk", data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// google ads

export const getGoogleAdsList = createAsyncThunk(
  "getGoogleAdsList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds", {
        params: _.params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getGoogleAdsDetails = createAsyncThunk(
  "getGoogleAdsDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/googleAds/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addGoogleAds = createAsyncThunk(
  "addGoogleAds",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/googleAds", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateGoogleAds = createAsyncThunk(
  "updateGoogleAds",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/googleAds/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateGoogleAdsCustom = createAsyncThunk(
  "updateGoogleAdsCustom",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(
        `/admin/googleAd/changeStatus?id=${id}&status=${data.status}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteGoogleAds = createAsyncThunk(
  "deleteGoogleAds",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/googleAds/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const advisementSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getadvisementList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getadvisementList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.advisementList = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getadvisementList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getadvisementDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getadvisementDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.advisementDetails = action?.payload?.data;
    });
    builder.addCase(getadvisementDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deleteAdvertisement.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteAdvertisement.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.advisementList = state.advisementList.filter(
        (advertisement) => advertisement.id !== action.meta.arg
      );
    });
    builder.addCase(deleteAdvertisement.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkAdvertisementDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkAdvertisementDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.advisementList = state.advisementList.filter(
        (advisement) => advisement.id !== action.meta.arg
      );
    });
    builder.addCase(BulkAdvertisementDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getGoogleAdsList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getGoogleAdsList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.googleAdsList = action?.payload?.data;
      // state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getGoogleAdsList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getGoogleAdsDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getGoogleAdsDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.googleAdsDetails = action?.payload?.data;
    });
    builder.addCase(getGoogleAdsDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deleteGoogleAds.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteGoogleAds.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.googleAdsList = state.googleAdsList.filter(
        (google) => google.id !== action.meta.arg
      );
    });
    builder.addCase(deleteGoogleAds.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = advisementSlice.actions;
export default advisementSlice.reducer;
