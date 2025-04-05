import React, { useState, useRef, memo, useEffect } from "react";
import {
  Box,
  IconButton,
  Container,
  Button,
  Typography,
  CardContent,
  Card,
  CardMedia,
  useMediaQuery,
  Stack,
  CardActions,
  Grid,
  CircularProgress,
  Skeleton,
  Modal,
  TextField,
  InputAdornment,
  Fab,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ShareIcon from "@mui/icons-material/Share";
import whatsappIcon from "../../assets/shareicons/whatsapp.png";
import instagramIcon from "../../assets/shareicons/instagram.png";
import facebookIcon from "../../assets/shareicons/facebook.png";
import emailIcon from "../../assets/shareicons/gmail.png";
import XIcon from "../../assets/shareicons/twitter.png";
import Teams from "../../assets/shareicons/business.png";
import chromeIcon from "../../assets/shareicons/chrome.png";
import snapchatIcon from "../../assets/shareicons/snapchat.png";
import telegramIcon from "../../assets/shareicons/telegram.png";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingHeroSection,
  getLandingEasySearchList,
  getLandingFeaturedList,
  getLandingInternationaList,
  getLandingNationaList,
  getLandingShortList,
  getLandingcategoryNameList,
  getLandingMorePoList,
  getLandingHomeAdsList,
  getLandingGoogleAdsHomeList,
  getHomeMetaInfo,
} from "../../services/slices/landingSlice";
import { useTheme } from "@emotion/react";
import AdsRenderer from "../../components/AdsRenderer";
import DynamicSEO from "../../components/SEO/DynamicSEO";
import axios from "axios";

const slides = [
  { image: slide1 },
  { image: slide2 },
  { image: slide1 },
  { image: slide2 },
  { image: slide1 },
  { image: slide2 },
  { image: slide1 },
  { image: slide2 },
  { image: slide1 },
  { image: slide2 },
];

const Home = () => {
  const theme = useTheme();
  // const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingEasySearch, setLoadingEasySearch] = useState(false);
  const [loadingMorePo, setLoadingEasySearchMorePo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentHome2ImageIndex, setCurrentHome2ImageIndex] = useState(0);
  // const [currentHome3ImageIndex, setCurrentHome3ImageIndex] = useState(0);
  const [currentHome4ImageIndex, setCurrentHome4ImageIndex] = useState(0);
  const [loadingHeroSection, setLoadingHeroSection] = useState(true);
  const [loadingNationSection, setLoadingNationSection] = useState(false);
  const [loadingFeaturedSection, setLoadingFeaturedSection] = useState(false);
  const [loadingShortSection, setLoadingShortSection] = useState(false);
  const [loadingEasySection, setLoadingEasySection] = useState(false);
  const [loadingMoreSection, setLoadingMoreSection] = useState(false);
  // const [currentIndexFeatured, setCurrentIndexFeatured] = useState(0);
  // const [currentIndexShort, setCurrentIndexShort] = useState(0);

  const landingcategoryNameList = useSelector(
    (state) => state.landing.landingcategoryNameList
  );
  const landingHeroSection = useSelector(
    (state) => state.landing.landingHeroSection
  );
  const landingInternationList = useSelector(
    (state) => state.landing.landingInternationList
  );
  const landingntionalList = useSelector(
    (state) => state.landing.landingntionalList
  );
  const landingShortList = useSelector(
    (state) => state.landing.landingShortList
  );
  const landingFeaturedList = useSelector(
    (state) => state.landing.landingFeaturedList
  );
  const landingEasySearchList = useSelector(
    (state) => state.landing.landingEasySearchList
  );
  const landingMorePoList = useSelector(
    (state) => state.landing.landingMorePoList
  );
  const landingHomeAdsList = useSelector(
    (state) => state.landing.landingHomeAdsList
  );
  // const metaInfo = useSelector((state) => state.landing.metaInfo);

  useEffect(() => {
    dispatch(getLandingcategoryNameList());
    setLoadingHeroSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingHeroSection(false);
    });
    dispatch(getHomeMetaInfo());
    setLoadingNationSection(true);
    dispatch(getLandingInternationaList()).finally(() => {
      setLoadingNationSection(false);
    });
    dispatch(getLandingNationaList()).finally(() => {
      setLoadingNationSection(false);
    });

    setLoadingFeaturedSection(true);
    dispatch(getLandingFeaturedList()).finally(() => {
      setLoadingFeaturedSection(false);
    });

    setLoadingShortSection(true);
    dispatch(getLandingShortList()).finally(() => {
      setLoadingShortSection(false);
    });

    setLoadingEasySection(true);
    dispatch(getLandingEasySearchList("ALL")).finally(() => {
      setLoadingEasySection(false);
    });

    setLoadingMoreSection(true);
    dispatch(getLandingMorePoList("ALL")).finally(() => {
      setLoadingMoreSection(false);
    });
    dispatch(getLandingHomeAdsList());
  }, [dispatch]);

  //this is for First Ads
  const home1VerticalImages = landingHomeAdsList
    .filter((ad) => ad.position === "HOME-1")
    .map((ad) => ({
      imageUrl: ad.horizontalImageUrl,
      adUrl: ad.advertisementUrl,
    }))
    .filter((url) => url);
  useEffect(() => {
    if (home1VerticalImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % home1VerticalImages.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [home1VerticalImages]);

  const home2HorizontalImages = landingHomeAdsList
    .filter((ad) => ad.position === "HOME-2")
    .map((ad) => ({
      imageUrl: ad.horizontalImageUrl,
      adUrl: ad.advertisementUrl,
    }))
    .filter((url) => url);

  useEffect(() => {
    if (home2HorizontalImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHome2ImageIndex(
          (prevIndex) => (prevIndex + 1) % home2HorizontalImages.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [home2HorizontalImages]);

  // const home3SquareImages = landingHomeAdsList
  //   .filter((ad) => ad.position === "HOME-2")
  //   .map((ad) => ({
  //     imageUrl: ad.squareImageUrl,
  //     adUrl: ad.advertisementUrl,
  //   }))
  //   .filter((url) => url);

  // useEffect(() => {
  //   if (home3SquareImages.length > 1) {
  //     const interval = setInterval(() => {
  //       setCurrentHome3ImageIndex(
  //         (prevIndex) => (prevIndex + 1) % home3SquareImages.length
  //       );
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // }, [home3SquareImages]);

  const home4HorizontalImages = landingHomeAdsList
    .filter((ad) => ad.position === "HOME-4")
    .map((ad) => ({
      imageUrl: ad.horizontalImageUrl,
      adUrl: ad.advertisementUrl,
    }))
    .filter((url) => url);

  useEffect(() => {
    if (home4HorizontalImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHome4ImageIndex(
          (prevIndex) => (prevIndex + 1) % home4HorizontalImages.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [home4HorizontalImages]);

  const thumbnailRef = useRef(null);
  const [currentIndex1, setCurrentIndex1] = useState(0);

  const leftSlide = () => {
    if (thumbnailRef.current) {
      const slideWidth = thumbnailRef.current.firstChild?.offsetWidth || 140;
      thumbnailRef.current.scrollBy({
        left: -slideWidth,
        behavior: "smooth",
      });
    }
    setCurrentIndex1((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const rightSlide = () => {
    if (thumbnailRef.current) {
      const slideWidth = thumbnailRef.current.firstChild?.offsetWidth || 140;
      thumbnailRef.current.scrollBy({
        left: slideWidth,
        behavior: "smooth",
      });
    }
    setCurrentIndex1((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // const isLeftDisabled = currentIndex1 === 0;
  // const isRightDisabled = currentIndex1 === slides.length - 1;

  const thumbnailFeturedRef = useRef(null);

  const handlePrevFeatured = () => {
    if (thumbnailFeturedRef.current) {
      const slideWidth =
        thumbnailFeturedRef.current.firstChild?.offsetWidth || 140;
      thumbnailFeturedRef.current.scrollBy({
        left: -slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextFeatured = () => {
    if (thumbnailFeturedRef.current) {
      const slideWidth =
        thumbnailFeturedRef.current.firstChild?.offsetWidth || 140;
      thumbnailFeturedRef.current.scrollBy({
        left: slideWidth,
        behavior: "smooth",
      });
    }
  };

  const thumbnailSortRef = useRef(null);

  const handlePrevSort = () => {
    if (thumbnailSortRef.current) {
      const slideWidth =
        thumbnailSortRef.current.firstChild?.offsetWidth || 140;
      thumbnailSortRef.current.scrollBy({
        left: -slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextSort = () => {
    if (thumbnailSortRef.current) {
      const slideWidth =
        thumbnailSortRef.current.firstChild?.offsetWidth || 140;
      thumbnailSortRef.current.scrollBy({
        left: slideWidth,
        behavior: "smooth",
      });
    }
  };

  // latest
  const [clickedHeadings, setClickedHeadings] = useState(false);
  const handleHeadingClick = (category) => {
    setClickedHeadings(clickedHeadings === category ? true : category);
  };

  const [clickedHeadingsMore, setClickedHeadingsMore] = useState(false);
  const handleHeadingMoreClick = (category) => {
    setClickedHeadingsMore(clickedHeadingsMore === category ? true : category);
  };

  //share pop up
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [homeMetaInfo, setHomeMetaInfo] = useState([]);

  const handleOpenShare = (permalink) => {
    setOpen(true);
    // setLink(`${import.meta.env.VITE_URL}/News/${permalink}`);
    setLink(`${window.location.origin}/News/${permalink}`);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleShare = (platform) => {
    const encodedLink = encodeURIComponent(link);
    let shareUrl = "";

    switch (platform) {
      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${encodedLink}`;
        break;

      case "XIcon":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}`;
        break;

      case "Instagram":
        shareUrl = `https://www.instagram.com/?url=${encodedLink}`;
        break;

      case "Teams":
        shareUrl = `https://www.microsoft.com/en-in/microsoft-teams/log-in?msockid=1413737803af645d14ff67be02426567=${encodedLink}`;
        break;

      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;

      case "Email":
        shareUrl = `mailto:?body=${encodedLink}`;
        break;
      case "Chrome":
        window.open(`https://www.google.com/search?q=${encodedLink}`, "_blank");
        break;
      case "Snapchat":
        window.open(
          `https://www.snapchat.com/send?text=${encodedLink}`,
          "_blank"
        );
        break;
      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${encodedLink}`;
        break;

      default:
        // console.error("Invalid platform");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // for google ads
  const [isAdVisible, setIsAdVisible] = useState(false);
  const landingGoogleAdsHomeList = useSelector(
    (state) => state.landing.landingGoogleAdsHomeList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsHomeList());
  }, [dispatch]);

  // Check if the ads are actually rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      const adElement = document.querySelector(".google-ad");
      setIsAdVisible(!!adElement);
    }, 1500);

    return () => clearTimeout(timer);
  }, [landingGoogleAdsHomeList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/landing/home/getMetaInfo`
        );
        setHomeMetaInfo(response.data.data);
      } catch (error) {
        // console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {homeMetaInfo[0] && (
        <DynamicSEO
          SEOTitle={homeMetaInfo?.[0].metaTitle}
          SEODescription={homeMetaInfo?.[0].metaDescription}
          SEOKeywords={homeMetaInfo?.[0].metaTags}
        />
      )}
      <Stack
        sx={{
          display: "flex",
          flexDirection: isMobile || isTablet ? "column" : "row",
          justifyContent: "space-between",
          width: "100%",
          height: isMobile ? "620px" : isTablet ? "620px" : "550px",
          padding: isMobile ? "0px 0px" : isTablet ? "0px 10px" : "0px 10px",
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          width="100%"
          height="100%"
          padding={"20px"}
          gap={2}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              backgroundColor: "white",
              width: { xs: "100%", md: "100%", lg: "49.5%" },
              height: { xs: "250px", md: "350px", lg: "500px" },
              "&:hover .content": {
                transform: {
                  xs: "translateY(0)",
                  md: "translateY(0)",
                  lg: "translateY(0)",
                },
              },
              "&:hover .heading": {
                transform: {
                  xs: "translateY(0)",
                  md: "translateY(-100%)",
                  lg: "translateY(-70%)",
                },
              },
              "&:hover .date": {
                transform: {
                  xs: "translateY(0)",
                  md: "translateY(-100%)",
                  lg: "translateY(-100%)",
                },
              },
            }}
          >
            {loadingHeroSection ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ width: "100%", height: "100%" }}
              />
            ) : (
              <>
                <Box
                  sx={{ position: "relative", width: "100%", height: "100%" }}
                  onClick={() => {
                    localStorage.setItem("postId", landingHeroSection[0]?.id);
                    navigate(`/News/${landingHeroSection[0]?.permalink}`, {
                      state: {
                        selectedCategory:
                          landingHeroSection[0]?.Categories?.[0]?.id,
                        scrollToPost: true,
                      },
                    });
                  }}
                >
                  <Box
                    component="img"
                    src={landingHeroSection[0]?.squareImageUrl}
                    alt={landingHeroSection[0]?.title}
                    onClick={() => {
                      localStorage.setItem("postId", landingHeroSection[0]?.id);
                      navigate(`/News/${landingHeroSection[0]?.permalink}`, {
                        state: {
                          selectedCategory:
                            landingHeroSection[0]?.Categories?.[0]?.id,
                          scrollToPost: true,
                        },
                      });
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "1000px",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "75%",
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                      zIndex: 1,
                    }}
                  />
                </Box>

                <Button
                  sx={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    padding: "1px 0px",
                    objectFit: "cover",
                    fontSize: { xs: "8px", lg: "10px" },
                    backgroundColor: "#895129",
                    "&:hover": {
                      backgroundColor: "#895129",
                      color: "white",
                    },
                    borderRadius: 0,
                  }}
                  variant="contained"
                >
                  {landingHeroSection[0]?.Categories?.[0]?.name}
                </Button>
                <Typography
                  className="heading"
                  sx={{
                    position: "absolute",
                    bottom: { xs: "1px", sm: "50px", md: "3px", lg: "1px" },
                    left: "10px",
                    color: "#fff",
                    maxWidth: "90%",
                    transform: { md: "translateY(0)", lg: "translateY(0)" },
                    fontSize: { xs: "16px", sm: "22px", lg: "30px" },
                    transition: "transform 0.3s ease-in-out",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    localStorage.setItem("postId", landingHeroSection[0]?.id);
                    navigate(`/News/${landingHeroSection[0]?.permalink}`, {
                      state: {
                        selectedCategory:
                          landingHeroSection[0]?.Categories?.[0]?.id,
                        scrollToPost: true,
                      },
                    });
                  }}
                >
                  {landingHeroSection[0]?.metaTitle
                    ?.split(" ")
                    .slice(0, 10)
                    .join(" ") +
                    (landingHeroSection[0]?.metaTitle?.split(" ").length > 10
                      ? "..."
                      : "")}
                </Typography>
                <Box
                  className="content"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    color: "#fff",
                    padding: "10px",
                    transform: {
                      md: "translateY(100%)",
                      lg: "translateY(100%)",
                    },
                    transition: "transform 0.3s ease-in-out",
                    zIndex: 2,
                  }}
                >
                  {!isMobile && (
                    <Typography
                      variant="body2"
                      onClick={() => {
                        localStorage.setItem(
                          "postId",
                          landingHeroSection[0]?.id
                        );
                        navigate(`/News/${landingHeroSection[0]?.permalink}`, {
                          state: {
                            selectedCategory:
                              landingHeroSection[0]?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                    >
                      {landingHeroSection[0]?.metaDescription
                        ?.split(" ")
                        .slice(0, 20)
                        .join(" ") +
                        (landingHeroSection[0]?.metaDescription?.split(" ")
                          .length > 20
                          ? "..."
                          : "")}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Box>

          <Box
            display="flex"
            flexDirection={{
              xs: "column",
              sm: "column",
              md: "row",
              lg: "column",
            }}
            width={{ xs: "100%", sm: "100%", md: "100%", lg: "49%" }}
            marginTop="0"
            gap={2}
          >
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "white",
                width: "100%",
                height: { xs: "150px", lg: "250px" },
                "&:hover .content": {
                  transform: {
                    xs: "translateY(0)",
                    sm: "translateY(0)",
                    md: "translateY(0)",
                    lg: "translateY(0)",
                  },
                },
                "&:hover .heading": {
                  transform: {
                    xs: "translateY(0)",
                    sm: "translateY(0)",
                    md: "translateY(-330%)",
                    lg: "translateY(-160%)",
                  },
                },
                "&:hover .date": {
                  transform: {
                    xs: "translateY(0)",
                    sm: "translateY(0)",
                    md: "translateY(-100%)",
                    lg: "translateY(-100%)",
                  },
                },
              }}
            >
              {loadingHeroSection ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                    onClick={() => {
                      localStorage.setItem("postId", landingHeroSection[1]?.id);
                      navigate(`/News/${landingHeroSection[1]?.permalink}`, {
                        state: {
                          selectedCategory:
                            landingHeroSection[1]?.Categories?.[0]?.id,
                          scrollToPost: true,
                        },
                      });
                    }}
                  >
                    <Box
                      component="img"
                      src={landingHeroSection[1]?.SEOImageUrl}
                      alt={landingHeroSection[1]?.title}
                      onClick={() => {
                        localStorage.setItem(
                          "postId",
                          landingHeroSection[1]?.id
                        );
                        navigate(`/News/${landingHeroSection[1]?.permalink}`, {
                          state: {
                            selectedCategory:
                              landingHeroSection[1]?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "75%",
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                        zIndex: 1,
                      }}
                    />
                  </Box>

                  <Button
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "#895129",
                      "&:hover": {
                        backgroundColor: "#895129",
                        color: "white",
                      },
                      fontSize: { xs: "8px", lg: "10px" },
                      padding: 0,
                      borderRadius: 0,
                      zIndex: 2,
                    }}
                    variant="contained"
                  >
                    {landingHeroSection[1]?.Categories?.[0]?.name}
                  </Button>
                  <Typography
                    className="heading"
                    sx={{
                      position: "absolute",
                      bottom: { xs: "1px", sm: "50px", md: "2px", lg: "1px" },
                      left: "10px",
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "18px", lg: "20px" },
                      transform: "translateY(0)",
                      transition: "transform 0.3s ease-in-out",
                      zIndex: 2,
                    }}
                  >
                    {landingHeroSection[1]?.metaTitle
                      ?.split(" ")
                      .slice(0, 8)
                      .join(" ") +
                      (landingHeroSection[1]?.metaTitle?.split(" ").length > 8
                        ? "..."
                        : "")}
                  </Typography>
                  <Box
                    className="content"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      color: "#fff",
                      padding: "10px",
                      transform: {
                        xs: "translateY(0)",
                        sm: "translateY(0)",
                        md: "translateY(100%)",
                        lg: "translateY(100%)",
                      },
                      transition: "transform 0.3s ease-in-out",
                      zIndex: 2,
                    }}
                  >
                    {!isMobile && (
                      <Typography
                        variant="body2"
                        onClick={() => {
                          localStorage.setItem(
                            "postId",
                            landingHeroSection[1]?.id
                          );
                          navigate(
                            `/News/${landingHeroSection[1]?.permalink}`,
                            {
                              state: {
                                selectedCategory:
                                  landingHeroSection[1]?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            }
                          );
                        }}
                      >
                        {landingHeroSection[1]?.metaDescription
                          ?.split(" ")
                          .slice(0, 20)
                          .join(" ") +
                          (landingHeroSection[1]?.metaDescription?.split(" ")
                            .length > 20
                            ? "..."
                            : "")}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              width="100%"
              flexWrap="wrap"
              gap={1}
              marginBottom={0}
              sx={{
                marginTop: isMobile || isTablet ? 0 : 0,
              }}
            >
              {landingHeroSection?.slice(2, 4).map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    overflow: "hidden",

                    backgroundColor: "white",
                    // width: { xs: "48%", sm: "49.3%", lg: "49.2%" },
                    width: { xs: "48%", sm: "49.3%", lg: "49.2%", md: "49%" },
                    height: { xs: "150px", lg: "233px" },
                    "&:hover .content": {
                      transform: {
                        xs: "translateY(0)",
                        md: "translateY(0)",
                        lg: "translateY(0)",
                      },
                    },
                    "&:hover .heading": {
                      transform: {
                        xs: "translateY(0)",
                        md: "translateY(-30%)",
                        lg: "translateY(-0)",
                      },
                    },
                    "&:hover .date": {
                      transform: {
                        xs: "translateY(0)",
                        md: "translateY(0)",
                        lg: "translateY(0)",
                      },
                    },
                  }}
                >
                  {loadingHeroSection ? (
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
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
                        <Box
                          component="img"
                          src={item?.squareImageUrl}
                          alt={item?.title}
                          onClick={() => {
                            localStorage.setItem("postId", item?.id);
                            navigate(`/News/${item?.permalink}`, {
                              state: {
                                selectedCategory: item?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "75%",
                            background:
                              "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                            zIndex: 1,
                          }}
                        />
                      </Box>

                      <Button
                        sx={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          objectFit: "cover",
                          backgroundColor: "#895129",
                          "&:hover": {
                            backgroundColor: "#895129",
                            color: "white",
                          },
                          fontSize: { xs: "8px", lg: "10px" },
                          padding: 0,

                          borderRadius: 0,
                          zIndex: 2,
                          width: "10px",
                        }}
                        variant="contained"
                      >
                        {item?.Categories?.[0]?.name}
                      </Button>
                      <Typography
                        className="heading"
                        sx={{
                          mb: { xs: 0, lg: 3 },
                          position: "absolute",
                          bottom: {
                            xs: "1px",
                            sm: "50px",
                            md: "50px",
                            lg: "30px",
                          },
                          left: { xs: "10px", lg: "10px" },
                          color: "#fff",
                          fontSize: { xs: "12px", sm: "16px", lg: "18px" },
                          fontWeight: "bold",
                          transform: {
                            xs: "translateY(0)",
                            sm: "translateY(0)",
                            md: "translateY(100%)",
                            lg: "translateY(100%)",
                          },
                          transition:
                            isMobile || isTablet
                              ? "none"
                              : "transform 0.3s ease-in-out",
                          zIndex: 1,
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
                        {item?.metaTitle?.split(" ").length > 6
                          ? item?.metaTitle?.split(" ").slice(0, 6).join(" ") +
                            "..."
                          : item?.metaTitle}
                      </Typography>
                      <Box
                        className="content"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          color: "#fff",

                          padding: "10px",
                          transform: {
                            xs: "translateY(0)",
                            sm: "translateY(0)",
                            md: "translateY(100%)",
                            lg: "translateY(100%)",
                          },
                          transition:
                            isMobile || isTablet
                              ? "none"
                              : "transform 0.3s ease-in-out",
                          zIndex: 1,
                        }}
                      >
                        {!isMobile && (
                          <Typography
                            variant="body2"
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
                            {item?.metaDescription
                              ?.split(" ")
                              .slice(0, 8)
                              .join(" ") +
                              (item?.metaDescription?.split(" ").length > 8
                                ? "..."
                                : "")}
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Stack>
      {/* 2nd main section */}
      <Stack
        sx={{
          marginTop: 0,
          alignItems: "center",
          padding: { xs: "20px 0", sm: "10px 0" },
          mb: { xs: 0, sm: 5 },
        }}
      >
        <Container
          sx={{
            mt: 0,
            ml: { xs: 0, sm: 0, lg: 4 },
            px: { xs: 2, sm: 4, lg: 0 },
            borderRadius: 0,
            padding: 0,
          }}
        >
          <Grid
            container
            spacing={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "row" },
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} sm={12} lg={5}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "white",
                  height: { xs: "250px", md: "350px", lg: "565px" },
                }}
              >
                {loadingHeroSection ? (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "postId",
                          landingHeroSection[4]?.id
                        );
                        navigate(`/News/${landingHeroSection[4]?.permalink}`, {
                          state: {
                            selectedCategory:
                              landingHeroSection[4]?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                    >
                      <Box
                        component="img"
                        src={landingHeroSection[4]?.squareImageUrl}
                        alt={landingHeroSection[4]?.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "75%",
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                          zIndex: 1,
                        }}
                      />
                    </Box>

                    <Button
                      sx={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        padding: "1px 0px",
                        objectFit: "cover",
                        fontSize: { xs: "8px", lg: "10px" },
                        backgroundColor: "#895129",

                        "&:hover": {
                          backgroundColor: "#895129",
                          color: "white",
                        },
                        borderRadius: 0,
                      }}
                      variant="contained"
                    >
                      {landingHeroSection[4]?.Categories?.[0]?.name}
                    </Button>
                    <Typography
                      className="heading"
                      sx={{
                        position: "absolute",
                        bottom: { xs: "1px", md: "20px", lg: "1px" },
                        left: "10px",
                        color: "#fff",
                        maxWidth: "95%",
                        transform: "translateY(0)",
                        fontSize: { xs: "16px", lg: "30px" },
                        transition: "transform 0.3s ease-in-out",
                        zIndex: 2,
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "postId",
                          landingHeroSection[4]?.id
                        );
                        navigate(`/News/${landingHeroSection[4]?.permalink}`, {
                          state: {
                            selectedCategory:
                              landingHeroSection[4]?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                    >
                      {landingHeroSection[4]?.metaTitle}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              {loadingHeroSection ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {landingHeroSection?.slice(5, 10).map((article, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "40%", sm: "170px" },
                          height: "100px",
                          flexShrink: 0,
                          overflow: "hidden",
                          mr: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          src={article?.verticalImageUrl}
                          alt={article?.title}
                          onClick={() => {
                            localStorage.setItem("postId", article?.id);
                            navigate(`/News/${article?.permalink}`, {
                              state: {
                                selectedCategory: article?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "8px", lg: "14px" },
                            display: "flex",

                            alignItems: "center",
                          }}
                        ></Typography>
                        <Typography
                          variant="h6"
                          onClick={() => {
                            localStorage.setItem("postId", article?.id);
                            navigate(`/News/${article?.permalink}`, {
                              state: {
                                selectedCategory: article?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          sx={{
                            mt: 1,
                            fontSize: { xs: "12px", lg: "16px" },
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {article?.metaTitle
                            ?.split(" ")
                            .slice(
                              0,
                              window.innerWidth <= 600
                                ? 8
                                : window.innerWidth <= 900
                                ? 10
                                : 5
                            )
                            .join(" ") +
                            (article?.metaTitle?.split(" ").length >
                            (window.innerWidth <= 600
                              ? 8
                              : window.innerWidth <= 900
                              ? 10
                              : 5)
                              ? "..."
                              : "")}
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
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              lg={3}
              sx={{ display: { xs: "none", sm: "none", lg: "flex" } }}
            >
              {/* adding dynamic ads */}

              {landingGoogleAdsHomeList.filter(
                (ad) => ad?.adsPosition?.toUpperCase() === "Multi Block"
              )?.[0]?.isCustomAds ? (
                home1VerticalImages.length > 0 ? (
                  <a
                    href={home1VerticalImages[currentImageIndex].adUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  >
                    <img
                      src={home1VerticalImages[currentImageIndex].imageUrl}
                      alt={`Advertisement ${currentImageIndex + 1}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </a>
                ) : (
                  <AdsRenderer
                    ads={landingGoogleAdsHomeList}
                    position="Multi Block"
                  />
                )
              ) : (
                <AdsRenderer
                  ads={landingGoogleAdsHomeList}
                  position="Multi Block"
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Stack>
      {/* {isAdVisible ? ( */}
      <Stack
        sx={{
          alignItems: "center",
          width: "100%",
          padding: { xs: "5px", sm: "10px 0" },
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        </Container>
      </Stack>
      {/* ) : null} */}
      {/* scroller */}
      {loadingHeroSection ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          {Array.from(new Array(6)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              animation="wave"
              sx={{
                width: "250px",
                height: { lg: "230px", sm: "170px", xs: "150px" },
                mb: "20px",
              }}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "1750px",
            mx: "auto",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <IconButton
              onClick={leftSlide}
              sx={{
                position: "absolute",
                left: { xs: "15px", sm: "15px" },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                color: "white",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { sm: "15px", xs: "10px" } }} />
            </IconButton>
            <Box
              ref={thumbnailRef}
              sx={{
                display: "flex",
                overflow: "hidden",
                whiteSpace: "nowrap",
                flexGrow: 1,
                mx: 2,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
                // new added
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {landingHeroSection?.slice(11, 20).map((slide, index) => {
                return (
                  <>
                    {(index + 1) % 3 === 0 && (
                      <Container sx={{}}>
                        <AdsRenderer
                          ads={landingGoogleAdsHomeList}
                          position="Square"
                        />
                      </Container>
                    )}
                    <Box
                      key={index}
                      sx={{
                        minWidth: { lg: "280px", sm: "220px", xs: "200px" },
                        mx: 1,
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <Box
                        component="div"
                        sx={{
                          width: "100%",
                          height: { lg: "230px", sm: "170px", xs: "150px" },
                          overflow: "hidden",
                          borderRadius: 1,
                          position: "relative",
                        }}
                        onClick={() => {
                          localStorage.setItem("postId", slide?.id);
                          navigate(`/News/${slide?.permalink}`, {
                            state: {
                              selectedCategory: slide?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      >
                        <Box
                          component="img"
                          src={slide?.squareImageUrl || slide?.SEOImageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "90%",
                          color: "#fff",
                          fontSize: { sm: "14px", xs: "9px" },
                          fontWeight: 600,
                          p: 1,
                          whiteSpace: "normal",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          sx={{
                            mb: 1,
                            fontSize: { sm: "14px", xs: "9px" },
                          }}
                          onClick={() => {
                            localStorage.setItem("postId", slide?.id);
                            navigate(`/News/${slide?.permalink}`, {
                              state: {
                                selectedCategory: slide?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                        >
                          {slide?.metaTitle?.split(" ").length > 12
                            ? slide?.metaTitle
                                ?.split(" ")
                                .slice(0, 12)
                                .join(" ") + "..."
                            : slide?.metaTitle}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: "#fff",
                            cursor: "pointer",
                            textDecoration: "underline",
                            mt: "auto",
                          }}
                          onClick={() => {
                            localStorage.setItem("postId", slide?.id);
                            navigate(`/News/${slide?.permalink}`, {
                              state: {
                                selectedCategory: slide?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                        >
                          Read More
                        </Typography>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Box>
            <IconButton
              onClick={rightSlide}
              sx={{
                position: "absolute",
                right: { xs: "15px", sm: "15px" },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                color: "white",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <ArrowForwardIosIcon
                sx={{ fontSize: { sm: "15px", xs: "10px" } }}
              />
            </IconButton>
          </Box>
        </Box>
      )}
      {/* ads */}
      {/* {isAdVisible ? ( */}
      <Stack
        sx={{
          alignItems: "center",
          width: "100%",
          padding: { xs: "5px", sm: "10px 0" },
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        </Container>
      </Stack>
      {/* ) : null} */}
      {/* international new */}
      {loadingNationSection ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "450px", mb: "20px" }}
        />
      ) : (
        <Stack
          sx={{
            // marginTop: "20px",
            backgroundColor: "#FCF8E7",
            alignItems: "center",
            width: "100%",
            paddingLeft: { xs: "10px 0", sm: "7px 0" },
            paddingRight: { xs: "10px 0", sm: "7px 0" },
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              // mt: 1,
              px: { xs: "5px", sm: "20px" },
            }}
          >
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "space-between",
                gap: { xs: "10px", lg: "16px" },
                width: "100%",
              }}
            >
              {[landingInternationList, landingntionalList].map((list, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: { xs: "100%", lg: "48%" },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        backgroundColor: "#895129",
                        padding: "5px 10px",
                        fontWeight: 200,
                      }}
                    >
                      {idx === 0 ? "INTERNATIONAL" : "NATIONAL"}
                    </span>{" "}
                    <span style={{ color: "#000000" }}>NEWS</span>
                  </Typography>
                  <Box>
                    {list.slice(0, 3).map((item, index) => (
                      <Card
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: "14px",
                          boxShadow: "none",
                          backgroundColor: "#f9f5eb",
                          alignItems: "center",
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
                            width: { sm: "180px", xs: "150px" },
                            height: { sm: "127px", xs: "125px" },
                            objectFit: "cover",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          image={item.squareImageUrl}
                          alt={item.title}
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
                            {isMobile ? (
                              <span>
                                {item?.metaTitle?.split(" ").length > 5
                                  ? item?.metaTitle
                                      ?.split(" ")
                                      .slice(0, 5)
                                      .join(" ") + "..."
                                  : item?.metaTitle}
                              </span>
                            ) : (
                              <span>{item.metaTitle}</span>
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              marginTop: "5px",
                              fontSize: { xs: "10px", sm: "12px" },
                              cursor: "pointer",
                            }}
                          >
                            {item?.metaDescription?.split(" ").length > 15
                              ? item?.metaDescription
                                  ?.split(" ")
                                  .slice(0, 15)
                                  .join(" ") + "..."
                              : item?.metaDescription}{" "}
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
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Stack>
      )}
      {/* ads */}
      {/* {isAdVisible ? ( */}
      <Stack
        sx={{
          alignItems: "center",
          width: "100%",
          padding: { xs: "5px", sm: "10px 0" },
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        </Container>
      </Stack>
      {/* ) : null} */}
      {/* Featured news */}
      {loadingFeaturedSection ? (
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
        <Stack
          sx={{
            alignItems: "center",
            width: "100%",
            padding: { xs: "5px", sm: "10px 0" },
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 2 } }}>
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
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "20px",
                  // pl: "10px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#895129",
                    padding: "5px",
                    fontWeight: 300,
                  }}
                >
                  FEATURED
                </span>{" "}
                <span style={{ color: "#000000" }}>NEWS</span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={handlePrevFeatured}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowBackIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
                <Box
                  ref={thumbnailFeturedRef}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    overflow: "hidden",
                    gap: { xs: "6px", sm: "12px" },
                    // new added
                    "&::-webkit-scrollbar": { display: "none" },
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {landingFeaturedList?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        px: { xs: 1, sm: 2 },
                        mb: 2,
                        width: isMobile ? "100%" : isTablet ? "48%" : "25%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Card
                        sx={{
                          maxWidth: "350px",
                          mx: "auto",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200px"
                          image={item?.verticalImageUrl}
                          alt="Post Thumbnail"
                          onClick={() => {
                            localStorage.setItem("postId", item?.id);
                            navigate(`/News/${item.permalink}`, {
                              state: {
                                selectedCategory: item?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                          sx={{
                            objectFit: "cover",
                            height: "200px",
                            cursor: "pointer",
                          }}
                        />
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            flexGrow: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            onClick={() => {
                              localStorage.setItem("postId", item?.id);
                              navigate(`/News/${item.permalink}`, {
                                state: {
                                  selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                            sx={{
                              mt: 0,
                              fontSize: { xs: "11px", sm: "13px" },
                              fontWeight: "bold",
                              fontFamily: "DM Sans, sans-serif",
                              cursor: "pointer",
                            }}
                          >
                            {item?.metaTitle?.split(" ").length > 8
                              ? item?.metaTitle
                                  ?.split(" ")
                                  .slice(0, 8)
                                  .join(" ") + "..."
                              : item?.metaTitle}
                          </Typography>
                          <Typography
                            variant="body2"
                            onClick={() => {
                              localStorage.setItem("postId", item?.id);
                              navigate(`/News/${item.permalink}`, {
                                state: {
                                  selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                            sx={{
                              mt: 0,
                              color: "gray",
                              width: "250px",
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: { xs: "9px", sm: "12px" },
                              textDecoration: "none",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {item?.metaDescription?.split(" ").length > 15
                              ? item?.metaDescription
                                  ?.split(" ")
                                  .slice(0, 15)
                                  .join(" ") + "..."
                              : item?.metaDescription}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                            gap: 0,
                            justifyContent: "flex-end",
                          }}
                        >
                          {/* <Box sx={{ display: "flex", gap: "-5px" }}>
                          {commentsimg.map((img, index) => (
                            <Box
                              key={index}
                              component="img"
                              src={img}
                              alt={`Comment avatar ${index + 1}`}
                              sx={{
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                zIndex: 4 - index,
                                boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                              }}
                            />
                          ))}
                        </Box> */}
                          {/* <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "gray",
                              fontSize: "10px",
                              fontWeight: "normal",
                            }}
                          >
                            Comments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "8px", color: "gray" }}
                          >
                            ({item.comments.length})
                          </Typography>
                        </Box> */}

                          <IconButton
                            onClick={() => handleOpenShare(item.permalink)}
                            sx={{
                              color: "#b5651d",
                              transition: "all 0.3s ease",
                              fontSize: "16px",
                              "&:hover": {
                                color: "white",
                                backgroundColor: "#b5651d",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <ShareIcon sx={{ fontSize: "12px" }} />
                          </IconButton>
                          {isMobile && open && (
                            <Box
                              sx={{
                                position: "fixed",
                                bottom: 0,
                                left: 0,
                                right: 0,

                                height: "460px",
                                bgcolor: "background.paper",
                                boxShadow: "0px -2px 10px rgba(0,0,0,0.2)",
                                borderRadius: "16px 16px 0 0",
                                padding: 4,
                                zIndex: 1300,
                              }}
                            >
                              <Button
                                onClick={handleClose}
                                sx={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  color: "#ff0000",
                                  textTransform: "none",
                                }}
                              >
                                X
                              </Button>

                              <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                sx={{ mb: 2 }}
                              >
                                <Grid item xs={9}>
                                  <TextField
                                    value={link}
                                    variant="standard"
                                    size="medium"
                                    fullWidth
                                    InputProps={{
                                      readOnly: true,
                                      disableUnderline: true,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <IconButton
                                            disableRipple
                                            disableFocusRipple
                                            sx={{ padding: 0, marginRight: 1 }}
                                          >
                                            <Typography
                                              sx={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                backgroundColor: "#804000",
                                                color: "#fff",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              T
                                            </Typography>
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                      sx: {
                                        padding: 0,
                                        background: "none",
                                        border: "none",
                                        color: "inherit",
                                        fontSize: "inherit",
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                  <IconButton onClick={handleCopy}>
                                    <ContentCopyOutlinedIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>

                              {copied && (
                                <Typography
                                  variant="body2"
                                  color="green"
                                  textAlign="center"
                                >
                                  Link copied!
                                </Typography>
                              )}
                              <Box
                                sx={{
                                  bgcolor: "#f2f2f2",
                                  padding: 2,
                                  borderRadius: 2,
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  textAlign="center"
                                  gutterBottom
                                >
                                  The Impact of Travel around the World : How
                                  Travel is Changing your Mindset
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  backgroundColor: "#f2f2f2",
                                  padding: 3,
                                  borderRadius: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  height: "220px",
                                  flexWrap: "wrap",
                                  alignItems: "left",
                                  gap: 3,
                                }}
                              >
                                <IconButton
                                  onClick={() => handleShare("WhatsApp")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "0",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={whatsappIcon}
                                    alt="WhatsApp"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("Instagram")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "0",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={instagramIcon}
                                    alt="Instagram"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("Teams")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "0",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={Teams}
                                    alt="Teams"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("Facebook")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={facebookIcon}
                                    alt="Facebook"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("XIcon")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={XIcon}
                                    alt="Xicon"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("Email")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={emailIcon}
                                    alt="Email"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>

                                <IconButton
                                  onClick={() => handleShare("Chrome")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={chromeIcon}
                                    alt="chromeicon"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>

                                <IconButton
                                  onClick={() => handleShare("Snapchat")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={snapchatIcon}
                                    alt="snapcharticon"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleShare("Telegram")}
                                  sx={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  }}
                                >
                                  <img
                                    src={telegramIcon}
                                    alt="telegramicon"
                                    width={30}
                                    height={30}
                                  />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                          {!isMobile && (
                            <Modal
                              BackdropProps={{
                                style: {
                                  backgroundColor: "rgba(114, 105, 105, 0.1)",
                                },
                              }}
                              PaperProps={{
                                style: {
                                  boxShadow: "none",
                                },
                              }}
                              open={open}
                              onClose={() => setOpen(false)}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  bgcolor: "background.paper",
                                  maxWidth: "660px",
                                  height: "380px",
                                  p: 4,
                                  borderRadius: 2,
                                  boxShadow: 24,
                                  "@media print": {
                                    display: "none",
                                  },
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  gutterBottom
                                >
                                  Share this page
                                </Typography>
                                <Button
                                  onClick={handleClose}
                                  sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    color: "#ff0000",
                                    textTransform: "none",
                                  }}
                                >
                                  X
                                </Button>
                                <Grid
                                  container
                                  spacing={2}
                                  alignItems="center"
                                  sx={{ mb: 4 }}
                                >
                                  <Grid item xs={9}>
                                    <TextField
                                      value={link}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <IconButton onClick={handleCopy}>
                                      <ContentCopyOutlinedIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>

                                {copied && (
                                  <Typography variant="body2" color="green">
                                    Link copied!
                                  </Typography>
                                )}

                                <Box
                                  sx={{
                                    backgroundColor: "#f2f2f2",
                                    padding: 0,
                                    borderRadius: 2,
                                    display: "flex",
                                    width: "400px",
                                    justifyContent: "center",
                                    height: "200px",
                                    flexWrap: "wrap",
                                    gap: 4,
                                  }}
                                >
                                  <IconButton
                                    onClick={() => handleShare("WhatsApp")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={whatsappIcon}
                                      alt="WhatsApp"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Instagram")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={instagramIcon}
                                      alt="Instagram"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Teams")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={Teams}
                                      alt="Teams"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Facebook")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={facebookIcon}
                                      alt="Facebook"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("XIcon")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={XIcon}
                                      alt="Xicon"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Email")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={emailIcon}
                                      alt="Email"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Chrome")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={chromeIcon}
                                      alt="chromeicon"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => handleShare("Snapchat")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={snapchatIcon}
                                      alt="snapcharticon"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleShare("Telegram")}
                                    sx={{
                                      borderRadius: "0",
                                    }}
                                  >
                                    <img
                                      src={telegramIcon}
                                      alt="telegramicon"
                                      width={30}
                                      height={30}
                                    />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Modal>
                          )}

                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#804000",
                              borderRadius: "20px",
                              textTransform: "none",
                              px: 3,
                              display: "flex",
                              alignItems: "center",
                              whiteSpace: "nowrap",
                              fontSize: "8px",
                              padding: 0,
                              width: isMobile
                                ? "60px"
                                : isTablet
                                ? "90px"
                                : "80px",
                              "& .MuiButton-startIcon": {
                                marginRight: "4px",
                                transition: "transform 0.3s ease",
                              },
                              "&:hover .MuiButton-startIcon": {
                                transform: "rotate(-90deg)",
                              },
                              "&:hover": {
                                backgroundColor: "white",
                                color: "#b5651d",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                            startIcon={
                              !isMobile && (
                                <ArrowForwardIcon sx={{ fontSize: "10px" }} />
                              )
                            }
                            onClick={() => {
                              localStorage.setItem("postId", item?.id);
                              navigate(`/News/${item.permalink}`, {
                                state: {
                                  selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                          >
                            Read More
                          </Button>
                        </CardActions>
                      </Card>
                      {(index + 1) % 3 === 0 && (
                        // <Stack
                        //   sx={{
                        //     minWidth: { xs: "200px", sm: "300px" },
                        //     // height: 100,
                        //     // position: "relative",
                        //     cursor: "pointer",
                        //     // background: "red",
                        //   }}
                        // >
                        // <Container sx={{}}>
                        <AdsRenderer
                          ads={landingGoogleAdsHomeList}
                          position="Square"
                        />
                        // </Container>
                        // </Stack>
                      )}
                    </Box>
                  ))}
                </Box>
                <IconButton
                  onClick={handleNextFeatured}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Stack>
      )}
      {/* ads */}
      {/* {isAdVisible ? ( */}
      <Stack
        sx={{
          alignItems: "center",
          width: "100%",
          padding: { xs: "5px", sm: "10px 0" },
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        </Container>
      </Stack>
      {/* ) : null} */}
      {/* sort news */}
      {loadingShortSection ? (
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
        <Stack sx={{ alignItems: "center", width: "100%" }}>
          <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#895129",
                    padding: "5px",
                    fontWeight: 300,
                  }}
                >
                  SHORT
                </span>{" "}
                <span style={{ color: "#000000" }}>NEWS</span>
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                  padding: "10px",
                }}
              >
                <IconButton
                  onClick={handlePrevSort}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowBackIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
                <Box
                  ref={thumbnailSortRef}
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {landingShortList?.map((article, index) => (
                    <React.Fragment key={index}>
                      <Card
                        sx={{
                          minWidth: { xs: "200px", sm: "300px" },
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="300"
                          image={article.SEOImageUrl}
                          alt="news"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            localStorage.setItem("postId", article?.id);
                            navigate(`/News/${article.permalink}`, {
                              state: {
                                selectedCategory: article?.Categories?.[0]?.id,
                                scrollToPost: true,
                              },
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => handleOpenShare(article?.permalink)}
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            bgcolor: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                        <CardContent
                          sx={{
                            bgcolor: "rgba(39, 37, 37, 0.7)",
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            padding: "10px",
                          }}
                        >
                          <Typography variant="body2" color="white">
                            {article?.metaTitle?.split(" ").length > 10
                              ? article?.metaTitle
                                  ?.split(" ")
                                  .slice(0, 10)
                                  .join(" ") + "..."
                              : article?.metaTitle}
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
                                marginLeft: "10px",
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
                      {(index + 1) % 3 === 0 && (
                        // <Stack
                        //   sx={{
                        //     minWidth: { xs: "200px", sm: "300px" },
                        //     // height: 100,
                        //     // position: "relative",
                        //     cursor: "pointer",
                        //     // background: "red",
                        //   }}
                        // >
                        <Container sx={{}}>
                          <AdsRenderer
                            ads={landingGoogleAdsHomeList}
                            position="Square"
                          />
                        </Container>
                        // </Stack>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
                <IconButton
                  onClick={handleNextSort}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Stack>
      )}

      {/* {loadingShortSection ? (
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
        <Stack
          sx={{
            alignItems: "center",
            width: "100%",
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#895129",
                    padding: "5px",
                    fontWeight: 300,
                  }}
                >
                  SHORT
                </span>{" "}
                <span style={{ color: "#000000" }}>NEWS</span>
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                  padding: "10px",
                }}
              >
                <IconButton
                  onClick={handlePrevSort}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowBackIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
                <Box
                  ref={thumbnailSortRef}
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {landingShortList?.map((article, index) => (
                    <Card
                      key={index}
                      sx={{
                        minWidth: { xs: "200px", sm: "300px" },
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={article.SEOImageUrl}
                        alt="news"
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          localStorage.setItem("postId", article?.id);
                          navigate(`/News/${article.permalink}`, {
                            state: {
                              selectedCategory: article?.Categories?.[0]?.id,
                              scrollToPost: true,
                            },
                          });
                        }}
                      />
                      <IconButton
                        onClick={() => handleOpenShare(article?.permalink)}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "rgba(255,255,255,0.8)",
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                      <CardContent
                        sx={{
                          bgcolor: "rgba(39, 37, 37, 0.7)",
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          padding: "10px",
                        }}
                      >
                        <Typography variant="body2" color="white">
                          {article?.metaTitle?.split(" ").length > 10
                            ? article?.metaTitle
                                ?.split(" ")
                                .slice(0, 10)
                                .join(" ") + "..."
                            : article?.metaTitle}
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
                              marginLeft: "10px",
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

                <IconButton
                  onClick={handleNextSort}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { lg: 10, xs: 1 },
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "50%",
                    zIndex: 2,
                    display: { xs: "none", sm: "flex" },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      color: "white",
                      fontSize: { sm: "15px", xs: "10px" },
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Stack>
      )}
      {/* ads */}
      {/* <div
        style={{
          width: "100%",
          height: "auto",
          margin: "20px 0",
          textAlign: "center",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
          data-ad-client="ca-pub-9632557061063857"
          data-ad-slot="9406755763"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div> */}
      {/* adding dynamic ads */}
      {/* {isAdVisible ? ( */}
      {landingGoogleAdsHomeList?.find(
        (ad) => ad?.adsPosition === "Full Body Width"
      )?.isCustomAds ? (
        <Stack sx={{ alignItems: "center" }}>
          <Container maxWidth="xl" sx={{ mt: 0, padding: 0 }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: "150px", sm: "200px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Box sx={{ width: "100%", height: "100%", textAlign: "center" }}>
                {home2HorizontalImages.length > 0 ? (
                  <a
                    href={home2HorizontalImages[currentHome2ImageIndex].adUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      let url = home2HorizontalImages[
                        currentHome2ImageIndex
                      ].adUrl.trim();
                      url = url.replace(/\s/g, "");
                      window.open(
                        url.startsWith("http") ? url : `http://${url}`,
                        "_blank"
                      );
                    }}
                  >
                    <img
                      src={
                        home2HorizontalImages[currentHome2ImageIndex].imageUrl
                      }
                      alt={`Ad ${currentHome2ImageIndex + 1}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </a>
                ) : (
                  <Stack
                    sx={{
                      alignItems: "center",
                      width: "100%",
                      padding: { xs: "5px", sm: "10px 0" },

                      border: "2px solid red",
                    }}
                  >
                    <Container
                      maxWidth="xl"
                      sx={{
                        mt: 0,
                        px: { xs: 1, sm: 2, md: 3 },
                        border: "2px solid red",
                      }}
                    >
                      <AdsRenderer
                        ads={landingGoogleAdsHomeList}
                        position="Full Body Width"
                      />
                    </Container>
                  </Stack>
                )}
              </Box>
            </Box>
          </Container>
        </Stack>
      ) : null}

      {/* easy search */}
      {loadingEasySection ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "450px", mb: "20px" }}
        />
      ) : (
        <Stack
          sx={{
            alignItems: "center",
            width: "100%",
            padding: { xs: "5px", sm: "10px 0" },
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
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
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "20px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#895129",
                    padding: "5px",
                    fontWeight: 300,
                  }}
                >
                  EASY
                </span>{" "}
                <span style={{ color: "#000000" }}>SEARCH</span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  border: "1px solid transparent",
                  mb: 2,
                  flexWrap: "wrap",
                  justifyContent: "left",
                  width: "100%",
                  overflow: "hidden",
                  "@media (min-width: 600px)": {
                    gap: 3,
                  },
                }}
              >
                {landingcategoryNameList
                  ?.slice(0, 10)
                  .map((category, index) => (
                    <Button
                      key={category.id || index}
                      variant="outlined"
                      onClick={() => {
                        handleHeadingClick(category);
                        setLoadingEasySearch(true);
                        dispatch(
                          getLandingEasySearchList(category.name || "ALL")
                        ).finally(() => {
                          setLoadingEasySearch(false);
                        });
                      }}
                      sx={{
                        backgroundColor:
                          clickedHeadings === category ? "#895129" : "white",
                        color:
                          clickedHeadings === category ? "white" : "#895129",
                        fontWeight: 500,
                        textTransform: "none",
                        flex: "0 1 auto",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        display:
                          index < 3 || window.innerWidth >= 600
                            ? "flex"
                            : "none",
                        "@media (max-width: 600px)": {
                          flex: "0 1 auto",
                          justifyContent: "flex-start",
                        },
                        borderColor: "#895129",
                        "&:hover": {
                          backgroundColor:
                            clickedHeadings === category
                              ? "#b5651d"
                              : "#f0f0f0",
                          color:
                            clickedHeadings === category ? "white" : "#333",
                          borderColor:
                            clickedHeadings === category ? "#b5651d" : "#ddd",
                        },
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                }}
              >
                <Grid item xs={12} sm={12} lg={9}>
                  {loadingEasySearch ? (
                    <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                      <CircularProgress sx={{ color: "#895129" }} />
                    </Box>
                  ) : landingEasySearchList?.length > 0 ? (
                    <Grid container spacing={1}>
                      {landingEasySearchList?.slice(0, 3).map((raw, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={index}>
                          <Card
                            sx={{
                              height: { xs: "350px", sm: "400px" },
                              width: "100%",
                              margin: 0,
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="251px"
                              image={raw.SEOImageUrl}
                              alt="Post Thumbnail"
                              onClick={() => {
                                localStorage.setItem("postId", raw?.id);
                                navigate(`/News/${raw.permalink}`, {
                                  state: {
                                    selectedCategory: raw?.Categories?.[0]?.id,
                                    scrollToPost: true,
                                  },
                                });
                              }}
                              sx={{
                                borderRadius: 0,
                                cursor: "pointer",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            />
                            <CardContent sx={{ paddingTop: 0 }}>
                              <Typography
                                variant="h6"
                                onClick={() => {
                                  localStorage.setItem("postId", raw?.id);
                                  navigate(`/News/${raw.permalink}`, {
                                    state: {
                                      selectedCategory:
                                        raw?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  });
                                }}
                                sx={{
                                  mt: 0,
                                  fontSize: { xs: "11px", sm: "13px" },
                                  fontWeight: "bold",
                                  fontFamily: "DM Sans, sans-serif",
                                  cursor: "pointer",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {raw?.metaTitle?.split(" ").length > 8
                                  ? raw?.metaTitle
                                      ?.split(" ")
                                      .slice(0, 8)
                                      .join(" ") + "..."
                                  : raw?.metaTitle}
                              </Typography>
                              <Typography
                                variant="body2"
                                onClick={() => {
                                  localStorage.setItem("postId", raw?.id);
                                  navigate(`/News/${raw.permalink}`, {
                                    state: {
                                      selectedCategory:
                                        raw?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  });
                                }}
                                sx={{
                                  mt: 0,
                                  color: "gray",
                                  fontFamily: "DM Sans, sans-serif",
                                  fontSize: { xs: "9px", sm: "12px" },
                                  cursor: "pointer",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {raw?.metaDescription?.split(" ").length > 10
                                  ? raw?.metaDescription
                                      ?.split(" ")
                                      .slice(0, 10)
                                      .join(" ") + "..."
                                  : raw?.metaDescription}
                              </Typography>
                            </CardContent>
                            <CardActions
                              sx={{
                                display: "flex",
                                px: 2,
                                pb: 1,
                                gap: 0,
                                justifyContent: "flex-end",
                              }}
                            >
                              {/* <Box sx={{ display: "flex", gap: "-5px" }}>
                              {commentsimg.map((img, index) => (
                                <Box
                                  key={index}
                                  component="img"
                                  src={img}
                                  alt={`Comment avatar ${index + 1}`}
                                  sx={{
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    zIndex: 4 - index,
                                    boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                                  }}
                                />
                              ))}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "gray",
                                  fontSize: "10px",
                                  fontWeight: "normal",
                                }}
                              >
                                Comments
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "8px", color: "gray" }}
                              >
                                ({raw.comments.length})
                              </Typography>
                            </Box> */}
                              <IconButton
                                onClick={() => handleOpenShare(raw?.permalink)}
                                sx={{
                                  color: "#b5651d",
                                  transition: "all 0.3s ease",
                                  fontSize: "16px",
                                  "&:hover": {
                                    color: "white",
                                    backgroundColor: "#b5651d",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <ShareIcon sx={{ fontSize: "12px" }} />
                              </IconButton>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "#804000",
                                  borderRadius: "20px",
                                  textTransform: "none",
                                  px: 3,
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "8px",
                                  padding: 0,
                                  width: isMobile
                                    ? "60px"
                                    : isTablet
                                    ? "90px"
                                    : "80px",
                                  "& .MuiButton-startIcon": {
                                    marginRight: "4px",
                                    transition: "transform 0.3s ease",
                                  },
                                  "&:hover .MuiButton-startIcon": {
                                    transform: "rotate(-90deg)",
                                  },
                                  "&:hover": {
                                    backgroundColor: "white",
                                    color: "#b5651d",
                                    boxShadow:
                                      "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                  },
                                }}
                                startIcon={
                                  !isMobile && (
                                    <ArrowForwardIcon
                                      sx={{ fontSize: "10px" }}
                                    />
                                  )
                                }
                                onClick={() => {
                                  localStorage.setItem("postId", raw?.id);
                                  navigate(`/News/${raw.permalink}`, {
                                    state: {
                                      selectedCategory:
                                        raw?.Categories?.[0]?.id,
                                      scrollToPost: true,
                                    },
                                  });
                                }}
                              >
                                Read More
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mt: 2 }}
                      >
                        No articles found for this category
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} lg={3}>
                  {/* adding dynamic ads */}
                  {landingGoogleAdsHomeList.filter(
                    (ad) => ad?.adsPosition === "Square"
                  )?.[0]?.isCustomAds ? (
                    <Box
                      sx={{
                        backgroundColor: "#e0e0e0",
                        width: "100%",
                        height: { xs: "300px", sm: "400px" },
                        display: { xs: "flex", sm: "none", lg: "flex" },
                        justifyContent: "center",
                        alignItems: "center",
                        position: "sticky",
                        top: "20px",
                      }}
                    >
                      {home2HorizontalImages.length > 0 ? (
                        <a
                          href={
                            home2HorizontalImages[currentHome2ImageIndex].adUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                          }}
                        >
                          <img
                            src={
                              home2HorizontalImages[currentHome2ImageIndex]
                                .imageUrl
                            }
                            alt={`Advertisement ${currentHome2ImageIndex + 1}`}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </a>
                      ) : (
                        <AdsRenderer
                          ads={landingGoogleAdsHomeList}
                          position="Square"
                        />
                      )}
                    </Box>
                  ) : (
                    <AdsRenderer
                      ads={landingGoogleAdsHomeList}
                      position="Square"
                    />
                  )}
                  {/*
                   */}
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                {landingEasySearchList?.slice(3, 8).map((raw, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      onClick={() => {
                        localStorage.setItem("postId", raw?.id);
                        navigate(`/News/${raw.permalink}`, {
                          state: {
                            selectedCategory: raw?.Categories?.[0]?.id,
                            scrollToPost: true,
                          },
                        });
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "none",
                        gap: 1,
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={raw.SEOImageUrl}
                        alt="Image"
                        sx={{
                          borderRadius: 0,
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "9px",
                              color: "black",
                              fontFamily: "DM Sans, sans-serif",
                            }}
                          >
                            {raw.metaTitle}
                          </Typography>
                          <IconButton
                            sx={{
                              color: "#804000",
                              borderRadius: "50%",
                              border: "2px solid #804000",
                              padding: "2px",
                              gap: 2,
                            }}
                            onClick={() => {
                              localStorage.setItem("postId", raw?.id);
                              navigate(`/News/${raw.permalink}`, {
                                state: {
                                  selectedCategory: raw?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Stack>
      )}
      {/* <div
        style={{
          width: "100%",
          height: "auto",
          margin: "20px 0",
          textAlign: "center",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
          data-ad-client="ca-pub-9632557061063857"
          data-ad-slot="9406755763"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div> */}
      {/* adding dynamic ads */}
      {/* ads */}
      {/* {isAdVisible ? ( */}
      <Stack
        sx={{
          alignItems: "center",
          width: "100%",
          padding: { xs: "5px", sm: "10px 0" },
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        </Container>
      </Stack>
      {/* ) : null} */}
      {/* more post */}
      {loadingMoreSection ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "450px" }}
        />
      ) : (
        <Stack
          sx={{
            // marginTop: "10px",
            backgroundColor: "#FCF8E7",
            alignItems: "center",
            width: "100%",
            padding: { xs: "5px", sm: "10px 0" },
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  marginBottom: "20px",
                  display: "inline-block",
                  paddingLeft: { xs: 0, sm: 2 },
                  paddingRight: { xs: 0, sm: 3 },
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#895129",
                    padding: "5px",
                    fontWeight: 300,
                  }}
                >
                  MORE
                </span>
                <span style={{ color: "black", marginLeft: "5px" }}>POSTS</span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  width: "100%",
                  overflow: "hidden",
                  paddingLeft: { xs: 0, sm: 2 },
                  paddingRight: { xs: 0, sm: 3 },
                  "@media (min-width: 600px)": {
                    gap: 3,
                  },
                }}
              >
                {landingcategoryNameList
                  ?.slice(0, 10)
                  .map((category, index) => (
                    <Button
                      key={category.id || index}
                      variant="outlined"
                      onClick={() => {
                        setLoadingEasySearchMorePo(true);
                        dispatch(
                          getLandingMorePoList(category.id || "ALL")
                        ).finally(() => setLoadingEasySearchMorePo(false));
                        handleHeadingMoreClick(category);
                      }}
                      sx={{
                        backgroundColor:
                          clickedHeadingsMore === category
                            ? "#b5651d"
                            : "white",
                        color:
                          clickedHeadingsMore === category ? "white" : "#333",
                        fontWeight: 500,
                        textTransform: "none",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        borderColor: "#895129",
                        "&:hover": {
                          backgroundColor:
                            clickedHeadingsMore === category
                              ? "#b5651d"
                              : "#f0f0f0",
                          color:
                            clickedHeadingsMore === category ? "white" : "#333",
                          borderColor:
                            clickedHeadingsMore === category
                              ? "#b5651d"
                              : "#ddd",
                        },
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
              </Box>
              {loadingMorePo ? (
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress sx={{ color: "#895129" }} />
                </Box>
              ) : landingMorePoList?.length > 0 ? (
                <Box
                  sx={{
                    padding: "0 18px",
                    paddingLeft: { xs: 0, sm: 2 },
                    paddingRight: { xs: 0, sm: 3 },
                  }}
                >
                  <Grid container spacing={1}>
                    {landingMorePoList?.slice(0, 6).map((item, index) => (
                      <>
                        {" "}
                        <Grid item xs={12} sm={6} lg={4} key={item.id}>
                          <Box
                            key={index}
                            onClick={() => {
                              localStorage.setItem("postId", item?.id);
                              navigate(`/News/${item?.permalink}`, {
                                state: {
                                  selectedCategory: item?.Categories?.[0]?.id,
                                  scrollToPost: true,
                                },
                              });
                            }}
                            sx={{
                              padding: { xs: 1, sm: 2 },
                              display: "flex",
                              flexDirection: "column",
                              position: "relative",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              textAlign: "left",
                              cursor: "pointer",
                              height: "100%",
                              minHeight: { xs: "60px", sm: "100px" },
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: "10px", sm: "14px" },

                                color: "black",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              {item.metaTitle || ""}
                            </Typography>
                            <Box
                              component="span"
                              sx={{
                                color: "#895129",
                                cursor: "pointer",
                                textDecoration: "underline",
                                marginTop: "5px",
                                fontSize: { xs: "8px", sm: "10px" },
                                fontWeight: "bold",
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
                              Read More
                            </Box>
                          </Box>
                        </Grid>
                        {(index + 1) % 3 === 0 && (
                          <Grid item xs={12}>
                            <AdsRenderer
                              ads={landingGoogleAdsHomeList}
                              position="Article"
                            />
                          </Grid>
                        )}
                      </>
                    ))}
                  </Grid>
                  <AdsRenderer
                    ads={landingGoogleAdsHomeList}
                    position="Article"
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  No more posts available
                </Box>
              )}
            </Box>
          </Container>
        </Stack>
      )}
      {/* ads */}
      {isAdVisible ? (
        landingGoogleAdsHomeList?.find(
          (ad) => ad?.adsPosition === "Full Body Width"
        )?.isCustomAds ? (
          <Stack
            sx={{
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <Container maxWidth="xl" sx={{ mt: 0, padding: 0 }}>
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                  },
                  height: {
                    xs: "100px",
                    sm: "200px",
                  },

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {home4HorizontalImages.length > 0 ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <a
                      href={
                        home4HorizontalImages[currentHome4ImageIndex]?.adUrl ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          home4HorizontalImages[currentHome4ImageIndex]
                            ?.imageUrl
                        }
                        alt="Advertisement"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </a>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <AdsRenderer
                      ads={landingGoogleAdsHomeList}
                      position="Full Body Width"
                    />
                  </Box>
                )}
              </Box>
            </Container>
          </Stack>
        ) : (
          <AdsRenderer
            ads={landingGoogleAdsHomeList}
            position="Full Body Width"
          />
        )
      ) : null}
      {/* scroll to top */}
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 0.5 : 1,
        }}
      >
        <Fab
          size="small"
          color="warning"
          aria-label="scroll to top"
          onClick={() => navigate("/", { state: { scrollToTop: true } })}
          sx={{
            bgcolor: "rgba(137, 81, 41, 0.8)",
            "&:hover, &:active": {
              bgcolor: "rgba(110, 63, 30, 0.7)",
            },
          }}
        >
          <ArrowUpwardIcon fontSize={isMobile ? "small" : "medium"} />
        </Fab>
      </Box>
    </>
  );
};

export default memo(Home);
