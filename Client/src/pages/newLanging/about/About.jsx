import { Box, Typography, Container, Button, Skeleton } from "@mui/material";
// import Mainimg from "../../../assets/aboutus/mainimg.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLandingPageDetailsByParmalinks } from "../../../services/slices/landingSlice";
import DynamicSEO from "../../../components/SEO/DynamicSEO";

// const heading1 = {
//   title: "Best News Hub is a place",
// };

// const heading2 = {
//   title: "Your Daily Dose of Trusted News Updates",
// };

// const description = {
//   content: ` The Best News Hub connects you to the pulse of the world, delivering real-time updates and insightful reporting. From global updates to local happenings, we’re your ultimate destination for authentic news.`,
// };
const About = () => {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const pathname = location.pathname;
  const permalink = pathname.replace("/page/", "");
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loadingView, setLoadingView] = useState(false);
  const landingPageDetailsByParmalinks = useSelector(
    (state) => state.landing.landingPageDetailsByParmalinks
  );
  useEffect(() => {
    setLoadingView(true);
    dispatch(getLandingPageDetailsByParmalinks(permalink)).finally(() =>
      setLoadingView(false)
    );
  }, [dispatch]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        mt: "3%",
      }}
    >
      <DynamicSEO
        SEOTitle={landingPageDetailsByParmalinks.metaTitle}
        SEODescription={landingPageDetailsByParmalinks.metaDescription}
        SEOKeywords={landingPageDetailsByParmalinks.metaTags}
      />
      <Box sx={{ mt: "3%", position: "relative", zIndex: 2 }}>
        {loadingView ? (
          <Skeleton variant="rectangular" width={900} height={500} />
        ) : (
          <img
            // src={Mainimg}
            src={landingPageDetailsByParmalinks?.SEOImageUrl}
            alt="mainimage"
            style={{
              // width: "100%",
              // height: "auto",
              width: "900px",
              heigth: "900px",
              borderRadius: "0",
            }}
          />
        )}

        {/* <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{
            backgroundColor: "#895129",
            color: "#FFFFFF",
            position: "absolute",
            top: { lg: "70%", xs: "60%", sm: "60%" },
            left: "50%",
            borderRadius: "15px",
            padding: { lg: "6px", xs: "1px", sm: "1px" },
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: { xs: "auto", sm: "auto", lg: "auto" },
            fontSize: { xs: "10px", sm: "15px" },
          }}
        >
          {loadingView ? <Skeleton width={150} /> : heading1?.title}
        </Typography>

        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{
            mt: "20px",
            color: "#FFFFFF",
            position: "absolute",
            top: { lg: "80%", xs: "70%", sm: "80%" },
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: { xs: "auto", sm: "auto", lg: "auto" },
          }}
        >
          {loadingView ? <Skeleton width={200} /> : heading2?.title}
        </Typography> */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#895129",
            color: "#FFFFFF",
            position: "absolute",
            top: 1,
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: { xs: "6px 12px", sm: "8px 16px" },
            "&:hover": {
              backgroundColor: "#895129",
            },
          }}
        >
          About Us
        </Button>
      </Box>
      {landingPageDetailsByParmalinks?.content ? (
        <Typography
          sx={{
            textAlign: "left",
            fontWeight: 400,
            mt: { xs: "12px", sm: "20px" },
            fontSize: { xs: "14px", sm: "16px" },
            width: "90%",
          }}
          dangerouslySetInnerHTML={{
            __html: landingPageDetailsByParmalinks?.content,
          }}
        />
      ) : (
        loadingView && <Skeleton variant="text" width="90%" height={50} />
      )}
    </Container>
  );
};

export default About;
