import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
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
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingCategoryAdsList,
  getLandingCategoryDetails,
  getLandingCategoryDetailsByParmalink,
  getLandingCategoryIdExplore,
  getLandingCategoryIdHighlight,
  getLandingCategoryIdMore,
  getLandingCategoryIdShort,
  getLandingGoogleAdsCategoryList,
  getLandingHeroSection,
  getLandingPopularCategoryList,
  getLandingSubCategoryDetails,
} from "@/services/slices/landingSlice";
import AdsRenderer from "@/components/AdsRenderer";
import DynamicSEO from "@/components/SEO/DynamicSEO";
import { formatNameLowerUpper } from "@/utility/helpers/globalHelpers";

const NewsPage = ({ categoryMetaInfo }) => {
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const permalink = Array.isArray(slug) ? slug.join("/") : slug || "";
  const [loadingView, setLoadingView] = useState(true);
  const [loadingSubView, setLoadingSubView] = useState(true);
  const [loadingShortView, setLoadingShortView] = useState(true);
  const [loadingHighlight, setLoadingHighlight] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [id, setId] = useState("");
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // const [categoryMetaInfo, setCategoryMetaInfo] = useState([]);
  const [loadingRecentSection, setLoadingRecentSection] = useState(false);
  const payload = {
    currentPage: 1,
  };

  const landingCategoryDetails = useSelector(
    (state) => state.landing.landingCategoryDetails
  );

  const landingCategoryDetailsByParmalink = useSelector(
    (state) => state.landing.landingCategoryDetailsByParmalink
  );
  useEffect(() => {
    if (landingCategoryDetailsByParmalink) {
      setCategoryName(landingCategoryDetailsByParmalink.name);
      setId(landingCategoryDetailsByParmalink.id);
      setCategoryChildren(landingCategoryDetailsByParmalink.children);
    }
  }, [landingCategoryDetailsByParmalink]);

  const landingSubCategoryDetails = useSelector(
    (state) => state.landing.landingSubCategoryDetails
  );

  useEffect(() => {
    if (categoryChildren?.length > 0) {
      setLoadingSubView(true);
      Promise.all(
        categoryChildren.map((category) =>
          dispatch(getLandingSubCategoryDetails(category.id))
        )
      ).finally(() => {
        setLoadingSubView(false);
      });
    }
  }, [categoryChildren, dispatch]);

  // const landingCategoryIdShort = useSelector(
  //   (state) => state.landing.landingCategoryIdShort
  // );
  const landingCategoryIdHighlight = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  const landingCategoryIdExplore = useSelector(
    (state) => state.landing.landingCategoryIdExplore
  );
  const landingCategoryIdMore = useSelector(
    (state) => state.landing.landingCategoryIdMore
  );

  const landingCategoryIdMoreCount = useSelector(
    (state) => state.landing.landingCategoryIdMoreCount
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
    if (permalink) {
      setLoadingView(true);
      dispatch(getLandingCategoryDetailsByParmalink(permalink)).finally(() => {
        setLoadingView(false);
      });
    }
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
  }, [id, permalink, dispatch]);

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

  const handleShowMore = () => {
    if (!loadingMore && hasMore) {
      setCurrentPage((prev) => prev + 1);
      // fetchArticles(currentPage + 1);
      payload.currentPage = currentPage + 1;
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
  };

  return (
    <>
      {categoryMetaInfo && <DynamicSEO metaInfo={categoryMetaInfo} />}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on larger screens
          gap: 2, // Spacing between boxes
        }}
      > */}
      {/* <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: "70px", // Adjust based on where you want it to stick
            // zIndex: 1000, // Ensures it stays above other content
            backgroundColor: "white", // Prevents content from showing through
          }}
        >
          <AdsRenderer
            ads={landingGoogleAdsCategoryList}
            position="Extra Vertical"
          />
        </Box> */}
      <Box>
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
              {formatNameLowerUpper(categoryName)}
              <Divider sx={{ marginTop: "5px" }} />
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <AdsRenderer
                  ads={landingGoogleAdsCategoryList}
                  position="Full Width"
                />
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
                      // marginBottom: "20px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "100%", md: "50%" },
                        height: "355px",
                        maxHeight: "355px",
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
                        marginBottom: { xs: "20px", md: "20px" },
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
                                  landingCategoryDetails[0]?.Categories?.[0]
                                    ?.id;
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
                              sx={{
                                textAlign: "justify",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: 14,
                                lineClamp: 14,
                              }}
                              // dangerouslySetInnerHTML={{
                              //   __html:
                              //     landingCategoryDetails[0]?.content
                              //       ?.split(" ")
                              //       .slice(0, 130)
                              //       .join(" ") +
                              //     (landingCategoryDetails[0]?.content?.split(
                              //       " "
                              //     ).length > 130
                              //       ? "..."
                              //       : ""),
                              // }}
                              dangerouslySetInnerHTML={{
                                __html: landingCategoryDetails[0]?.content,
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
                                  landingCategoryDetails[0]?.Categories?.[0]
                                    ?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              sx={{
                                color: "#895129",
                                cursor: "pointer",
                                textDecoration: "underline",
                                zIndex: 1,
                                display: "inline-block",
                              }}
                            >
                              Read More
                            </Box>
                          </Typography>
                        </>
                      )}
                      <Typography variant="caption" sx={{ display: "block" }}>
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
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <AdsRenderer
                      ads={landingGoogleAdsCategoryList}
                      position="Full Width"
                    />
                    {landingCategoryDetails?.slice(1, 4).map((item, index) => (
                      <Card
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          // marginBottom: "15px",
                          boxShadow: "none",
                          backgroundColor: "white",
                          // alignItems: "center",
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
                              // width: "320px",
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
                            fontSize: { xs: "11px", sm: "12px" },
                            // fontFamily: "DM Sans, sans-serif",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            lineClamp: 2,
                            "&:hover": {
                              cursor: "pointer",
                              color: "#895129",
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
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          sx={{
                            marginTop: "10px",
                            // fontFamily: "DM Sans, sans-serif",
                            fontSize: { xs: "9px", sm: "12px" },
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 4,
                            lineClamp: 4,
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
                          {item.metaDescription || ""}
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            color: "#895129",
                            cursor: "pointer",
                            textDecoration: "underline",
                            mt: 1,
                            fontSize: { xs: "10px", sm: "12px" },
                            fontWeight: "bold",
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
                          Read More
                        </Box>
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
                      style={{ marginBottom: { xs: "0px", sm: "10px" } }}
                    />
                  ) : (
                    landingCategoryDetails?.slice(4, 11).map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            fontSize: { xs: "9px", sm: "12px" },
                            fontWeight: "bold",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 1,
                            lineClamp: 1,
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
                          {item?.metaTitle || ""}{" "}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: { xs: "7px", sm: "11px" },
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            lineClamp: 2,
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
                          {item.metaDescription || ""}
                        </Typography>
                        <Typography
                          variant="h6"
                          onClick={() => {
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "8px", sm: "10px" },
                            color: "black",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
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
                              {formatNameLowerUpper(categoryName) || ""}
                            </span>
                          </Box>
                        </Typography>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: { xs: "column", sm: "row", md: "column" },
                    justifyContent: {
                      xs: "center",
                      sm: "space-between",
                      lg: "center",
                    },
                    gap: { xs: 0, sm: 1, md: 0 },
                  }}
                >
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
                        width: { xs: "100%", sm: "50%", md: "100%" },
                        pt: 0,
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
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="white"
                        >
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

                  <Box
                    sx={{ display: { xs: "block", md: "none", lg: "block" } }}
                  >
                    <AdsRenderer
                      ads={landingGoogleAdsCategoryList}
                      position="Square"
                    />
                  </Box>

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
                        position: "sticky",
                        top: "70px",
                        alignSelf: "start",
                        maxHeight: "calc(200vh - 20px)",
                        overflowY: "auto",
                        width: { xs: "100%", sm: "50%", md: "100%" },
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#895129",
                          p: 0.5,
                          display: "inline-block",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="white"
                        >
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
                      <Box sx={{ margin: "auto", pt: 1.5 }}>
                        {landingHeroSection?.slice(0, 5).map((item, index) => (
                          <Card
                            key={index || item.id}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              marginBottom: "10px",
                              boxShadow: "none",
                              borderRadius: "0px",
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
                            <CardMedia
                              component="img"
                              sx={{
                                // width: "40%",
                                // height: "40%",
                                width: { xs: "40%", sm: "45%", md: "50%" },
                                height: { xs: "40%", sm: "45%", md: "50%" },
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              image={item.squareImageUrl}
                              alt={item.title}
                            />
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{
                                  fontWeight: "bold",
                                  ml: 2,
                                  fontSize: { xs: "11px", sm: "12px" },
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  WebkitLineClamp: 1,
                                  lineClamp: 1,
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
                                {formatNameLowerUpper(item?.metaTitle) || ""}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: { xs: "7px", sm: "11px" },
                                  ml: 2,
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  WebkitLineClamp: { xs: 2, sm: 2, md: 3 },
                                  lineClamp: { xs: 2, sm: 2, md: 3 },
                                  "&:hover": {
                                    cursor: "pointer",
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
                                {item.metaDescription || ""}
                              </Typography>
                              <Typography
                                variant="h6"
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  const postId = item?.id;
                                  const permalink = item?.permalink;
                                  const categoryId =
                                    item?.Categories?.[0]?._parentCategories ||
                                    item?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                                sx={{
                                  ml: 2,
                                  fontWeight: 700,
                                  fontSize: { xs: "8px", sm: "10px" },
                                  color: "black",
                                  fontFamily: "DM Sans, sans-serif",
                                }}
                              >
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
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
            <AdsRenderer
              ads={landingGoogleAdsCategoryList}
              position="Full Width"
            />
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

        {landingCategoryIdHighlight.length > 0 && (
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
                      {formatNameLowerUpper(categoryName)}
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
                        {/* <Card
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          borderRadius: 0,
                          overflow: "hidden",
                          boxShadow: "none",
                        }}
                      > */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            // marginBottom: "20px",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              flex: "1 1 auto",
                              objectFit: "cover",
                              height: "380px",
                              maxHeight: "380px",
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
                                landingCategoryIdHighlight[0]?.Categories?.[0]
                                  ?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                            image={landingCategoryIdHighlight[0]?.SEOImageUrl}
                            alt={
                              landingCategoryIdHighlight[0]?.title || "image"
                            }
                          />
                          {/* <CardContent
                          sx={{
                            flex: "1 1 auto",
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "center",
                            marginBottom: { xs: 0, sm: "10px" },
                            "&:hover": {
                              cursor: "pointer",
                            },
                            mt: 1,
                            marginLeft: { xs: "0px", sm: "20px" },
                            marginBottom: { xs: "0px", sm: "0px" },
                            padding: { xs: "0px", sm: "0px" },
                          }}
                        > */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              marginBottom: { xs: "20px", md: "20px" },
                            }}
                          >
                            {isMobiles ? (
                              <>
                                <Typography
                                  variant="h7"
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
                                      landingCategoryIdHighlight[0]
                                        ?.Categories?.[0]?._parentCategories ||
                                      landingCategoryIdHighlight[0]
                                        ?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
                                  }}
                                >
                                  {landingCategoryIdHighlight[0]?.metaTitle ||
                                    ""}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  component="div"
                                  color="text.secondary"
                                  sx={{
                                    marginTop: 1,
                                    fontSize: {
                                      xs: "12px",
                                      sm: "13px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {landingCategoryIdHighlight[0]
                                    ?.metaDescription || ""}
                                  <span
                                    onClick={() => {
                                      const postId =
                                        landingCategoryIdHighlight[0]?.id;
                                      const permalink =
                                        landingCategoryIdHighlight[0]
                                          ?.permalink;
                                      const categoryId =
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]
                                          ?._parentCategories ||
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]?.id;
                                      handleClick(
                                        postId,
                                        permalink,
                                        categoryId
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
                                >
                                  {landingCategoryIdHighlight[0]?.metaTitle ||
                                    ""}
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
                                      landingCategoryIdHighlight[0]
                                        ?.Categories?.[0]?._parentCategories ||
                                      landingCategoryIdHighlight[0]
                                        ?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
                                  }}
                                >
                                  <Box
                                    sx={{
                                      textAlign: "justify",
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      WebkitLineClamp: 16,
                                      lineClamp: 16,
                                    }}
                                    // dangerouslySetInnerHTML={{
                                    //   __html:
                                    //     landingCategoryIdHighlight[0]?.content
                                    //       ?.split(" ")
                                    //       .slice(0, 130)
                                    //       .join(" ") +
                                    //     (landingCategoryIdHighlight[0]?.content?.split(
                                    //       " "
                                    //     ).length > 130
                                    //       ? "..."
                                    //       : ""),
                                    // }}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        landingCategoryIdHighlight[0]?.content,
                                    }}
                                  />
                                  <Box
                                    component="span"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const postId =
                                        landingCategoryIdHighlight[0]?.id;
                                      const permalink =
                                        landingCategoryIdHighlight[0]
                                          ?.permalink;
                                      const categoryId =
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]
                                          ?._parentCategories ||
                                        landingCategoryIdHighlight[0]
                                          ?.Categories?.[0]?.id;
                                      handleClick(
                                        postId,
                                        permalink,
                                        categoryId
                                      );
                                    }}
                                    sx={{
                                      color: "#895129",
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      zIndex: 1,
                                      display: "inline-block",
                                      // ml: 1,
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
                              // sx={{ marginTop: 0.5 }}
                            >
                              {timeAgo(
                                landingCategoryIdHighlight[0]?.createdAt
                              ) || ""}
                            </Typography>
                          </Box>
                          {/* </CardContent> */}
                          {/* </Card> */}
                        </Box>
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
                        sx={{
                          display: "flex",
                          // flexDirection: "column",
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                            md: "column",
                          },
                          gap: 0,
                        }}
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
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  WebkitLineClamp: 2,
                                  lineClamp: 2,
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
                                variant="h6"
                                sx={{
                                  fontSize: { xs: "7px", sm: "11px" },
                                  fontFamily: "DM Sans, sans-serif",
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  WebkitLineClamp: 3,
                                  lineClamp: 3,
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
                                {item.metaDescription || ""}
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
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "block",
                                  marginTop: { xs: "5px", sm: "10px" },
                                  fontSize: {
                                    xs: "6px",
                                    md: "8px",
                                    sm: "10px",
                                  },
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
                                    {formatNameLowerUpper(categoryName) || ""}
                                  </span>
                                </Box>
                                <Divider
                                  sx={{
                                    marginTop: "5px",
                                  }}
                                />
                              </Typography>
                            </Card>
                          ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <AdsRenderer
                        ads={landingGoogleAdsCategoryList}
                        position="Full Width"
                      />
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
                                      item?.Categories?.[0]
                                        ?._parentCategories ||
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
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    WebkitLineClamp: 2,
                                    lineClamp: 2,
                                    "&:hover": {
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    },
                                  }}
                                  onClick={() => {
                                    const postId = item?.id;
                                    const permalink = item?.permalink;
                                    const categoryId =
                                      item?.Categories?.[0]
                                        ?._parentCategories ||
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
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      WebkitLineClamp: 3,
                                      lineClamp: 3,
                                      "&:hover": {
                                        cursor: "pointer",
                                      },
                                    }}
                                    onClick={() => {
                                      const postId = item?.id;
                                      const permalink = item?.permalink;
                                      const categoryId =
                                        item?.Categories?.[0]
                                          ?._parentCategories ||
                                        item?.Categories?.[0]?.id;
                                      handleClick(
                                        postId,
                                        permalink,
                                        categoryId
                                      );
                                    }}
                                  >
                                    {item?.metaDescription || ""}
                                  </Typography>
                                  <Box
                                    component="span"
                                    sx={{
                                      color: "#895129",
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      mt: 1,
                                      fontSize: { xs: "10px", sm: "12px" },
                                      fontWeight: "bold",
                                    }}
                                    onClick={() => {
                                      const postId = item?.id;
                                      const permalink = item?.permalink;
                                      const categoryId =
                                        item?.Categories?.[0]
                                          ?._parentCategories ||
                                        item?.Categories?.[0]?.id;
                                      handleClick(
                                        postId,
                                        permalink,
                                        categoryId
                                      );
                                    }}
                                  >
                                    Read More
                                  </Box>
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
        )}

        {/* explore more */}
        {landingCategoryIdExplore.length > 0 && (
          <Box
            sx={{ position: "relative", width: "100%", paddingBottom: "2rem" }}
          >
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
                    sx={{ marginBottom: "10px" }}
                  />
                ) : landingCategoryIdExplore.length > 0 ? (
                  <Grid container spacing={3}>
                    {landingCategoryIdExplore.map((article, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Box
                              component="img"
                              src={article.SEOImageUrl}
                              alt={article.title}
                              sx={{
                                width: "100%",
                                minHeight: "100px",
                                objectFit: "cover",
                                transition: "0.3s ease",
                                "&:hover": {
                                  cursor: "pointer",
                                  transform: "scale(1.05)",
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
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              variant="subtitle1"
                              component="div"
                              sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "12px", sm: "14px" },
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: { xs: 2, sm: 2, lg: 2 },
                                lineClamp: { xs: 2, sm: 2, lg: 2 },
                                "&:hover": {
                                  cursor: "pointer",
                                  color: "#895129",
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
                              {article?.metaTitle || ""}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: { xs: "10px", sm: "12px" },
                                fontWeight: "bold",
                              }}
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
                              variant="caption"
                              sx={{
                                color: "gray",
                                fontSize: { xs: "8px", sm: "10px" },
                                display: "block",
                                mt: 1,
                              }}
                            >
                              {timeAgo(article.createdAt) || ""} |{" "}
                              {formatNameLowerUpper(categoryName) || " "}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      No articles found.
                    </Typography>
                  </Box>
                )}
              </Box>
              <AdsRenderer
                ads={landingGoogleAdsCategoryList}
                position="Full Width"
              />
              <Divider sx={{ marginY: "1.5rem", borderColor: "black" }} />
            </Container>
          </Box>
        )}

        {/* subcategory */}
        {categoryChildren?.length > 0 && (
          <>
            {" "}
            {loadingSubView ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                {Array.from(new Array(6)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      width: "300px",
                      height: "300px",
                      mb: "20px",
                    }}
                  />
                ))}
              </Box>
            ) : (
              categoryChildren?.length > 0 && (
                <Stack
                  sx={{
                    alignItems: "center",
                    width: "100%",
                    padding: { xs: "5px", sm: "10px 0" },
                  }}
                >
                  <Container
                    maxWidth="xl"
                    sx={{ mt: 0, px: { xs: 1, sm: 2, md: 2 } }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingLeft: { xs: 0, sm: 2 },
                        paddingRight: { xs: 0, sm: 3 },
                      }}
                    >
                      {categoryChildren?.map((category) => (
                        <Box key={category.id} sx={{ mb: 3 }}>
                          <Typography
                            variant="h7"
                            component="div"
                            sx={{
                              marginBottom: "20px",
                              display: "inline-block",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const url = `/news/category/${category?.slug?.toLowerCase()}`;
                              window.location.href = url;
                            }}
                          >
                            <span
                              style={{
                                color: "white",
                                backgroundColor: "#895129",
                                padding: "5px",
                                fontWeight: 300,
                                textTransform: "uppercase",
                                cursor: "pointer",
                              }}
                            >
                              {category.name}
                            </span>{" "}
                            <span style={{ color: "#000000" }}>NEWS</span>
                          </Typography>
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "space-between",
                            }}
                          >
                            {/* News Items */}
                            <Grid item xs={12} sm={12} lg={9}>
                              <Grid container spacing={2}>
                                {(landingSubCategoryDetails[category.id] || [])
                                  ?.slice(0, isTablet ? 4 : 3)
                                  ?.map((item, index) => (
                                    <Grid
                                      item
                                      xs={12}
                                      sm={6}
                                      md={4}
                                      lg={4}
                                      key={index}
                                    >
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
                                              item?.Categories?.[0]
                                                ?._parentCategories ||
                                              item?.Categories?.[0]?.id;
                                            handleClick(
                                              postId,
                                              permalink,
                                              categoryId
                                            );
                                          }}
                                          sx={{
                                            "&:hover": { cursor: "pointer" },
                                          }}
                                        />
                                        <Typography
                                          variant="h6"
                                          component="span"
                                          fontWeight="bold"
                                          sx={{
                                            fontSize: {
                                              xs: "10px",
                                              sm: "14px",
                                            },
                                            "&:hover": {
                                              cursor: "pointer",
                                              textDecoration: "underline",
                                            },
                                          }}
                                          onClick={() => {
                                            const postId = item?.id;
                                            const permalink = item?.permalink;
                                            const categoryId =
                                              item?.Categories?.[0]
                                                ?._parentCategories ||
                                              item?.Categories?.[0]?.id;
                                            handleClick(
                                              postId,
                                              permalink,
                                              categoryId
                                            );
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
                                              fontSize: {
                                                xs: "9px",
                                                sm: "12px",
                                              },
                                              display: "-webkit-box",
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                              WebkitLineClamp: 2,
                                              lineClamp: 2,
                                              "&:hover": { cursor: "pointer" },
                                            }}
                                            onClick={() => {
                                              const postId = item?.id;
                                              const permalink = item?.permalink;
                                              const categoryId =
                                                item?.Categories?.[0]
                                                  ?._parentCategories ||
                                                item?.Categories?.[0]?.id;
                                              handleClick(
                                                postId,
                                                permalink,
                                                categoryId
                                              );
                                            }}
                                          >
                                            {item?.metaDescription || ""}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontSize: {
                                                xs: "10px",
                                                sm: "12px",
                                              },
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <span
                                              onClick={() => {
                                                const postId = item?.id;
                                                const permalink =
                                                  item?.permalink;
                                                const categoryId =
                                                  item?.Categories?.[0]
                                                    ?._parentCategories ||
                                                  item?.Categories?.[0]?.id;
                                                handleClick(
                                                  postId,
                                                  permalink,
                                                  categoryId
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
                                        </Box>
                                        <Box sx={{ marginTop: "0px" }}>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                              fontFamily: "DM Sans, sans-serif",
                                            }}
                                          >
                                            {timeAgo(item?.createdAt) || ""}
                                            <Divider
                                              sx={{ marginTop: "5px" }}
                                            />
                                          </Typography>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  ))}
                              </Grid>
                            </Grid>

                            {/* Ads Section */}
                            <Grid
                              item
                              xs={12}
                              md={4}
                              lg={3}
                              sx={{
                                display: {
                                  xs: "none",
                                  sm: "none",
                                  lg: "block",
                                },
                              }}
                            >
                              <AdsRenderer
                                ads={landingGoogleAdsCategoryList}
                                position="Square"
                              />
                            </Grid>
                          </Grid>

                          {/* <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                        }}
                      >
                        <Grid item xs={12} sm={12} lg={9}>
                          <Grid container spacing={1}>
                            {(landingSubCategoryDetails[category.id] || [])
                              ?.slice(0, isTablet ? 4 : 3)
                              ?.map((item, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={index}>
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
                                          item?.Categories?.[0]
                                            ?._parentCategories ||
                                          item?.Categories?.[0]?.id;
                                        handleClick(
                                          postId,
                                          permalink,
                                          categoryId
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
                                        const postId = item?.id;
                                        const permalink = item?.permalink;
                                        const categoryId =
                                          item?.Categories?.[0]
                                            ?._parentCategories ||
                                          item?.Categories?.[0]?.id;
                                        handleClick(
                                          postId,
                                          permalink,
                                          categoryId
                                        );
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
                                          display: "-webkit-box",
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                          WebkitLineClamp: 2,
                                          lineClamp: 2,
                                          "&:hover": {
                                            cursor: "pointer",
                                          },
                                        }}
                                        onClick={() => {
                                          const postId = item?.id;
                                          const permalink = item?.permalink;
                                          const categoryId =
                                            item?.Categories?.[0]
                                              ?._parentCategories ||
                                            item?.Categories?.[0]?.id;
                                          handleClick(
                                            postId,
                                            permalink,
                                            categoryId
                                          );
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
                                            handleClick(
                                              postId,
                                              permalink,
                                              categoryId
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
                                    </Box>
                                    <Box sx={{ marginTop: "0px" }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          fontFamily: "DM Sans, sans-serif",
                                        }}
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
                        <Grid
                          item
                          xs={12}
                          lg={3}
                          sx={{
                            display: { xs: "none", sm: "none", lg: "block" },
                          }}
                        >
                          <AdsRenderer
                            ads={landingGoogleAdsCategoryList}
                            position="Square"
                          />
                        </Grid>
                      </Grid> */}
                        </Box>
                      ))}
                    </Box>
                  </Container>
                </Stack>
              )
            )}
          </>
        )}

        {/* most read */}
        {landingCategoryIdMore?.length > 0 && (
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
                    <Grid item xs={12} sm={6} md={3} key={index} sx={{}}>
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
                          sx={{
                            fontSize: { xs: "10px", sm: "14px" },
                            fontWeight: "bold",
                            fontFamily: "DM Sans, sans-serif",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            lineClamp: 2,
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
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: { xs: "7px", sm: "11px" },
                            color: "black",
                            fontFamily: "DM Sans, sans-serif",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 3,
                            lineClamp: 3,
                            "&:hover": {
                              cursor: "pointer",
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
                          {article.metaDescription || ""}
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            mb: 1,
                            color: "#895129",
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginTop: "5px",
                            fontSize: { xs: "8px", sm: "10px" },
                            fontWeight: "bold",
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
                          Read More
                        </Box>
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

                  {hasMore && (
                    // <Box
                    //   sx={{
                    //     display: "flex",
                    //     justifyContent: "flex-end", // Moves items to the right
                    //     alignItems: "center",
                    //     width: "100%",
                    //   }}
                    // >
                    //   <Button
                    //     variant="contained"
                    //     size="small"
                    //     sx={{ backgroundColor: "#895129", color: "#fff" }}
                    //     onClick={handleShowMore}
                    //     disabled={loadingMore}
                    //   >
                    //     {loadingMore ? (
                    //       <CircularProgress size={14} sx={{ color: "#fff" }} />
                    //     ) : (
                    //       "Show More"
                    //     )}
                    //   </Button>
                    // </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end", // Moves items to the right
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Chip
                        label={
                          loadingMore ? (
                            <CircularProgress
                              size={14}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            "Show More"
                          )
                        }
                        sx={{
                          backgroundColor: "#fff",
                          color: "#895129",
                          // padding: "8px 12px",
                          padding: { xs: "5px 7px", sm: "8px 12px" },
                          fontSize: { xs: "12px", sm: "14px" },
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#895129",
                            color: "#fff",
                          },
                          "&.Mui-disabled": {
                            opacity: 0.6,
                            cursor: "not-allowed",
                          },
                        }}
                        onClick={!loadingMore ? handleShowMore : undefined}
                        disabled={
                          landingCategoryIdMoreCount ===
                            landingCategoryIdMore.length || loadingMore
                        }
                      />
                    </Box>
                  )}
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
        )}
      </Box>
      {/* </Box> */}
    </>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params.slug
    ? Array.isArray(params.slug)
      ? params.slug.join("/")
      : params.slug
    : "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing/category/metaInfo?slug=${slug}`
    );
    const data = await res.json();

    if (!data?.data) {
      return { notFound: true };
    }
    return {
      props: {
        categoryMetaInfo: data.data || {},
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default NewsPage;
