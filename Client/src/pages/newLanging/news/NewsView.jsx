import {
  useMediaQuery,
  IconButton,
  Container,
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardMedia,
  Grid,
  Divider,
  TextField,
  CircularProgress,
  Dialog,
  DialogContent,
  Skeleton,
  ListItemText,
  List,
  ListSubheader,
  Chip,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { memo, useEffect, useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import whatsappIcon from "../../../assets/shareicons/whatsapp.png";
import instagramIcon from "../../../assets/shareicons/instagram.png";
import facebookIcon from "../../../assets/shareicons/facebook.png";
import emailIcon from "../../../assets/shareicons/gmail.png";
import XIcon from "../../../assets/shareicons/twitter.png";
import Teams from "../../../assets/shareicons/business.png";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import chromeIcon from "../../../assets/shareicons/chrome.png";
import snapchatIcon from "../../../assets/shareicons/snapchat.png";
import telegramIcon from "../../../assets/shareicons/telegram.png";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingArticleAdsList,
  getLandingCategoryIdShort,
  getLandingcategoryNameList,
  getLandingGoogleAdsArticleList,
  getLandingHeroSection,
  getLandingMorePoList,
  getLandingPopularCategoryList,
  getLandingPostDetailsByParmalink,
  landingRemoveSaveItemList,
  landingSaveItem,
} from "../../../services/slices/landingSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { timeAgo } from "../../../utility/helpers/globalHelpers";
import AdsRenderer from "../../../components/AdsRenderer";
import DynamicSEO from "../../../components/SEO/DynamicSEO";

const NewsView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const pathname = location.pathname;
  const permalink = pathname.replace("/News/", "");
  const loginUserDetails = localStorage.getItem("loginUser");
  const dataKey = JSON.parse(loginUserDetails);
  const id = dataKey?.userData?.id;
  const [loadingView, setLoadingView] = useState(false);
  const [loadingShortView, setLoadingShortView] = useState(false);
  const [loadingMorePo, setLoadingEasySearchMorePo] = useState(false);
  const [loadingRecentSection, setLoadingRecentSection] = useState(false);
  // const [position1CurrentImageIndex, setPosition1CurrentImageIndex] = useState(
  //   0
  // );
  // const [position2CurrentImageIndex, setPosition2CurrentImageIndex] = useState(
  //   0
  // );
  // const [position3CurrentImageIndex, setPosition3CurrentImageIndex] = useState(
  //   0
  // );
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");

  const landingPostDetailsByParmalinks = useSelector(
    (state) => state.landing.landingPostDetailsByParmalinks
  );
  const postId = landingPostDetailsByParmalinks?.id;
  const isSavePostByParmalinks = useSelector(
    (state) => state.landing.isSavePostByParmalinks
  );
  const landingPopularCategoryList = useSelector(
    (state) => state.landing.landingPopularCategoryList
  );
  // const landingCategoryIdShort = useSelector(
  //   (state) => state.landing.landingCategoryIdShort
  // );
  const landingcategoryNameList = useSelector(
    (state) => state.landing.landingcategoryNameList
  );
  const landingMorePoList = useSelector(
    (state) => state.landing.landingMorePoList
  );
  const landingHeroSection = useSelector(
    (state) => state.landing.landingHeroSection
  );
  // const landingArticleAdsList = useSelector(
  //   (state) => state.landing.landingArticleAdsList
  // );
  useEffect(() => {
    setLoadingView(true);
    dispatch(
      getLandingPostDetailsByParmalink({ links: permalink, id: id || null })
    ).finally(() => {
      setLoadingView(false);
    });
    dispatch(getLandingPopularCategoryList());
  }, [permalink, id, dispatch]);

  const catId = landingPostDetailsByParmalinks?.Categories?.[0]?.id;
  useEffect(() => {
    if (catId) {
      setLoadingShortView(true);
      dispatch(getLandingCategoryIdShort({ id: catId })).finally(() => {
        setLoadingShortView(false);
      });
    }
    setLoadingView(true);
    dispatch(getLandingcategoryNameList()).finally(() => {
      setLoadingView(false);
    });
    dispatch(getLandingMorePoList("ALL"));
    setLoadingRecentSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingRecentSection(false);
    });
    dispatch(getLandingArticleAdsList());
  }, [dispatch, catId]);

  // for normal ads

  // const position1Images = landingArticleAdsList
  //   .filter((ad) => ad.position === "ARTICLE-1")
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

  // const position2Images = landingArticleAdsList
  //   .filter((ad) => ad.position === "ARTICLE-2")
  //   .map((ad) => ({
  //     imageUrl: ad.horizontalImageUrl,
  //     adUrl: ad.advertisementUrl,
  //   }))
  //   .filter((url) => url);
  // useEffect(() => {
  //   if (position2Images.length > 1) {
  //     const interval = setInterval(() => {
  //       setPosition2CurrentImageIndex(
  //         (prevIndex) => (prevIndex + 1) % position2Images.length
  //       );
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // }, [position2Images]);

  // const position3Images = landingArticleAdsList
  //   .filter((ad) => ad.position === "ARTICLE-3")
  //   .map((ad) => ({
  //     imageUrl: ad.horizontalImageUrl,
  //     adUrl: ad.advertisementUrl,
  //   }))
  //   .filter((url) => url);
  // useEffect(() => {
  //   if (position3Images.length > 1) {
  //     const interval = setInterval(() => {
  //       setPosition3CurrentImageIndex(
  //         (prevIndex) => (prevIndex + 1) % position3Images.length
  //       );
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // }, [position3Images]);

  // for comment

  // const [formValues, setFormValues] = useState({
  //   description: "",
  //   _post: postId,
  // });
  // useEffect(() => {
  //   if (postId) {
  //     setFormValues((prev) => ({ ...prev, _post: postId }));
  //   }
  // }, [postId]);
  // const [loading, setLoading] = useState(false);

  // const handleComment = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     await dispatch(addComment(formValues)).unwrap();
  //     await dispatch(
  //       getLandingPostDetailsByParmalink({ links: permalink, id: id || null })
  //     ).unwrap();
  //     setFormValues({ description: "", _post: postId });
  //   } catch (error) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  //share pop up
  const handleOpenShare = (permalink) => {
    setOpen(true);
    setLink(`${window.location.origin}/News/${permalink}`);
  };
  const handlePrint = () => {
    setOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

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
        console.error("Invalid platform");
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

  // more sectio
  const [clickedHeadingsMore, setClickedHeadingsMore] = useState(false);
  const handleHeadingMoreClick = (category) => {
    setClickedHeadingsMore(clickedHeadingsMore === category ? true : category);
  };

  // save post
  const validUser = loginUserDetails ? JSON.parse(loginUserDetails) : null;
  const [openDialogCheck, setOpenDialogCheck] = useState(false);
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const handlesaveIconClick = () => {
    if (!validUser) {
      setOpenDialogCheck(true);
    } else {
      setOpenDialogSave(true);
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      await dispatch(landingSaveItem({ postId: postId })).unwrap();
      await dispatch(
        getLandingPostDetailsByParmalink({ links: permalink, id: id || null })
      ).unwrap();
      setOpenDialogSave(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingSave(false);
    }
  };

  const [openDialogUnsave, setOpenDialogUnsave] = useState(false);
  const [loadingUnsave, setLoadingUnsave] = useState(false);
  const handleUnsave = async () => {
    setLoadingUnsave(true);
    try {
      await dispatch(landingRemoveSaveItemList(postId)).unwrap();
      await dispatch(
        getLandingPostDetailsByParmalink({ links: permalink, id: id || null })
      ).unwrap();
      setOpenDialogUnsave(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUnsave(false);
    }
  };

  // for google ads
  const [isAdVisible, setIsAdVisible] = useState(false);
  const landingGoogleAdsArticleList = useSelector(
    (state) => state.landing.landingGoogleAdsArticleList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsArticleList());
  }, [dispatch]);

  // Check if the ads are actually rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      const adElement = document.querySelector(".google-ad");
      setIsAdVisible(!!adElement);
    }, 1500);

    return () => clearTimeout(timer);
  }, [landingGoogleAdsArticleList]);

  return (
    <Container maxWidth="xl" sx={{ mt: 1, px: { xs: 2, sm: 4 } }}>
      <ToastContainer />
      {landingPostDetailsByParmalinks && (
        <DynamicSEO
          SEOTitle={landingPostDetailsByParmalinks?.metaTitle}
          SEODescription={landingPostDetailsByParmalinks?.metaDescription}
          SEOKeywords={landingPostDetailsByParmalinks?.metaTags}
          SEOImage={landingPostDetailsByParmalinks?.SEOImageUrl}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4, mt: "1em" }}>
            <Typography
              variant="contained"
              sx={{
                backgroundColor: "#E5B80B3D",
                borderRadius: "2px",
                gap: "10px",
                color: "#895129",
                mb: "20px",
                fontSize: { xs: "8px", lg: "10px" },
                fontWeight: 600,
                padding: "3px",
              }}
            >
              {loadingView ? (
                <Skeleton width={100} />
              ) : (
                landingPostDetailsByParmalinks?.Categories?.[0]?.name ||
                "No Category"
              )}
            </Typography>

            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mt: "10px",
                fontSize: { xs: "12px", lg: "20px" },
              }}
            >
              {loadingView ? (
                <Skeleton width={150} heigth={100} />
              ) : (
                (landingPostDetailsByParmalinks?.title || "")
                  .charAt(0)
                  .toUpperCase() +
                (landingPostDetailsByParmalinks?.title || "").slice(1)
              )}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 0,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "10px", sm: "0.5rem" } }}
                >
                  {loadingView ? (
                    <Skeleton width={150} />
                  ) : (
                    timeAgo(landingPostDetailsByParmalinks?.createdAt) || ""
                  )}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  color="#895129"
                  sx={{
                    boxShadow: "0px 0px 0px rgba(0, 0, 0)",
                  }}
                  onClick={() =>
                    handleOpenShare(landingPostDetailsByParmalinks?.permalink)
                  }
                >
                  {
                    <ShareIcon
                      sx={{
                        color: "#895129",
                        fontSize: { xs: "12px", lg: "16px" },
                      }}
                    />
                  }
                </IconButton>
                {isSavePostByParmalinks === true ? (
                  <>
                    <IconButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#895129",
                        "&:hover": {
                          backgroundColor: "#895129",
                        },
                        ml: "8px",
                      }}
                      onClick={() => setOpenDialogUnsave(true)}
                    >
                      <BookmarkBorderIcon
                        sx={{
                          color: "white",
                          fontSize: { xs: "12px", lg: "16px" },
                        }}
                      />
                    </IconButton>
                    <Dialog
                      open={openDialogUnsave}
                      onClose={() => setOpenDialogUnsave(false)}
                    >
                      <DialogContent sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Confirm
                        </Typography>
                        <Typography sx={{}}>
                          Are you sure you want to unsave this post? .
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            onClick={() => setOpenDialogUnsave(false)}
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
                            onClick={handleUnsave}
                            variant="contained"
                            sx={{
                              bgcolor: "#895129",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#895129",
                              },
                            }}
                            disabled={loadingUnsave}
                          >
                            {loadingUnsave ? (
                              <CircularProgress
                                size={24}
                                sx={{ color: "#895129" }}
                              />
                            ) : (
                              "Unsave"
                            )}
                          </Button>
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <IconButton
                    variant="contained"
                    sx={{
                      ml: "8px",
                    }}
                    onClick={handlesaveIconClick}
                  >
                    <BookmarkBorderIcon
                      sx={{
                        color: "#895129",
                        fontSize: { xs: "12px", lg: "16px" },
                      }}
                    />
                  </IconButton>
                )}
                {/* for login check */}
                <Dialog
                  open={openDialogCheck}
                  onClose={() => setOpenDialogCheck(false)}
                >
                  <DialogContent>
                    <Typography sx={{ fontWeight: "bold" }}>Login</Typography>
                    <p>Please login to continue.</p>
                    <Box>
                      <Button
                        onClick={() => setOpenDialogCheck(false)}
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
                        // onClick={() => window.open("/signin", "_blank")}
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
                {/* for save */}
                <Dialog
                  open={openDialogSave}
                  onClose={() => setOpenDialogSave(false)}
                >
                  <DialogContent sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>Confirm</Typography>
                    <Typography sx={{}}>
                      Are you sure you want to save this post?.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Button
                        onClick={() => setOpenDialogSave(false)}
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
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                          bgcolor: "#895129",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#895129",
                          },
                        }}
                        disabled={loadingSave}
                      >
                        {loadingSave ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#895129" }}
                          />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </Box>
                  </DialogContent>
                </Dialog>
              </Box>
            </Box>
            <Box>
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
                      mb: 1,
                      mt: -1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      textAlign="center"
                      gutterBottom
                      sx={{ fontSize: { xs: "12px", sm: "16px" } }}
                    >
                      The Impact of Travel around the World : How Travel is
                      Changing your Mindset
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#f2f2f2",
                      padding: 3,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      height: "285px",
                      flexWrap: "wrap",
                      alignItems: "left",
                      gap: { xs: 3, sm: 3 },
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
                      <img src={Teams} alt="Teams" width={30} height={30} />
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
                      <img src={XIcon} alt="Xicon" width={30} height={30} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleShare("Email")}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <img src={emailIcon} alt="Email" width={30} height={30} />
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
                    <IconButton
                      onClick={handlePrint}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <LocalPrintshopIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Box>
                </Box>
              )}
              {!isMobile && (
                <Modal open={open} onClose={() => setOpen(false)}>
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
                    <Typography variant="h6" component="h2" gutterBottom>
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
                        <img src={Teams} alt="Teams" width={30} height={30} />
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
                        <img src={XIcon} alt="Xicon" width={30} height={30} />
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

                      <IconButton
                        onClick={handlePrint}
                        sx={{
                          borderRadius: "0",
                        }}
                      >
                        <LocalPrintshopIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Modal>
              )}
            </Box>
            {/* adding dynamic ads */}
            {/* {isAdVisible ? */}
            {landingGoogleAdsArticleList && (
              <AdsRenderer
                ads={landingGoogleAdsArticleList}
                position="In Article"
              />
            )}
            {/* : null} */}

            <Card sx={{ mt: 2, boxShadow: "none" }}>
              {loadingView ? (
                <Skeleton variant="rectangular" height={500} />
              ) : (
                <CardMedia
                  component="img"
                  height="500"
                  image={landingPostDetailsByParmalinks?.squareImageUrl}
                  alt="Post Image"
                />
              )}
            </Card>
            {landingPostDetailsByParmalinks?.content ? (
              <Typography
                variant="body1"
                sx={{
                  mt: "10px",
                  // mb: "10px",
                  fontSize: { xs: "12px", md: "13px", sm: "14px" },
                  lineHeight: "1.5",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: landingPostDetailsByParmalinks?.content,
                  }}
                  style={{ textAlign: "justify" }}
                />
              </Typography>
            ) : (
              loadingView && <Skeleton variant="text" width="90%" height={50} />
            )}

            {/* tags */}
            {landingPostDetailsByParmalinks?.metaTags?.split(",")?.length >
              0 && (
              <Box sx={{ mt: 2 }}>
                {landingPostDetailsByParmalinks?.metaTags
                  ?.split(",")
                  ?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      sx={{
                        mr: 1,
                        mt: 1,
                        fontSize: { xs: "13px", md: "12px", sm: "14px" },
                        fontWeight: "bold",
                        border: "1px solid #895129",
                        color: "#895129",
                      }}
                    />
                  ))}
              </Box>
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

            {/* faq */}
            {landingPostDetailsByParmalinks?.FAQ?.length > 0 && (
              <Box sx={{ mt: "2em" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "15px", sm: "20px" },
                    color: "#895129",
                    fontWeight: 600,
                    borderBottom: "3px solid #895129",
                  }}
                >
                  FAQ
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {landingPostDetailsByParmalinks?.FAQ?.map((faq, index) => (
                    <Box key={index} sx={{ borderBottom: "1px solid #ccc" }}>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: { xs: "12px", md: "16px", sm: "18px" },
                          fontWeight: "bold",
                        }}
                      >
                        Q {index + 1}. {faq.question}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", md: "14px", sm: "15px" },
                          mt: 1,
                        }}
                      >
                        <strong>Ans.</strong> {faq.answer}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* <Box
              sx={{
                mt: 0,
                p: 0,
                border: "1px solid #ddd",
                backgroundColor: "#f7f7f7",
                borderRadius: 2,
                textAlign: "center",
                boxShadow: 2,
                width: {
                  xs: "100%",
                  sm: "100%",
                },
                height: "130px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {position3Images.length > 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <a
                    href={position3Images[position3CurrentImageIndex].adUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <img
                      src={position3Images[position3CurrentImageIndex].imageUrl}
                      alt={`Advertisement ${position3CurrentImageIndex + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </a>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      position: "relative",
                      zIndex: 2,
                      fontSize: { xs: "12px", md: "14px", sm: "16px" },
                    }}
                  >
                    Advertisement
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      position: "relative",
                      zIndex: 2,
                      fontSize: { xs: "12px", md: "14px", sm: "16px" },
                    }}
                  >
                    728x100
                  </Typography>
                </>
              )}
            </Box> */}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} mt={2}>
          {/* ads */}
          {/* {isAdVisible ? ( */}
          <AdsRenderer ads={landingGoogleAdsArticleList} position="Square" />
          {/* ) : null} */}

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
                      localStorage.setItem("categoryId", category.categoryId);
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
                    <ListItemText primary={category.name} sx={{ flex: 1 }} />
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

          {/* ads */}
          {/* {isAdVisible ? ( */}
          <AdsRenderer ads={landingGoogleAdsArticleList} position="Square" />
          {/* ) : null} */}

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
              <Box sx={{ margin: "auto", padding: 1 }}>
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
                      {/* {item?.metaTitle?.split(" ").length > 5
                        ? item?.metaTitle?.split(" ").slice(0, 5).join(" ") +
                          "..."
                        : item?.metaTitle} */}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          <Divider
            sx={{ marginBottom: "10px", mt: { lg: "1em", xs: "1em", sm: 0 } }}
          />
          {/* <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "10px",
              fontSize: { xs: "12px", sm: "16px" },
            }}
          >
            Short News
          </Typography>
          <Divider
            sx={{ marginBottom: "10px", mt: { lg: "1em", xs: "1em", sm: "0" } }}
          />
          {loadingShortView ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ width: "100%", height: "400px" }}
            />
          ) : (
            <Box
              sx={{
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {landingCategoryIdShort.length > 0 ? (
                <Card sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="400px"
                    image={landingCategoryIdShort[currentIndex]?.SEOImageUrl}
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
                      // onClick={() => {
                      //   localStorage.setItem(
                      //     "postId",
                      //     landingCategoryIdShort[currentIndex]?.id
                      //   );
                      //   // navigate(
                      //   //   `/News/${landingCategoryIdShort[currentIndex]?.permalink}`, {
                      //   //     state: { scrollToPost: true },
                      //   //   }
                      //   // );
                      //   window.open(
                      //     `/News/${landingCategoryIdShort[currentIndex]?.permalink}`,
                      //     "_blank"
                      //   );
                      // }}

                      onClick={() => {
                        localStorage.setItem(
                          "postId",
                          landingCategoryIdShort[currentIndex]?.id
                        );
                        navigate(
                          `/News/${landingCategoryIdShort[currentIndex]?.permalink}`,
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
                  <Typography sx={{ fontSize: { xs: "12px", sm: "16px" } }}>
                    No Short News Avaliable
                  </Typography>
                </Box>
              )}
            </Box>
          )} */}

          {/* adding dynamic ads */}
          {/* {isAdVisible ? ( */}
          <AdsRenderer
            ads={landingGoogleAdsArticleList}
            position="Extra Vertical"
          />
          {/* ) : null} */}
        </Grid>
      </Grid>

      {/* ads */}
      {/* {isAdVisible ? ( */}
      <AdsRenderer
        ads={landingGoogleAdsArticleList}
        position="Full Body Width"
      />
      {/* ) : null} */}

      <Box
        sx={{
          borderBottom: "1px solid #949494",
          mb: "1em",
          mt: "1em",
          width: "100%",
        }}
      ></Box>

      <Box
        sx={{
          top: "90%",
          width: "100%",
          backgroundColor: "#FCF8E7",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3.7 } }}>
          <Box sx={{ py: 0 }}>
            <Box>
              <Typography
                variant="h5"
                sx={{ mt: 1, fontWeight: "bold", mb: 3 }}
              >
                <span
                  style={{
                    backgroundColor: "#804000",
                    color: "white",
                    padding: "0 2px",
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
                  border: "1px solid transparent",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  width: "100%",
                  fontSize: { xs: "12px", sm: "16px" },
                  // overflow: "hidden",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "@media (min-width: 600px)": {
                    gap: 3,
                    margin: { xs: 0, sm: "0 -30px" },
                  },
                }}
              >
                {loadingView ? (
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
                    {landingcategoryNameList
                      ?.slice(0, 8)
                      .map((category, index) => (
                        <Button
                          key={category.id || index}
                          variant="outlined"
                          onClick={() => {
                            setLoadingEasySearchMorePo(true);
                            dispatch(
                              getLandingMorePoList(category.id || "ALL")
                            ).finally(() => {
                              setLoadingEasySearchMorePo(false);
                            });
                            handleHeadingMoreClick(category);
                          }}
                          sx={{
                            backgroundColor:
                              clickedHeadingsMore === category
                                ? "#b5651d"
                                : "white",

                            color:
                              clickedHeadingsMore === category
                                ? "white"
                                : "#333",
                            fontWeight: 500,
                            textTransform: "none",
                            // flex: "0 1 auto",
                            flex: "0 0 auto",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            padding: 0.5,
                            borderRadius: "20px",
                            fontSize: { xs: "10px", sm: "14px" },
                            // display:
                            //   index < 2 || window.innerWidth >= 600
                            //     ? "flex"
                            //     : "none",
                            // "@media (max-width: 600px)": {
                            //   flex: "0 1 auto",
                            //   justifyContent: "flex-start",
                            // },
                            borderColor: "#895129",
                            "&:hover": {
                              backgroundColor:
                                clickedHeadingsMore === category
                                  ? "#b5651d"
                                  : "#f0f0f0",
                              color:
                                clickedHeadingsMore === category
                                  ? "white"
                                  : "#333",
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
                  </>
                )}
              </Box>
              {loadingMorePo ? (
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  <CircularProgress sx={{ color: "#895129" }} />
                </Box>
              ) : landingMorePoList?.length > 0 ? (
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                  {landingMorePoList?.slice(0, 6).map((item, index) => (
                    <Grid item xs={12} sm={4} key={item.id || index}>
                      <Box
                        sx={{
                          p: { xs: 1, sm: 2 },
                          fontSize: { xs: "10px", sm: "14px" },
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "transparent",
                          position: "relative",
                          cursor: "pointer",
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "1px",
                            height: "100%",
                            backgroundColor: "#ddd",
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
                        <Typography
                          variant="h6"
                          onClick={() => {
                            handleHeadingMoreClick(index);
                          }}
                          style={{
                            color: "#895129",
                            cursor: "pointer",
                          }}
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "10px", sm: "14px" },
                            color: "black",
                            fontFamily: "DM Sans, sans-serif",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.metaTitle || ""}
                        </Typography>
                        <Typography
                          variant="h6"
                          onClick={() => handleHeadingMoreClick(index)}
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
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  No more posts available
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      {/* adding dynamic ads */}
      {/* ads */}
      {/* {isAdVisible ? ( */}
      <AdsRenderer
        ads={landingGoogleAdsArticleList}
        position="Full Body Width"
      />
      {/* ) : null} */}
    </Container>
  );
};

export default memo(NewsView);
