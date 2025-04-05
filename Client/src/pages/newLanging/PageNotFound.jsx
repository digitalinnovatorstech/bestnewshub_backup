import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: { xs: "5rem", sm: "6rem" },
            color: "#895129",
          }}
        />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#895129",
          mb: 1,
          fontSize: { xs: "1.8rem", sm: "2.5rem" },
        }}
      >
        404: Page Not Found
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#895129",
          mb: 3,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        Oops! The page you’re looking for doesn’t exist. It might have been
        removed or the URL might be incorrect.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{
          px: { xs: 3, sm: 4 },
          py: { xs: 1, sm: 1.5 },
          fontSize: { xs: "0.9rem", sm: "1rem" },
          borderRadius: 0,
          backgroundColor: "#895129",
          "&:hover": {
            backgroundColor: "#895129",
            color: "white",
          },
        }}
        onClick={handleGoHome}
      >
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default PageNotFound;
