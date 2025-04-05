import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingGoogleAdsPageList,
  getLandingPageDetailsByParmalinks,
} from "../../../services/slices/landingSlice";
import {
  Backdrop,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import DynamicSEO from "../../../components/SEO/DynamicSEO";
import AdsRenderer from "../../../components/AdsRenderer";
import { useLocation } from "react-router-dom";

const PagesView = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const permalink = pathname.startsWith("/page/")
    ? pathname.replace("/page/", "")
    : "";
  const [loadingView, setLoadingView] = useState(false);
  const landingPageDetailsByParmalinks = useSelector(
    (state) => state.landing.landingPageDetailsByParmalinks
  );
  const landingGoogleAdsPageList = useSelector(
    (state) => state.landing.landingGoogleAdsPageList
  );

  useEffect(() => {
    setLoadingView(true);
    if (permalink) {
      dispatch(getLandingPageDetailsByParmalinks(permalink)).finally(() =>
        setLoadingView(false)
      );
    }
  }, [permalink, dispatch]);

  useEffect(() => {
    if (landingGoogleAdsPageList?.length === 0) {
      dispatch(getLandingGoogleAdsPageList());
    }
  }, [dispatch, landingGoogleAdsPageList]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "80%",
          minWidth: "300px",
          margin: "auto",
          mt: "2em",
        }}
      >
        {landingPageDetailsByParmalinks?.metaTitle &&
          landingPageDetailsByParmalinks?.metaDescription && (
            <DynamicSEO
              SEOTitle={landingPageDetailsByParmalinks.metaTitle}
              SEODescription={landingPageDetailsByParmalinks.metaDescription}
              SEOKeywords={landingPageDetailsByParmalinks.metaTags}
            />
          )}

        {/* Loading Indicator */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingView}
        >
          <CircularProgress sx={{ color: "#895129" }} />
        </Backdrop>

        {/* Page Title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "20px", sm: "25px" },
            color: "#7B3300",
            fontWeight: 600,
          }}
        >
          {landingPageDetailsByParmalinks?.title || ""}
        </Typography>

        <Box sx={{ borderBottom: "1px solid #000000" }} />

        {/* Page Image */}
        {landingPageDetailsByParmalinks?.SEOImageUrl && (
          <Card sx={{ mt: 2 }}>
            <CardMedia
              component="img"
              height="400"
              image={landingPageDetailsByParmalinks?.SEOImageUrl}
              alt="Post Image"
            />
          </Card>
        )}
        {landingGoogleAdsPageList?.length > 0 && (
          <AdsRenderer ads={landingGoogleAdsPageList} position="Full Width" />
        )}

        {/* Page Content */}
        {landingPageDetailsByParmalinks?.content && (
          <Typography
            variant="body1"
            sx={{
              mt: "10px",
              mb: "10px",
              fontSize: { xs: "12px", sm: "14px" },
              lineHeight: "1.5",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: landingPageDetailsByParmalinks.content,
            }}
          />
        )}

        {/* faq */}
        {landingPageDetailsByParmalinks?.FAQ?.length > 0 && (
          <Box sx={{ mt: "2em" }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "15px", sm: "20px" },
                color: "#7B3300",
                fontWeight: 600,
                borderBottom: "3px solid #7B3300",
              }}
            >
              FAQ
            </Typography>
            <Box sx={{ mt: 2 }}>
              {landingPageDetailsByParmalinks?.FAQ?.map((faq, index) => (
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
    </>
  );
};

export default memo(PagesView);
