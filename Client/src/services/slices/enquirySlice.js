import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  contactEnquiryList: [],
  contactAdsEnquiryList: [],
  userNavbarDetails: {},
  userDetails: {},
  userpostList: [],
  loading: "",
};

export const getContactEnquiryList = createAsyncThunk(
  "getContactEnquiryList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/admin/enquiry/getAll?contactType=ENQUIRY&currentPage=${_?.params?.currentPage}&perPage=${_?.params?.perPage}&searchQuery=${_?.params?.searchQuery}&status=${_?.params?.status}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAdsEnquiryList = createAsyncThunk(
  "getAdsEnquiryList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/admin/enquiry/getAll?contactType=ADVERTISEMENT&currentPage=${_?.params?.currentPage}&perPage=${_?.params?.perPage}&searchQuery=${_?.params?.searchQuery}&status=${_?.params?.status}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getUserNavbarDetails = createAsyncThunk(
  "getUserNavbarDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/user/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "getUserDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/user/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addEnquiryUser = createAsyncThunk(
  "addUser",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/enquiry/create", data);
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

export const updateEnquiryUser = createAsyncThunk(
  "updateEnquiryUser",
  async ({ id, formValues }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/enquiry/update/${id}`, formValues);
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

export const BulkUserAction = createAsyncThunk(
  "BulkUserAction",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(`/admin/enquiry/update/${data.id}`, data);
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

export const updateEnquiryStatus = createAsyncThunk(
  "updateEnquiryStatus",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/enquiry/update/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateAdsEnquiryStatus = createAsyncThunk(
  "updateAdsEnquiryStatus",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/enquiry/update/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const BulkAdsEnqueriesDelete = createAsyncThunk(
  "BulkAdsEnqueriesDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("admin/enquiry/delete", data);
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

export const BulkContactEnqueriesDelete = createAsyncThunk(
  "BulkContactEnqueriesDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("admin/enquiry/delete", data);
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

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContactEnquiryList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getContactEnquiryList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactEnquiryList = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getContactEnquiryList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getAdsEnquiryList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getAdsEnquiryList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactAdsEnquiryList = action?.payload?.data;
      // state.contactAdsEnquiryList = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getAdsEnquiryList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getUserNavbarDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getUserNavbarDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.userNavbarDetails = action?.payload?.data;
    });
    builder.addCase(getUserNavbarDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getUserDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.userDetails = action?.payload?.data;
      state.userpostList = action?.payload?.data?.posts;
    });
    builder.addCase(getUserDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkUserAction.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkUserAction.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactEnquiryList = state.contactEnquiryList.filter(
        (user) => user.id !== action.meta.arg
      );
    });
    builder.addCase(BulkUserAction.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(updateEnquiryStatus.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(updateEnquiryStatus.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactEnquiryList = state.contactEnquiryList.filter(
        (user) => user.id !== action.meta.arg
      );
    });
    builder.addCase(updateEnquiryStatus.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(updateAdsEnquiryStatus.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(updateAdsEnquiryStatus.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactAdsEnquiryList = state.contactAdsEnquiryList.filter(
        (user) => user.id !== action.meta.arg
      );
    });
    builder.addCase(updateAdsEnquiryStatus.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkAdsEnqueriesDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkAdsEnqueriesDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactAdsEnquiryList = state.contactAdsEnquiryList.filter(
        (contactAds) => contactAds.id !== action.meta.arg
      );
    });
    builder.addCase(BulkAdsEnqueriesDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkContactEnqueriesDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkContactEnqueriesDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.contactEnquiryList = state.contactEnquiryList.filter(
        (contact) => contact.id !== action.meta.arg
      );
    });
    builder.addCase(BulkContactEnqueriesDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = usersSlice.actions;
export default enquirySlice.reducer;
