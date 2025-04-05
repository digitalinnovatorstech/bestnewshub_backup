import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utility/hook/api";
import { toast } from "react-toastify";
const initialState = {
  landingHeroSection: [],
  landingcategoryNameList: [],
  landingPopularCategoryList: [],
  landingPostList: [],
  landingInternationList: [],
  landingntionalList: [],
  landingShortList: [],
  landingFeaturedList: [],
  landingEasySearchList: [],
  landingMorePoList: [],
  landingPostDetails: "",
  landingPostDetailsByParmalinks: "",
  landingCategoryDetails: [],
  landingCategoryIdShort: [],
  landingCategoryIdHighlight: [],
  landingCategoryIdExplore: [],
  landingCategoryIdMore: [],
  landingHomeAdsList: [],
  landingHeaderAdsList: [],
  landingCategoryAdsList: [],
  landingArticleAdsList: [],
  landingSaveItemList: [],
  landingYourPostList: [],
  landingYourPendingPostList: [],
  landingNotificationList: {},
  LandingNotificationListAll: [],
  landingSearchingList: [],
  landingSocialList: [],
  landingPageList: [],
  selectedPageId: null,
  landingPageDetails: {},
  landingPageDetailsByParmalinks: {},
  landingGoogleAdsHeaderList: [],
  landingGoogleAdsHomeList: [],
  landingGoogleAdsCategoryList: [],
  landingGoogleAdsArticleList: [],
  landingGoogleAdsPageList: [],
  metaInfo: [],
  loading: "idle",
};

const loginUserDetails = localStorage.getItem("loginUser");
const validUser = loginUserDetails ? JSON.parse(loginUserDetails) : null;

export const getLandingcategoryNameList = createAsyncThunk(
  "getLandingcategoryNameList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/category/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPopularCategoryList = createAsyncThunk(
  "getLandingPopularCategoryList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/category/popular");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPostList = createAsyncThunk(
  "getLandingPostList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/pages/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingInternationaList = createAsyncThunk(
  "getLandingInternationaList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        "/landing/posts/homePage?positionQuery=INTERNATIONAL"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingHeroSection = createAsyncThunk(
  "getLandingHeroSection",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/posts/home/heroSection");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingNationaList = createAsyncThunk(
  "getLandingNationaList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        "/landing/posts/homePage?positionQuery=NATIONAL"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingShortList = createAsyncThunk(
  "getLandingShortList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        "/landing/posts/homePage?positionQuery=SHORT&limit=10"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingFeaturedList = createAsyncThunk(
  "getLandingFeaturedList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        "/landing/posts/homePage?positionQuery=FEATURED&limit=10"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingEasySearchList = createAsyncThunk(
  "getLandingEasySearchList",
  async (category, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/homePage?positionQuery=EASY_SEARCH&category=${
          category || ""
        }&limit=7`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingMorePoList = createAsyncThunk(
  "getLandingMorePoList",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/morePosts?category=${id || ""}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPostDetails = createAsyncThunk(
  "getLandingPostDetails",
  async (id, thunkAPI) => {
    try {
      let response;
      if (!validUser) {
        response = await api.get(`/landing/posts/getById/${id}`);
      } else {
        response = await api.get(`/admin/posts/getById/${id}`);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPostDetailsByParmalink = createAsyncThunk(
  "getLandingPostDetailsByParmalink",
  async ({ links, id }, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getByPermalink?permalink=${links}&userId=${id || null}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCommentList = createAsyncThunk(
  "getLandingCommentList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/comments/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "addComment",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/comments/create", data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      // toast.error(error.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryDetails = createAsyncThunk(
  "getLandingCategoryDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/landing/posts/getByCategory/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryIdShort = createAsyncThunk(
  "getLandingCategoryIdShort",
  async ({ id }, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getByCategory/${id}?positionQuery=SHORT`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryIdHighlight = createAsyncThunk(
  "getLandingCategoryIdHighlight",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getByCategory/${id}?positionQuery=HIGHLIGHTS`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryIdExplore = createAsyncThunk(
  "getLandingCategoryIdExplore",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getByCategory/${id}?positionQuery=EXPLOREMORE`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryIdMore = createAsyncThunk(
  "getLandingCategoryIdMore",
  async ({ id, page }, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getByCategory/${id}?positionQuery=MORE&page=${page.currentPage}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingHomeAdsList = createAsyncThunk(
  "getLandingHomeAdsList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/advertisement/position/HOME");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingCategoryAdsList = createAsyncThunk(
  "getLandingCategoryAdsList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        "/landing/advertisement/position/CATEGORY"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingArticleAdsList = createAsyncThunk(
  "getLandingArticleAdsList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/advertisement/position/ARTICLE");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingSaveItem = createAsyncThunk(
  "landingSaveItem",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/savedPost/create", data);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingSaveItemList = createAsyncThunk(
  "getLandingSaveItemList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/savedPosts/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingRemoveSaveItemList = createAsyncThunk(
  "landingRemoveSaveItemList",
  async (postId, thunkAPI) => {
    try {
      const response = await api.delete(`/landing/savedPost/delete/${postId}`);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingProfileUpdate = createAsyncThunk(
  "landingProfileUpdate",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.delete(`/landing/user/update/${id}`, data);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingYourPostList = createAsyncThunk(
  "getLandingYourPostList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/pages/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingYourPendingPostList = createAsyncThunk(
  "getLandingYourPendingPostList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/pages/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingNotitcationUpdate = createAsyncThunk(
  "getLandingNotitcationUpdate",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/setting/general/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingUserNavbarDetails = createAsyncThunk(
  "getLandingUserNavbarDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/landing/user/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingDisplayNameUpdate = createAsyncThunk(
  "getLandingDisplayNameUpdate",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/landing/user/update/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingNotification = createAsyncThunk(
  "getLandingNotification",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/landing/setting/general`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateNotifications = createAsyncThunk(
  "updateNotifications",
  async ({ data }, thunkAPI) => {
    try {
      const response = await api.put(`/landing/setting/general`, data);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingNotificationAll = createAsyncThunk(
  "getLandingNotificationAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/landing/notification/getAll`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingNotificationRead = createAsyncThunk(
  "landingNotificationRead",
  async (id, thunkAPI) => {
    try {
      const response = await api.put(`/landing/notifications/read/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const landingNotificationRemove = createAsyncThunk(
  "landingNotificationRemove",
  async (payloadDelete, thunkAPI) => {
    try {
      const response = await api.put(
        `/landing/notification/delete`,
        payloadDelete
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingSearchQuery = createAsyncThunk(
  "getLandingSearchQuery",
  async (query, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/posts/getSeachPosts?searchQuery=${query}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingSocialList = createAsyncThunk(
  "getLandingSocialList",
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

export const getLandingPageList = createAsyncThunk(
  "getLandingPageList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/pages/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPageDetails = createAsyncThunk(
  "getLandingPageDetails",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/landing/pages/getById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingPageDetailsByParmalinks = createAsyncThunk(
  "getLandingPageDetailsByParmalinks",
  async (link, thunkAPI) => {
    try {
      const response = await api.get(
        `/landing/pages/getByPermalink?permalink=${link}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingGoogleAdsHeaderList = createAsyncThunk(
  "getLandingGoogleAdsHeaderList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds/getByPage/Header");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingGoogleAdsHomeList = createAsyncThunk(
  "getLandingGoogleAdsHomeList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds/getByPage/Home");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingGoogleAdsCategoryList = createAsyncThunk(
  "getLandingGoogleAdsCategoryList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds/getByPage/Category");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingGoogleAdsArticleList = createAsyncThunk(
  "getLandingGoogleAdsArticleList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds/getByPage/Article");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getLandingGoogleAdsPageList = createAsyncThunk(
  "getLandingGoogleAdsPageList",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/googleAds/getByPage/Pages");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addEnquiry = createAsyncThunk(
  "addEnquiry",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/landing/enquiry/create", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getHomeMetaInfo = createAsyncThunk(
  "getHomeMetaInfo",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/landing/home/getMetaInfo");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    setSelectedPageId: (state, action) => {
      state.selectedPageId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLandingcategoryNameList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingcategoryNameList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingcategoryNameList = action?.payload?.data;
    });
    builder.addCase(getLandingcategoryNameList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPopularCategoryList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingPopularCategoryList.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingPopularCategoryList = action?.payload?.data?.categories;
      }
    );
    builder.addCase(getLandingPopularCategoryList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPostList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingPostList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingPostList = action?.payload?.data;
    });
    builder.addCase(getLandingPostList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingInternationaList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingInternationaList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingInternationList = action?.payload?.data;
    });
    builder.addCase(getLandingInternationaList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingNationaList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingNationaList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingntionalList = action?.payload?.data;
    });
    builder.addCase(getLandingNationaList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingShortList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingShortList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingShortList = action?.payload?.data;
    });
    builder.addCase(getLandingShortList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingFeaturedList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingFeaturedList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingFeaturedList = action?.payload?.data;
    });
    builder.addCase(getLandingFeaturedList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingEasySearchList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingEasySearchList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingEasySearchList = action?.payload?.data;
    });
    builder.addCase(getLandingEasySearchList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingMorePoList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingMorePoList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingMorePoList = action?.payload?.data;
    });
    builder.addCase(getLandingMorePoList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingHeroSection.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingHeroSection.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingHeroSection = action?.payload?.data;
    });
    builder.addCase(getLandingHeroSection.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPostDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingPostDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingPostDetails = action?.payload?.data?.post;
      state.isSavePost = action?.payload?.data?.isSaved;
    });
    builder.addCase(getLandingPostDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPostDetailsByParmalink.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingPostDetailsByParmalink.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingPostDetailsByParmalinks = action?.payload?.data?.post;
        state.isSavePostByParmalinks = action?.payload?.data?.isSaved;
      }
    );
    builder.addCase(getLandingPostDetailsByParmalink.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingCategoryDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingCategoryDetails = action?.payload?.data;
    });
    builder.addCase(getLandingCategoryDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryIdShort.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingCategoryIdShort.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingCategoryIdShort = action?.payload?.data;
    });
    builder.addCase(getLandingCategoryIdShort.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryIdHighlight.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingCategoryIdHighlight.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingCategoryIdHighlight = action?.payload?.data;
      }
    );
    builder.addCase(getLandingCategoryIdHighlight.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryIdExplore.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingCategoryIdExplore.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingCategoryIdExplore = action?.payload?.data;
    });
    builder.addCase(getLandingCategoryIdExplore.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryIdMore.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingCategoryIdMore.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingCategoryIdMore = action?.payload?.data;
    });
    builder.addCase(getLandingCategoryIdMore.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingHomeAdsList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingHomeAdsList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingHomeAdsList = action?.payload?.data;
      state.landingHeaderAdsList = action?.payload?.header;
    });
    builder.addCase(getLandingHomeAdsList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingCategoryAdsList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingCategoryAdsList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingCategoryAdsList = action?.payload?.data;
    });
    builder.addCase(getLandingCategoryAdsList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingArticleAdsList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingArticleAdsList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingArticleAdsList = action?.payload?.data;
    });
    builder.addCase(getLandingArticleAdsList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingSaveItemList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingSaveItemList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingSaveItemList = action?.payload?.data;
    });
    builder.addCase(getLandingSaveItemList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingYourPostList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingYourPostList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingYourPostList = action?.payload?.data;
    });
    builder.addCase(getLandingYourPostList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingYourPendingPostList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingYourPendingPostList.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingYourPendingPostList = action?.payload?.data;
      }
    );
    builder.addCase(getLandingYourPendingPostList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingUserNavbarDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingUserNavbarDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landinguserNavbarDetails = action?.payload?.data;
    });
    builder.addCase(getLandingUserNavbarDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingNotification.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingNotification.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingNotificationList = action?.payload?.data;
    });
    builder.addCase(getLandingNotification.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingNotificationAll.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingNotificationAll.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.LandingNotificationListAll = action?.payload?.data;
    });
    builder.addCase(getLandingNotificationAll.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(landingNotificationRead.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(landingNotificationRead.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.LandingNotificationListAll = state.LandingNotificationListAll.filter(
        (notification) => notification.id !== action.meta.arg
      );
    });
    builder.addCase(landingNotificationRead.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(landingNotificationRemove.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(landingNotificationRemove.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.LandingNotificationListAll = state.LandingNotificationListAll.filter(
        (notification) => notification.id !== action.meta.arg
      );
    });
    builder.addCase(landingNotificationRemove.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingSearchQuery.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingSearchQuery.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingSearchingList = action?.payload?.posts;
    });
    builder.addCase(getLandingSearchQuery.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingSocialList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingSocialList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingSocialList = action?.payload?.data;
    });
    builder.addCase(getLandingSocialList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPageList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingPageList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingPageList = action?.payload?.data;
    });
    builder.addCase(getLandingPageList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPageDetails.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingPageDetails.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingPageDetails = action?.payload?.data;
    });
    builder.addCase(getLandingPageDetails.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingPageDetailsByParmalinks.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingPageDetailsByParmalinks.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingPageDetailsByParmalinks = action?.payload?.data;
      }
    );
    builder.addCase(getLandingPageDetailsByParmalinks.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingGoogleAdsHeaderList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingGoogleAdsHeaderList.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingGoogleAdsHeaderList = action?.payload?.data;
      }
    );
    builder.addCase(getLandingGoogleAdsHeaderList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingGoogleAdsHomeList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingGoogleAdsHomeList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingGoogleAdsHomeList = action?.payload?.data;
    });
    builder.addCase(getLandingGoogleAdsHomeList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingGoogleAdsCategoryList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingGoogleAdsCategoryList.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingGoogleAdsCategoryList = action?.payload?.data;
      }
    );
    builder.addCase(getLandingGoogleAdsCategoryList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingGoogleAdsArticleList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getLandingGoogleAdsArticleList.fulfilled,
      (state, action) => {
        state.loading = "complete_success";
        state.landingGoogleAdsArticleList = action?.payload?.data;
      }
    );
    builder.addCase(getLandingGoogleAdsArticleList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getLandingGoogleAdsPageList.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getLandingGoogleAdsPageList.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.landingGoogleAdsPageList = action?.payload?.data;
    });
    builder.addCase(getLandingGoogleAdsPageList.rejected, (state) => {
      state.authLoading = "complete_failure";
    });

    builder.addCase(getHomeMetaInfo.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getHomeMetaInfo.fulfilled, (state, action) => {
      state.loading = "complete_success";
      state.getHomeMetaInfo = action?.payload?.data;
    });
    builder.addCase(getHomeMetaInfo.rejected, (state) => {
      state.authLoading = "complete_failure";
    });
  },
});
export const { setSelectedPageId } = landingSlice.actions;
export default landingSlice.reducer;
