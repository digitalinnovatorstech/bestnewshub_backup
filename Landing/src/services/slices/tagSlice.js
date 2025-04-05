import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  tagList: [],
  tagDetails: {},
  loading: "",
};

export const getTagList = createAsyncThunk(
  "getTagList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/tags/getAll", {
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

export const getTagDetails = createAsyncThunk(
  "getTagDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/tags/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addTag = createAsyncThunk("addTag", async (data, thunkAPI) => {
  try {
    const response = await api.post("/admin/tags/create", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(
      error.response ? error.response.data : error.message
    );
  }
});

export const updateTag = createAsyncThunk(
  "updateTag",
  async ({ tagId, changedValues }, thunkAPI) => {
    try {
      const response = await api.put(
        `/admin/tags/update/${tagId}`,
        changedValues
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

export const deleteTag = createAsyncThunk(
  "deleteTag",
  async ({ tagId }, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/tags/delete/${tagId}`);
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

export const BulkTagDelete = createAsyncThunk(
  "BulkTagDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("admin/tags/bulk/delete", data);
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

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTagList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getTagList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      // state.tagList = action?.payload?.data;
      state.tagList = action?.payload?.data?.tags;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getTagList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getTagDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getTagDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.tagDetails = action?.payload?.data;
    });
    builder.addCase(getTagDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deleteTag.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.tagList = state.tagList.filter((tag) => tag.id !== action.meta.arg);
    });
    builder.addCase(deleteTag.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkTagDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkTagDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.tagList = state.tagList.filter((tag) => tag.id !== action.meta.arg);
    });
    builder.addCase(BulkTagDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = tagSlice.actions;
export default tagSlice.reducer;
