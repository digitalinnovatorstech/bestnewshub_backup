import { useRouter } from "next/router";
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
import { useDispatch, useSelector } from "react-redux";
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
} from "@/services/slices/landingSlice";
import AdsRenderer from "@/components/AdsRenderer";
import DynamicSEO from "@/components/SEO/DynamicSEO";
import axios from "axios";
import api from "@/utility/hook/api";

const NewsPage = ({ categoryMetaInfo }) => {
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();
  const { category, id } = router.query;
  const categoryName = category;
  const [loadingView, setLoadingView] = useState(false);
  const [loadingShortView, setLoadingShortView] = useState(false);
  const [loadingHighlight, setLoadingHighlight] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  // const [categoryMetaInfo, setCategoryMetaInfo] = useState([]);
  const [loadingRecentSection, setLoadingRecentSection] = useState(false);
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

  const handleCategoryClick = (category) => {
    if (!category) return;
    localStorage.setItem("categoryId", category.categoryId);
    localStorage.setItem("categoryName", category.name);
    // const url = `/News?category=${category.name}&id=${category.categoryId}&selectedCategory=${category.categoryId}`;
    const url = `/news/category/${category?.slug?.toLowerCase()}`;

    router.push(url).then(() => {
      window.location.href = url;
    });
  };

  const handleClick = (postId, permalink, category) => {
    localStorage.setItem("postId", postId);
    const url = `/news/${permalink}`;
    window.location.href = url;
  };
  return (
    <>
      {categoryMetaInfo && <DynamicSEO metaInfo={categoryMetaInfo} />}
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
                      const permalink =
                        landingCategoryDetails[0].permalink.toLowerCase();
                      const selectedCategory =
                        landingCategoryDetails[0]?.Categories?.[0]?.id;
                      const url = `/news/${permalink}`;
                      window.location.href = url;
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
                            const postId = landingCategoryDetails[0]?.id;
                            const permalink =
                              landingCategoryDetails[0]?.permalink;
                            const categoryId =
                              landingCategoryDetails[0]?.Categories?.[0]
                                ?._parentCategories ||
                              landingCategoryDetails[0]?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        >
                          {landingCategoryDetails[0]?.metaTitle || ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "11px", sm: "14px" },
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          {landingCategoryDetails[0]?.metaDescription || ""}{" "}
                          <span
                            onClick={() => {
                              const postId = landingCategoryDetails[0]?.id;
                              const permalink =
                                landingCategoryDetails[0]?.permalink;
                              const categoryId =
                                landingCategoryDetails[0]?.Categories?.[0]
                                  ?._parentCategories ||
                                landingCategoryDetails[0]?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
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
                            const postId = landingCategoryDetails[0]?.id;
                            const permalink =
                              landingCategoryDetails[0]?.permalink;
                            const categoryId =
                              landingCategoryDetails[0]?.Categories?.[0]
                                ?._parentCategories ||
                              landingCategoryDetails[0]?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        >
                          {landingCategoryDetails[0]?.metaTitle || ""}
                        </Typography>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{
                            fontSize: { xs: "10px", sm: "12px" },
                            lineHeight: "1.5",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const postId = landingCategoryDetails[0]?.id;
                            const permalink =
                              landingCategoryDetails[0]?.permalink;
                            const categoryId =
                              landingCategoryDetails[0]?.Categories?.[0]
                                ?._parentCategories ||
                              landingCategoryDetails[0]?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        >
                          <Box
                            sx={{ textAlign: "justify" }}
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
                          />
                          <Box
                            component="span"
                            onClick={(e) => {
                              e.stopPropagation();
                              const postId = landingCategoryDetails[0]?.id;
                              const permalink =
                                landingCategoryDetails[0]?.permalink;
                              const categoryId =
                                landingCategoryDetails[0]?.Categories?.[0]
                                  ?._parentCategories ||
                                landingCategoryDetails[0]?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                            sx={{
                              color: "#895129",
                              cursor: "pointer",
                              textDecoration: "underline",
                              zIndex: 1,
                              display: "inline-block",
                              ml: 1,
                            }}
                          >
                            Read More
                          </Box>
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
                            // localStorage.setItem("postId", item?.id);
                            // navigate(
                            //   `/News/${item?.permalink?.toLowerCase()}`,
                            //   {
                            //     state: {
                            //       selectedCategory: item?.Categories?.[0]?.id,
                            //       scrollToPost: true,
                            //     },
                            //   }
                            // );
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
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
                          // localStorage.setItem("postId", item?.id);
                          // navigate(`/News/${item?.permalink?.toLowerCase()}`, {
                          //   state: {
                          //     selectedCategory: item?.Categories?.[0]?.id,
                          //     scrollToPost: true,
                          //   },
                          // });
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
                        }}
                      >
                        {item.metaTitle}
                      </Typography>

                      <Typography
                        variant="body2"
                        component="div"
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
                          // localStorage.setItem("postId", item?.id);
                          // navigate(`/News/${item?.permalink}`, {
                          //   state: {
                          //     selectedCategory: item?.Categories?.[0]?.id,
                          //     scrollToPost: true,
                          //   },
                          // });
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
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
                        component="div"
                        sx={{
                          fontSize: { xs: "9px", sm: "12px" },
                          fontWeight: "bold",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          // localStorage.setItem("postId", item?.id);
                          // navigate(`/News/${item?.permalink}`, {
                          //   state: {
                          //     selectedCategory: item?.Categories?.[0]?.id,
                          //     scrollToPost: true,
                          //   },
                          // });
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
                        }}
                      >
                        {item?.metaTitle || ""}{" "}
                        <span
                          onClick={() => {
                            // localStorage.setItem("postId", item?.id);
                            // navigate(`/News/${item?.permalink}`, {
                            //   state: {
                            //     selectedCategory: item?.Categories?.[0]?.id,
                            //     scrollToPost: true,
                            //   },
                            // });
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
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
                        component="div"
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
                      p: 0.5,
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
                          handleCategoryClick(category);
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
                      p: 0.5,
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
                          // localStorage.setItem("postId", item?.id);
                          // navigate(`/News/${item?.permalink}`, {
                          //   state: {
                          //     selectedCategory: item?.Categories?.[0]?.id,
                          //     scrollToPost: true,
                          //   },
                          // });
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
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
                            window.scrollTo(0, 0);
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
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
                variant="h7"
                component="span"
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
                          const postId = landingCategoryIdHighlight[0]?.id;
                          const permalink =
                            landingCategoryIdHighlight[0]?.permalink;
                          const categoryId =
                            landingCategoryIdHighlight[0]?.Categories?.[0]
                              ?._parentCategories ||
                            landingCategoryIdHighlight[0]?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
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
                                const postId =
                                  landingCategoryIdHighlight[0]?.id;
                                const permalink =
                                  landingCategoryIdHighlight[0]?.permalink;
                                const categoryId =
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?._parentCategories ||
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                            >
                              {landingCategoryIdHighlight[0]?.metaTitle || ""}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              color="text.secondary"
                              sx={{ marginTop: 2 }}
                            >
                              {landingCategoryIdHighlight[0]?.metaDescription ||
                                ""}{" "}
                              <span
                                onClick={() => {
                                  const postId =
                                    landingCategoryIdHighlight[0]?.id;
                                  const permalink =
                                    landingCategoryIdHighlight[0]?.permalink;
                                  const categoryId =
                                    landingCategoryIdHighlight[0]
                                      ?.Categories?.[0]?._parentCategories ||
                                    landingCategoryIdHighlight[0]
                                      ?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
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
                                const postId =
                                  landingCategoryIdHighlight[0]?.id;
                                const permalink =
                                  landingCategoryIdHighlight[0]?.permalink;
                                const categoryId =
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?._parentCategories ||
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                            >
                              {landingCategoryIdHighlight[0]?.metaTitle || ""}
                            </Typography>
                            <Typography
                              variant="body1"
                              component="div"
                              sx={{
                                fontSize: { xs: "10px", sm: "12px" },
                                lineHeight: "1.5",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const postId =
                                  landingCategoryIdHighlight[0]?.id;
                                const permalink =
                                  landingCategoryIdHighlight[0]?.permalink;
                                const categoryId =
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?._parentCategories ||
                                  landingCategoryIdHighlight[0]?.Categories?.[0]
                                    ?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                            >
                              <Box
                                sx={{ textAlign: "justify" }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    landingCategoryIdHighlight[0]?.content
                                      ?.split(" ")
                                      .slice(0, 100)
                                      .join(" ") +
                                    (landingCategoryIdHighlight[0]?.content?.split(
                                      " "
                                    ).length > 100
                                      ? "..."
                                      : ""),
                                }}
                              />
                              <Box
                                component="span"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const postId =
                                    landingCategoryIdHighlight[0]?.id;
                                  const permalink =
                                    landingCategoryIdHighlight[0]?.permalink;
                                  const categoryId =
                                    landingCategoryIdHighlight[0]
                                      ?.Categories?.[0]?._parentCategories ||
                                    landingCategoryIdHighlight[0]
                                      ?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                                sx={{
                                  color: "#895129",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  zIndex: 1,
                                  display: "inline-block",
                                  ml: 1,
                                }}
                              >
                                Read More
                              </Box>
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
                      component="span"
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
                              const postId = item?.id;
                              const permalink = item?.permalink;
                              const categoryId =
                                item?.Categories?.[0]?._parentCategories ||
                                item?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                          >
                            {item?.metaTitle || ""}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            component="div"
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
                                const postId = item?.id;
                                const permalink = item?.permalink;
                                const categoryId =
                                  item?.Categories?.[0]?._parentCategories ||
                                  item?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
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
                            <Box
                              component="div"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
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
                                const postId = item?.id;
                                const permalink = item?.permalink;
                                const categoryId =
                                  item?.Categories?.[0]?._parentCategories ||
                                  item?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              sx={{
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            />
                            <Typography
                              variant="h6"
                              component="span"
                              fontWeight="bold"
                              sx={{
                                fontSize: { xs: "10px", sm: "14px" },
                                "&:hover": {
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => {
                                // localStorage.setItem("postId", item?.id);
                                // navigate(
                                //   `/News/${item?.permalink?.toLowerCase()}`,
                                //   {
                                //     state: {
                                //       selectedCategory:
                                //         item?.Categories?.[0]?.id,
                                //       scrollToPost: true,
                                //     },
                                //   }
                                // );
                                const postId = item?.id;
                                const permalink = item?.permalink;
                                const categoryId =
                                  item?.Categories?.[0]?._parentCategories ||
                                  item?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                            >
                              {item?.metaTitle || ""}
                            </Typography>
                            <Box sx={{ marginTop: "10px" }}>
                              <Typography
                                variant="body2"
                                component="div"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "9px", sm: "12px" },
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => {
                                  const postId = item?.id;
                                  const permalink = item?.permalink;
                                  const categoryId =
                                    item?.Categories?.[0]?._parentCategories ||
                                    item?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                              >
                                {item?.metaDescription || ""}{" "}
                                <span
                                  onClick={() => {
                                    const postId = item?.id;
                                    const permalink = item?.permalink;
                                    const categoryId =
                                      item?.Categories?.[0]
                                        ?._parentCategories ||
                                      item?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
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
            variant="h7"
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
                            // alignItems="center"
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
                                  const postId = article?.id;
                                  const permalink = article?.permalink;
                                  const categoryId =
                                    article?.Categories?.[0]
                                      ?._parentCategories ||
                                    article?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                component="span"
                                sx={{
                                  fontSize: { xs: "10px", sm: "14px" },
                                  fontWeight: "bold",
                                  lineHeight: 0,
                                  "&:hover": {
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  },
                                }}
                                onClick={() => {
                                  const postId = article?.id;
                                  const permalink = article?.permalink;
                                  const categoryId =
                                    article?.Categories?.[0]
                                      ?._parentCategories ||
                                    article?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                              >
                                {article.metaTitle}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                component="div"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                              >
                                <span
                                  onClick={() => {
                                    const postId = article?.id;
                                    const permalink = article?.permalink;
                                    const categoryId =
                                      article?.Categories?.[0]
                                        ?._parentCategories ||
                                      article?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
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
                                  marginTop: "auto",
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
                            // alignItems="center"
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
                                  const postId = article?.id;
                                  const permalink = article?.permalink;
                                  const categoryId =
                                    article?.Categories?.[0]
                                      ?._parentCategories ||
                                    article?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                component="span"
                                sx={{
                                  fontSize: { xs: "10px", sm: "14px" },
                                  lineHeight: 0,
                                  fontWeight: "bold",
                                  "&:hover": {
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  },
                                }}
                                onClick={() => {
                                  const postId = article?.id;
                                  const permalink = article?.permalink;
                                  const categoryId =
                                    article?.Categories?.[0]
                                      ?._parentCategories ||
                                    article?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                              >
                                {article.metaTitle}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                component="div"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: "8px", sm: "12px" } }}
                              >
                                <span
                                  onClick={() => {
                                    const postId = article?.id;
                                    const permalink = article?.permalink;
                                    const categoryId =
                                      article?.Categories?.[0]
                                        ?._parentCategories ||
                                      article?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
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
                                  marginTop: "auto",
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
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
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
            variant="h7"
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
                  <Card
                    sx={{
                      boxShadow: "none",
                      height: "100%",
                      minHeight: { xs: "60px", sm: "100px" },
                      borderRadius: "none",
                      borderBottom: "1px solid #ccc",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "8px",
                    }}
                  >
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
                        const postId = article?.id;
                        const permalink = article?.permalink;
                        const categoryId =
                          article?.Categories?.[0]?._parentCategories ||
                          article?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
                      }}
                    >
                      {article.metaTitle}
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "8px", sm: "10px" },
                          color: "black",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        <span
                          onClick={() => {
                            const postId = article?.id;
                            const permalink = article?.permalink;
                            const categoryId =
                              article?.Categories?.[0]?._parentCategories ||
                              article?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
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
                    <Box
                      sx={{
                        fontSize: { xs: "8px", sm: "10px" },
                        display: "flex",
                        alignItems: "center",
                        marginTop: "auto",
                      }}
                    >
                      <span>{timeAgo(article.createdAt) || ""}</span>
                      <span style={{ marginLeft: "25px" }}>|</span>
                      <span style={{ marginLeft: "25px" }}>
                        {article?.Categories[0]?.name || "No category"}
                      </span>
                    </Box>
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
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                No articles found.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing/category/metaInfo/${id}`
    );
    if (res.status !== 200) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    const data = await res.json();
    return {
      props: {
        categoryMetaInfo: data.data || {},
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}

export default NewsPage;
