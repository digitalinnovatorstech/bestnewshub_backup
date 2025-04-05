import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  login: {},
  otp: {},
  verify: {},
  password: {},
  loading: "",
};

export const getLogin = createAsyncThunk(
  "employeeOrAdminLogin",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/login/user", data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingLogin = createAsyncThunk(
  "getLandingLogin",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/login/user", data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingSignUp = createAsyncThunk(
  "getLandingSignUp",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/create/user", data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingOTPSend = createAsyncThunk(
  "landingOTPSend",
  async ({ data }, thunkAPI) => {
    try {
      const response = await api.post(`/landing/user/verifyEmail`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingOTPVerify = createAsyncThunk(
  "landingOTPVerify",
  async ({ data }, thunkAPI) => {
    try {
      const response = await api.post(`/landing/user/email/otp/verify`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const resetPasswordOTP = createAsyncThunk(
  "resetPasswordOTP",
  async (email, thunkAPI) => {
    try {
      const response = await api.get(`/admin/reset/password/otp/${email}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const otpVerify = createAsyncThunk(
  "otpVerify",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/reset/password/otp/verify", data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (data, thunkAPI) => {
    try {
      const response = await api.put("/admin/reset/password", data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.message || error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLogin.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLogin.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.login = action?.payload?.data;
    });
    builder.addCase(getLogin.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(resetPasswordOTP.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(resetPasswordOTP.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.otp = action?.payload?.data;
    });
    builder.addCase(resetPasswordOTP.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(otpVerify.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(otpVerify.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.verify = action?.payload?.data;
    });
    builder.addCase(otpVerify.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.password = action?.payload?.data;
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});

// export const {} = globalSlice.actions;
export default authSlice.reducer;
