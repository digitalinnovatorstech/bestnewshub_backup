import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  pageList: [],
  pageDetails: {},
  loading: "",
};

export const getPageList = createAsyncThunk(
  "getPageList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/pages/getAll", {
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

export const getPageDetails = createAsyncThunk(
  "getPageDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/pages/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deletePage = createAsyncThunk(
  "deletePage",
  async ({ pageId }, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/pages/delete/${pageId}`);
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

export const BulkPageDelete = createAsyncThunk(
  "BulkPageDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("/admin/pages/bulk/delete", data);
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

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPageList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getPageList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      // state.pageList = action?.payload?.data;
      state.pageList = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getPageList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getPageDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getPageDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.pageDetails = action?.payload?.data;
    });
    builder.addCase(getPageDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deletePage.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deletePage.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.pageList = state.pageList.filter(
        (page) => page.id !== action.meta.arg
      );
    });
    builder.addCase(deletePage.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkPageDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkPageDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.pageList = state.pageList.filter(
        (page) => page.id !== action.meta.arg
      );
    });
    builder.addCase(BulkPageDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = pageSlice.actions;
export default pageSlice.reducer;
