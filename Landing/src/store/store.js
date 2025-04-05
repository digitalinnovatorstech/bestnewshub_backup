import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "../services/slices/globalSlice";
import auhSlice from "../services/slices/authSlice";
import pageSlice from "../services/slices/pageSlice";
import postSlice from "../services/slices/postSlice";
import categoriesSlice from "../services/slices/categoriesSlice";
import tagSlice from "../services/slices/tagSlice";
import userSlice from "../services/slices/userSlice";
import landingSlice from "../services/slices/landingSlice";
import advisementSlice from "../services/slices/advisementSlice";
import dashboardSlice from "../services/slices/dashboardSlice";
import enquirySlice from "../services/slices/enquirySlice";
export const store = configureStore({
  reducer: {
    auth: auhSlice,
    global: globalSlice,
    page: pageSlice,
    post: postSlice,
    categories: categoriesSlice,
    tag: tagSlice,
    users: userSlice,
    landing: landingSlice,
    ads: advisementSlice,
    dashboard: dashboardSlice,
    enquiry: enquirySlice,
  },
});

export default store;
