import { memo, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  Skeleton,
  List,
  ListSubheader,
  ListItemText,
} from "@mui/material";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getLandingCategoryAdsList,
  getLandingCategoryDetails,
  getLandingCategoryIdExplore,
  getLandingCategoryIdHighlight,
  getLandingCategoryIdMore,
  getLandingCategoryIdShort,
  getLandingGoogleAdsCategoryList,
  getLandingHeroSection,
  getLandingPopularCategoryList,
} from "../../../services/slices/landingSlice";
import AdsRenderer from "../../../components/AdsRenderer";
import DynamicSEO from "../../../components/SEO/DynamicSEO";
import axios from "axios";

const Newspage = () => {
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const categoryName = searchParams.get("category");
  const [loadingView, setLoadingView] = useState(false);
  const [loadingShortView, setLoadingShortView] = useState(false);
  const [loadingHighlight, setLoadingHighlight] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryMetaInfo, setCategoryMetaInfo] = useState([]);
  const [loadingRecentSection, setLoadingRecentSection] = useState(false);
  // const [position1CurrentImageIndex, setPosition1CurrentImageIndex] = useState(
  //   0
  // );
  const payload = {
    currentPage: 1,
  };

  const landingCategoryDetails = useSelector(
    (state) => state.landing.landingCategoryDetails
  );
  // const landingCategoryIdShort = useSelector(
  //   (state) => state.landing.landingCategoryIdShort
  // );
  const landingCategoryIdHighlight = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  const landingCategoryIdExplore = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  const landingCategoryIdMore = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  // const landingCategoryAdsList = useSelector(
  //   (state) => state.landing.landingCategoryAdsList
  // );
  const landingPopularCategoryList = useSelector(
    (state) => state.landing.landingPopularCategoryList
  );
  const landingHeroSection = useSelector(
    (state) => state.landing.landingHeroSection
  );
  useEffect(() => {
    if (id) {
      setLoadingView(true);
      dispatch(getLandingCategoryDetails(id)).finally(() => {
        setLoadingView(false);
      });
      setLoadingShortView(true);
      dispatch(getLandingCategoryIdShort(id)).finally(() => {
        setLoadingShortView(false);
      });
      setLoadingHighlight(true);
      dispatch(getLandingCategoryIdHighlight(id)).finally(() => {
        setLoadingHighlight(false);
      });
      setLoadingExplore(true);
      dispatch(getLandingCategoryIdExplore(id)).finally(() => {
        setLoadingExplore(false);
      });
      setLoadingMore(true);
      dispatch(
        getLandingCategoryIdMore({
          id: id,
          page: payload,
        })
      ).finally(() => {
        setLoadingMore(false);
      });
    }
    dispatch(getLandingCategoryAdsList());
    dispatch(getLandingPopularCategoryList());
    setLoadingRecentSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingRecentSection(false);
    });
  }, [id, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/landing/category/metaInfo/${id}`
        );
        setCategoryMetaInfo(response.data.data);
      } catch (error) {
        // console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  // const position1Images = landingCategoryAdsList
  //   .filter((ad) => ad.position === "CATEGORY-1")
  //   .map((ad) => ({
  //     imageUrl: ad.verticalImageUrl,
  //     adUrl: ad.advertisementUrl,
  //   }))
  //   .filter((url) => url);
  // useEffect(() => {
  //   if (position1Images.length > 1) {
  //     const interval = setInterval(() => {
  //       setPosition1CurrentImageIndex(
  //         (prevIndex) => (prevIndex + 1) % position1Images.length
  //       );
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // }, [position1Images]);

  // for short news
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const handleNextImage = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex < landingCategoryIdShort.length - 1 ? prevIndex + 1 : 0
  //   );
  // };
  // const handlePrevImage = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex > 0 ? prevIndex - 1 : landingCategoryIdShort.length - 1
  //   );
  // };

  // time ago function
  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  }

  // for google ads
  const [isAdVisible, setIsAdVisible] = useState(false);
  const landingGoogleAdsCategoryList = useSelector(
    (state) => state.landing.landingGoogleAdsCategoryList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsCategoryList());
  }, [dispatch]);

  // Check if the ads are actually rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      const adElement = document.querySelector(".google-ad");
      setIsAdVisible(!!adElement);
    }, 1500);

    return () => clearTimeout(timer);
  }, [landingGoogleAdsCategoryList]);

  return (
    <>
      {categoryMetaInfo && (
        <DynamicSEO
          SEOTitle={categoryMetaInfo?.metaTitle}
          SEODescription={categoryMetaInfo?.metaDescription}
          SEOKeywords={categoryMetaInfo?.metaTags}
        />
      )}
      {/* news main section */}
      <Box sx={{ top: "90%", width: "100%" }}>
        <Container maxWidth="xl" sx={{ mt: 1, px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "15px", sm: "20px" },
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#804000",
              cursor: "pointer",
            }}
          >
            {categoryName || "News"}
            <Divider sx={{ marginTop: "5px" }} />
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {loadingView ? (
                <Skeleton
                  variant="rectangular"
                  height={350}
                  style={{ marginBottom: "10px" }}
                />
              ) : landingCategoryDetails?.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    marginBottom: "20px",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      height: "350px",
                      borderRadius: "0",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    image={landingCategoryDetails[0]?.SEOImageUrl}
                    alt={landingCategoryDetails[0]?.title}
                    onClick={() => {
                      localStorage.setItem(
                        "postId",
                        landingCategoryDetails[0]?.id
                      );
                      navigate(
                        `/News/${landingCategoryDetails[0]?.permalink?.toLowerCase()}`,
                        {
                          state: {
                            selectedCategory:
                              landingCategoryDetails[0]?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        }
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      marginBottom: { xs: "20px", md: "120px" },
                    }}
                  >
                    {isMobiles ? (
                      <>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                            fontSize: { xs: "11px", sm: "14px" },
                            fontFamily: "DM Sans, sans-serif",
                            "&:hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => {
                            localStorage.setItem(
                              "postId",
                              landingCategoryDetails[0]?.id
                            );
                            navigate(
                              `/News/${landingCategoryDetails[0]?.permalink?.toLowerCase()}`,
                              {
                                state: {
                                  selectedCategory:
                                    landingCategoryDetails[0]?.Categories?.[0]
                                      ?.id,
                                  // selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              }
                            );
                          }}
                        >
                          {landingCategoryDetails[0]?.metaTitle || ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "11px", sm: "14px" },
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          {landingCategoryDetails[0]?.metaDescription || ""}{" "}
                          <span
                            onClick={() => {
                              localStorage.setItem(
                                "postId",
                                landingCategoryDetails[0]?.id
                              );
                              navigate(
                                `/News/${landingCategoryDetails[0]?.permalink}`,
                                {
                                  state: {
                                    selectedCategory:
                                      landingCategoryDetails[0]?.Categories?.[0]
                                        ?.id,
                                    scrollToPost: true,
                                  },
                                }
                              );
                            }}
                            style={{
                              color: "#895129",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Read More
                          </span>
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                            fontSize: { xs: "11px", sm: "14px" },
                            fontFamily: "DM Sans, sans-serif",
                            "&:hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => {
                            localStorage.setItem(
                              "postId",
                              landingCategoryDetails[0]?.id
                            );
                            navigate(
                              `/News/${landingCategoryDetails[0]?.permalink?.toLowerCase()}`,
                              {
                                state: {
                                  selectedCategory:
                                    landingCategoryDetails[0]?.Categories?.[0]
                                      ?.id,
                                  scrollToPost: true,
                                },
                              }
                            );
                          }}
                        >
                          {landingCategoryDetails[0]?.metaTitle || ""}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: "10px", sm: "12px" },
                            lineHeight: "1.5",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            localStorage.setItem(
                              "postId",
                              landingCategoryDetails[0]?.id
                            );
                            navigate(
                              `/News/${landingCategoryDetails[0]?.permalink}`,
                              {
                                state: {
                                  selectedCategory:
                                    landingCategoryDetails[0]?.Categories?.[0]
                                      ?.id,
                                  scrollToPost: true,
                                },
                              }
                            );
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                landingCategoryDetails[0]?.content
                                  ?.split(" ")
                                  .slice(0, 100)
                                  .join(" ") +
                                (landingCategoryDetails[0]?.content?.split(" ")
                                  .length > 100
                                  ? "..."
                                  : ""),
                            }}
                            style={{ textAlign: "justify" }}
                          />
                          <span
                            onClick={() => {
                              localStorage.setItem(
                                "postId",
                                landingCategoryDetails[0]?.id
                              );
                              navigate(
                                `/News/${landingCategoryDetails[0]?.permalink}`,
                                {
                                  state: {
                                    selectedCategory:
                                      landingCategoryDetails[0]?.Categories?.[0]
                                        ?.id,
                                    scrollToPost: true,
                                  },
                                }
                              );
                            }}
                            style={{
                              color: "#895129",
                              cursor: "pointer",
                              textDecoration: "underline",
                              zIndex: 1,
                            }}
                          >
                            Read More
                          </span>
                        </Typography>
                      </>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ display: "block", marginTop: "10px" }}
                    >
                      {timeAgo(landingCategoryDetails[0]?.createdAt) || ""}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    No Posts found for this category.
                  </Typography>
                </Box>
              )}
              {loadingView ? (
                <Skeleton
                  variant="rectangular"
                  height={350}
                  width={"100%"}
                  style={{ marginBottom: "10px" }}
                />
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                  {landingCategoryDetails?.slice(1, 4).map((item, index) => (
                    <Card
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        // marginBottom: "15px",
                        boxShadow: "none",
                        backgroundColor: "white",
                        alignItems: "center",
                        width: { xs: "100%", sm: "calc(33% - 10px)" },
                        borderRadius: "0",
                      }}
                    >
                      {!item.SEOImageUrl ? (
                        <Skeleton
                          variant="rectangular"
                          height={220}
                          width={320}
                        />
                      ) : (
                        <CardMedia
                          component="img"
                          sx={{
                            width: "320px",
                            height: "220px",
                            objectFit: "cover",
                            borderRadius: "0",
                            "&:hover": {
                              cursor: "pointer",
                            },
                          }}
                          image={item.SEOImageUrl}
                          alt={item.title}
                          onClick={() => {
                            localStorage.setItem("postId", item?.id);
                            navigate(
                              `/News/${item?.permalink?.toLowerCase()}`,
                              {
                                state: {
                                  selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              }
                            );
                          }}
                        />
                      )}

                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                          fontWeight: "bold",
                          // marginTop: "5px",
                          fontSize: { xs: "10px", md: "12px", sm: "14px" },
                          fontFamily: "DM Sans, sans-serif",
                          "&:hover": {
                            cursor: "pointer",
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", item?.id);
                          navigate(`/News/${item?.permalink?.toLowerCase()}`, {
                            state: {
                              selectedCategory: item?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      >
                        {item.metaTitle}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginTop: "10px",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: { xs: "9px", sm: "12px" },
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", item?.id);
                          navigate(`/News/${item?.permalink}`, {
                            state: {
                              selectedCategory: item?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      >
                        {item.metaDescription || ""}{" "}
                        <span
                          style={{
                            fontSize: { xs: "6px", sm: "8px" },
                            fontWeight: "bold",
                            color: "#895129",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Read More
                        </span>
                      </Typography>
                      <Divider sx={{ marginTop: "10px" }} />
                    </Card>
                  ))}
                </Box>
              )}

              <Grid
                container
                spacing={2}
                sx={{
                  marginTop: "20px",
                  direction: { xs: "column", sm: "row" },
                }}
              >
                {loadingView ? (
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    width={"100%"}
                    style={{ marginBottom: "10px" }}
                  />
                ) : (
                  landingCategoryDetails?.slice(5, 11).map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "9px", sm: "12px" },
                          fontWeight: "bold",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", item?.id);
                          navigate(`/News/${item?.permalink}`, {
                            state: {
                              selectedCategory: item?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      >
                        {item?.metaTitle || ""}{" "}
                        <span
                          onClick={() => {
                            localStorage.setItem("postId", item?.id);
                            navigate(`/News/${item?.permalink}`, {
                              state: {
                                selectedCategory: item?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          style={{
                            fontSize: { xs: "6px", sm: "8px" },
                            fontWeight: "bold",
                            color: "#895129",
                            "&:hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Read More
                        </span>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          marginTop: { xs: "5px", sm: "10px" },
                          fontSize: { xs: "6px", md: "8px", sm: "10px" },
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <span>
                            {" "}
                            {timeAgo(landingCategoryDetails[0]?.createdAt) ||
                              ""}
                          </span>
                          <span style={{ marginLeft: "25px" }}>|</span>
                          <span style={{ marginLeft: "25px" }}>
                            {categoryName || ""} News
                          </span>
                        </Box>
                      </Typography>
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <AdsRenderer
                ads={landingGoogleAdsCategoryList}
                position="Square"
              /> */}
              {loadingShortView ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "400px" }}
                />
              ) : (
                <List
                  sx={{
                    bgcolor: "background.paper",
                    textAlign: "start",
                    overflow: "hidden",
                    maxHeight: "100%",
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  <Box
                    sx={{
                      backgroundColor: "#895129",
                      p: 1.5,
                      display: "inline-block",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold" color="white">
                      Popular Categories
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      backgroundColor: "#895129",
                      width: "100%",
                      marginTop: "-2px",
                    }}
                  />

                  <ul
                    style={{
                      listStyleType: "none",
                      paddingLeft: "10px",
                      paddingRight: "5px",
                      marginTop: "2px",
                    }}
                  >
                    {landingPopularCategoryList?.map((category) => (
                      <li
                        key={category.categoryId}
                        style={{
                          position: "relative",
                          display: "flex",
                          padding: "2px 0",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: "#53585c",
                          fontSize: "12px",
                          fontWeight: 600,
                          fontFamily: "sans-serif",
                          marginBottom: "5px",
                          borderBottom: "1px dashed lightgray",
                          cursor: "pointer",
                          "&:hover": {
                            color: "#53585c",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "categoryId",
                            category.categoryId
                          );
                          localStorage.setItem("categoryName", category.name);
                          navigate(
                            `/News?category=${category.name}&id=${category.categoryId}`,
                            {
                              state: {
                                selectedCategory: category.categoryId,
                                scrollToCategory: true,
                              },
                            }
                          );
                        }}
                      >
                        <ListItemText
                          primary={category.name}
                          sx={{ flex: 1 }}
                        />
                        <ListItemText
                          primary={category.postCount}
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </List>
              )}
              {loadingRecentSection ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ mt: 1, width: "100%", height: "400px" }}
                />
              ) : (
                <Box
                  sx={{
                    fontFamily: "sans-serif",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#895129",
                      p: 1.5,
                      display: "inline-block",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold" color="white">
                      Recent Posts
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      backgroundColor: "#895129",
                      width: "100%",
                      marginTop: "-2px",
                    }}
                  />
                  <Box sx={{ margin: "auto", padding: 2 }}>
                    {landingHeroSection?.slice(0, 5).map((item, index) => (
                      <Card
                        key={index || item.id}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: "10px",
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", item?.id);
                          navigate(`/News/${item?.permalink}`, {
                            state: {
                              selectedCategory: item?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: { sm: "90px", xs: "70px" },
                            height: { sm: "80px", xs: "70px" },
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          image={item.squareImageUrl}
                          alt={item.title}
                        />
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            ml: 2,
                            fontSize: { xs: "11px", sm: "12px" },
                            "&:hover": {
                              cursor: "pointer",
                              color: "#895129",
                            },
                          }}
                          onClick={() => {
                            localStorage.setItem("postId", item?.id);
                            window.scrollTo(0, 0);
                            navigate(`/News/${item?.permalink}`, {
                              state: {
                                selectedCategory: item?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                        >
                          {item?.metaTitle || ""}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              <Divider
                sx={{
                  marginBottom: "10px",
                  mt: { lg: "1em", xs: "1em", sm: 0 },
                }}
              />
            </Grid>

            {/* <Grid item xs={12} md={4}>
              <Divider sx={{ marginTop: "10px" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: "10px" }}
              >
                Short News
              </Typography>
              <hr />
              {loadingShortView ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "400px" }}
                />
              ) : (
                <Box
                  sx={{
                    height: "500px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid red",
                  }}
                >
                  {landingCategoryIdShort.length > 0 ? (
                    <Card sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="600px"
                        image={
                          landingCategoryIdShort[currentIndex]?.SEOImageUrl
                        }
                        alt={landingCategoryIdShort[currentIndex]?.title}
                        sx={{}}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3))",
                          zIndex: 1,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          padding: "10px",
                          boxSizing: "border-box",
                          height: "30%",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "600",
                            fontSize: "30px",
                            color: "#000",
                            mt: "1em",
                            "&:hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => {
                            localStorage.setItem(
                              "postId",
                              landingCategoryIdShort[currentIndex]?.id
                            );
                            navigate(
                              `/News/${landingCategoryIdShort[
                                currentIndex
                              ]?.permalink?.toLowerCase()}`,
                              {
                                state: {
                                  selectedCategory:
                                    landingCategoryIdShort[currentIndex]
                                      ?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              }
                            );
                          }}
                        >
                          {landingCategoryIdShort[currentIndex]?.metaTitle}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                          zIndex: 10,
                        }}
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleNextImage}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                          zIndex: 10,
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Card>
                  ) : (
                    <Box sx={{}}>
                      <Typography>No Short News Avaliable</Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
              >
                <AdsRenderer
                  ads={landingGoogleAdsCategoryList}
                  position="Vertical"
                />
                <AdsRenderer
                  ads={landingGoogleAdsCategoryList}
                  position="Square"
                />
              </Box>
            </Grid> */}
          </Grid>
          {/* {isAdVisible ? ( */}
          <AdsRenderer
            ads={landingGoogleAdsCategoryList}
            position="Full Width"
          />
          {/* ) : null} */}
          <Divider
            sx={{
              marginY: "1.5rem",
              color: "black",
              border: "1px solid black",
            }}
          />
        </Container>
      </Box>

      {/* highlight section */}
      <Box sx={{ top: "100%", width: "100%" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 } }}>
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 0,
                overflow: "hidden",
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "0",
                  display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#804000",
                    padding: "5px",
                  }}
                >
                  HIGHLIGHT
                </span>{" "}
                <span style={{ color: "#000000" }}>
                  {categoryName || "NEWS"}
                </span>
              </Typography>
            </Box>
            {loadingHighlight ? (
              <Skeleton
                variant="rectangular"
                height={350}
                style={{ marginBottom: "10px" }}
              />
            ) : (
              <Grid container spacing={4}>
                {landingCategoryIdHighlight.length > 0 ? (
                  <Grid item xs={12} md={8}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        borderRadius: 0,
                        overflow: "hidden",
                        boxShadow: "none",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          flex: "1 1 auto",
                          objectFit: "cover",
                          height: "450px",
                          width: { xs: "100%", md: "50%" },
                          // width: "450px",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "postId",
                            landingCategoryIdHighlight[0]?.id
                          );
                          navigate(
                            `/News/${landingCategoryIdHighlight[0]?.permalink}`,
                            {
                              state: {
                                selectedCategory:
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?.id,
                                scrollToPost: true,
                              },
                            }
                          );
                        }}
                        image={landingCategoryIdHighlight[0]?.SEOImageUrl}
                        alt={landingCategoryIdHighlight[0]?.title || "image"}
                      />
                      <CardContent
                        sx={{
                          flex: "1 1 auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          marginBottom: { xs: 0, sm: "10px" },
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        {isMobiles ? (
                          <>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              sx={{
                                lineHeight: 1.3,
                                "&:hover": {
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => {
                                localStorage.setItem(
                                  "postId",
                                  landingCategoryIdHighlight[0]?.id
                                );
                                navigate(
                                  `/News/${landingCategoryIdHighlight[0]?.permalink?.toLowerCase()}`,
                                  {
                                    state: {
                                      selectedCategory:
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  }
                                );
                              }}
                            >
                              {landingCategoryIdHighlight[0]?.metaTitle || ""}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ marginTop: 2 }}
                            >
                              {landingCategoryIdHighlight[0]?.metaDescription ||
                                ""}{" "}
                              <span
                                onClick={() => {
                                  localStorage.setItem(
                                    "postId",
                                    landingCategoryIdHighlight[0]?.id
                                  );
                                  navigate(
                                    `/News/${landingCategoryIdHighlight[0]?.permalink}`,
                                    {
                                      state: {
                                        selectedCategory:
                                          landingCategoryIdHighlight[0]
                                            ?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    }
                                  );
                                }}
                                style={{
                                  fontSize: {
                                    xs: "7px",
                                    md: "8px",
                                    sm: "10px",
                                  },
                                  fontWeight: "bold",
                                  color: "#895129",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                Read More
                              </span>
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                marginBottom: "10px",
                                fontSize: { xs: "11px", sm: "14px" },
                                fontFamily: "DM Sans, sans-serif",
                                "&:hover": {
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => {
                                localStorage.setItem(
                                  "postId",
                                  landingCategoryIdHighlight[0]?.id
                                );
                                navigate(
                                  `/News/${landingCategoryIdHighlight[0]?.permalink?.toLowerCase()}`,
                                  {
                                    state: {
                                      selectedCategory:
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  }
                                );
                              }}
                            >
                              {landingCategoryIdHighlight[0]?.metaTitle || ""}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: { xs: "10px", sm: "12px" },
                                lineHeight: "1.5",
                              }}
                              onClick={() => {
                                localStorage.setItem(
                                  "postId",
                                  landingCategoryIdHighlight[0]?.id
                                );
                                navigate(
                                  `/News/${landingCategoryIdHighlight[0]?.permalink?.toLowerCase()}`,
                                  {
                                    state: {
                                      selectedCategory:
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  }
                                );
                              }}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    landingCategoryIdHighlight[0]?.content
                                      ?.split(" ")
                                      .slice(0, 80)
                                      .join(" ") +
                                    (landingCategoryIdHighlight[0]?.content?.split(
                                      " "
                                    ).length > 80
                                      ? "..."
                                      : ""),
                                }}
                                style={{ textAlign: "justify" }}
                              />
                              <span
                                onClick={() => {
                                  localStorage.setItem(
                                    "postId",
                                    landingCategoryIdHighlight[0]?.id
                                  );
                                  navigate(
                                    `/News/${landingCategoryIdHighlight[0]?.permalink}`,
                                    {
                                      state: {
                                        selectedCategory:
                                          landingCategoryIdHighlight[0]
                                            ?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    }
                                  );
                                }}
                                style={{
                                  color: "#895129",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                Read More
                              </span>
                            </Typography>
                          </>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ marginTop: 2 }}
                        >
                          {timeAgo(landingCategoryIdHighlight[0]?.createdAt) ||
                            ""}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      mt: 4,
                      ml: 4,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      No Highlight News Avaliable
                    </Typography>
                  </Box>
                )}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0 }}
                  >
                    {landingCategoryIdHighlight
                      ?.slice(6, 12)
                      .map((item, index) => (
                        <Card
                          key={index}
                          sx={{
                            // padding: 0.5,
                            borderRadius: 0,
                            boxShadow: "none",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: "10px", sm: "14px" },
                              "&:hover": {
                                cursor: "pointer",
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => {
                              localStorage.setItem("postId", item?.id);
                              navigate(
                                `/News/${item?.permalink?.toLowerCase()}`,
                                {
                                  state: {
                                    selectedCategory: item?.Categories?.[0]?.id,
                                    scrollToPost: true,
                                  },
                                }
                              );
                            }}
                          >
                            {item?.metaTitle || ""}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: "8px", sm: "10px" },
                              fontWeight: "bold",
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          >
                            <span
                              onClick={() => {
                                localStorage.setItem("postId", item?.id);
                                navigate(`/News/${item?.permalink}`, {
                                  state: {
                                    selectedCategory: item?.Categories?.[0]?.id,
                                    scrollToPost: true,
                                  },
                                });
                              }}
                              style={{
                                color: "#895129",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Read More
                            </span>
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              marginTop: { xs: "5px", sm: "10px" },
                              fontSize: { xs: "6px", md: "8px", sm: "10px" },
                              fontFamily: "DM Sans, sans-serif",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <span> {timeAgo(item?.createdAt) || ""}</span>
                              <span style={{ marginLeft: "25px" }}>|</span>
                              <span style={{ marginLeft: "25px" }}>
                                {categoryName || ""} News
                              </span>
                            </Box>
                            <Divider sx={{ marginTop: "5px" }} />
                          </Typography>
                        </Card>
                      ))}
                  </Box>
                  {/* {isAdVisible ? ( */}
                  <AdsRenderer
                    ads={landingGoogleAdsCategoryList}
                    position="Full Width"
                  />
                  {/* ) : null} */}
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {landingCategoryIdHighlight
                      ?.slice(1, 5)
                      .map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card
                            sx={{
                              borderRadius: 0,
                              overflow: "hidden",
                              boxShadow: "none",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="200px"
                              image={item?.SEOImageUrl}
                              alt={item?.title || ""}
                              onClick={() => {
                                localStorage.setItem("postId", item?.id);
                                navigate(
                                  `/News/${item?.permalink?.toLowerCase()}`,
                                  {
                                    state: {
                                      selectedCategory:
                                        item?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  }
                                );
                              }}
                              sx={{
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{
                                fontSize: { xs: "10px", sm: "14px" },
                                "&:hover": {
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => {
                                localStorage.setItem("postId", item?.id);
                                navigate(
                                  `/News/${item?.permalink?.toLowerCase()}`,
                                  {
                                    state: {
                                      selectedCategory:
                                        item?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  }
                                );
                              }}
                            >
                              {item?.metaTitle || ""}
                            </Typography>
                            <Box sx={{ marginTop: "10px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "9px", sm: "12px" },
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => {
                                  localStorage.setItem("postId", item?.id);
                                  navigate(
                                    `/News/${item?.permalink?.toLowerCase()}`,
                                    {
                                      state: {
                                        selectedCategory:
                                          item?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    }
                                  );
                                }}
                              >
                                {item?.metaDescription || ""}{" "}
                                <span
                                  onClick={() => {
                                    localStorage.setItem("postId", item?.id);
                                    navigate(`/News/${item?.permalink}`, {
                                      state: {
                                        selectedCategory:
                                          item?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    });
                                  }}
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
                            <Box sx={{ marginTop: "0px" }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontFamily: "DM Sans, sans-serif" }}
                              >
                                {timeAgo(item?.createdAt) || ""}
                                <Divider sx={{ marginTop: "5px" }} />
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>
          {/* {isAdVisible ? ( */}
          <AdsRenderer
            ads={landingGoogleAdsCategoryList}
            position="Full Width"
          />
          {/* ) : null} */}
          <Divider
            sx={{
              marginY: "1.5rem",
              color: "black",
              border: "1px solid black",
            }}
          />
        </Container>
      </Box>

      {/* explore more */}
      <Box sx={{ top: "90%", width: "100%" }}>
        <Container maxWidth="xl" sx={{ mt: 1, px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              marginBottom: "20px",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            <span
              style={{
                color: "white",
                backgroundColor: "#804000",
                padding: "5px",
              }}
            >
              Explore
            </span>{" "}
            <span style={{ color: "#000000" }}>More</span>
          </Typography>
          <Box>
            {loadingExplore ? (
              <Skeleton
                variant="rectangular"
                height={350}
                style={{ marginBottom: "10px" }}
              />
            ) : landingCategoryIdExplore.length > 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    {landingCategoryIdExplore
                      ?.slice(0, 3)
                      .map((article, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            direction="row"
                          >
                            <Grid item xs={4}>
                              <Box
                                component="img"
                                src={article.SEOImageUrl}
                                alt={article.title}
                                sx={{
                                  width: "100%",
                                  height: "100px",
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => {
                                  localStorage.setItem("postId", article?.id);
                                  navigate(`/News/${article?.permalink}`, {
                                    state: {
                                      selectedCategory:
                                        article?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  });
                                }}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: { xs: "10px", sm: "14px" },
                                  fontWeight: "bold",
                                  "&:hover": {
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  },
                                }}
                                onClick={() => {
                                  localStorage.setItem("postId", article?.id);
                                  navigate(
                                    `/News/${article?.permalink?.toLowerCase()}`,
                                    {
                                      state: {
                                        selectedCategory:
                                          article?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    }
                                  );
                                }}
                              >
                                {article.metaTitle}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                              >
                                <span
                                  onClick={() => {
                                    localStorage.setItem("postId", article?.id);
                                    navigate(`/News/${article?.permalink}`, {
                                      state: {
                                        selectedCategory:
                                          article?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    });
                                  }}
                                  style={{
                                    color: "#895129",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Read More
                                </span>
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "gray",
                                  fontSize: { xs: "8px", sm: "10px" },
                                }}
                              >
                                {timeAgo(article.createdAt) || ""} |{" "}
                                {categoryName || "News"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    {landingCategoryIdExplore
                      ?.slice(4, 7)
                      .map((article, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            direction="row"
                          >
                            <Grid item xs={4}>
                              <Box
                                component="img"
                                src={article.SEOImageUrl}
                                alt={article.title}
                                sx={{
                                  width: "100%",
                                  height: "100px",
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => {
                                  localStorage.setItem("postId", article?.id);
                                  navigate(`/News/${article?.permalink}`, {
                                    state: {
                                      selectedCategory:
                                        article?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  });
                                }}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: { xs: "10px", sm: "14px" },
                                  fontWeight: "bold",
                                  "&:hover": {
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  },
                                }}
                                onClick={() => {
                                  localStorage.setItem("postId", article?.id);
                                  navigate(
                                    `/News/${article?.permalink?.toLowerCase()}`,
                                    {
                                      state: {
                                        selectedCategory:
                                          article?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    }
                                  );
                                }}
                              >
                                {article.metaTitle}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: "8px", sm: "12px" } }}
                              >
                                <span
                                  onClick={() => {
                                    localStorage.setItem("postId", article?.id);
                                    navigate(`/News/${article?.permalink}`, {
                                      state: {
                                        selectedCategory:
                                          article?.Categories?.[0]?.id,
                                        scrollToPost: true,
                                      },
                                    });
                                  }}
                                  style={{
                                    color: "#895129",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Read More
                                </span>
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "gray",
                                  // mt: 1,
                                  fontSize: { xs: "8px", sm: "10px" },
                                }}
                              >
                                {timeAgo(article.createdAt) || ""} |{" "}
                                {categoryName || "News"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  No articles found.
                </Typography>
              </Box>
            )}
          </Box>
          {/* {isAdVisible ? ( */}
          <AdsRenderer
            ads={landingGoogleAdsCategoryList}
            position="Full Width"
          />
          {/* ) : null} */}

          <Divider
            sx={{
              marginY: "1.5rem",
              color: "black",
              border: "1px solid black",
            }}
          />
        </Container>
      </Box>

      {/* most read */}
      <Box sx={{ top: "90%", width: "100%" }}>
        <Container maxWidth="xl" sx={{ mt: 1, px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              marginBottom: "20px",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            <span
              style={{
                color: "white",
                backgroundColor: "#804000",
                padding: "5px",
              }}
            >
              More
            </span>{" "}
            <span style={{ color: "#000000" }}>Read</span>
          </Typography>
          {loadingMore ? (
            <Skeleton
              variant="rectangular"
              height={350}
              style={{ marginBottom: "10px" }}
            />
          ) : landingCategoryIdMore?.length > 0 ? (
            <Grid container spacing={2}>
              {landingCategoryIdMore?.map((article, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ boxShadow: "none" }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: "10px", sm: "14px" },
                        "&:hover": {
                          cursor: "pointer",
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => {
                        localStorage.setItem("postId", article?.id);
                        navigate(`/News/${article?.permalink?.toLowerCase()}`, {
                          state: {
                            selectedCategory: article?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                    >
                      {article.metaTitle}
                      <Typography
                        variant="h6"
                        // onClick={() => handleHeadingMoreClick(index)}
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "8px", sm: "10px" },
                          color: "black",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        <span
                          onClick={() => {
                            localStorage.setItem("postId", article?.id);
                            navigate(`/News/${article?.permalink}`, {
                              state: {
                                selectedCategory: article?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          style={{
                            marginLeft: "5px",
                            color: "#895129",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Read More
                        </span>
                      </Typography>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: "8px", sm: "10px" },
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>{timeAgo(article.createdAt) || ""}</span>
                        <span style={{ marginLeft: "25px" }}>|</span>
                        <span style={{ marginLeft: "25px" }}>
                          {article?.Categories[0]?.name || "No category"}
                        </span>
                      </Box>
                      <Divider sx={{ marginTop: "5px" }} />
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                No articles found.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default memo(Newspage);
