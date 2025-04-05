import { useEffect, useState, memo, useCallback } from "react";
import { Box, Collapse, MenuItem, MenuList, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Settings,
  ExpandLess,
  ExpandMore,
  PostAdd,
  Category,
  Label,
  QuestionAnswer,
  AddAPhoto,
  Contacts,
  Code,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import GoogleIcon from "@mui/icons-material/Google";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUserDetails = localStorage.getItem("loginUser");
  const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;
  const userType = data?.userData?.userType;
  const [openSection, setOpenSection] = useState("");
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const savedItem =
      location.state?.activeItem || sessionStorage.getItem("activeItem");
    setActiveItem(
      location.pathname === "/admin/dashboard"
        ? "Dashboard"
        : savedItem || "Dashboard"
    );
  }, [location.state, location.pathname]);

  const handleMenuSideBar = useCallback((value) => {
    sessionStorage.setItem("activeItem", value);
    setActiveItem(value);
  }, []);

  const getMenuItemStyles = (item) => ({
    color: activeItem === item ? "#895129" : "inherit",
    fontWeight: activeItem === item ? "bold" : "normal",
    "&:hover": { backgroundColor: "#FCF8E7" },
  });

  const renderMenuItem = (label, icon, path) => (
    <MenuItem
      onClick={() => {
        handleMenuSideBar(label);
        navigate(path);
      }}
      sx={getMenuItemStyles(label)}
    >
      {icon}
      <Box sx={{ ml: "10px" }}>{label}</Box>
    </MenuItem>
  );

  const renderCollapseSection = (label, icon, sectionKey, items) => (
    <Stack>
      <MenuItem
        onClick={() => {
          handleMenuSideBar(label);
          setOpenSection((prev) => (prev === sectionKey ? "" : sectionKey));
        }}
        sx={getMenuItemStyles(label)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex" }}>
            {icon}
            <Box sx={{ ml: "10px" }}>{label}</Box>
          </Box>
          {openSection === sectionKey ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </MenuItem>
      <Collapse in={openSection === sectionKey} timeout="auto" unmountOnExit>
        <MenuList sx={{ ml: "29px", fontWeight: 500 }}>{items}</MenuList>
      </Collapse>
    </Stack>
  );

  return (
    <Box
      sx={{
        background: "#FCF8E7",
        height: "90vh",
        overflow: "auto",
        width: "20%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <MenuList variant="selectedMenu" sx={{ ml: "19px", fontWeight: 500 }}>
        {renderMenuItem("Dashboard", <Home />, "/admin/dashboard")}
        {(userType === "ADMIN" || userType === "BLOGGER") &&
          renderCollapseSection(
            "Page",
            <DescriptionOutlinedIcon />,
            "page",
            <Stack>
              {renderMenuItem(
                "All Pages",
                <DynamicFeedOutlinedIcon />,
                "/admin/page"
              )}
              {renderMenuItem("New Page", <PostAdd />, "/admin/page/addPage")}
            </Stack>
          )}
        {renderCollapseSection(
          "Post",
          <ArticleIcon />,
          "post",
          <Stack>
            {renderMenuItem(
              "All Posts",
              <DynamicFeedOutlinedIcon />,
              "/admin/posts"
            )}
            {renderMenuItem("New Post", <PostAdd />, "/admin/posts/addPosts")}
          </Stack>
        )}
        {(userType === "ADMIN" || userType === "BLOGGER") &&
          renderCollapseSection(
            "Categories",
            <Category />,
            "categories",
            <Stack>
              {renderMenuItem(
                "All Categories",
                <Category />,
                "/admin/categories"
              )}
              {renderMenuItem(
                "New Categories",
                <Category />,
                "/admin/categories/addCategories"
              )}
            </Stack>
          )}
        {renderCollapseSection(
          "Tag",
          <Label />,
          "tag",
          <Stack>
            {renderMenuItem("All Tags", <Label />, "/admin/tags")}
            {renderMenuItem("New Tag", <Label />, "/admin/tags/addTags")}
          </Stack>
        )}
        {(userType === "ADMIN" || userType === "BLOGGER") &&
          renderMenuItem("Comments", <ForumOutlinedIcon />, "/admin/comments")}
        {/* {(userType === "ADMIN" || userType === "BLOGGER") && */}
        {userType === "ADMIN" &&
          renderCollapseSection(
            "Advertisement",
            <ArticleIcon />,
            "advertisement",
            <Stack>
              {renderMenuItem(
                "All Ads",
                <DynamicFeedOutlinedIcon />,
                "/admin/advertisement"
              )}
              {renderMenuItem(
                "New Ads",
                <PostAdd />,
                "/admin/advertisement/addAdvertisement"
              )}
              {renderMenuItem(
                "Google Ads",
                <GoogleIcon />,
                "/admin/advertisement/googleAds"
              )}
            </Stack>
          )}
        {(userType === "ADMIN" || userType === "BLOGGER") &&
          renderCollapseSection(
            "Users",
            <GroupOutlinedIcon />,
            "users",
            <Stack>
              {renderMenuItem(
                "All Users",
                <GroupsOutlinedIcon />,
                "/admin/users/allUsers"
              )}
              {renderMenuItem(
                "New User",
                <PersonAddOutlinedIcon />,
                "/admin/users/newUsers"
              )}
            </Stack>
          )}
        {renderMenuItem(
          "Notification",
          <NotificationsIcon />,
          "/admin/notification"
        )}
        {userType === "ADMIN" &&
          renderCollapseSection(
            "Enquiry",
            <QuestionAnswer />,
            "enquiry",
            <Stack>
              {renderMenuItem(
                "All Contact Enquiry",
                <Contacts />,
                "/admin/enquiry/contact"
              )}
              {renderMenuItem(
                "All Advertisement ",
                <AddAPhoto />,
                "/admin/enquiry/advertisement"
              )}
            </Stack>
          )}
        {renderCollapseSection(
          "Settings",
          <Settings />,
          "settings",
          <Stack>
            {renderMenuItem(
              "Profile",
              <AccountCircleOutlinedIcon />,
              "/admin/users/profile"
            )}
            {(userType === "ADMIN" || userType === "BLOGGER") &&
              renderMenuItem(
                "General Info",
                <ManageAccountsIcon />,
                "/admin/settings"
              )}
            {(userType === "ADMIN" || userType === "BLOGGER") &&
              renderMenuItem(
                "Social Media",
                <ConnectWithoutContactOutlinedIcon />,
                "/admin/settings/social"
              )}
            {userType === "ADMIN" &&
              renderMenuItem(
                "Custom Asset",
                <Code />,
                "/admin/settings/customAsset"
              )}
          </Stack>
        )}
      </MenuList>
    </Box>
  );
};

export default memo(SideMenu);
