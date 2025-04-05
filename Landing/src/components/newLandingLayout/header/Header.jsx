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
  useTheme,
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
import { debounce, round } from "lodash";
// import logo from "../../../assets/logo.png";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingCategoryDetailsByParmalink,
  getLandingcategoryNameList,
  getLandingGoogleAdsHeaderList,
  getLandingHomeAdsList,
  getLandingNotificationAll,
  getLandingPageList,
  getLandingPopularCategoryList,
  getLandingPostDetailsByParmalink,
  getLandingSearchQuery,
  getLandingUserNavbarDetails,
  landingNotificationRead,
} from "../../../services/slices/landingSlice";
import moment from "moment/moment";
import { formatNameLowerUpper } from "../../../utility/helpers/globalHelpers";
// import { useTheme } from "@emotion/react";
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
// import "react-swipeable-list/dist/styles.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AdsRenderer from "../../AdsRenderer";
import { getLogoDetails } from "../../../services/slices/globalSlice";
import { useRouter } from "next/router";
import { getLandingLogin } from "@/services/slices/authSlice";
import SigninPage from "@/pages/signin/index";

const Header = () => {
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();
  // const { selectedCategory } = router.query;
  const searchRef = useRef(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [expandedSub, setExpandedSub] = useState({});
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [openDialogCheckLogin, setOpenDialogCheckLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogCheck, setOpenDialogCheck] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [signOutPopup, setSignOutPopup] = useState(false);
  const [isSearchInputVisible, setSearchInputVisible] = useState(false);
  const [searchInputVisibleMobile, setSearchInputVisibleMobile] =
    useState(false);
  const [searchingQuery, setSearchingQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [id, setId] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  const allowedPaths = ["/saveItems", "/myprofile", "/author", "/Notification"];
  const { slug } = router.query;
  const permalink = Array.isArray(slug) ? slug.join("/") : slug || "";
  // const categoryPermalink = Array.isArray(slug) ? slug.join("/") : slug || "";
  const path = router.asPath;
  const categoryPermalink = path.split("/news/category/")[1] || "";

  const landingPostDetailsByParmalinks = useSelector(
    (state) => state.landing.landingPostDetailsByParmalinks
  );
  const landingCategoryDetailsByParmalink = useSelector(
    (state) => state.landing.landingCategoryDetailsByParmalink
  );
  useEffect(() => {
    let categoryId;
    if (landingCategoryDetailsByParmalink) {
      categoryId =
        landingCategoryDetailsByParmalink.parent?._parentCategories ||
        landingCategoryDetailsByParmalink?._parentCategories ||
        landingCategoryDetailsByParmalink.id;
    } else {
      categoryId =
        landingPostDetailsByParmalinks?.Categories?.[0]?._parentCategories ||
        landingPostDetailsByParmalinks?.Categories?.[0]?.id;
    }
    setSelectedCategory(categoryId);
  }, [landingPostDetailsByParmalinks, landingCategoryDetailsByParmalink]);

  useEffect(() => {
    let isArtile = router.pathname.split("/")[1];
    let isPage = router.pathname.split("/")[1];
    let isCategory = router.pathname.split("/")?.[2];
    let isTag = router.pathname.split("/")?.[2];
    if (
      isCategory?.toLowerCase() !== "category" &&
      isArtile?.toLowerCase() !== "pages" &&
      isTag?.toLowerCase() !== "tag"
    ) {
      setLoadingView(true);
      if (permalink) {
        dispatch(
          getLandingPostDetailsByParmalink({ links: permalink, id: null })
        )
          .finally(() => {
            setLoadingView(false);
          })
          .catch((err) => {
            setLoadingView(false);
          });
      }
    }
  }, [permalink, dispatch, router]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginUserDetails = localStorage.getItem("loginUser");
      if (loginUserDetails) {
        try {
          const data = JSON.parse(loginUserDetails);
          setData(data || null);
          setUserType(data?.userData?.userType || null);
          setId(data?.userData?.id || null);
        } catch (error) {}
      }
    }
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const ids = open ? "notification-popover" : undefined;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setMenuAnchorEl(null);
  };

  // for home page
  const scrollRef = useRef();
  useEffect(() => {
    let scrollToTop = router.query?.scrollToTop;
    if (router.pathname === "/") {
      scrollToTop = true;
    }
    if (scrollToTop && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [router.query]);

  // for category
  const categoryRef = useRef();
  useEffect(() => {
    if (router.query?.scrollToCategory && categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [router.query]);

  // for post
  const postRef = useRef();
  useEffect(() => {
    postRef.current.scrollIntoView({ behavior: "smooth" });
  }, [router.pathname]);

  // for page
  const pageRef = useRef();
  useEffect(() => {
    pageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [router.pathname]);

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
  const userDetails = useSelector((state) => state.auth.userDetails);
  const landingPageList = useSelector((state) => state.landing.landingPageList);
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
    if (!userDetails) {
      dispatch(getLandingLogin());
    }
    if (categoryPermalink) {
      setLoadingLogo(true);
      dispatch(getLandingCategoryDetailsByParmalink(categoryPermalink)).finally(
        () => {
          setLoadingLogo(false);
        }
      );
    }

    dispatch(getLandingPageList());
  }, [dispatch, id, categoryPermalink]);

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

  const handleCategoryClick = (slug) => {
    // const url = `/News?category=${name}&id=${id}&selectedCategory=${id}`;
    const url = `/news/category/${slug?.toLowerCase()}`;

    window.location.href = url;
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
        setError("Failed to fetch weather data.");
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => setError("Unable to retrieve location.")
      );
    } else {
      setError("Geolocation is not supported.");
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
  // const handlePostClick = (post) => {
  //   const permalink = post?.permalink?.toLowerCase();
  //   const selectedCategory =
  //     post?.Categories?.[0]?._parentCategories || post?.Categories?.[0]?.id;
  //   router.push({
  //     pathname: `/News/${permalink}`,
  //     query: {
  //       selectedCategory: selectedCategory,
  //       scrollToPost: true,
  //     },
  //   });
  //   setSearchingQuery("");
  //   setSearchInputVisible(false);
  //   dispatch(getLandingSearchQuery());
  // };

  const handlePostClick = (post) => {
    const permalink = post?.permalink?.toLowerCase();
    const selectedCategory =
      post?.Categories?.[0]?._parentCategories || post?.Categories?.[0]?.id;

    const url = `/news/${permalink}`;

    window.location.href = url;

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
    const permalink = post?.permalink?.toLowerCase();
    const selectedCategory =
      post?.Categories?.[0]?._parentCategories || post?.Categories?.[0]?.id;
    const url = `/news/${permalink}`;
    window.location.href = url;
    setSearchQuery("");
    setSearchInputVisibleMobile(false);
    dispatch(getLandingSearchQuery());
  };

  // profile drawers
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
    setDrawerOpen(false);
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  //this is for header Ads
  const headerImages = landingHeaderAdsList
    ?.filter((ad) => ad.position === "HEADER")
    ?.map((ad) => ({
      imageUrl: ad.horizontalImageUrl,
      adUrl: ad.advertisementUrl,
    }))
    ?.filter((ad) => ad.imageUrl);

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

  const handleClick = (item) => {
    const pageName = item?.pageName?.toLowerCase()?.replace(/\s+/g, "-");
    router.push({
      pathname: `/pages/${pageName}`,
      query: { scrollToPage: true },
    });
  };

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
              src={logoDetails}
              alt="Logo"
              style={{ width: "250px", height: "90px", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          )}
          {/* <AdsRenderer ads={landingGoogleAdsHeaderList} position="Header" />
           */}

          <Container maxWidth="xl" sx={{ height: "100px" }}>
            <AdsRenderer ads={landingGoogleAdsHeaderList} position="Header" />
          </Container>
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
                  {landingSearchingList?.map((post, index) => (
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
                            ? post?.metaTitle
                                .split(" ")
                                ?.slice(0, 5)
                                .join(" ") + "..."
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
                    {landingSearchingList?.map((post, index) => (
                      <>
                        <Card
                          key={post.id || index}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
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
              }}
            >
              {loadingLogo ? (
                <Skeleton variant="rectangular" width={140} height={60} />
              ) : (
                <img
                  src={logoDetails}
                  alt="Logo"
                  style={{ width: "135px", height: "60px" }}
                  onClick={() => router.push("/")}
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
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <Button
                sx={{
                  color: allowedPaths.includes(router.pathname)
                    ? "#804000"
                    : router.pathname === "/"
                    ? "#895129"
                    : "#804000",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: allowedPaths.includes(router.pathname)
                      ? "0"
                      : router.pathname === "/"
                      ? "100%"
                      : "0",
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
                // onClick={() => {
                //   window.scrollTo(0, 0);
                //   router.replace({
                //     pathname: "/",
                //   });
                // }}
                onClick={() => {
                  window.scrollTo(0, 0);
                  window.location.href = "/";
                }}
              >
                Home
              </Button>
              {loadingCategory ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {Array.from(new Array(6))?.map((_, index) => (
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
                          color: "#895129",
                          position: "relative",
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            color:
                              Number(selectedCategory) === item?.id
                                ? "#895129"
                                : "#804000",
                            width:
                              Number(selectedCategory) === item?.id
                                ? "100%"
                                : "0",
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
                          // const url = `/News?category=${item.name}&id=${item.id}&selectedCategory=${item.id}`;
                          const url = `/news/category/${item.slug?.toLowerCase()}`;
                          router.push(url).then(() => {
                            window.location.href = url;
                          });
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
                          {item.children?.map((child) => (
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
                                  const url = `/news/category/${child.slug?.toLowerCase()}`;
                                  router.push(url).then(() => {
                                    window.location.href = url;
                                  });
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
                                    {child.children?.map((grandChild) => (
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
                                            // router.push({
                                            //   pathname: "/News",
                                            //   query: {
                                            //     category: grandChild.name,
                                            //     id: grandChild.id,
                                            //     selectedCategory: item.id,
                                            //     scrollToCategory: "true",
                                            //   },
                                            // });

                                            // const url = `/News?category=${grandChild.name}&id=${grandChild.id}&selectedCategory=${item.id}`;
                                            const url = `/news/category/${grandChild.slug?.toLowerCase()}`;

                                            router.push(url).then(() => {
                                              window.location.href = url;
                                            });
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
                            // router.push({
                            //   pathname: "/News",
                            //   query: {
                            //     category: item.name,
                            //     id: item.id,
                            //     selectedCategory: item.id,
                            //     scrollToCategory: "true",
                            //   },
                            // });

                            // const url = `/News?category=${item.name}&id=${item.id}&selectedCategory=${item.id}`;
                            const url = `/news/category/${item.slug?.toLowerCase()}`;

                            router.push(url).then(() => {
                              window.location.href = url;
                            });
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
                            {item.children?.map((child) => (
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
                                    // router.push({
                                    //   pathname: "/News",
                                    //   query: {
                                    //     category: child.name,
                                    //     id: child.id,
                                    //     selectedCategory: item.id,
                                    //     scrollToCategory: "true",
                                    //   },
                                    // });
                                    // const url = `/News?category=${child.name}&id=${child.id}&selectedCategory=${item.id}`;
                                    const url = `/news/category/${child.slug?.toLowerCase()}`;

                                    router.push(url).then(() => {
                                      window.location.href = url;
                                    });
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
                                      {child.children?.map((grandChild) => (
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
                                              // const url = `/News?category=${grandChild.name}&id=${grandChild.id}&selectedCategory=${item.id}`;
                                              const url = `/news/category/${grandChild.slug?.toLowerCase()}`;

                                              router.push(url).then(() => {
                                                window.location.href = url;
                                              });
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
                    fontSize: { xs: "8px", sm: "12px" },
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
                  fontSize: { xs: "8px", sm: "12px" },
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
                        router.push({
                          pathname: `/news/${notification?.permalink}`,
                          query: {
                            selectedCategory:
                              notification?.Categories?.[0]
                                ?._parentCategories ||
                              notification?.Categories?.[0]?.id,
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
                      // variant="h6"
                      sx={{
                        fontSize: { xs: "12px", sm: "14px", lg: "16px" },
                        fontWeight: "bold",
                        color: "#895129",
                      }}
                    >
                      {notification.notificationsTitle}
                    </Typography>
                    <Typography
                      // variant="body2"
                      sx={{
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: { xs: "10px", sm: "12px", lg: "14px" },
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
                  <>
                    <Button
                      onClick={() =>
                        router.push({
                          pathname: "/signin",
                          query: { open: "true" },
                        })
                      }
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
                    {openSignIn && (
                      <SigninPage
                        signInOpen={openSignIn}
                        onClose={() => setOpenSignIn(false)}
                      />
                    )}
                  </>
                </Box>
              </DialogContent>
            </Dialog>
            {(!data || Object.keys(data).length === 0) &&
            (!userDetails || Object.keys(userDetails).length === 0) ? (
              <>
                <Button
                  onClick={() => setOpenSignIn(true)}
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

                {/* Conditionally Render SigninPage */}
                {openSignIn && (
                  <SigninPage
                    signInOpen={openSignIn}
                    onClose={() => setOpenSignIn(false)}
                  />
                )}
              </>
            ) : (
              <>
                <IconButton
                  sx={{
                    color: "#895129",

                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      color: allowedPaths.includes(router.pathname)
                        ? "#895129"
                        : "#804000",
                      width: allowedPaths.includes(router.pathname)
                        ? "100%"
                        : "0",
                      height: "2px",
                      backgroundColor: "#804000",
                      transition: "width 0.3s ease",
                    },
                  }}
                  onMouseEnter={
                    userType === "ADMIN" ||
                    userType === "BLOGGER" ||
                    userType === "STAFF WRITER" ||
                    userType === "FREELANCE WRITER"
                      ? handleMouseEnter
                      : undefined
                  }
                  onClick={() => {
                    if (
                      userType === "ADMIN" ||
                      userType === "BLOGGER" ||
                      userType === "STAFF WRITER" ||
                      userType === "FREELANCE WRITER"
                    ) {
                      // // window.open("/admin/dashboard", "_blank");
                      // window.open(
                      //   `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`,
                      //   "_blank"
                      // );
                    } else {
                      setIsProfileOpen(true);
                    }
                  }}
                >
                  <AccountCircleOutlinedIcon sx={{ fontSize: "30px" }} />
                </IconButton>
                <Popover
                  open={Boolean(menuAnchorEl)}
                  anchorEl={menuAnchorEl}
                  onClose={handleMouseLeave}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  disableRestoreFocus
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      p: 1,
                      backgroundColor: "#f8f5f2",
                      color: "#895129",
                      boxShadow: 3,
                      // borderRadius: 1,
                    }}
                    onMouseLeave={handleMouseLeave}
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
                        window.open(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`,
                          "_blank"
                        );
                      }}
                    >
                      Dashboard
                    </Button>
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
                        setSignOutPopup(true);
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </Popover>
              </>
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
              button="true"
              // onClick={() => {
              //   window.scrollTo(0, 0);
              //   router.replace({
              //     pathname: "/",
              //   });
              //   window.location.reload();
              //   setDrawerOpen(false);
              // }}
              onClick={() => {
                // router.replace("/", undefined, { shallow: true }).then(() => {
                //   // window.location.reload();
                // });
                window.location.href = "/";
                setDrawerOpen(false);
              }}
            >
              Home
            </ListItem>
            {(showMore
              ? landingcategoryNameList
              : landingcategoryNameList?.slice(0, 8)
            )?.map((item) => (
              <Box key={item.id}>
                <ListItem
                  button="true"
                  // onClick={() => handleCategoryClick(item.id, item.name)}
                  onClick={() => handleCategoryClick(item.slug)}
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
                      {item.children?.map((child) => (
                        <Box key={`${item.id}-${child.id}`}>
                          <ListItem
                            sx={{ pl: 4 }}
                            button="true"
                            onClick={() => handleCategoryClick(child.slug)}
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
                                {child.children?.map((subchild) => (
                                  <ListItem
                                    key={`${item.id}-${child.id}-${subchild.id}`}
                                    sx={{ pl: 8 }}
                                    button="true"
                                    onClick={() =>
                                      handleCategoryClick(
                                        subchild.slug
                                        // subchild.name
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
                sx={{
                  color: "#895129",
                  justifyContent: "flex-start",
                  paddingLeft: "18px",
                }}
              >
                {showMore ? "Show Less" : "More"}
              </Button>
            )}
          </List>
        </Box>
      </Drawer>

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
                button="true"
                sx={{ color: "#895129", cursor: "pointer" }}
                onClick={() => {
                  router.push("/saveItems");
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
                button="true"
                sx={{ color: "#895129", cursor: "pointer" }}
                onClick={() => {
                  router.push("/myprofile");
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
                    button="true"
                    sx={{ color: "#895129", cursor: "pointer" }}
                    onClick={() => {
                      if (landinguserNavbarDetails?.status === "PENDING") {
                        setOpenDialogCheck(true);
                      } else {
                        router.push("/author");
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
                  button="true"
                  sx={{ color: "#895129", cursor: "pointer" }}
                  onClick={() => {
                    if (landinguserNavbarDetails?.status === "PENDING") {
                      setOpenDialogCheck(true);
                    } else {
                      window.open(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`,
                        "_blank"
                      );
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
                button="true"
                sx={{ color: "#895129", cursor: "pointer" }}
                onClick={() => {
                  router.push("/Notification");
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
                button="true"
                sx={{ color: "#895129", cursor: "pointer" }}
                onClick={() => {
                  setIsProfileOpen(false);
                  const filteredPage = landingPageList.find((page) =>
                    page.pageName.toLowerCase().includes("privacy")
                  );
                  if (filteredPage) {
                    handleClick(filteredPage);
                  }
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
                button="true"
                sx={{ color: "#895129", cursor: "pointer" }}
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
            </List>
          </Box>
        </Box>
      </Drawer>
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
    </>
  );
};

export default memo(Header);
