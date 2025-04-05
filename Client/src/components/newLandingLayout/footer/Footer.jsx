import { memo, useEffect, useState } from "react";
import { Box, Typography, Grid, Link, Skeleton } from "@mui/material";
import { styled } from "@mui/system";
// import logo from "../../../assets/logo.png";
import * as MuiIcons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingPageList,
  getLandingPopularCategoryList,
  getLandingSocialList,
  setSelectedPageId,
} from "../../../services/slices/landingSlice";
import { getLogoDetails } from "../../../services/slices/globalSlice";

const FooterLink = styled(Link)(() => ({
  color: "inherit",
  textDecoration: "none",
  display: "block",
  marginTop: 8,
}));

const content = {
  text: `The Best News Hub connects you to the pulse of the world, delivering
            real-time updates and insightful reporting. From global updates to
            local happenings, we’re your ultimate destination for authentic
            news.`,
};

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingLogo, setLoadingLogo] = useState(true);
  const landingPopularCategoryList = useSelector(
    (state) => state.landing.landingPopularCategoryList
  );
  const landingSocialList = useSelector(
    (state) => state.landing.landingSocialList
  );
  const landingPageList = useSelector((state) => state.landing.landingPageList);
  const logoDetails = useSelector((state) => state.global.logoDetails);
  useEffect(() => {
    dispatch(getLandingPopularCategoryList());
    dispatch(getLandingSocialList());
    dispatch(getLandingPageList());
    setLoadingLogo(true);
    dispatch(getLogoDetails()).finally(() => {
      setLoadingLogo(false);
    });
  }, [dispatch]);

  // const payload = {
  //   currentPage: 1,
  // };

  // const quick = [
  //   "About Us",
  //   "Contact Us",
  //   // "FAQ",
  //   "Advertise With Us",
  //   // "Career",
  // ];

  // register now check
  // const loginUserDetails = localStorage.getItem("loginUser");
  // const validUser = loginUserDetails ? JSON.parse(loginUserDetails) : null;

  const renderIcon = (iconName) => {
    const IconComponent = MuiIcons[iconName];
    return IconComponent ? <IconComponent fontSize="small" /> : null;
  };
  return (
    <Box
      sx={{
        backgroundColor: "#f8f8f8",
        pb: 1,
        pl: { xs: 1, sm: 3 },
        mt: 2,
        pr: { xs: 1, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {/* <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#000000",
            ml: { lg: "19em", xs: 0 },
            fontSize: { xs: "12px", sm: "16px" },
          }}
        >
          Let Read an Update News on Best News Hub
        </Typography> */}
        {/* {(!validUser || validUser?.userData?.userType === "SUBSCRIBER") && (
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              mt: { xs: 1, sm: 1 },
              backgroundColor: "#F2EBE6",
              padding: { xs: "10px", sm: "15px" },
              borderRadius: "50px",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "11px", sm: "16px" } }}
            >
              Aspiring to be an Author
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#895129",
                height: { lg: "30px", xs: "20px" },
                width: { xs: "90px", sm: "110px" },
                borderRadius: "50px",
                fontSize: { xs: "9px", sm: "12px" },
                "&:hover": {
                  bgcolor: "#8C6339",
                },
              }}
              onClick={() => navigate("/welcomeUser")}
            >
              Register now
            </Button>
          </Box>
        )} */}
      </Box>

      <Grid container spacing={2} sx={{ mt: { xs: 0, sm: 1 } }}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            {loadingLogo ? (
              <Skeleton
                variant="rectangular"
                sx={{
                  width: { xs: "130px", sm: "166px" },
                  height: { xs: "50px", sm: "67px" },
                }}
              />
            ) : (
              <Box
                component="img"
                src={logoDetails}
                alt="BestNewsHub"
                sx={{
                  width: { xs: "130px", sm: "166px" },
                  height: { xs: "50px", sm: "67px" },
                  // mx: "auto",
                  mb: 2,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              />
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                mb: { xs: 0, sm: 2 },
              }}
            >
              {landingSocialList.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  color="#7B3300"
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {renderIcon(item.iconName)}{" "}
                </Link>
              ))}
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#666",
              maxWidth: { xs: "95%" },
              // fontSize: { xs: "12px", sm: "16px" },
              fontSize: {
                xs: "8px",
                sm: "10px",
                md: "12px",
                lg: "13px",
                xl: "14px",
              },
            }}
          >
            {content.text}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            ml: { lg: "7em" },
            textAlign: { xs: "left", sm: "left" },
            maxWidth: { xs: "50%", sm: "250px" },
            display: { xs: "inline-block", sm: "block" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", fontSize: { xs: "14px", sm: "16px" } }}
          >
            Popular Category
          </Typography>
          {landingPopularCategoryList?.slice(0, 7).map((item) => (
            <FooterLink
              key={item.categoryId}
              sx={{ cursor: "pointer", fontSize: { xs: "10px", sm: "12px" } }}
              onClick={() => {
                localStorage.setItem("categoryId", item.categoryId);
                localStorage.setItem("categoryName", item.name);
                navigate(`/News?category=${item.name}&id=${item.categoryId}`, {
                  state: {
                    selectedCategory: item.categoryId,
                    scrollToCategory: true,
                  },
                });
              }}
            >
              {item?.name}
            </FooterLink>
          ))}
        </Grid>

        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            ml: { lg: "7em" },
            maxWidth: { xs: "50%", sm: "250px" },
            display: { xs: "inline-block", sm: "block" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", fontSize: { xs: "14px", sm: "16px" } }}
          >
            Pages
          </Typography>
          {landingPageList?.map((item, index) => (
            <FooterLink
              key={item.id || index}
              sx={{ cursor: "pointer", fontSize: { xs: "10px", sm: "12px" } }}
              onClick={() => {
                dispatch(setSelectedPageId(item.id));
                if (item.pageName?.toLowerCase().includes("contact")) {
                  navigate(
                    `page/${item?.pageName
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-")}`,
                    {
                      state: {
                        scrollToPage: true,
                      },
                    }
                  );
                } else if (item.pageName?.toLowerCase().includes("advertise")) {
                  navigate(
                    `page/${item?.pageName
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-")}`,
                    {
                      state: {
                        scrollToPage: true,
                      },
                    }
                  );
                } else if (item.pageName?.toLowerCase().includes("about")) {
                  navigate(
                    `page/${item?.pageName
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-")}`,
                    {
                      state: {
                        scrollToPage: true,
                      },
                    }
                  );
                } else {
                  navigate(`/page/${item.permalink}`, {
                    state: {
                      scrollToPage: true,
                    },
                  });
                }
              }}
            >
              {item.pageName}
            </FooterLink>
          ))}
        </Grid>
      </Grid>

      <Box
        sx={{
          borderBottom: "1px solid #ccc",
          my: { xs: 1, sm: 2, lg: 1, md: 0 },
        }}
      />

      <Box
        sx={{
          mt: { xs: 1, sm: 0, md: 0, lg: 0 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "gray",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
          &copy; Copyright {new Date().getFullYear()}, All Rights Reserved
        </Typography>
        <Box
          sx={{
            display: "flex",
            mt: { xs: 1, sm: 0, md: 0, lg: 0 },
          }}
        >
          <Typography
            onClick={() => {
              const filteredPage = landingPageList.find((page) =>
                page.pageName.toLowerCase().includes("privacy")
              );

              if (filteredPage) {
                navigate(
                  `page/${filteredPage.permalink
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  {
                    state: {
                      scrollToPage: true,
                    },
                  }
                );
              }
            }}
            sx={{
              cursor: "pointer",
              fontSize: { xs: "12px", sm: "14px" },
              mx: 1,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            onClick={() => {
              const filteredPage = landingPageList.find((page) =>
                page.pageName.toLowerCase().includes("terms")
              );

              if (filteredPage) {
                navigate(
                  `page/${filteredPage.permalink
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  {
                    state: {
                      scrollToPage: true,
                    },
                  }
                );
              }
            }}
            sx={{
              cursor: "pointer",
              fontSize: { xs: "12px", sm: "14px" },
              mx: 1,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Terms & Conditions
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Footer);
