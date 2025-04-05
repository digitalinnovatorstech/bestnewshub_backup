import { Box, Container, useMediaQuery } from "@mui/material";
import Navbar from "../navbar/Navbar";
import SideMenu from "../sidemenu/SideMenu";
import { Outlet, useNavigate } from "react-router-dom";
import { memo, useEffect } from "react";

const MainLayout = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const loginUserDetails = localStorage.getItem("loginUser");
  const user = loginUserDetails ? JSON.parse(loginUserDetails) : null;

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    }
  }, [user]);

  // If no user, return null to prevent rendering
  if (!user) return null;

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Container
        maxWidth="xxl"
        disableGutters
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {!isTabMode && <SideMenu />}
        <Box
          sx={{
            backgroundColor: "#F9F9F9",
            width: isTabMode ? "100%" : "80%",
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Container>
  );
};

export default memo(MainLayout);
