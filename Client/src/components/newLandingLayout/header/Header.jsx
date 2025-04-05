import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  Avatar,
  Typography,
  ListItemIcon,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Badge,
  Popover,
  Paper,
  Skeleton,
  FormControl,
  OutlinedInput,
  Card,
  CardMedia,
  CardContent,
  InputBase,
  Slide,
  Stack,
  Container,
} from "@mui/material";
import { debounce } from "lodash";
// import logo from "../../../assets/logo.png";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingcategoryNameList,
  getLandingGoogleAdsHeaderList,
  getLandingHomeAdsList,
  getLandingNotificationAll,
  getLandingSearchQuery,
  getLandingUserNavbarDetails,
  landingNotificationRead,
} from "../../../services/slices/landingSlice";
import moment from "moment/moment";
import { formatNameLowerUpper } from "../../../utility/helpers/globalHelpers";
import { useTheme } from "@emotion/react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PolicyIcon from "@mui/icons-material/Policy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Home } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "react-swipeable-list/dist/styles.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AdsRenderer from "../../AdsRenderer";
import { getLogoDetails } from "../../../services/slices/globalSlice";
import { toast } from "react-toastify";

const Header = () => {
  const loginUserDetails = localStorage.getItem("loginUser");
  const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;
  const userType = data?.userData?.userType;
  const id = data?.userData?.id;
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTabMode = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRef = useRef(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [expandedSub, setExpandedSub] = useState({});
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  // const [error, setError] = useState(null);
  const [openDialogCheckLogin, setOpenDialogCheckLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogCheck, setOpenDialogCheck] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [signOutPopup, setSignOutPopup] = useState(false);
  const [isSearchInputVisible, setSearchInputVisible] = useState(false);
  const [searchInputVisibleMobile, setSearchInputVisibleMobile] = useState(
    false
  );
  const [searchingQuery, setSearchingQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const ids = open ? "notification-popover" : undefined;

  // for home page
  const scrollRef = useRef();
  useEffect(() => {
    if (location.state?.scrollToTop && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // for category
  const categoryRef = useRef();
  useEffect(() => {
    if (location.state?.scrollToCategory && categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // for post
  const postRef = useRef();
  useEffect(() => {
    if (location.state?.scrollToPost && postRef.current) {
      postRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // for page
  const pageRef = useRef();
  useEffect(() => {
    if (location.state?.scrollToPage && pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [location.state]);
  const landingcategoryNameList = useSelector(
    (state) => state.landing.landingcategoryNameList
  );
  const LandingNotificationListAll = useSelector(
    (state) => state.landing.LandingNotificationListAll
  );
  const unreadNotificationsCount = LandingNotificationListAll?.filter(
    (notification) => !notification.isRead
  )?.length;
  const landingHeaderAdsList = useSelector(
    (state) => state.landing.landingHeaderAdsList
  );
  const logoDetails = useSelector((state) => state.global.logoDetails);

  useEffect(() => {
    setLoadingCategory(true);
    dispatch(getLandingcategoryNameList()).finally(() => {
      setLoadingCategory(false);
    });
    if (id) {
      dispatch(getLandingNotificationAll());
    }
    dispatch(getLandingHomeAdsList());
    setLoadingLogo(true);
    dispatch(getLogoDetails()).finally(() => {
      setLoadingLogo(false);
    });
  }, [dispatch, id]);

  const toggleExpand = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleExpandSub = (id) => {
    setExpandedSub((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [showMore, setShowMore] = useState(false);
  const handleCategoryClick = (id, name) => {
    localStorage.setItem("categoryId", id);
    localStorage.setItem("categoryName", name);
    navigate(`/News?category=${name}&id=${id}`, {
      state: { selectedCategory: id, scrollToCategory: true },
    });
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const timeFormatted = moment().format("LT");
  const timeFormattedMobile = moment().format("LT");

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const apiKey = "2bb84b9094efee012db213571d3099b3";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather(` ${data.main.temp}°C`);
      } catch (err) {
        toast.error(err.message);
        // setError("Failed to fetch weather data.");
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        }
        // () => setError("Unable to retrieve location.")
      );
    } else {
      // setError("Geolocation is not supported.");
    }
  }, []);

  // search
  const landingSearchingList = useSelector(
    (state) => state.landing.landingSearchingList
  );
  useEffect(() => {
    if (searchingQuery.trim()) {
      dispatch(getLandingSearchQuery(searchingQuery));
      setSearchInputVisible(true);
    } else {
      setSearchInputVisible(false);
    }
  }, [dispatch, searchingQuery]);

  const handleSearchingQueryChange = (e) => {
    setSearchingQuery(e.target.value);
  };
  const handlePostClick = (post) => {
    localStorage.setItem("postId", post?.id);
    navigate(`/News/${post?.permalink}`, {
      state: {
        selectedCategory: post?.Categories?.[0]?.id,
        scrollToPost: true,
      },
    });

    setSearchingQuery("");
    setSearchInputVisible(false);
    dispatch(getLandingSearchQuery());
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchInputVisible(false);
        setSearchingQuery("");
        dispatch(getLandingSearchQuery());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for mobile search
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = debounce((query) => {
    if (query.trim() !== "") {
      dispatch(getLandingSearchQuery(query));
    } else {
      dispatch(getLandingSearchQuery());
    }
  }, 500);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handlePostClickMobile = (post) => {
    localStorage.setItem("postId", post?.id);
    navigate(`/News/${post?.permalink}`, {
      state: {
        selectedCategory: post?.Categories?.[0]?.id,
        scrollToPost: true,
      },
    });
    setSearchQuery("");
    setSearchInputVisibleMobile(false);
    dispatch(getLandingSearchQuery());
  };

  // profile drawer
  const landinguserNavbarDetails = useSelector(
    (state) => state.landing.landinguserNavbarDetails
  );
  useEffect(() => {
    if (id) {
      dispatch(getLandingUserNavbarDetails(id));
    }
  }, [dispatch, id]);

  const handleSignOut = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    setSignOutPopup(false);
    navigate("/signin");
  }, []);

  //this is for header Ads
  const headerImages = landingHeaderAdsList
    ?.filter((ad) => ad.position === "HEADER")
    .map((ad) => ({
      imageUrl: ad.horizontalImageUrl,
      adUrl: ad.advertisementUrl,
    }))
    .filter((ad) => ad.imageUrl);

  useEffect(() => {
    if (headerImages?.length > 1 && isAdVisible) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % headerImages?.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [headerImages, isAdVisible]);

  const landingGoogleAdsHeaderList = useSelector(
    (state) => state.landing.landingGoogleAdsHeaderList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsHeaderList());
  }, [dispatch]);

  return (
    <>
      <Box
        ref={(el) => {
          if (scrollRef) scrollRef.current = el;
          if (categoryRef) categoryRef.current = el;
          if (postRef) postRef.current = el;
          if (pageRef) pageRef.current = el;
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box
          sx={{
            // display: "flex",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 20px 2px 45px",
            width: "100%",
            gap: "50px",
          }}
        >
          {/* {logoDetails && ( */}
          {loadingLogo ? (
            <Skeleton variant="rectangular" width={250} height={90} />
          ) : (
            <img
              // src={logo}
              // src={logoDetails ? logoDetails : logo}
              src={logoDetails}
              alt="Logo"
              style={{ width: "250px", height: "90px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          )}

          {landingGoogleAdsHeaderList.filter(
            (ad) => ad?.adsPosition?.toUpperCase() === "HEADER"
          )?.[0]?.isCustomAds ? (
            isAdVisible &&
            headerImages?.length > 0 && (
              <div
                style={{
                  position: "relative",
                  width: "950px",
                  height: "100px",
                }}
              >
                <a
                  href={headerImages[currentImageIndex].adUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={headerImages[currentImageIndex].imageUrl}
                    alt={`Advertisement ${currentImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  />
                </a>
                <button
                  onClick={() => setIsAdVisible(false)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            )
          ) : (
            <Stack
              sx={{
                alignItems: "center",
                width: "100%",
              }}
            >
              <Container
                maxWidth="xl"
                sx={{
                  mt: 0,
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <AdsRenderer
                  ads={landingGoogleAdsHeaderList}
                  position="Header"
                />
              </Container>
            </Stack>
          )}
        </Box>
      </Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "#804000",
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexGrow: 1,
              padding: { xs: "0px 5px", sm: "0px 20px" },
              "@media (min-width:900px) and (max-width:1017px)": {
                padding: "0px 5px",
              },
            }}
          >
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ color: "#804000", display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              ref={searchRef}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isSearchInputVisible && (
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{
                    mr: 1,
                    width: 210,
                    background: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  <OutlinedInput
                    type="text"
                    value={searchingQuery}
                    onChange={handleSearchingQueryChange}
                    placeholder="Search..."
                    size="small"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "0.8rem",
                        color: "#895129",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129",
                      },
                    }}
                  />
                </FormControl>
              )}
              {!isSearchInputVisible && (
                <IconButton
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "#804000",
                  }}
                  onClick={() => setSearchInputVisible((prev) => !prev)}
                >
                  <SearchIcon />
                </IconButton>
              )}
              {isSearchInputVisible && landingSearchingList?.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "55px",
                    left: "0",
                    width: { xs: "300px", sm: "500px" },
                    background: "#fff",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "none",
                    border: "2px solid #895129",
                    zIndex: 10,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {landingSearchingList.map((post, index) => (
                    <Card
                      key={post.id || index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "10px",
                        boxShadow: "none",
                        backgroundColor: "#f9f5eb",
                        alignItems: "center",
                        cursor: "pointer",
                        pl: 1,
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: { sm: "150px", xs: "150px" },
                          height: { sm: "127px", xs: "125px" },
                          objectFit: "cover",
                          borderRadius: "none",
                          cursor: "pointer",
                        }}
                        image={post.squareImageUrl}
                        alt={post.title}
                      />
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            marginTop: "5px",
                            fontSize: { xs: "12px", sm: "14px" },
                            "&:hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {post?.metaTitle?.split(" ").length > 5
                            ? post?.metaTitle.split(" ").slice(0, 5).join(" ") +
                              "..."
                            : post?.metaTitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            marginTop: "5px",
                            fontSize: { xs: "10px", sm: "12px" },
                          }}
                        >
                          {post?.metaDescription?.split(" ").length > 15
                            ? post?.metaDescription
                                .split(" ")
                                .slice(0, 15)
                                .join(" ") + "..."
                            : post?.metaDescription}{" "}
                          <span
                            style={{
                              color: "#895129",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Read More
                          </span>
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            {/* for mobile */}
            <IconButton
              sx={{ display: { xs: "block", sm: "none" }, color: "#804000" }}
              onClick={() => setSearchInputVisibleMobile(true)}
            >
              <SearchIcon />
            </IconButton>
            <Slide
              direction="down"
              in={searchInputVisibleMobile}
              mountOnEnter
              unmountOnExit
            >
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  background: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(1px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  zIndex: 1200,
                }}
              >
                <IconButton
                  onClick={() => {
                    setSearchQuery("");
                    setSearchInputVisibleMobile(false);
                    dispatch(getLandingSearchQuery());
                  }}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "#fff",
                    p: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Box
                  sx={{
                    mt: 6,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "30px",
                    padding: "5px 15px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    width: "90%",
                    maxWidth: 400,
                  }}
                >
                  <InputBase
                    placeholder="Search for..."
                    sx={{ ml: 1, flex: 1, fontSize: "16px" }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <SearchIcon sx={{ color: "#666" }} />
                </Box>
                {landingSearchingList && landingSearchingList?.length > 0 && (
                  <Box
                    sx={{
                      mt: 1,
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "none",
                      zIndex: 10,
                      maxHeight: "500px",
                      overflowY: "auto",
                      backgroundColor: "#f9f5eb",
                    }}
                  >
                    {landingSearchingList.map((post, index) => (
                      <>
                        <Card
                          key={post.id || index}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            // marginBottom: "5px",
                            // borderBottom: "1px solid #ccc",
                            boxShadow: "none",
                            borderRadius: 0,
                            backgroundColor: "#f9f5eb",
                            alignItems: "center",
                            cursor: "pointer",
                            pl: 1,
                          }}
                          onClick={() => handlePostClickMobile(post)}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              width: "70px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "none",
                              cursor: "pointer",
                            }}
                            image={post.squareImageUrl}
                            alt={post.title}
                          />
                          <Box sx={{ ml: 1 }}>
                            <Typography
                              // variant="subtitle1"
                              component="div"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px",
                                "&:hover": {
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {post?.metaTitle?.split(" ").length > 4
                                ? post?.metaTitle
                                    .split(" ")
                                    .slice(0, 4)
                                    .join(" ") + "..."
                                : post?.metaTitle}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                marginTop: "2px",
                                fontSize: { xs: "10px", sm: "12px" },
                              }}
                            >
                              {post?.metaDescription?.split(" ").length > 10
                                ? post?.metaDescription
                                    .split(" ")
                                    .slice(0, 10)
                                    .join(" ") + "..."
                                : post?.metaDescription}{" "}
                              <span
                                style={{
                                  color: "#895129",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                Read More
                              </span>
                            </Typography>
                          </Box>
                        </Card>
                        <Divider
                          sx={{
                            backgroundColor: "#f9f5eb",
                            marginBottom: "10px",
                            mt: "10px",
                          }}
                        />
                      </>
                    ))}
                  </Box>
                )}
              </Box>
            </Slide>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                gap: "15px",
              }}
            >
              {loadingLogo ? (
                <Skeleton variant="rectangular" width={150} height={60} />
              ) : (
                <img
                  src={logoDetails}
                  alt="Logo"
                  style={{ width: "150px", height: "60px" }}
                  onClick={() => navigate("/")}
                />
              )}
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "flex-end",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexGrow: 1,
                  borderRadius: "50%",
                }}
              ></Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                // display: { xs: "none", sm: "flex" },
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <Button
                sx={{
                  color: selectedCategory === null ? "#895129" : "#804000",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: selectedCategory === null ? "100%" : "0",
                    height: "2px",

                    backgroundColor: "#804000",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:after": {
                    width: "100%",
                  },
                  "&:hover": {
                    color: "#895129",
                    backgroundColor: "#fff",
                  },
                  transition: "color 0.3s ease",
                  textTransform: "none",
                  boxShadow: "none",
                }}
                onClick={() => {
                  setSelectedCategory(null);
                  navigate("/", { state: { scrollToTop: true } });
                }}
              >
                Home
              </Button>
              {loadingCategory ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {Array.from(new Array(6)).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      animation="wave"
                      sx={{
                        width: 100,
                        height: 40,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <>
                  {landingcategoryNameList?.slice(0, 6).map((item, index) => (
                    <Box
                      key={index}
                      sx={{ position: "relative", display: "inline-block" }}
                      onMouseEnter={() => toggleExpand(item.id)}
                      onMouseLeave={() => toggleExpand(item.id)}
                    >
                      <Button
                        key={index}
                        sx={{
                          color:
                            selectedCategory === item?.id
                              ? "#895129"
                              : "#804000",
                          position: "relative",
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: selectedCategory === item?.id ? "100%" : "0",
                            height: "2px",
                            backgroundColor: "#804000",
                            transition: "width 0.3s ease",
                          },
                          "&:hover:after": {
                            width: "100%",
                          },
                          "&:hover": {
                            color: "#895129",
                            backgroundColor: "#fff",
                          },
                          transition: "color 0.3s ease",
                          textTransform: "none",
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          setSelectedCategory(item);
                          localStorage.setItem("categoryId", item.id);
                          localStorage.setItem("categoryName", item.name);
                          navigate(
                            `/News?category=${item.name}&id=${item.id}`,
                            {
                              state: {
                                selectedCategory: item.id,
                                scrollToCategory: true,
                              },
                            }
                          );
                        }}
                      >
                        {formatNameLowerUpper(item.name)}
                      </Button>
                      {expanded[item.id] && item.children?.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            backgroundColor: "#f8f5f2",
                            zIndex: 10,
                            padding: "10px",
                            minWidth: "150px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {item.children.map((child) => (
                            <Box
                              key={child.id}
                              sx={{
                                position: "relative",
                                display: "inline-block",
                              }}
                              onMouseEnter={() => toggleExpand(child.id)}
                              onMouseLeave={() => toggleExpand(child.id)}
                            >
                              <Button
                                sx={{
                                  display: "block",
                                  color: "#804000",
                                  textAlign: "left",
                                  textTransform: "none",
                                  "&:hover": {
                                    fontWeight: "bold",
                                    color: "#895129",
                                    backgroundColor: "#f8f5f2",
                                  },
                                  width: "100%",
                                }}
                                onClick={() => {
                                  localStorage.setItem("categoryId", child.id);
                                  localStorage.setItem(
                                    "categoryName",
                                    child.name
                                  );
                                  navigate(
                                    `/News?category=${child.name}&id=${child.id}`,
                                    {
                                      state: {
                                        selectedCategory: item.id,
                                        scrollToCategory: true,
                                      },
                                    }
                                  );
                                }}
                              >
                                {formatNameLowerUpper(child.name)}
                              </Button>
                              {expanded[child.id] &&
                                child.children?.length > 0 && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      left: "100%",
                                      backgroundColor: "#f8f5f2",
                                      zIndex: 10,
                                      padding: "10px",
                                      minWidth: "150px",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    {child.children.map((grandChild) => (
                                      <Box
                                        key={grandChild.id}
                                        sx={{
                                          position: "relative",
                                          display: "inline-block",
                                        }}
                                        onMouseEnter={() =>
                                          toggleExpand(grandChild.id)
                                        }
                                        onMouseLeave={() =>
                                          toggleExpand(grandChild.id)
                                        }
                                      >
                                        <Button
                                          sx={{
                                            display: "block",
                                            color: "#804000",
                                            textAlign: "left",
                                            textTransform: "none",
                                            "&:hover": {
                                              fontWeight: "bold",
                                              color: "#895129",
                                              backgroundColor: "#f8f5f2",
                                            },
                                            width: "100%",
                                          }}
                                          onClick={() => {
                                            localStorage.setItem(
                                              "categoryId",
                                              grandChild.id
                                            );
                                            localStorage.setItem(
                                              "categoryName",
                                              grandChild.name
                                            );
                                            navigate(
                                              `/News?category=${grandChild.name}&id=${grandChild.id}`,
                                              {
                                                state: {
                                                  selectedCategory:
                                                    grandChild.id,
                                                  scrollToCategory: true,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {formatNameLowerUpper(
                                            grandChild.name
                                          )}
                                        </Button>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </>
              )}
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Button
                  sx={{
                    color: "#895129",
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",

                      backgroundColor: "#804000",
                      transition: "width 0.3s ease",
                    },
                    "&:hover:after": {
                      width: "100%",
                    },
                    "&:hover": {
                      color: "#895129",
                      backgroundColor: "#fff",
                    },
                    transition: "color 0.3s ease",
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <MoreHorizIcon />
                </Button>
                {isHovered && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#f8f5f2",
                      zIndex: 10,
                      padding: "10px",
                      minWidth: "150px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {landingcategoryNameList?.slice(6).map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                        }}
                        onMouseEnter={() => toggleExpand(item.id)}
                        onMouseLeave={() => toggleExpand(item.id)}
                      >
                        <Button
                          key={index}
                          sx={{
                            display: "block",
                            color: "#804000",
                            textAlign: "left",
                            textTransform: "none",
                            "&:hover": {
                              fontWeight: "bold",
                              color: "#895129",
                              backgroundColor: "#f8f5f2",
                            },
                            width: "100%",
                          }}
                          onClick={() => {
                            setSelectedCategory(item);
                            localStorage.setItem("categoryId", item.id);
                            localStorage.setItem("categoryName", item.name);
                            navigate(
                              `/News?category=${item.name}&id=${item.id}`,
                              {
                                state: { selectedCategory: item.id },
                              }
                            );
                          }}
                        >
                          {formatNameLowerUpper(item.name)}
                        </Button>
                        {expanded[item.id] && item.children?.length > 0 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "0",
                              left: "100%",
                              backgroundColor: "#f8f5f2",
                              zIndex: 10,
                              padding: "10px",
                              minWidth: "150px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {item.children.map((child) => (
                              <Box
                                key={child.id}
                                sx={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                                onMouseEnter={() => toggleExpand(child.id)}
                                onMouseLeave={() => toggleExpand(child.id)}
                              >
                                <Button
                                  sx={{
                                    display: "block",
                                    color: "#804000",
                                    textAlign: "left",
                                    textTransform: "none",
                                    "&:hover": {
                                      fontWeight: "bold",
                                      color: "#895129",
                                      backgroundColor: "#f8f5f2",
                                    },
                                    width: "100%",
                                  }}
                                  onClick={() => {
                                    localStorage.setItem(
                                      "categoryId",
                                      child.id
                                    );
                                    localStorage.setItem(
                                      "categoryName",
                                      child.name
                                    );
                                    navigate(
                                      `/News?category=${child.name}&id=${child.id}`,
                                      {
                                        state: {
                                          selectedCategory: child.id,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {formatNameLowerUpper(child.name)}
                                </Button>
                                {expanded[child.id] &&
                                  child.children?.length > 0 && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: "100%",
                                        backgroundColor: "#f8f5f2",
                                        zIndex: 10,
                                        padding: "10px",
                                        minWidth: "150px",
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {child.children.map((grandChild) => (
                                        <Box
                                          key={grandChild.id}
                                          sx={{
                                            position: "relative",
                                            display: "inline-block",
                                          }}
                                          onMouseEnter={() =>
                                            toggleExpand(grandChild.id)
                                          }
                                          onMouseLeave={() =>
                                            toggleExpand(grandChild.id)
                                          }
                                        >
                                          <Button
                                            sx={{
                                              display: "block",
                                              color: "#804000",
                                              textAlign: "left",
                                              textTransform: "none",
                                              "&:hover": {
                                                fontWeight: "bold",
                                                color: "#895129",
                                                backgroundColor: "#f8f5f2",
                                              },
                                              width: "100%",
                                            }}
                                            onClick={() => {
                                              localStorage.setItem(
                                                "categoryId",
                                                grandChild.id
                                              );
                                              localStorage.setItem(
                                                "categoryName",
                                                grandChild.name
                                              );
                                              navigate(
                                                `/News?category=${grandChild.name}&id=${grandChild.id}`,
                                                {
                                                  state: {
                                                    selectedCategory:
                                                      grandChild.id,
                                                  },
                                                }
                                              );
                                            }}
                                          >
                                            {formatNameLowerUpper(
                                              grandChild.name
                                            )}
                                          </Button>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "8px",
                "@media (min-width:600px)": {
                  fontSize: "16px",
                  display: { xs: "none", sm: "block" },
                },
                "@media (max-width:599px)": {
                  fontSize: "14px",
                  display: { xs: "none", sm: "block" },
                },
                "@media (min-width:900px) and (max-width:1170px)": {
                  display: "none",
                },
              }}
            >
              {weather && (
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "10px", sm: "16px" },
                    display: "flex",
                    gap: isMobiles ? "5px" : "20px",
                  }}
                >
                  <span>{weather}</span>
                  {isMobiles ? (
                    <span>{timeFormattedMobile}</span>
                  ) : (
                    <span>{timeFormatted}</span>
                  )}
                </Box>
              )}
              <Box
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                }}
              >
                {formattedDate}
              </Box>
            </Box>
            {(userType === "SUBSCRIBER" ||
              userType === "GUEST AUTHOR" ||
              userType === "BLOGGER") && (
              <IconButton
                sx={{ color: "#895129" }}
                onClick={(event) => {
                  if (data) {
                    setAnchorEl(event.currentTarget);
                  } else {
                    setOpenDialogCheckLogin(true);
                  }
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
                  <NotificationsNoneOutlinedIcon sx={{ fontSize: "30px" }} />
                </Badge>
              </IconButton>
            )}
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
              )?.length > 0 ? (
                LandingNotificationListAll?.filter(
                  (notification) => !notification.isRead
                )?.map((notification, index) => (
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
                      {new Date(notification.createdAt).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        dispatch(
                          landingNotificationRead(notification?.id)
                        ).unwrap();
                        localStorage.setItem("postId", notification?.id);
                        navigate(`/News/${notification?.permalink}`, {
                          state: {
                            selectedCategory: notification?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                        handleClose();
                      }}
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
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", fontStyle: "italic" }}
                  >
                    No unread notifications available.
                  </Typography>
                </Box>
              )}
            </Popover>
            <Dialog open={openDialogCheckLogin}>
              <DialogContent>
                <Typography sx={{ fontWeight: "bold" }}>Login</Typography>
                <p>Please login to continue.</p>
                <Box>
                  <Button
                    onClick={() => setOpenDialogCheckLogin(false)}
                    variant="outlined"
                    sx={{
                      border: "1px solid #895129",
                      bgcolor: "#FCF8E7",
                      color: "#895129",
                      mr: 2,
                      "&:hover": {
                        backgroundColor: "#FCF8E7",
                        border: "1px solid #895129",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => navigate("/signin")}
                    variant="contained"
                    sx={{
                      bgcolor: "#895129",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#895129",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
            {!data ? (
              <Button
                onClick={() => navigate("/signin")}
                variant="contained"
                sx={{
                  bgcolor: "#895129",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#895129",
                  },
                  fontSize: { xs: "10px", sm: "16px" },
                }}
              >
                Sign in
              </Button>
            ) : (
              <IconButton
                sx={{ color: "#895129" }}
                onClick={() => {
                  if (
                    userType === "ADMIN" ||
                    userType === "BLOGGER" ||
                    userType === "STAFF WRITER" ||
                    userType === "FREELANCE WRITER"
                  ) {
                    window.open("/admin/dashboard", "_blank");
                  } else {
                    setIsProfileOpen(true);
                  }
                }}
              >
                <AccountCircleOutlinedIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* menubar */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: { xs: 250, sm: 300 },
            backgroundColor: "#fff7ee",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 20px",
              borderBottom: "1px solid #ddd",
              position: "relative",
            }}
          >
            <IconButton
              sx={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            {loadingLogo ? (
              <Skeleton variant="rectangular" width={250} height={90} />
            ) : (
              <img
                src={logoDetails}
                alt="Logo"
                style={{ width: "250px", height: "90px" }}
              />
            )}
          </Box>
          <Divider />
          <List sx={{ padding: "10px 20px" }}>
            <ListItem
              button
              onClick={() => {
                navigate("/", { state: { scrollToTop: true } });
                setDrawerOpen(false);
                setSelectedCategory(null);
              }}
            >
              Home
            </ListItem>
            {(showMore
              ? landingcategoryNameList
              : landingcategoryNameList.slice(0, 8)
            ).map((item) => (
              <Box key={item.id}>
                <ListItem
                  button
                  onClick={() => handleCategoryClick(item.id, item.name)}
                >
                  <ListItemText primary={item.name} />
                  {item.children?.length > 0 && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}
                    >
                      {expanded[item.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  )}
                </ListItem>
                {item.children?.length > 0 && (
                  <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <Box key={`${item.id}-${child.id}`}>
                          <ListItem
                            sx={{ pl: 4 }}
                            button
                            onClick={() =>
                              handleCategoryClick(child.id, child.name)
                            }
                          >
                            <ListItemText primary={child.name} />
                            {child.children?.length > 0 && (
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandSub(`${item.id}-${child.id}`);
                                }}
                              >
                                {expandedSub[`${item.id}-${child.id}`] ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            )}
                          </ListItem>
                          {child.children?.length > 0 && (
                            <Collapse
                              in={expandedSub[`${item.id}-${child.id}`]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {child.children.map((subchild) => (
                                  <ListItem
                                    key={`${item.id}-${child.id}-${subchild.id}`}
                                    sx={{ pl: 8 }}
                                    button
                                    onClick={() =>
                                      handleCategoryClick(
                                        subchild.id,
                                        subchild.name
                                      )
                                    }
                                  >
                                    <ListItemText primary={subchild.name} />
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          )}
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
            {landingcategoryNameList.length > 8 && (
              <Button
                fullWidth
                startIcon={<MoreHorizIcon />}
                onClick={() => setShowMore(!showMore)}
                sx={{ color: "#895129" }}
              >
                {showMore ? "Show Less" : "More"}
              </Button>
            )}
          </List>
        </Box>
      </Drawer>

      {/* <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: { xs: 250, sm: 300 },
            backgroundColor: "#fff7ee",
            height: "100%",
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 20px",
              borderBottom: "1px solid #ddd",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={toggleDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
            {logoDetails && (
              <img
                src={logoDetails}
                alt="Logo"
                style={{ width: "250px", height: "90px" }}
              />
            )}
          </Box>
          <Divider />
          <List sx={{ padding: "10px 20px" }}>
            <ListItem
              button
              onClick={() => {
                navigate("/");
                setDrawerOpen(false);
                setSelectedCategory(null);
              }}
            >
              Home
            </ListItem>
            {landingcategoryNameList?.slice(0, 8).map((item) => (
              <Box key={item.id}>
                <ListItem button>
                  <ListItemText
                    primary={item.name}
                    onClick={() => {
                      localStorage.setItem("categoryId", item.id);
                      localStorage.setItem("categoryName", item.name);
                      navigate(`/News?category=${item.name}&id=${item.id}`, {
                        state: {
                          selectedCategory: item.id,
                          scrollToCategory: true,
                        },
                      });
                      setDrawerOpen(false);
                    }}
                  />
                  {item.children?.length > 0 && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}
                    >
                      {expanded[item.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  )}
                </ListItem>
                {item.children?.length > 0 && (
                  <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <Box key={`${item.id}-${child.id}`}>
                          <ListItem
                            sx={{ pl: 4 }}
                            button
                            onClick={() => {
                              localStorage.setItem("categoryId", child.id);
                              localStorage.setItem("categoryName", child.name);
                              navigate(
                                `/News?category=${child.name}&id=${child.id}`,
                                {
                                  state: {
                                    selectedCategory: item.id,
                                    scrollToCategory: true,
                                  },
                                }
                              );
                              setDrawerOpen(false);
                            }}
                          >
                            <ListItemText primary={child.name} />
                            {child.children?.length > 0 && (
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandSub(`${item.id}-${child.id}`);
                                }}
                              >
                                {expandedSub[`${item.id}-${child.id}`] ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            )}
                          </ListItem>
                          {child.children?.length > 0 && (
                            <Collapse
                              in={expandedSub[`${item.id}-${child.id}`]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {child.children.map((subchild) => (
                                  <ListItem
                                    key={`${item.id}-${child.id}-${subchild.id}`}
                                    sx={{ pl: 8 }}
                                    button
                                    onClick={() => {
                                      localStorage.setItem(
                                        "categoryId",
                                        subchild.id
                                      );
                                      localStorage.setItem(
                                        "categoryName",
                                        subchild.name
                                      );
                                      navigate(
                                        `/News?category=${subchild.name}&id=${subchild.id}`,
                                        {
                                          state: {
                                            selectedCategory: item.id,
                                            scrollToCategory: true,
                                          },
                                        }
                                      );
                                      setDrawerOpen(false);
                                    }}
                                  >
                                    <ListItemText primary={subchild.name} />
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          )}
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer> */}

      {/* profile drawer */}
      <Drawer
        anchor="right"
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      >
        <Box
          p={3}
          sx={{
            position: "relative",
            width: { xs: 250, sm: 300 },
            backgroundColor: "#fff7ee",
            height: "100%",
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
            onClick={() => setIsProfileOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ marginTop: "2px" }}
          >
            <Avatar
              src={landinguserNavbarDetails?.profilePhoto}
              sx={{
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                marginBottom: { xs: "5px", sm: "7px" },
              }}
            >
              {landinguserNavbarDetails?.firstName?.charAt(0).toUpperCase()}
              {landinguserNavbarDetails?.lastName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "14px", sm: "18px" },
              }}
            >
              {formatNameLowerUpper(landinguserNavbarDetails?.firstName)}{" "}
              {formatNameLowerUpper(landinguserNavbarDetails?.lastName)}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontSize: { xs: "12px", sm: "16px" },
              }}
            >
              {landinguserNavbarDetails?.userName}
            </Typography>
            <Typography
              variant="h7"
              sx={{
                textAlign: "center",
                fontSize: { xs: "12px", sm: "16px" },
              }}
            >
              {landinguserNavbarDetails?.email}
            </Typography>
            <Typography
              variant="h7"
              sx={{
                textAlign: "center",
                fontSize: { xs: "12px", sm: "16px" },
              }}
            >
              {landinguserNavbarDetails?.phoneNumber}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center",
                fontSize: { xs: "12px", sm: "16px" },
              }}
            >
              {formatNameLowerUpper(landinguserNavbarDetails?.userType)}
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: "1px",
                backgroundColor: "#ddd",
              }}
            />
          </Box>
          <Box>
            <List>
              <ListItem
                button
                sx={{ color: "#895129" }}
                onClick={() => {
                  navigate("/saveItems");
                  setIsProfileOpen(false);
                }}
              >
                <ListItemIcon>
                  <BookmarkIcon
                    sx={{
                      color: "#895129",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Save Items"
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "14px", sm: "18px" } },
                  }}
                />
              </ListItem>
              <ListItem
                button
                sx={{ color: "#895129" }}
                onClick={() => {
                  navigate("/myprofile");
                  setIsProfileOpen(false);
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    sx={{
                      color: "#895129",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "14px", sm: "18px" } },
                  }}
                />
              </ListItem>
              {landinguserNavbarDetails?.userType === "GUEST AUTHOR" && (
                <>
                  <ListItem
                    button
                    sx={{ color: "#895129" }}
                    onClick={() => {
                      if (landinguserNavbarDetails?.status === "PENDING") {
                        setOpenDialogCheck(true);
                      } else {
                        navigate("/author");
                        setIsProfileOpen(false);
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PostAddIcon
                        sx={{
                          color: "#895129",
                          fontSize: { xs: "20px", sm: "25px" },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="My Post"
                      primaryTypographyProps={{
                        sx: { fontSize: { xs: "14px", sm: "18px" } },
                      }}
                    />
                  </ListItem>
                  <Dialog
                    BackdropProps={{
                      style: {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    PaperProps={{
                      style: {
                        boxShadow: "none",
                      },
                    }}
                    open={openDialogCheck}
                    onClose={() => setOpenDialogCheck(false)}
                    fullWidth
                    maxWidth="xs"
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
                          color: "#895129",
                        }}
                      />
                    </DialogTitle>
                    <DialogContent
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "10px", sm: "14px" },
                      }}
                    >
                      Your application is currently under review. Once it is
                      approved, you will be able to post articles.
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                      <Button
                        onClick={() => setOpenDialogCheck(false)}
                        variant="outlined"
                        sx={{
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          px: { xs: 1, sm: 2 },
                          py: { xs: 1, sm: 1 },
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                      >
                        Done
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
              {landinguserNavbarDetails?.userType === "GUEST AUTHOR" && (
                <ListItem
                  button
                  sx={{ color: "#895129" }}
                  onClick={() => {
                    if (landinguserNavbarDetails?.status === "PENDING") {
                      setOpenDialogCheck(true);
                    } else {
                      window.open("/admin/dashboard", "_blank");
                      setIsProfileOpen(false);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Home
                      sx={{
                        color: "#895129",
                        fontSize: { xs: "20px", sm: "25px" },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Go to Dashboard"
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: "14px", sm: "18px" } },
                    }}
                  />
                </ListItem>
              )}
              <ListItem
                button
                sx={{ color: "#895129" }}
                onClick={() => {
                  navigate("/Notification");
                  setIsProfileOpen(false);
                }}
              >
                <ListItemIcon>
                  <NotificationsIcon
                    sx={{
                      color: "#895129",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Notification"
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "14px", sm: "18px" } },
                  }}
                />
              </ListItem>
              <ListItem
                button
                sx={{ color: "#895129" }}
                onClick={() => {
                  navigate("/PrivacyPolicy");
                  setIsProfileOpen(false);
                }}
              >
                <ListItemIcon>
                  <PolicyIcon
                    sx={{
                      color: "#895129",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Privacy Policy"
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "14px", sm: "18px" } },
                  }}
                />
              </ListItem>
              <ListItem
                button
                sx={{ color: "#895129" }}
                onClick={() => setSignOutPopup(true)}
              >
                <ListItemIcon>
                  <ExitToAppIcon
                    sx={{
                      color: "#895129",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Sign Out"
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "14px", sm: "18px" } },
                  }}
                />
              </ListItem>
              <Dialog
                open={signOutPopup}
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
                  <div>Confirm Signout</div>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                  Are you sure you want to Signout?
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button
                    onClick={() => setSignOutPopup(false)}
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
                    onClick={handleSignOut}
                    variant="contained"
                    sx={{
                      bgcolor: "#895129",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#895129",
                      },
                    }}
                  >
                    Signout
                  </Button>
                </DialogActions>
              </Dialog>
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default memo(Header);
