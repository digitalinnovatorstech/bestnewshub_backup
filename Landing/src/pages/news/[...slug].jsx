import { useRouter } from "next/router";
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
import React, { memo, useEffect, useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import whatsappIcon from "@/assets/shareicons/whatsapp.png";
import instagramIcon from "@/assets/shareicons/instagram.png";
import facebookIcon from "@/assets/shareicons/facebook.png";
import emailIcon from "@/assets/shareicons/gmail.png";
import XIcon from "@/assets/shareicons/twitter.png";
import Teams from "@/assets/shareicons/business.png";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import chromeIcon from "@/assets/shareicons/chrome.png";
import snapchatIcon from "@/assets/shareicons/snapchat.png";
import telegramIcon from "@/assets/shareicons/telegram.png";
import CloseIcon from "@mui/icons-material/Close";
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
} from "@/services/slices/landingSlice";
import { formatNameLowerUpper, timeAgo } from "@/utility/helpers/globalHelpers";
import AdsRenderer from "@/components/AdsRenderer";
import DynamicSEO from "@/components/SEO/DynamicSEO";
import Image from "next/image";
import DOMPurify from "dompurify";
import SigninPage from "@/pages/signin/index";

const NewsSlugPage = ({ metaInfo }) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  const { slug } = router.query;
  const permalink = Array.isArray(slug) ? slug.join("/") : slug || "";
  const [loadingView, setLoadingView] = useState(true);
  const [loadingShortView, setLoadingShortView] = useState(true);
  const [loadingMorePo, setLoadingEasySearchMorePo] = useState(true);
  const [loadingRecentSection, setLoadingRecentSection] = useState(true);

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [validUser, setValidUser] = useState(null);
  const [id, setId] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginUserDetails = localStorage.getItem("loginUser");
      if (loginUserDetails) {
        try {
          const data = JSON.parse(loginUserDetails);
          setValidUser(data);
          setId(data?.userData?.id || null);
        } catch (error) {
          // //console.error("Error parsing loginUser from localStorage", error);
        }
      }
    }
  }, []);

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

  const landingcategoryNameList = useSelector(
    (state) => state.landing.landingcategoryNameList
  );
  const landingMorePoList = useSelector(
    (state) => state.landing.landingMorePoList
  );
  const landingHeroSection = useSelector(
    (state) => state.landing.landingHeroSection
  );

  useEffect(() => {
    setLoadingView(true);
    console.log("loadingView", loadingView);
    if (permalink) {
      dispatch(
        getLandingPostDetailsByParmalink({ links: permalink, id: id || null })
      )
        .finally(() => {
          setLoadingView(false);
        })
        .catch((err) => {
          setLoadingView(false);
        });
    }
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
    // dispatch(getLandingMorePoList("ALL"));
    setLoadingEasySearchMorePo(true);
    dispatch(getLandingMorePoList("ALL")).finally(() => {
      setLoadingEasySearchMorePo(false);
    });

    setLoadingRecentSection(true);
    dispatch(getLandingHeroSection()).finally(() => {
      setLoadingRecentSection(false);
    });
    dispatch(getLandingArticleAdsList());
  }, [dispatch, catId]);

  //share pop up
  const handleOpenShare = (item) => {
    setOpen(true);
    setLink(`${window.location.origin}/news/${item.permalink}`);
  };
  const handlePrint = () => {
    setOpen(false);

    setTimeout(() => {
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
      document.body.style.display = "block";

      // Ensure each element breaks properly
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        el.style.pageBreakInside = "auto";
        el.style.breakInside = "auto";
      });

      // Print the document
      window.print();

      // Reset styles after printing
      setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.body.style.display = "";
        elements.forEach((el) => {
          el.style.pageBreakInside = "";
          el.style.breakInside = "";
        });
      }, 500);
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
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
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

  // more sectio
  const [clickedHeadingsMore, setClickedHeadingsMore] = useState(false);
  const handleHeadingMoreClick = (category) => {
    setClickedHeadingsMore(clickedHeadingsMore === category ? true : category);
  };

  // save post
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
  const landingGoogleAdsArticleList = useSelector(
    (state) => state.landing.landingGoogleAdsArticleList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsArticleList());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    if (!category) return;
    localStorage.setItem("categoryId", category.categoryId);
    localStorage.setItem("categoryName", category.name);
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

  // for content
  const contentHtml = landingPostDetailsByParmalinks?.content || "";

  const getContentWithAds = (htmlContent, interval = 4) => {
    if (!htmlContent) return null;

    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    const paragraphs = sanitizedHtml
      .split(/<\/p>\s*/)
      .filter((p) => p.trim() !== "");

    const processedContent = [];
    paragraphs.forEach((para, index) => {
      processedContent.push(`${para}</p>`);
      if ((index + 1) % interval === 0) {
        processedContent.push(
          <AdsRenderer
            ads={landingGoogleAdsArticleList}
            position="In Article"
          />
        );
      }
    });
    return processedContent;
  };

  const contentWithAds = getContentWithAds(contentHtml, 4);

  const handleTagClick = (tag) => {
    if (!tag) return;
    const url = `/news/tag/${tag?.toLowerCase()}`;
    router.push(url).then(() => {
      window.location.href = url;
    });
  };
  return (
    <Container maxWidth="xl" sx={{ mt: 1, px: { xs: 2, sm: 2 } }}>
      <ToastContainer />
      {metaInfo && <DynamicSEO metaInfo={metaInfo} />}
      <Grid container spacing={2}>
        <Grid item md={2} sx={{ display: { xs: "none", md: "block" } }}>
          <AdsRenderer
            ads={landingGoogleAdsArticleList}
            position="Extra Vertical"
          />
        </Grid>
        <Grid item xs={12} md={7}>
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
                formatNameLowerUpper(
                  landingPostDetailsByParmalinks?.Categories?.[0]?.name
                ) || "No Category"
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
                    handleOpenShare(landingPostDetailsByParmalinks)
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
                    ></Typography>
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
                      <Image src={Teams} alt="Teams" width={30} height={30} />
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
                      <Image src={XIcon} alt="Xicon" width={30} height={30} />
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
                      // boxShadow: 24,
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
                      <IconButton onClick={() => setOpen(false)}>
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
                            "&:hover": { backgroundColor: "#e0e0e0" },
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

                      {/* Print Button */}
                      <IconButton
                        onClick={handlePrint}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          p: 1,
                          "&:hover": { backgroundColor: "#e0e0e0" },
                        }}
                      >
                        <LocalPrintshopIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Modal>
              )}
            </Box>
            {landingGoogleAdsArticleList && (
              <AdsRenderer
                ads={landingGoogleAdsArticleList}
                position="In Article"
              />
            )}
            <Card sx={{ mt: 2, boxShadow: "none" }}>
              {loadingView ? (
                <Skeleton variant="rectangular" height={500} />
              ) : (
                <CardMedia
                  component="img"
                  height="500"
                  image={landingPostDetailsByParmalinks?.squareImageUrl}
                  alt="Post Image"
                  sx={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                />
              )}
            </Card>
            <Typography
              variant="body1"
              component="div"
              sx={{
                mt: "10px",
                fontSize: { xs: "12px", md: "13px", sm: "14px" },
                lineHeight: "1.5",
              }}
            >
              {contentWithAds ? (
                <div style={{ textAlign: "justify" }}>
                  {contentWithAds.map((item, idx) =>
                    typeof item === "string" ? (
                      <div
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ) : (
                      <React.Fragment key={idx}>{item}</React.Fragment>
                    )
                  )}
                </div>
              ) : (
                loadingView && (
                  <Skeleton variant="text" width="90%" height={50} />
                )
              )}
            </Typography>

            {/* tags */}
            {landingPostDetailsByParmalinks?.metaTags?.split(",")?.length >
              0 && (
              <Box sx={{ mt: 2 }}>
                {landingPostDetailsByParmalinks?.metaTags
                  ?.split(",")
                  ?.map((tag, index) => (
                    <Chip
                      onClick={() => {
                        handleTagClick(tag);
                      }}
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
          </Box>
        </Grid>
        <Grid item xs={12} md={3} mt={1}>
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

            <Box sx={{ display: { xs: "block", md: "none", lg: "block" } }}>
              <AdsRenderer
                ads={landingGoogleAdsArticleList}
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
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
        {/* <Grid item md={2} sx={{ display: { xs: "none", md: "block" } }}>
          <AdsRenderer
            ads={landingGoogleAdsArticleList}
            position="Extra Vertical"
          />
        </Grid> */}
      </Grid>

      <AdsRenderer
        ads={landingGoogleAdsArticleList}
        position="Full Body Width"
      />

      {/* more post */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FCF8E7",
          // py: 2,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 0 } }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <span
                style={{
                  backgroundColor: "#804000",
                  color: "white",
                  padding: "0 4px",
                }}
              >
                MORE
              </span>
              <span style={{ color: "black", marginLeft: "5px" }}>POSTS</span>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {loadingView ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                {Array.from(new Array(6)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: 100, height: 40 }}
                  />
                ))}
              </Box>
            ) : (
              landingcategoryNameList?.slice(0, 8).map((category, index) => (
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
                      clickedHeadingsMore === category ? "#b5651d" : "white",
                    color: clickedHeadingsMore === category ? "white" : "#333",
                    fontWeight: 500,
                    textTransform: "none",
                    flex: "0 0 auto",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    padding: "6px 12px",
                    fontSize: { xs: "10px", sm: "14px" },
                    borderColor: "#895129",
                    "&:hover": {
                      backgroundColor:
                        clickedHeadingsMore === category
                          ? "#b5651d"
                          : "#f0f0f0",
                      color:
                        clickedHeadingsMore === category ? "white" : "#333",
                      borderColor: "#b5651d",
                    },
                  }}
                >
                  {category.name}
                </Button>
              ))
            )}
          </Box>

          {loadingMorePo ? (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <CircularProgress sx={{ color: "#895129" }} />
            </Box>
          ) : landingMorePoList?.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 3 }}>
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
                      const postId = item?.id;
                      const permalink = item?.permalink;
                      const categoryId =
                        item?.Categories?.[0]?._parentCategories ||
                        item?.Categories?.[0]?.id;
                      handleClick(postId, permalink, categoryId);
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
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 1,
                        lineClamp: 1,
                        "&:hover": {
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {item.metaTitle || ""}
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
                        handleHeadingMoreClick(index);
                      }}
                    >
                      {item.metaDescription || ""}
                    </Typography>
                    <Typography
                      variant="h6"
                      onClick={() => {
                        handleHeadingMoreClick(index);
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
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              No more posts available
            </Box>
          )}
        </Container>
      </Box>

      {/* <Box
        sx={{
          top: "90%",
          width: "100%",
          backgroundColor: "#FCF8E7",
          padding: 0,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 0 } }}>
          <Box sx={{ py: 0 }}>
            <Box>
              <Typography
                variant="h7"
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
                  <Box>
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
                            marginRight: 1,
                            marginTop: 1,
                            // borderRadius: "20px",
                            fontSize: { xs: "10px", sm: "14px" },
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
                  </Box>
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
                          const postId = item?.id;
                          const permalink = item?.permalink;
                          const categoryId =
                            item?.Categories?.[0]?._parentCategories ||
                            item?.Categories?.[0]?.id;
                          handleClick(postId, permalink, categoryId);
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
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 1,
                            lineClamp: 1,
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {item.metaTitle || ""}
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
                            handleHeadingMoreClick(index);
                          }}
                        >
                          {item.metaDescription || ""}
                        </Typography>
                        <Typography
                          variant="h6"
                          onClick={() => {
                            handleHeadingMoreClick(index);
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
      </Box> */}

      <AdsRenderer
        ads={landingGoogleAdsArticleList}
        position="Full Body Width"
      />
      {/* ) : null} */}
    </Container>
  );
};

export async function getServerSideProps(context) {
  try {
    const { slug } = context.params || {};
    const permalink = Array.isArray(slug) ? slug.join("/") : slug || "";
    const userId = context.query.userId || null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing/posts/seo/getByPermalink?permalink=${permalink}&userId=${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();

    if (!data?.data?.post) {
      return { notFound: true };
    }

    let metaInfo = {
      metaTitle: data.data.post.metaTitle,
      metaDescription: data.data.post.metaDescription,
      SEOImageUrl: data.data.post.SEOImageUrl,
      metaTags: data.data.post.metaTags,
    };

    return {
      props: {
        metaInfo: metaInfo || {},
      },
    };
  } catch (error) {
    return {
      // redirect: {
      //   destination: "/404",
      //   permanent: false,
      // },
      notFound: true,
    };
  }
}

export default NewsSlugPage;
