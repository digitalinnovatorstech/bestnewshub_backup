import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  categoriesList: [],
  categoriesDetails: {},
  loading: "",
};

export const getCategoriesList = createAsyncThunk(
  "getCategoriesList",
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

export const getCategoryDetails = createAsyncThunk(
  "getCategoryDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/category/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "addCategory",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/admin/category/create", data);
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

export const updateCategory = createAsyncThunk(
  "updateCategory",
  async ({ categoryId, changedValues }, thunkAPI) => {
    try {
      const response = await api.put(
        `/admin/category/update/${categoryId}`,
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

export const deleteCategories = createAsyncThunk(
  "deleteCategories",
  async ({ categoryId }, thunkAPI) => {
    try {
      const response = await api.delete(`/admin/category/delete/${categoryId}`);
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

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategoriesList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCategoriesList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.categoriesList = action?.payload?.data;
    });
    builder.addCase(getCategoriesList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getCategoryDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getCategoryDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.categoriesDetails = action?.payload?.data;
    });
    builder.addCase(getCategoryDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    // builder.addCase(deleteCategories.pending, (state) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(deleteCategories.fulfilled, (state, action) => {
    //   state.loading = "complete_success";
    //   state.categoriesList = state.categoriesList.filter(
    //     (categories) => categories.id !== action.meta.arg
    //   );
    // });
    // builder.addCase(deleteCategories.rejected, (state) => {
    //   state.authLoading = "complete_failure";
    // });
  },
});
// export const {} = categoriesSlice.actions;
export default categoriesSlice.reducer;
