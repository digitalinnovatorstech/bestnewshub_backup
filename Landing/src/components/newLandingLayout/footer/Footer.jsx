import { memo, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  Skeleton,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import * as MuiIcons from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingGoogleAdsHomeList,
  getLandingPageList,
  getLandingPopularCategoryList,
  getLandingSocialList,
  setSelectedPageId,
} from "../../../services/slices/landingSlice";
import { getLogoDetails } from "../../../services/slices/globalSlice";
import AdsRenderer from "@/components/AdsRenderer";

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
  const router = useRouter();
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

  const renderIcon = (iconName) => {
    const IconComponent = MuiIcons[iconName];
    return IconComponent ? <IconComponent fontSize="small" /> : null;
  };
  // const handleClick = (item) => {
  //   const pageName = item?.pageName?.toLowerCase()?.replace(/\s+/g, "-");
  //   router.push({
  //     pathname: `/pages/${pageName}`,
  //     query: { scrollToPage: true },
  //   });
  // };

  const handleClick = (item) => {
    const pageName = item?.pageName?.toLowerCase()?.replace(/\s+/g, "-");
    const url = `/pages/${pageName}`;
    window.location.href = url;
  };

  // ads
  const landingGoogleAdsHomeList = useSelector(
    (state) => state.landing.landingGoogleAdsHomeList
  );
  useEffect(() => {
    dispatch(getLandingGoogleAdsHomeList());
  }, [dispatch]);

  return (
    <Box component="footer" sx={{ backgroundColor: "#f8f8f8", p: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              {loadingLogo ? (
                <Skeleton
                  variant="rectangular"
                  sx={{ width: "130px", height: "50px" }}
                />
              ) : (
                <img
                  src={logoDetails}
                  onClick={() => router.push("/")}
                  alt="Best News Hub"
                  style={{ width: "130px", height: 50, cursor: "pointer" }}
                />
              )}
            </Box>
            <Typography
              variant="body2"
              mt={2}
              sx={{ color: "#666", fontSize: { xs: "12px", sm: "14px" } }}
            >
              {content.text}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              {landingSocialList?.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  color="#7B3300"
                  underline="none"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {renderIcon(item.iconName)}
                </Link>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", fontSize: { xs: "14px", sm: "16px" } }}
            >
              Popular Category
            </Typography>
            {landingPopularCategoryList?.slice(0, 7).map((item) => (
              <FooterLink
                key={item.categoryId}
                sx={{ cursor: "pointer", fontSize: "12px" }}
                onClick={() => {
                  const url = `/news/category/${item.slug?.toLowerCase()}`;
                  window.location.href = url;
                }}
              >
                {item.name}
              </FooterLink>
            ))}
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            >
              Pages
            </Typography>
            {landingPageList?.map((item, index) => (
              <FooterLink
                key={item.id || index}
                sx={{ cursor: "pointer", fontSize: { xs: "10px", sm: "12px" } }}
                onClick={() => {
                  dispatch(setSelectedPageId(item.id));
                  let url = "";

                  if (item.pageName?.toLowerCase().includes("contact")) {
                    url = `/pages/contact/${item?.pageName
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-")}`;
                  } else if (
                    item.pageName?.toLowerCase().includes("advertise")
                  ) {
                    url = `/pages/advertise/${item?.pageName
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-")}`;
                  } else {
                    handleClick(item);
                    return;
                  }

                  window.location.href = url;
                }}
              >
                {item.pageName}
              </FooterLink>
            ))}
          </Grid>
          <Grid
            item
            sm={4}
            md={4}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            <AdsRenderer ads={landingGoogleAdsHomeList} position="Square" />
          </Grid>
        </Grid>

        <Box
          borderTop={1}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            &copy; Copyright {new Date().getFullYear()}, All Rights Reserved
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography
              onClick={() => {
                const filteredPage = landingPageList.find((page) =>
                  page.pageName.toLowerCase().includes("privacy")
                );
                if (filteredPage) {
                  handleClick(filteredPage);
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
                  handleClick(filteredPage);
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
      </Container>
    </Box>
  );
};

export default memo(Footer);
