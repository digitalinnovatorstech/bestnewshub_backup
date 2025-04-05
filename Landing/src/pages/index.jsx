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
  useTheme,
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
import slide1 from "../assets/slide1.png";
// import slide1 from "@/assets/sli";

import slide2 from "../assets/slide2.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ShareIcon from "@mui/icons-material/Share";
import whatsappIcon from "../assets/shareicons/whatsapp.png";
import instagramIcon from "../assets/shareicons/instagram.png";
import facebookIcon from "../assets/shareicons/facebook.png";
import emailIcon from "../assets/shareicons/gmail.png";
import XIcon from "../assets/shareicons/twitter.png";
import Teams from "../assets/shareicons/business.png";
import chromeIcon from "../assets/shareicons/chrome.png";
import snapchatIcon from "../assets/shareicons/snapchat.png";
import telegramIcon from "../assets/shareicons/telegram.png";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingHeroSection,
  getLandingEasySearchList,
  // getLandingFeaturedList,
  // getLandingInternationaList,
  // getLandingNationaList,
  // getLandingShortList,
  getLandingcategoryNameList,
  getLandingMorePoList,
  getLandingHomeAdsList,
  getLandingGoogleAdsHomeList,
  getHomeMetaInfo,
  getCategoryHome,
  getByCategoryHome,
} from "../services/slices/landingSlice";
// import { useTheme } from "@emotion/react";
import AdsRenderer from "../components/AdsRenderer";
import DynamicSEO from "../components/SEO/DynamicSEO";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

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

const Home = ({ homeMetaInfo }) => {
  const theme = useTheme();
  // const isMobiles = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // const navigate = useNavigate();
  const router = useRouter();
  const pathname = router.pathname;
  const location = router.query;
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
  // const landingInternationList = useSelector(
  //   (state) => state.landing.landingInternationList
  // );
  // const landingntionalList = useSelector(
  //   (state) => state.landing.landingntionalList
  // );
  // const landingShortList = useSelector(
  //   (state) => state.landing.landingShortList
  // );
  // const landingFeaturedList = useSelector(
  //   (state) => state.landing.landingFeaturedList
  // );
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

  const landingCategoryHome = useSelector(
    (state) => state.landing.landingCategoryHome
  );
  const internationalNews = useSelector(
    (state) => state.landing.internationalNews
  );

  const nationalNews = useSelector((state) => state.landing.nationalNews);
  const featuredNews = useSelector((state) => state.landing.featuredNews);
  const sortNews = useSelector((state) => state.landing.sortNews);

  useEffect(() => {
    if (landingCategoryHome) {
      setLoadingNationSection(true);
      dispatch(
        getByCategoryHome({
          id: landingCategoryHome?.find((item) => item.index === 0)?.id,
          limit: 3,
        })
      ).finally(() => {
        setLoadingNationSection(false);
      }); // Fetch international news
      dispatch(
        getByCategoryHome({
          id: landingCategoryHome?.find((item) => item.index === 1)?.id,
          limit: 3,
        })
      ).finally(() => {
        setLoadingNationSection(false);
      }); // Fetch national news
      setLoadingFeaturedSection(true);
      dispatch(
        getByCategoryHome({
          id: landingCategoryHome?.find((item) => item.index === 2)?.id,
          limit: 10,
        })
      ).finally(() => {
        setLoadingFeaturedSection(false);
      }); // Fetch featured news
      setLoadingShortSection(true);
      dispatch(
        getByCategoryHome({
          id: landingCategoryHome?.find((item) => item.index === 3)?.id,
          limit: 10,
        })
      ).finally(() => {
        setLoadingShortSection(false);
      }); // Fetch sort news
    }
  }, [landingCategoryHome, dispatch]);

  useEffect(() => {
    dispatch(getLandingcategoryNameList());
    setLoadingHeroSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingHeroSection(false);
    });
    dispatch(getHomeMetaInfo());
    // setLoadingNationSection(true);
    // dispatch(getLandingInternationaList()).finally(() => {
    //   setLoadingNationSection(false);
    // });
    // dispatch(getLandingNationaList()).finally(() => {
    //   setLoadingNationSection(false);
    // });

    // setLoadingFeaturedSection(true);
    // dispatch(getLandingFeaturedList()).finally(() => {
    //   setLoadingFeaturedSection(false);
    // });

    // setLoadingShortSection(true);
    // dispatch(getLandingShortList()).finally(() => {
    //   setLoadingShortSection(false);
    // });

    setLoadingEasySection(true);
    dispatch(getLandingEasySearchList("ALL")).finally(() => {
      setLoadingEasySection(false);
    });

    setLoadingMoreSection(true);
    dispatch(getLandingMorePoList("ALL")).finally(() => {
      setLoadingMoreSection(false);
    });

    dispatch(getLandingHomeAdsList());
    dispatch(getCategoryHome());
    // dispatch(getByCategoryHome({ id: 1, limit: 2 }));
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

  // easy search
  const scrollRef = useRef(null);

  // Function to handle scrolling
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  //share pop up
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  // const [, setHomeMetaInfo] = useState([]);

  const handleOpenShare = (item) => {
    setOpen(true);
    // setLink(`${import.meta.env.VITE_URL}/News/${permalink}`);
    setLink(`${window.location.origin}/news/${item.permalink}`);
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
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      // Use modern Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied!");
      } else {
        // Fallback method for older browsers / HTTP sites
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed"; // Avoid scrolling to textarea
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied!");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(err.message);
    }
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

  const handleClick = (postId, permalink, category) => {
    localStorage.setItem("postId", postId);
    const url = `/news/${permalink}`;
    window.location.href = url;
  };

  return (
    <>
      <ToastContainer />
      {homeMetaInfo[0] && <DynamicSEO metaInfo={homeMetaInfo[0]} />}
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
                    const postId = landingHeroSection[0]?.id;
                    const permalink = landingHeroSection[0]?.permalink;
                    const categoryId =
                      landingHeroSection[0]?.Categories?.[0]
                        ?._parentCategories ||
                      landingHeroSection[0]?.Categories?.[0]?.id;
                    handleClick(postId, permalink, categoryId);
                  }}
                >
                  <Box
                    component="img"
                    src={landingHeroSection[0]?.squareImageUrl}
                    alt={landingHeroSection[0]?.title}
                    onClick={() => {
                      const postId = landingHeroSection[0]?.id;
                      const permalink = landingHeroSection[0]?.permalink;
                      const categoryId =
                        landingHeroSection[0]?.Categories?.[0]
                          ?._parentCategories ||
                        landingHeroSection[0]?.Categories?.[0]?.id;
                      handleClick(postId, permalink, categoryId);
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
                    mb: { xs: 3, sm: 3, md: 3, lg: 1 },
                    left: "10px",
                    color: "#fff",
                    maxWidth: "90%",
                    transform: { md: "translateY(0)", lg: "translateY(0)" },
                    fontSize: { xs: "16px", sm: "22px", lg: "30px" },
                    transition: "transform 0.3s ease-in-out",
                    zIndex: 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 2,
                    lineClamp: 2,
                  }}
                  onClick={() => {
                    const postId = landingHeroSection[0]?.id;
                    const permalink = landingHeroSection[0]?.permalink;
                    const categoryId =
                      landingHeroSection[0]?.Categories?.[0]
                        ?._parentCategories ||
                      landingHeroSection[0]?.Categories?.[0]?.id;
                    handleClick(postId, permalink, categoryId);
                  }}
                >
                  {landingHeroSection[0]?.metaTitle
                    ?.split(" ")
                    ?.slice(0, 10)
                    ?.join(" ") +
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
                    <>
                      <Typography
                        variant="body2"
                        onClick={() => {
                          const postId = landingHeroSection[0]?.id;
                          const permalink = landingHeroSection[0]?.permalink;
                          const categoryId =
                            landingHeroSection[0]?.Categories?.[0]
                              ?._parentCategories ||
                            landingHeroSection[0]?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
                        }}
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          WebkitLineClamp: 2,
                          lineClamp: 2,
                        }}
                      >
                        {/* {landingHeroSection[0]?.metaDescription
                        ?.split(" ")
                        ?.slice(0, 20)
                        ?.join(" ") +
                        (landingHeroSection[0]?.metaDescription?.split(" ")
                          .length > 20
                          ? "..."
                            : "")} */}
                        {landingHeroSection[0]?.metaDescription}
                      </Typography>
                    </>
                  )}
                  <Typography
                    component="span"
                    sx={{
                      cursor: "pointer",
                      fontSize: { xs: "6px", sm: "8px", md: "10px" }, // Responsive font size
                      color: "#fff",
                      textDecoration: "underline",
                      "&:hover": { textDecoration: "underline" }, // Handle hover effect
                    }}
                    onClick={() => {
                      const postId = landingHeroSection[0]?.id;
                      const permalink = landingHeroSection[0]?.permalink;
                      const categoryId =
                        landingHeroSection[0]?.Categories?.[0]
                          ?._parentCategories ||
                        landingHeroSection[0]?.Categories?.[0]?.id;
                      handleClick(postId, permalink, categoryId);
                    }}
                  >
                    Read More
                  </Typography>
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
                    md: "translateY(-300%)",
                    lg: "translateY(-130%)",
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
                      const postId = landingHeroSection[1]?.id;
                      const permalink = landingHeroSection[1]?.permalink;
                      const categoryId =
                        landingHeroSection[1]?.Categories?.[0]
                          ?._parentCategories ||
                        landingHeroSection[1]?.Categories?.[0]?.id;
                      handleClick(postId, permalink, categoryId);
                    }}
                  >
                    <Box
                      component="img"
                      src={landingHeroSection[1]?.SEOImageUrl}
                      alt={landingHeroSection[1]?.title}
                      onClick={() => {
                        const postId = landingHeroSection[1]?.id;
                        const permalink = landingHeroSection[1]?.permalink;
                        const categoryId =
                          landingHeroSection[1]?.Categories?.[0]
                            ?._parentCategories ||
                          landingHeroSection[1]?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
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
                      bottom: { xs: "1px", sm: "50px", md: "0px", lg: "10px" },
                      mb: { xs: 3, sm: 3, md: 0, lg: 2 },
                      left: "10px",
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "18px", lg: "20px" },
                      transform: "translateY(0)",
                      transition: "transform 0.3s ease-in-out",
                      zIndex: 2,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                      lineClamp: 1,
                    }}
                  >
                    {/* {landingHeroSection[1]?.metaTitle
                      ?.split(" ")
                      ?.slice(0, 8)
                      ?.join(" ") +
                      (landingHeroSection[1]?.metaTitle?.split(" ").length > 8
                        ? "..."
                        : "")} */}
                    {landingHeroSection[1]?.metaTitle}
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
                      <>
                        <Typography
                          variant="body2"
                          onClick={() => {
                            const postId = landingHeroSection[1]?.id;
                            const permalink = landingHeroSection[1]?.permalink;
                            const categoryId =
                              landingHeroSection[1]?.Categories?.[0]
                                ?._parentCategories ||
                              landingHeroSection[1]?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            lineClamp: 2,
                          }}
                        >
                          {/* {landingHeroSection[1]?.metaDescription
                          ?.split(" ")
                          ?.slice(0, 20)
                          ?.join(" ") +
                          (landingHeroSection[1]?.metaDescription?.split(" ")
                            .length > 20
                            ? "..."
                            : "")} */}
                          {landingHeroSection[1]?.metaDescription}
                          {/* <span
                            style={{ cursor: "pointer" }}
                            onMouseOver={(e) =>
                              (e.target.style.textDecoration = "underline")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.textDecoration = "none")
                            }
                          >
                            Read More
                          </span> */}
                        </Typography>
                      </>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        cursor: "pointer",
                        fontSize: { xs: "6px", sm: "8px", md: "10px" },
                        color: "#fff",
                        textDecoration: "underline",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => {
                        const postId = landingHeroSection[1]?.id;
                        const permalink = landingHeroSection[1]?.permalink;
                        const categoryId =
                          landingHeroSection[1]?.Categories?.[0]
                            ?._parentCategories ||
                          landingHeroSection[1]?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
                      }}
                    >
                      Read More
                    </Typography>
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
                  key={item.id || index}
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
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
                        }}
                      >
                        <Box
                          component="img"
                          src={item?.squareImageUrl}
                          alt={item?.title}
                          onClick={() => {
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
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
                          // mb: { xs: 0, lg: 3 },
                          position: "absolute",
                          bottom: {
                            xs: "1px",
                            sm: "50px",
                            md: "50px",
                            lg: "30px",
                          },
                          mb: { xs: 3, sm: 3, lg: 5 },
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
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          WebkitLineClamp: 2,
                          lineClamp: 2,
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
                        {item?.metaTitle}
                        {/* {item?.metaTitle?.split(" ").length > 8
                          ? item?.metaTitle?.split(" ").slice(0, 8).join(" ") +
                            "..."
                          : item?.metaTitle} */}
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
                          <>
                            <Typography
                              variant="body2"
                              onClick={() => {
                                const postId = item?.id;
                                const permalink = item?.permalink;
                                const categoryId =
                                  item?.Categories?.[0]?._parentCategories ||
                                  item?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: 2,
                                lineClamp: 2,
                              }}
                            >
                              {item?.metaDescription}
                              {/* {item?.metaDescription
                                ?.split(" ")
                                .slice(0, 8)
                                .join(" ") +
                                (item?.metaDescription?.split(" ").length > 8
                                  ? "..."
                                  : "")} */}
                            </Typography>
                          </>
                        )}
                        <Typography
                          component="span"
                          sx={{
                            cursor: "pointer",
                            fontSize: { xs: "6px", sm: "8px", md: "10px" },
                            color: "#fff",
                            textDecoration: "underline",
                            "&:hover": { textDecoration: "underline" },
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
                        </Typography>
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
          width: "100%",
        }}
      >
        <Container
          sx={{
            mt: 0,
            borderRadius: 0,
            maxWidth: "100% !important",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "row" },
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} sm={6} lg={5}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "white",
                  height: { xs: "250px", md: "300px", lg: "510px" },
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
                        const postId = landingHeroSection?.[4]?.id;
                        const permalink = landingHeroSection?.[4]?.permalink;
                        const categoryId =
                          landingHeroSection?.[4]?.Categories?.[0]
                            ?._parentCategories ||
                          landingHeroSection?.[4]?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
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
                        mb: 2,
                        left: "10px",
                        color: "#fff",
                        maxWidth: "95%",
                        transform: "translateY(0)",
                        fontSize: { xs: "16px", lg: "30px" },
                        transition: "transform 0.3s ease-in-out",
                        zIndex: 2,
                      }}
                      onClick={() => {
                        const postId = landingHeroSection?.[4]?.id;
                        const permalink = landingHeroSection?.[4]?.permalink;
                        const categoryId =
                          landingHeroSection?.[4]?.Categories?.[0]
                            ?._parentCategories ||
                          landingHeroSection?.[4]?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
                      }}
                    >
                      {landingHeroSection[4]?.metaTitle}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        cursor: "pointer",
                        fontSize: { xs: "6px", sm: "8px", md: "10px" },
                        color: "#fff",
                        textDecoration: "underline",
                        "&:hover": { textDecoration: "underline" },
                        zIndex: 3,
                        bottom: "5px",
                        left: "10px",
                      }}
                      onClick={() => {
                        const postId = landingHeroSection?.[4]?.id;
                        const permalink = landingHeroSection?.[4]?.permalink;
                        const categoryId =
                          landingHeroSection?.[4]?.Categories?.[0]
                            ?._parentCategories ||
                          landingHeroSection?.[4]?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
                      }}
                    >
                      Read More
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
                    "@media (min-width:899px) and (max-width:1199px)": {
                      maxHeight: "300px",
                      overflow: "hidden",
                    },
                  }}
                >
                  {landingHeroSection
                    ?.slice(5, isTablet ? 8 : 10)
                    .map((article, index) => (
                      <Box
                        key={article.id || index}
                        sx={{
                          mb: 2,
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: "40%", md: "85px", lg: "170px" },
                            height: { xs: "100%", md: "85px", lg: "100%" },
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
                              const postId = article?.id;
                              const permalink = article?.permalink;
                              const categoryId =
                                article?.Categories?.[0]?._parentCategories ||
                                article?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
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
                              const postId = article?.id;
                              const permalink = article?.permalink;
                              const categoryId =
                                article?.Categories?.[0]?._parentCategories ||
                                article?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                            sx={{
                              mt: 1,
                              fontSize: { xs: "12px", lg: "16px" },
                              fontWeight: "bold",
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
                                const postId = article?.id;
                                const permalink = article?.permalink;
                                const categoryId =
                                  article?.Categories?.[0]?._parentCategories ||
                                  article?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              style={{
                                fontSize: "10px",
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
              {landingGoogleAdsHomeList.filter(
                (ad) => ad?.adsPosition?.toUpperCase() === "Multi Block"
              )?.[0]?.isCustomAds ? (
                home1VerticalImages.length > 0 && (
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

      {/* for tab only */}
      {isTablet && (
        <Stack sx={{ padding: "0px 12px" }}>
          <Container sx={{ mt: 0, px: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ display: "flex" }}>
              {landingHeroSection?.slice(8, 10).map((article, index) => (
                <Box
                  key={article.id || index}
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "40%", md: "80px", lg: "170px" },
                      // height: "100px",
                      height: { xs: "100%", md: "80px", lg: "100%" },
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
                        const postId = article?.id;
                        const permalink = article?.permalink;
                        const categoryId =
                          article?.Categories?.[0]?._parentCategories ||
                          article?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
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
                        const postId = article?.id;
                        const permalink = article?.permalink;
                        const categoryId =
                          article?.Categories?.[0]?._parentCategories ||
                          article?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
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
                          const postId = article?.id;
                          const permalink = article?.permalink;
                          const categoryId =
                            article?.Categories?.[0]?._parentCategories ||
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
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Stack>
      )}

      {/* ads */}
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
                  <Box
                    key={slide.id || index}
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
                        const postId = slide?.id;
                        const permalink = slide?.permalink;
                        const categoryId =
                          slide?.Categories?.[0]?._parentCategories ||
                          slide?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
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
                          // mb: 1,
                          fontSize: { sm: "14px", xs: "9px" },
                        }}
                        onClick={() => {
                          const postId = slide?.id;
                          const permalink = slide?.permalink;
                          const categoryId =
                            slide?.Categories?.[0]?._parentCategories ||
                            slide?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
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
                          fontSize: { xs: "6px", sm: "8px", md: "10px" },
                          color: "#fff",
                          cursor: "pointer",
                          textDecoration: "underline",
                          mt: "auto",
                        }}
                        onClick={() => {
                          const postId = slide?.id;
                          const permalink = slide?.permalink;
                          const categoryId =
                            slide?.Categories?.[0]?._parentCategories ||
                            slide?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
                        }}
                      >
                        Read More
                      </Typography>
                    </Box>
                  </Box>
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

      {/* Nation */}
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
              px: { xs: "2px", sm: "10px" },
            }}
          >
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: { xs: "column", sm: "row", lg: "row" },
                justifyContent: "space-between",
                gap: { xs: "10px", lg: "16px" },
                width: "100%",
              }}
            >
              {[internationalNews, nationalNews].map((list, idx) => (
                <Box
                  key={list.id || idx}
                  sx={{
                    width: { xs: "100%", lg: "48%" },
                  }}
                >
                  <Typography
                    variant="h7"
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
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        let category =
                          idx === 0
                            ? landingCategoryHome?.find(
                                (item) => item.index === 0
                              )?.slug
                            : landingCategoryHome?.find(
                                (item) => item.index === 1
                              )?.slug;

                        const url = `/news/category/${category?.toLowerCase()}`;
                        window.location.href = url;
                      }}
                    >
                      {idx === 0
                        ? `${
                            landingCategoryHome?.find(
                              (item) => item.index === 0
                            )?.name
                          }`
                        : `${
                            landingCategoryHome?.find(
                              (item) => item.index === 1
                            )?.name
                          }`}
                    </span>{" "}
                    <span style={{ color: "#000000" }}>NEWS</span>
                  </Typography>
                  <Box>
                    {list.slice(0, 3).map((item, index) => (
                      <Card
                        key={item.id || index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          marginBottom: "8px",
                          boxShadow: "none",
                          backgroundColor: "#f9f5eb",
                          // alignItems: "center",
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
                            width: { xs: "150px", sm: "150px", lg: "180px" },
                            height: { xs: "125px", sm: "125px", lg: "127px" },
                            objectFit: "cover",
                            // borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          image={item.squareImageUrl}
                          alt={item.title}
                        />
                        <CardContent
                          sx={{
                            paddingLeft: "10px",
                            // padding: "0px",
                            paddingRight: "0px",
                            paddingButtom: "0px",
                            paddingTop: "0px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{
                              fontWeight: "bold",
                              // marginTop: "5px",
                              fontSize: { xs: "12px", sm: "14px" },
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              lineClamp: 1,
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
                            {item.metaTitle}
                            {/* {isMobile ? (
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
                            )} */}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              marginTop: "5px",
                              fontSize: { xs: "10px", sm: "12px" },
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 4,
                              lineClamp: 4,
                              cursor: "pointer",
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
                            {item?.metaDescription}
                            {/* {!isMobile
                              ? item?.metaDescription?.split(" ").length > 25
                                ? item?.metaDescription
                                    ?.split(" ")
                                    .slice(0, 25)
                                    .join(" ") + "..."
                                : item?.metaDescription
                              : item?.metaDescription?.split(" ").length > 15
                              ? item?.metaDescription
                                  ?.split(" ")
                                  .slice(0, 15)
                                  .join(" ") + "..."
                              : item?.metaDescription} */}

                            {/* <span
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
                            </span> */}

                            {/* {isMobile ? (
                              <span>
                                {item?.metaDescription?.split(" ").length > 20
                                  ? item?.metaDescription
                                      ?.split(" ")
                                      .slice(0, 5)
                                      .join(" ") + "..."
                                  : item?.metaDescription}
                              </span>
                            ) : (
                              <span>{item.metaDescription}</span>
                            )} */}
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

      {/* feature */}
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
                variant="h7"
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
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const category = landingCategoryHome?.find(
                      (item) => item.index === 2
                    )?.slug;
                    const url = `/news/category/${category?.toLowerCase()}`;
                    window.location.href = url;
                  }}
                >
                  {/* FEATURED */}
                  {landingCategoryHome?.find((item) => item.index === 2)?.name}
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
                  {featuredNews?.map((item, index) => (
                    <Box
                      key={item.id || index}
                      sx={{
                        px: { xs: 0.5 },
                        mb: 2,
                        width: isMobile ? "100%" : isTablet ? "48%" : "20%",
                        display: "flex",
                        justifyContent: "center",
                        p: 0,
                        boxShadow: "0px",
                      }}
                    >
                      <Card
                        sx={{
                          maxWidth: "350px",
                          mx: "auto",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          width: "250px",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200px"
                          image={item?.verticalImageUrl}
                          alt="Post Thumbnail"
                          onClick={() => {
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                          sx={{
                            objectFit: "cover",
                            height: "200px",
                            cursor: "pointer",
                            padding: "0px",
                          }}
                        />
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "space-between",
                            flexGrow: 1,
                            p: 0.5,
                          }}
                        >
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
                              mt: 0,
                              fontSize: { xs: "11px", sm: "13px" },
                              fontWeight: "bold",
                              fontFamily: "DM Sans, sans-serif",
                              cursor: "pointer",

                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                            }}
                          >
                            {/* {item?.metaTitle?.split(" ").length > 8
                              ? item?.metaTitle
                                  ?.split(" ")
                                  .slice(0, 8)
                                  .join(" ") + "..."
                              : item?.metaTitle} */}
                            {item?.metaTitle}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="body2"
                              onClick={() => {
                                const postId = item?.id;
                                const permalink = item?.permalink;
                                const categoryId =
                                  item?.Categories?.[0]?._parentCategories ||
                                  item?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              // sx={{
                              //   mt: 0,
                              //   color: "gray",
                              //   width: "250px",
                              //   fontFamily: "DM Sans, sans-serif",
                              //   fontSize: { xs: "9px", sm: "12px" },
                              //   textDecoration: "none",
                              //   cursor: "pointer",
                              //   "&:hover": {
                              //     textDecoration: "underline",
                              //   },
                              // }}
                              sx={{
                                mt: 0,
                                color: "gray",
                                // width: "250px",
                                fontFamily: "DM Sans, sans-serif",
                                fontSize: { xs: "9px", sm: "12px" },
                                textDecoration: "none",
                                cursor: "pointer",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 4, // Limits text to 2 lines
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {item?.metaDescription}
                              {/* {item?.metaDescription?.split(" ").length > 15
                              ? item?.metaDescription
                                  ?.split(" ")
                                  .slice(0, 15)
                                  .join(" ") + "..."
                              : item?.metaDescription} */}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: "flex",
                            px: 1,
                            pb: 0.5,
                            pt: 0,
                            gap: 0,
                            justifyContent: "space-between",
                          }}
                        >
                          <IconButton
                            onClick={() => handleOpenShare(item)}
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
                                height: "420px",
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
                              <Box
                                sx={{
                                  bgcolor: "#f2f2f2",
                                  padding: 2,
                                  borderRadius: 2,
                                  mb: 1,
                                  mt: -1,
                                }}
                              >
                                {/* <Typography
                                  variant="h6"
                                  textAlign="center"
                                  gutterBottom
                                  sx={{ fontSize: { xs: "12px", sm: "16px" } }}
                                >
                                  The Impact of Travel around the World : How
                                  Travel is Changing your Mindset
                                </Typography> */}
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  <Image
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
                                  maxWidth: 500,
                                  width: "90%",
                                  p: 3,
                                  borderRadius: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="h6" fontWeight="bold">
                                    Share this page
                                  </Typography>
                                  <IconButton
                                    onClick={() => setOpen(false)}
                                    color="error"
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Box>
                                <Grid container spacing={1} alignItems="center">
                                  <Grid item xs={9}>
                                    <TextField
                                      value={link}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      InputProps={{ readOnly: true }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <IconButton
                                      onClick={handleCopy}
                                      sx={{ borderRadius: 1 }}
                                    >
                                      <ContentCopyOutlinedIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fit, minmax(50px, 1fr))",
                                    gap: 2,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    p: 2,
                                    backgroundColor: "#f7f7f7",
                                    borderRadius: 2,
                                  }}
                                >
                                  {[
                                    { src: whatsappIcon, alt: "WhatsApp" },
                                    { src: instagramIcon, alt: "Instagram" },
                                    { src: Teams, alt: "Teams" },
                                    { src: facebookIcon, alt: "Facebook" },
                                    { src: XIcon, alt: "X" },
                                    { src: emailIcon, alt: "Email" },
                                    { src: chromeIcon, alt: "Chrome" },
                                    { src: snapchatIcon, alt: "Snapchat" },
                                    { src: telegramIcon, alt: "Telegram" },
                                  ].map((icon, index) => (
                                    <IconButton
                                      key={index}
                                      onClick={() => handleShare(icon.alt)}
                                      sx={{
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        p: 1,
                                        "&:hover": {
                                          backgroundColor: "#e0e0e0",
                                        },
                                      }}
                                    >
                                      <Image
                                        src={icon.src}
                                        alt={icon.alt}
                                        width={30}
                                        height={30}
                                      />
                                    </IconButton>
                                  ))}
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
                              // justifyContent: "flex-end",
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
                              const postId = item?.id;
                              const permalink = item?.permalink;
                              const categoryId =
                                item?.Categories?.[0]?._parentCategories ||
                                item?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                          >
                            Read More
                          </Button>
                        </CardActions>
                      </Card>
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
                variant="h7"
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
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const category = landingCategoryHome?.find(
                      (item) => item.index === 3
                    )?.slug;
                    const url = `/news/category/${category?.toLowerCase()}`;
                    window.location.href = url;
                  }}
                >
                  {/* SHORT */}
                  {landingCategoryHome?.find((item) => item.index === 3)?.name}
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
                  {sortNews?.map((article, index) => (
                    <React.Fragment key={article.id || index}>
                      <Card
                        sx={{
                          minWidth: { xs: "250px", sm: "300px" },
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
                            const postId = article?.id;
                            const permalink = article?.permalink;
                            const categoryId =
                              article?.Categories?.[0]?._parentCategories ||
                              article?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        />
                        <IconButton
                          onClick={() => handleOpenShare(article)}
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
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="white"
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {article?.metaTitle}
                              {/* {article?.metaTitle?.split(" ").length > 10
                              ? article?.metaTitle
                                  ?.split(" ")
                                  .slice(0, 10)
                                  .join(" ") + "..."
                              : article?.metaTitle} */}
                              {/* <span
                              onClick={() => {
                                const postId = article?.id;
                                const permalink = article?.permalink;
                                const categoryId =
                                  article?.Categories?.[0]?._parentCategories ||
                                  article?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              style={{
                                marginLeft: "10px",
                                color: "white",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Read More
                            </span> */}
                            </Typography>
                            <Box
                              component="span"
                              onClick={() => {
                                const postId = article?.id;
                                const permalink = article?.permalink;
                                const categoryId =
                                  article?.Categories?.[0]?._parentCategories ||
                                  article?.Categories?.[0]?.id;
                                handleClick(postId, permalink, categoryId);
                              }}
                              sx={{
                                marginTop: "5px",
                                color: "white",
                                cursor: "pointer",
                                textDecoration: "underline",
                                fontSize: "10px",
                                display: "inline-block",
                              }}
                            >
                              Read More
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                      {(index + 1) % 3 === 0 && (
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

      {/* adding dynamic ads */}
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
      {/* {landingGoogleAdsHomeList?.find(
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
      ) : null} */}

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
                variant="h7"
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
              {/* <Box
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
                        display: "flex",
                        // display:
                        //   index < 3 || window.innerWidth >= 600
                        //     ? "flex"
                        //     : "none",
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
              </Box> */}
              <Box sx={{ width: "100%", position: "relative" }}>
                <Box
                  ref={scrollRef}
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 1 },
                    border: "1px solid transparent",
                    mb: 2,
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                    justifyContent: { xs: "flex-start", sm: "left" },
                    overflowX: { xs: "auto", sm: "hidden" },
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
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
                          ).finally(() => setLoadingEasySearch(false));
                        }}
                        sx={{
                          backgroundColor:
                            clickedHeadings === category ? "#895129" : "white",
                          color:
                            clickedHeadings === category ? "white" : "#895129",
                          fontWeight: 500,
                          textTransform: "none",
                          flex: "0 1 auto",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "flex",
                          borderColor: "#895129",
                          minWidth: "120px", // Prevents buttons from being too small
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
                      {landingEasySearchList
                        ?.slice(0, isTablet ? 4 : 3)
                        ?.map((raw, index) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            key={raw.id || index}
                          >
                            <Card
                              sx={{
                                height: { xs: "300px", sm: "340px" },
                                width: "100%",
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 0,
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="200px"
                                image={raw.SEOImageUrl}
                                alt="Post Thumbnail"
                                onClick={() => {
                                  localStorage.setItem("postId", raw?.id);
                                  const postId = raw?.id;
                                  const permalink = raw?.permalink;
                                  const categoryId =
                                    raw?.Categories?.[0]?._parentCategories ||
                                    raw?.Categories?.[0]?.id;
                                  handleClick(postId, permalink, categoryId);
                                }}
                                sx={{
                                  borderRadius: 0,
                                  cursor: "pointer",
                                  objectFit: "cover",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              />
                              <CardContent
                                sx={{
                                  paddingTop: 0,
                                  flexGrow: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  onClick={() => {
                                    const postId = raw?.id;
                                    const permalink = raw?.permalink;
                                    const categoryId =
                                      raw?.Categories?.[0]?._parentCategories ||
                                      raw?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
                                  }}
                                  sx={{
                                    mt: 0,
                                    fontSize: { xs: "11px", sm: "13px" },
                                    fontWeight: "bold",
                                    fontFamily: "DM Sans, sans-serif",
                                    cursor: "pointer",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    WebkitLineClamp: 1,
                                    lineClamp: 1,
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  {raw?.metaTitle}
                                  {/* {raw?.metaTitle?.split(" ").length > 8
                                  ? raw?.metaTitle
                                      ?.split(" ")
                                      .slice(0, 8)
                                      .join(" ") + "..."
                                  : raw?.metaTitle} */}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  onClick={() => {
                                    const postId = raw?.id;
                                    const permalink = raw?.permalink;
                                    const categoryId =
                                      raw?.Categories?.[0]?._parentCategories ||
                                      raw?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
                                  }}
                                  sx={{
                                    mt: 0,
                                    color: "gray",
                                    fontFamily: "DM Sans, sans-serif",
                                    fontSize: { xs: "9px", sm: "12px" },
                                    cursor: "pointer",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    WebkitLineClamp: 3,
                                    lineClamp: 3,
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  {raw?.metaDescription}
                                  {/* {raw?.metaDescription?.split(" ").length > 10
                                  ? raw?.metaDescription
                                      ?.split(" ")
                                      .slice(0, 10)
                                      .join(" ") + "..."
                                  : raw?.metaDescription} */}
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
                                <IconButton
                                  onClick={() => handleOpenShare(raw)}
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
                                    const postId = raw?.id;
                                    const permalink = raw?.permalink;
                                    const categoryId =
                                      raw?.Categories?.[0]?._parentCategories ||
                                      raw?.Categories?.[0]?.id;
                                    handleClick(postId, permalink, categoryId);
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
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                  sx={{
                    display: { xs: "none", sm: "none", lg: "block" },
                  }}
                >
                  {/* adding dynamic ads */}
                  {landingGoogleAdsHomeList.filter(
                    (ad) => ad?.adsPosition === "Square"
                  )?.[0]?.isCustomAds ? (
                    <Box
                      sx={{
                        // backgroundColor: "#e0e0e0",
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
                  <Grid item xs={12} sm={6} md={3} key={raw.id || index}>
                    <Card
                      onClick={() => {
                        const postId = raw?.id;
                        const permalink = raw?.permalink;
                        const categoryId =
                          raw?.Categories?.[0]?._parentCategories ||
                          raw?.Categories?.[0]?.id;
                        handleClick(postId, permalink, categoryId);
                      }}
                      sx={{
                        display: "flex",
                        // alignItems: "center",
                        // justifyContent: "space-between",
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
                          // width: "150px",
                          // height: "100px",
                          width: { xs: "150px", sm: "120px", lg: "150px" },
                          height: { xs: "100px", sm: "80px", lg: "100px" },
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          // alignItems: "center",
                          // justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "9px",
                            color: "black",
                            fontFamily: "DM Sans, sans-serif",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 5,
                            lineClamp: 5,
                          }}
                        >
                          {raw.metaDescription}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            marginTop: "5px",
                            cursor: "pointer",
                            fontSize: { xs: "6px", sm: "8px", md: "10px" },
                            color: "#895129",
                            textDecoration: "underline",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => {
                            const postId = raw?.id;
                            const permalink = raw?.permalink;
                            const categoryId =
                              raw?.Categories?.[0]?._parentCategories ||
                              raw?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                        >
                          Read More
                        </Typography>
                        {/* <IconButton
                            sx={{
                              color: "#804000",
                              borderRadius: "50%",
                              border: "2px solid #804000",
                              padding: "2px",
                              gap: 2,
                            }}
                            onClick={() => {
                              const postId = raw?.id;
                              const permalink = raw?.permalink;
                              const categoryId =
                                raw?.Categories?.[0]?._parentCategories ||
                                raw?.Categories?.[0]?.id;
                              handleClick(postId, permalink, categoryId);
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton> */}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Stack>
      )}

      {/* ads */}
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
                variant="h7"
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
                    gap: 2,
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
                  <Grid container spacing={2} alignItems="stretch">
                    {landingMorePoList?.slice(0, 6).map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={item.id || index}
                        sx={{ display: "flex" }}
                      >
                        <Box
                          onClick={() => {
                            const postId = item?.id;
                            const permalink = item?.permalink;
                            const categoryId =
                              item?.Categories?.[0]?._parentCategories ||
                              item?.Categories?.[0]?.id;
                            handleClick(postId, permalink, categoryId);
                          }}
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            textAlign: "left",
                            cursor: "pointer",
                            height: "100%",
                            flexGrow: 1,
                            minHeight: "150px", // Ensures equal height
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: "12px", sm: "14px", md: "16px" },
                              color: "black",
                              fontFamily: "DM Sans, sans-serif",
                            }}
                          >
                            {item.metaTitle || ""}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "10px", sm: "12px" },
                              color: "black",
                              fontFamily: "DM Sans, sans-serif",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 2,
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
                        </Box>
                      </Grid>
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
          onClick={() => router.push("/", undefined, { scroll: true })}
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

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing/home/getMetaInfo`
    );
    let data = await res.json();
    data = {
      ...data,
    };
    return {
      props: {
        homeMetaInfo: data.data || {},
      },
    };
  } catch (error) {
    return {
      props: {
        homeMetaInfo: {},
      },
    };
  }
}
export default memo(Home);
