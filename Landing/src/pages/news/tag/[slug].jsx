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
  getLandingCategoryDetailsByParmalink,
  getLandingCategoryIdExplore,
  getLandingCategoryIdHighlight,
  getLandingCategoryIdMore,
  getLandingCategoryIdShort,
  getLandingGoogleAdsCategoryList,
  getLandingHeroSection,
  getLandingPopularCategoryList,
  getLandingTagDetailsByParmalink,
} from "@/services/slices/landingSlice";
import AdsRenderer from "@/components/AdsRenderer";
import DynamicSEO from "@/components/SEO/DynamicSEO";
import axios from "axios";
import api from "@/utility/hook/api";
import { formatNameLowerUpper } from "@/utility/helpers/globalHelpers";

const NewsPage = ({ categoryMetaInfo }) => {
  const theme = useTheme();
  const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const permalink = Array.isArray(slug) ? slug?.join("/") : slug || "";
  const [loadingView, setLoadingView] = useState(false);
  const [loadingShortView, setLoadingShortView] = useState(false);
  const [loadingHighlight, setLoadingHighlight] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [id, setId] = useState("");

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

  const landingTagDetailsByParmalink = useSelector(
    (state) => state.landing.landingTagDetailsByParmalink
  );

  useEffect(() => {
    setCategoryName(`Tag/${slug}`);
    // setId(landingTagDetailsByParmalink.id);
  }, [landingTagDetailsByParmalink]);

  const landingCategoryIdHighlight = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  const landingCategoryIdExplore = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );
  const landingCategoryIdMore = useSelector(
    (state) => state.landing.landingCategoryIdHighlight
  );

  const landingPopularCategoryList = useSelector(
    (state) => state.landing.landingPopularCategoryList
  );
  const landingHeroSection = useSelector(
    (state) => state.landing.landingHeroSection
  );

  useEffect(() => {
    if (permalink) {
      setLoadingView(true);
      dispatch(getLandingTagDetailsByParmalink(permalink)).finally(() => {
        setLoadingView(false);
      });
    }
    dispatch(getLandingCategoryAdsList());
    dispatch(getLandingPopularCategoryList());
    setLoadingRecentSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingRecentSection(false);
    });
  }, [permalink, dispatch]);

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
    // localStorage.setItem("categoryId", category.categoryId);
    // localStorage.setItem("categoryName", category.name);
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
                  {landingTagDetailsByParmalink?.map((item, index) => (
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
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          maxWidth: "320px",
                          width: "100%",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "11px", sm: "12px" },
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
                            fontFamily: "DM Sans, sans-serif",
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
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        >
                          {item.metaDescription || ""}{" "}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "8px",
                              sm: "10px",
                              md: "12px",
                              lg: "12px",
                            },
                            fontWeight: "bold",
                            color: "#895129",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Read More
                        </Typography>
                      </Box>

                      <Divider sx={{ marginTop: "10px" }} />
                    </Card>
                  ))}
                </Box>
              )}

              <AdsRenderer
                ads={landingGoogleAdsCategoryList}
                position="Full Width"
              />
              <AdsRenderer
                ads={landingGoogleAdsCategoryList}
                position="Full Width"
              />
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

                <Box sx={{ display: { xs: "block", md: "none", lg: "block" } }}>
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
      `${process.env.NEXT_PUBLIC_API_URL}/landing/posts/getByTag?tag=${slug}&perPage=10&currentPage=1`
    );
    const data = await res.json();
    if (data?.success == false) {
      return { notFound: true };
    }
    return {
      props: {
        categoryMetaInfo: data.posts[0] || {},
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
export default NewsPage;
