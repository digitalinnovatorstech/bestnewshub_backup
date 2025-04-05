import { useState, memo, useCallback, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
// import logo from "../../assets/logo.png";
import LanguageIcon from "@mui/icons-material/Language";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  Home,
  Settings,
  ExpandLess,
  ExpandMore,
  PostAdd,
  Category,
  Label,
  Logout,
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
import { useDispatch, useSelector } from "react-redux";
import { getUserNavbarDetails } from "../../services/slices/userSlice";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  getLandingNotificationAll,
  landingNotificationRead,
} from "../../services/slices/landingSlice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import { getLogoDetails } from "../../services/slices/globalSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginUserDetails = localStorage.getItem("loginUser");
  const dataKey = JSON.parse(loginUserDetails);
  const userType = dataKey?.userData?.userType;
  const id = dataKey?.userData?.id;
  const [loadingLogo, setLoadingLogo] = useState(true);
  const userNavbarDetails = useSelector(
    (state) => state.users.userNavbarDetails
  );
  const LandingNotificationListAll = useSelector(
    (state) => state.landing.LandingNotificationListAll
  );
  const unreadNotificationsCount = LandingNotificationListAll?.filter(
    (notification) => !notification.isRead
  ).length;
  const logoDetails = useSelector((state) => state.global.logoDetails);
  useEffect(() => {
    dispatch(getUserNavbarDetails(id));
    dispatch(getLandingNotificationAll());
    setLoadingLogo(true);
    dispatch(getLogoDetails()).finally(() => {
      setLoadingLogo(false);
    });
  }, [dispatch]);
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [openAdvertisement, setOpenAdvertisement] = useState(false);
  const [openPage, setOpenPage] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openCategory, setOpencategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openEnqueries, setOpenEnqueries] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const ids = open ? "notification-popover" : undefined;

  useEffect(() => {
    const savedItem = sessionStorage.getItem("activeItem");
    setActiveItem(
      location.pathname === "/admin/dashboard"
        ? "Dashboard"
        : savedItem || "Dashboard"
    );
  }, []);
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
        setDrawerOpen(false);
      }}
      sx={getMenuItemStyles(label)}
    >
      {icon}
      <Box sx={{ ml: "10px" }}>{label}</Box>
    </MenuItem>
  );

  const renderCollapseSection = (label, icon, isOpen, toggleOpen, items) => (
    <>
      <MenuItem
        onClick={() => {
          handleMenuSideBar(label);
          toggleOpen((prev) => !prev);
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
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </MenuItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <MenuList sx={{ ml: "29px", fontWeight: 500 }}>{items}</MenuList>
      </Collapse>
    </>
  );

  const capitalize = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/admin/login");
  }, [navigate]);

  // useEffect(() => {
  //   fetchLogo = async () => {
  //     const res = await axios(`${import.meta.env.VITE_API_URL}/`);
  //   };
  //   fetchLogo();
  // }, []);
  return (
    <Box
      width="100%"
      height="40px"
      sx={{
        background: "#FCF8E7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px 35px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {isTabMode ? (
        <>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: "#895129" }} />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Stack
              sx={{
                background: "#FCF8E7",
                width: { xs: 250, sm: 300 },
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Box>
                  {loadingLogo ? (
                    <Skeleton variant="rectangular" height={50} />
                  ) : (
                    <img
                      src={logoDetails}
                      height="50px"
                      width="auto"
                      alt="Logo"
                      onClick={() => {
                        navigate("/admin/dashboard");
                      }}
                    />
                  )}
                </Box>
                <Box>
                  <CloseIcon onClick={() => setDrawerOpen(false)} />
                </Box>
              </Stack>
              <Stack>
                <MenuList
                  variant="selectedMenu"
                  sx={{ ml: "19px", fontWeight: 500 }}
                >
                  {renderMenuItem("Dashboard", <Home />, "/admin/dashboard")}
                  {(userType === "ADMIN" || userType === "BLOGGER") &&
                    renderCollapseSection(
                      "Page",
                      <DescriptionOutlinedIcon />,
                      openPage,
                      setOpenPage,
                      <>
                        {renderMenuItem(
                          "All Pages",
                          <DynamicFeedOutlinedIcon />,
                          "/admin/page"
                        )}
                        {renderMenuItem(
                          "New Page",
                          <PostAdd />,
                          "/admin/page/addPage"
                        )}
                      </>
                    )}
                  {renderCollapseSection(
                    "Post",
                    <ArticleIcon />,
                    openPost,
                    setOpenPost,
                    <Stack>
                      {renderMenuItem(
                        "All Posts",
                        <DynamicFeedOutlinedIcon />,
                        "/admin/posts"
                      )}
                      {renderMenuItem(
                        "New Post",
                        <PostAdd />,
                        "/admin/posts/addPosts"
                      )}
                    </Stack>
                  )}
                  {(userType === "ADMIN" || userType === "BLOGGER") &&
                    renderCollapseSection(
                      "Categories",
                      <Category />,
                      openCategory,
                      setOpencategory,
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
                    openTag,
                    setOpenTag,
                    <Stack>
                      {renderMenuItem("All Tags", <Label />, "/admin/tags")}
                      {renderMenuItem(
                        "New Tag",
                        <Label />,
                        "/admin/tags/addTags"
                      )}
                    </Stack>
                  )}
                  {(userType === "ADMIN" || userType === "BLOGGER") &&
                    renderMenuItem(
                      "Comments",
                      <ForumOutlinedIcon />,
                      "/admin/comments"
                    )}
                  {renderCollapseSection(
                    "Advertisement",
                    <ArticleIcon />,
                    openAdvertisement,
                    setOpenAdvertisement,
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
                      openUsers,
                      setOpenUsers,
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
                      openEnqueries,
                      setOpenEnqueries,
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
                    openSettings,
                    setOpenSettings,
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
              </Stack>
            </Stack>
          </Drawer>
        </>
      ) : loadingLogo ? (
        <Skeleton variant="rectangular" width={"auto"} height={50} />
      ) : (
        <img
          src={logoDetails}
          height="50px"
          width="auto"
          alt="Logo"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/admin/dashboard");
          }}
        />
      )}
      <Toolbar>
        {/* <Button
          variant="outlined"
          startIcon={<LanguageIcon />}
          sx={{
            marginRight: { xs: 0, sm: 2 },
            borderColor: "#895129",
            backgroundColor: "#FAFBFD",
            color: "#895129",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#FAFBFD",
              border: "1px solid #895129",
            },
          }}
          onClick={() => window.open("/", "_blank")}
        >
          {isTabMode ? "" : "View Website"}
        </Button> */}
        <Button
          variant="outlined"
          startIcon={<LanguageIcon />}
          sx={{
            marginRight: { xs: 0, sm: 2 },
            borderColor: { xs: "transparent", sm: "#895129" },
            backgroundColor: { xs: "transparent", sm: "#FAFBFD" },
            color: "#895129",
            textTransform: "none",
            "&:hover": {
              backgroundColor: { xs: "transparent", sm: "#FAFBFD" },
              border: { xs: "none", sm: "1px solid #895129" },
            },
          }}
          // onClick={() => window.open("/", "_blank")}
          onClick={() =>
            window.open(import.meta.env.VITE_API_LANDING_URL, "_blank")
          }
        >
          {isTabMode ? "" : "View Website"}
        </Button>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            sx={{ color: "#895129" }}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <Badge
              badgeContent={unreadNotificationsCount}
              color="primary"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#FF5722",
                  color: "#fff",
                  fontSize: "12px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9px",
                },
              }}
            >
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: { xs: "25px", sm: "30px" } }}
              />
            </Badge>
          </IconButton>
          <Popover
            id={ids}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                width: { xs: "100%", sm: 400 },
                maxHeight: 400,
                overflowY: "auto",
                padding: "8px 0",
                borderRadius: "0px",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                padding: "8px 16px",
                fontWeight: "bold",
                color: "#895129",
              }}
            >
              Notifications
            </Typography>
            <Divider />
            {LandingNotificationListAll?.filter(
              (notification) => !notification.isRead
            ).length > 0 ? (
              LandingNotificationListAll.filter(
                (notification) => !notification.isRead
              ).map((notification, index) => (
                <Paper
                  key={notification.id || index}
                  sx={{
                    p: 2,
                    backgroundColor: "#FFF4E5",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: "none",
                    borderBottom: "1px solid #ccc",
                    "&:hover": {
                      backgroundColor: "#FFF0DA",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      fontSize: "12px",
                      paddingRight: "32px",
                    }}
                  >
                    {new Date(notification.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Typography>
                  <IconButton
                    // onClick={() => {
                    //   dispatch(
                    //     landingNotificationRead(notification?.id)
                    //   ).unwrap();
                    //   localStorage.setItem("postId", notification?.id);

                    //   if (
                    //     notification?.permalink.includes("/enquiry/contact")
                    //   ) {
                    //     navigate(`/admin/enquiry/contact`, {
                    //       state: {
                    //         selectedCategory: notification?.Categories?.[0]?.id,
                    //         scrollToPost: true,
                    //       },
                    //     });
                    //   } else if (
                    //     notification?.permalink.includes(
                    //       "/enquiry/advertisement"
                    //     )
                    //   ) {
                    //     navigate(`/admin/enquiry/advertisement`, {
                    //       state: {
                    //         selectedCategory: notification?.Categories?.[0]?.id,
                    //         scrollToPost: true,
                    //       },
                    //     });
                    //   } else {
                    //     navigate(`/News/${notification?.permalink}`, {
                    //       state: {
                    //         selectedCategory: notification?.Categories?.[0]?.id,
                    //         scrollToPost: true,
                    //       },
                    //     });
                    //   }
                    //   handleClose();
                    // }}
                    sx={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "#804000",
                      color: "white",
                      padding: "2px",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "white",
                        borderColor: "#804000",
                      },
                      "&:hover svg": {
                        transform: "rotate(-90deg)",
                        transition: "transform 0.3s ease",
                        color: "#804000",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // if (!notification?.post?.id) {
                      //   alert("Post has been deleted");
                      //   return;
                      // }
                      dispatch(
                        landingNotificationRead(notification?.id)
                      ).unwrap();
                      if (
                        notification?.permalink.includes("/enquiry/contact")
                      ) {
                        navigate(`/admin/enquiry/contact`, {
                          state: {
                            selectedCategory: notification?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      } else if (
                        notification?.permalink.includes(
                          "/enquiry/advertisement"
                        )
                      ) {
                        navigate(`/admin/enquiry/advertisement`, {
                          state: {
                            selectedCategory: notification?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      } else {
                        // const selectedCategory =
                        //   notification?.post?.Categories?.[0]
                        //     ?._parentCategories ||
                        //   notification?.post?.Categories?.[0]?.id;
                        const permalink = notification?.permalink
                          ?.trim()
                          .replace(/\s+/g, "-");
                        // const url = `${
                        //   import.meta.env.VITE_API_LANDING_URL
                        // }/News/${permalink}&selectedCategory=${selectedCategory}&scrollToPost=true`;
                        const url = `${
                          import.meta.env.VITE_API_LANDING_URL
                        }/news/${permalink}`;
                        if (notification?.post?.status === "PUBLISHED") {
                          window.open(url, "_blank");
                        } else {
                          localStorage.setItem(
                            "postId",
                            notification?.post?.id
                          );
                          navigate("/admin/posts/editPosts", {
                            state: { activeItem: "All Posts" },
                          });
                        }
                      }
                      handleClose();
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#895129" }}
                  >
                    {notification.notificationsTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {notification.notificationContent}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Box sx={{ textAlign: "center", padding: "16px" }}>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  No unread notifications available.
                </Typography>
              </Box>
            )}
          </Popover>
          <Avatar
            src={userNavbarDetails?.profilePhoto}
            sx={{
              bgcolor: "#895129",
              borderRadius: "10px",
              marginRight: "10px",
            }}
            variant="square"
          >
            {userNavbarDetails?.firstName?.charAt(0).toUpperCase()}
            {userNavbarDetails?.lastName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {capitalize(userNavbarDetails?.firstName) || ""}{" "}
              {capitalize(userNavbarDetails?.lastName) || ""}
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
              {userNavbarDetails?.email}
            </Typography>
          </Box>
        </Box>
        <IconButton
          sx={{
            ml: { xs: 0, sm: 2 },
            bgcolor: "#895129",
            "&:hover": { backgroundColor: "#895129" },
          }}
          onClick={() => setLogoutPopup(true)}
        >
          <Logout
            sx={{ color: "#fff", fontSize: { xs: "20px", sm: "30px" } }}
          />
        </IconButton>
        <Dialog
          open={logoutPopup}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle
            id="confirm-dialog-title"
            sx={{
              textAlign: "center",
              color: "red",
            }}
          >
            <WarningAmberIcon
              sx={{
                fontSize: 50,
                color: "red",
              }}
            />
            <div>Confirm Logout</div>
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            Are you sure you want to Logout?
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={() => setLogoutPopup(false)}
              variant="outlined"
              sx={{
                border: "1px solid #895129",
                bgcolor: "#FCF8E7",
                color: "#895129",
                "&:hover": {
                  backgroundColor: "#FCF8E7",
                  border: "1px solid #895129",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#895129",
                },
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </Box>
  );
};

export default memo(Navbar);
