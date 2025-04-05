import { Box, Container } from "@mui/material";
import { memo } from "react";
import Header from "../header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";

const MainLayout = () => {
  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // overflow: "auto",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Container>
    // <Container
    //   maxWidth="xxl"
    //   disableGutters
    //   sx={{
    //     height: "100vh",
    //     display: "flex",
    //     flexDirection: "column",
    //     overflowX: "hidden",
    //     width: "100%",
    //   }}
    // >
    //   <Box sx={{ width: "100%" }}>
    //     <Header />
    //   </Box>
    //   <Box sx={{ flexGrow: 1, width: "100%" }}>
    //     <Outlet />
    //   </Box>
    //   <Footer />
    // </Container>
  );
};

export default memo(MainLayout);
