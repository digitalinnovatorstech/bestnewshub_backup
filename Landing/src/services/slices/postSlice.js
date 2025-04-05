import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  postList: [],
  postDetails: {},
  loading: "",
};

export const getPostList = createAsyncThunk(
  "getPostList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/posts/getAll", {
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

export const getPostDetails = createAsyncThunk(
  "getPostDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/posts/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addPost = createAsyncThunk("addPost", async (data, thunkAPI) => {
  try {
    const response = await api.post("/admin/posts/create", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(
      error.response ? error.response.data : error.message
    );
  }
});

export const deletePost = createAsyncThunk(
  "deletePost",
  async ({ postId }, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/posts/delete/${postId}`);
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

export const BulkPostDelete = createAsyncThunk(
  "BulkPostDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/post/multiple/update/remove?action=DELETE",
        data
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

export const BulkPostApprove = createAsyncThunk(
  "BulkPostApprove",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/post/multiple/update/remove?action=STATUSCHANGE",
        data
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

export const BulkPostReject = createAsyncThunk(
  "BulkPostReject",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/post/multiple/update/remove?action=STATUSCHANGE",
        data
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

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPostList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getPostList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      // state.postList = action?.payload?.data;
      state.postList = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getPostList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getPostDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getPostDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.postDetails = action?.payload?.data?.post;
    });
    builder.addCase(getPostDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deletePost.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.postList = state.postList.filter(
        (post) => post.id !== action.meta.arg
      );
    });
    builder.addCase(deletePost.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkPostDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkPostDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.postList = state.postList.filter(
        (post) => post.id !== action.meta.arg
      );
    });
    builder.addCase(BulkPostDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkPostApprove.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkPostApprove.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.postList = state.postList.filter(
        (post) => post.id !== action.meta.arg
      );
    });
    builder.addCase(BulkPostApprove.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkPostReject.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkPostReject.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.postList = state.postList.filter(
        (post) => post.id !== action.meta.arg
      );
    });
    builder.addCase(BulkPostReject.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = postSlice.actions;
export default postSlice.reducer;
