import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import Otp from "../pages/login/Otp";
import CreatePassword from "../pages/login/CreatePassword";
import MainLayout from "../components/mainLayout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Settings from "../pages/settings/Settings";
import Page from "../pages/page/Page";
import AddPage from "../pages/page/AddPage";
import Posts from "../pages/blog/posts/Posts";
import AddPosts from "../pages/blog/posts/AddPosts";
import Tags from "../pages/blog/tags/Tags";
import Categories from "../pages/blog/categories/Categories";
import AddTags from "../pages/blog/tags/AddTags";
import ImageGallery from "../pages/blog/posts/ImageGallery";
import AddCatergories from "../pages/blog/categories/AddCatergories";
import TempPost from "../pages/blog/posts/TempPost";
import Comments from "../pages/blog/comments/Comments";
import AllUsers from "../pages/users/allUsers/AllUsers";
import NewUsers from "../pages/users/newUsers/NewUsers";
import Profile from "../pages/users/profile/Profile";
import NewMainLayout from "../components/newLandingLayout/mainLayout/MainLayout";
import Home from "../pages/newLanging/Home";
import Newspage from "../pages/newLanging/news/Newspage";
import Career from "../pages/newLanging/Career";
import Notification from "../pages/newLanging/Notification";
import NewsView from "../pages/newLanging/news/NewsView";
import UserView from "../pages/users/allUsers/UserView";
import EditUser from "../pages/users/allUsers/EditUser";
import About from "../pages/newLanging/about/About";
import MyProfile from "../pages/newLanging/myprofile/MyProfile";
import Contact from "../pages/newLanging/contact/Contact";
import EditTag from "../pages/blog/tags/EditTag";
import EditCategories from "../pages/blog/categories/EditCategories";
import EditPosts from "../pages/blog/posts/EditPosts";
import Signup from "../pages/newLanging/signup/Signup";
import Verificationpage from "../pages/newLanging/welcomeUser/Verificationpage";
import SigninPage from "../pages/newLanging/signin/Signinpage";
import Author from "../pages/newLanging/author/Author";
import PrivacyPolicy from "../pages/newLanging/privacyandpolicy/PrivacyPolicy";
import Advertise from "../pages/newLanging/advertise/Advertise";
import Advertisement from "../pages/advertisement/Advertisement";
import AddAdvertisement from "../pages/advertisement/add/AddAdvertisement";
import EditAdvertisement from "../pages/advertisement/edit/EditAdvertisement";
import EditPage from "../pages/page/EditPage";
import BestNewsSearch from "../pages/newLanging/Bestnewssearcg/BestNewsSearch";
import Welcom from "../pages/newLanging/welcomeUser/Welcom";
import AuthorPostPage from "../pages/newLanging/author/AuthorPostPage";
import AuthorProfilePage from "../pages/newLanging/author/AuthorProfilePage";
import Forgotpassword from "../pages/newLanging/signin/Forgotpassword";
import OtpPage from "../pages/newLanging/signin/Otp";
import CreatePasswordPage from "../pages/newLanging/signin/CreatePassword";
import SaveItem from "../pages/newLanging/author/SaveItem";
import AdminNotification from "../pages/notification/Notification";
import Social from "../pages/settings/social/Social";
import TermAndCondition from "../pages/newLanging/termandcondition/TermAndCondition";
import PagesView from "../pages/newLanging/pagesView/PagesView";
import GoogleAds from "../pages/advertisement/googleads/GoogleAds";
// import ReactEditorWithCropper from "../components/ReactEditorWithCropper";
import AllContactEnquiry from "../pages/enquiry/AllContactEnquiry";
import AllAdsEnquiry from "../pages/enquiry/AllAdsEnquiry";
import PageNotFound from "../pages/newLanging/pageNotFound";
import CustomAsset from "../pages/settings/customAsset/CustomAsset";

const loginUserDetails = localStorage.getItem("loginUser");
const user = loginUserDetails ? JSON.parse(loginUserDetails) : null;

export const baseRoutes = createBrowserRouter(
  [
    // {
    //   path: "editor",
    //   element: <ReactEditorWithCropper />,
    // },
    // {
    //   path: "signup",
    //   element: <Signup />,
    // },
    // {
    //   path: "forgotpassword",
    //   element: <Forgotpassword />,
    // },
    // {
    //   path: "forgotpassword/otp",
    //   element: <OtpPage />,
    // },
    // {
    //   path: "/forgotpassword/createpassword",
    //   element: <CreatePasswordPage />,
    // },
    // {
    //   path: "search",
    //   element: <BestNewsSearch />,
    // },

    // {
    //   path: "signin",
    //   element: <SigninPage />,
    // },
    // {
    //   path: "welcomeUser",
    //   element: <Welcom />,
    // },
    // {
    //   path: "/Verification",
    //   element: <Verificationpage />,
    // },
    // {
    //   path: "/",
    //   element: <NewMainLayout />,
    //   children: [
    //     {
    //       path: "",
    //       element: <Home />,
    //     },
    //     {
    //       path: "myprofile",
    //       element: <MyProfile />,
    //     },
    //     {
    //       path: "author",
    //       element: <Author />,
    //     },
    //     {
    //       path: "authorpost",
    //       element: <AuthorPostPage />,
    //     },
    //     {
    //       path: "saveItems",
    //       element: <SaveItem />,
    //     },
    //     {
    //       path: "authorProfile",
    //       element: <AuthorProfilePage />,
    //     },
    //     {
    //       path: "PrivacyPolicy",
    //       element: <PrivacyPolicy />,
    //     },
    //     {
    //       path: "termandcondition",
    //       element: <TermAndCondition />,
    //     },
    //     {
    //       path: "page/about-us",
    //       element: <About />,
    //     },
    //     {
    //       path: "page/contact-us",
    //       element: <Contact />,
    //     },
    //     {
    //       path: "page/advertise-with-us",
    //       element: <Advertise />,
    //     },
    //     {
    //       path: "News",
    //       element: <Newspage />,
    //     },
    //     {
    //       path: "News/*",
    //       element: <Newspage />,
    //     },
    //     {
    //       path: "News/view",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "News/:category",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "News/:category:category",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "News/:category/:category",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "News/:category/:id/:slug",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "News/:category/:category/:id/:slug",
    //       element: <NewsView />,
    //     },
    //     {
    //       path: "page",
    //       element: <PagesView />,
    //     },
    //     {
    //       path: "page/*",
    //       element: <PagesView />,
    //     },
    //     {
    //       path: "page/:path",
    //       element: <PagesView />,
    //     },
    //     {
    //       path: "News/:path/:path",
    //       element: <PagesView />,
    //     },
    //     {
    //       path: "Career",
    //       element: <Career />,
    //     },
    //     {
    //       path: "Notification",
    //       element: <Notification />,
    //     },
    //   ],
    // },

    {
      path: "/admin/login",
      element: <Login />,
    },
    {
      path: "/admin/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/admin/forgotpassword/otp",
      element: <Otp />,
    },
    {
      path: "/admin/forgotpassword/createpassword",
      element: <CreatePassword />,
    },
    {
      path: "/",
      element:
        user?.userData?.status?.toUpperCase?.() === "ACTIVE" &&
        user?.userData?.userType?.toUpperCase?.() !== "SUBSCRIBER" ? (
          // <MainLayout />
          <Navigate to="/admin/dashboard" />
        ) : (
          <>
            {/* {toast.error("Access Denied for Dashboard!")} */}
            <Navigate to="/admin/login" />
          </>
        ),
    },
    // {
    //   path: "/admin",
    //   element:
    //     user?.userData?.status?.toUpperCase?.() === "ACTIVE" &&
    //     user?.userData?.userType?.toUpperCase?.() !== "SUBSCRIBER" ? (
    //       <MainLayout />
    //     ) : (
    //       <>
    //         {/* {toast.error("Access Denied for Dashboard!")} */}
    //         <Navigate to="/admin/login" />
    //       </>
    //     ),
    {
      path: "/admin",
      element: <MainLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "page",
          element: <Page />,
        },
        {
          path: "page/addPage",
          element: <AddPage />,
        },
        {
          path: "page/editPage",
          element: <EditPage />,
        },
        {
          path: "advertisement",
          element: <Advertisement />,
        },
        {
          path: "advertisement/addAdvertisement",
          element: <AddAdvertisement />,
        },
        {
          path: "advertisement/editAdvertisement",
          element: <EditAdvertisement />,
        },
        {
          path: "advertisement/googleAds",
          element: <GoogleAds />,
        },
        {
          path: "posts",
          element: <Posts />,
        },
        {
          path: "blog/galley",
          element: <ImageGallery />,
        },
        {
          path: "blog/temp",
          element: <TempPost />,
        },
        {
          path: "posts/addPosts",
          element: <AddPosts />,
        },
        {
          path: "posts/editPosts",
          element: <EditPosts />,
        },
        {
          path: "categories",
          element: <Categories />,
        },
        {
          path: "categories/addCategories",
          element: <AddCatergories />,
        },
        {
          path: "categories/editCategories",
          element: <EditCategories />,
        },
        {
          path: "tags",
          element: <Tags />,
        },
        {
          path: "tags/addTags",
          element: <AddTags />,
        },
        {
          path: "tags/EditTags",
          element: <EditTag />,
        },
        {
          path: "comments",
          element: <Comments />,
        },
        {
          path: "users/allUsers",
          element: <AllUsers />,
        },
        {
          path: "users/newUsers",
          element: <NewUsers />,
        },
        {
          path: "users/view",
          element: <UserView />,
        },
        {
          path: "users/edit",
          element: <EditUser />,
        },
        {
          path: "users/profile",
          element: <Profile />,
        },
        {
          path: "notification",
          element: <AdminNotification />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "settings/social",
          element: <Social />,
        },
        {
          path: "settings/social",
          element: <Social />,
        },
        {
          path: "enquiry/contact",
          element: <AllContactEnquiry />,
        },
        {
          path: "enquiry/advertisement",
          element: <AllAdsEnquiry />,
        },
        {
          path: "settings/customAsset",
          element: <CustomAsset />,
        },
      ],
    },
    {
      path: "/*",
      element: <PageNotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
