import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  usersList: [],
  userNavbarDetails: {},
  userDetails: {},
  userpostList: [],
  loading: "",
};

export const getUserList = createAsyncThunk(
  "getUserList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/user/getAll", {
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

export const addUser = createAsyncThunk("addUser", async (data, thunkAPI) => {
  try {
    const response = await api.post("/admin/create/user", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(
      error.response ? error.response.data : error.message
    );
  }
});

export const userSignUp = createAsyncThunk(
  "userSignUp",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/create/user", data);
      // toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "updateUserStatus",
  async ({ id, formValues }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/user/update/${id}`, formValues);
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
      const response = await api.put("admin/user/bulk/actionUser", data);
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

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.usersList = action?.payload?.data?.users;
      state.paginationModel = action?.payload?.pagination || {};
    });
    builder.addCase(getUserList.rejected, (state) => {
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
      state.usersList = state.usersList.filter(
        (user) => user.id !== action.meta.arg
      );
    });
    builder.addCase(BulkUserAction.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
// export const {} = usersSlice.actions;
export default usersSlice.reducer;
