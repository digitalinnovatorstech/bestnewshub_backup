import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  allcategoryList: [],
  allTagList: [],
  commentLsit: [],
  categoryFindall: [],
  genralInfo: {},
  socialList: [],
  socialInfo: {},
  customAssetList: [],
  customAssetDetails: {},
  logoDetails: {},
  loading: "",
};

export const getAllCategories = createAsyncThunk(
  "getAllCategories",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/category/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getAllTags = createAsyncThunk(
  "getAllTags",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/tags/list");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCommentList = createAsyncThunk(
  "getCommentList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/comments/getAll", {
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

export const BulkCommentDelete = createAsyncThunk(
  "BulkCommentDelete",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=DELETE",
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

export const BulkCommentApprove = createAsyncThunk(
  "BulkCommentApprove",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=STATUSCHANGE",
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

export const BulkCommentPending = createAsyncThunk(
  "BulkCommentPending",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=STATUSCHANGE",
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

export const BulkCommentSpam = createAsyncThunk(
  "BulkCommentSpam",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=STATUSCHANGE",
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

export const BulkCommentFlagged = createAsyncThunk(
  "BulkCommentFlagged",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=STATUSCHANGE",
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

export const BulkCommentReject = createAsyncThunk(
  "BulkCommentReject",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(
        "admin/comments/multiple/update/remove?action=STATUSCHANGE",
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

export const getCategoryFindall = createAsyncThunk(
  "getCategoryFindall",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/category/user/findAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getGenralInfo = createAsyncThunk(
  "getGenralInfo",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/setting/general");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addSocialInfo = createAsyncThunk(
  "addSocialInfo",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/social-media", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getSocialList = createAsyncThunk(
  "getSocialList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/social-media/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getSocialInfo = createAsyncThunk(
  "getSocialInfo",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/social-media/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateSocialInfo = createAsyncThunk(
  "updateSocialInfo",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/social-media/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteSocialInfo = createAsyncThunk(
  "deleteSocialInfo",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/social-media/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addCustomAsset = createAsyncThunk(
  "addCustomAsset",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/setting/appearance/add", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateCustomAsset = createAsyncThunk(
  "updateCustomAsset",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(
        `/admin/setting/appearance/add/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomAssetList = createAsyncThunk(
  "getCustomAssetList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/setting/appearance/get");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomAssetDetails = createAsyncThunk(
  "getCustomAssetDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/setting/appearance/get/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteCustomAsset = createAsyncThunk(
  "deleteCustomAsset",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/setting/appearance/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLogoDetails = createAsyncThunk(
  "getLogoDetails",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/global/siteLogo");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.allcategoryList = action?.payload?.data;
    });
    builder.addCase(getAllCategories.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getAllTags.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getAllTags.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.allTagList = action?.payload?.data?.tags;
    });
    builder.addCase(getAllTags.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getCommentList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCommentList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = action?.payload?.data;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getCommentList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkCommentDelete.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentDelete.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentDelete.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
    builder.addCase(BulkCommentApprove.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentApprove.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentApprove.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkCommentPending.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentPending.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentPending.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkCommentSpam.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentSpam.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentSpam.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkCommentFlagged.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentFlagged.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentFlagged.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(BulkCommentReject.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(BulkCommentReject.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.commentLsit = state.commentLsit.filter(
        (comment) => comment.id !== action.meta.arg
      );
    });
    builder.addCase(BulkCommentReject.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getCategoryFindall.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCategoryFindall.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.categoryFindall = action?.payload?.data;
    });
    builder.addCase(getCategoryFindall.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getGenralInfo.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getGenralInfo.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.genralInfo = action?.payload?.data;
    });
    builder.addCase(getGenralInfo.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getSocialList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getSocialList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.socialList = action?.payload?.data;
    });
    builder.addCase(getSocialList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getSocialInfo.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getSocialInfo.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.socialInfo = action?.payload?.data;
    });
    builder.addCase(getSocialInfo.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deleteSocialInfo.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteSocialInfo.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.socialList = state.socialList.filter(
        (social) => social.id !== action.meta.arg
      );
    });
    builder.addCase(deleteSocialInfo.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getCustomAssetList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCustomAssetList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.customAssetList = action?.payload?.data;
    });
    builder.addCase(getCustomAssetList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getCustomAssetDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCustomAssetDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.customAssetDetails = action?.payload?.data;
    });
    builder.addCase(getCustomAssetDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(deleteCustomAsset.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteCustomAsset.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.customAssetList = state.customAssetList.filter(
        (customAsset) => customAsset.id !== action.meta.arg
      );
    });
    builder.addCase(deleteCustomAsset.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLogoDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLogoDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.logoDetails = action?.payload?.data;
    });
    builder.addCase(getLogoDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = globalSlice.actions;
export default globalSlice.reducer;
