import React from "react";
import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import errorGif from "@/assets/404_GIF.gif";
import { useRouter } from "next/router";

const PageNotFound = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        textAlign: { xs: "center", sm: "center", md: "left" },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: { xs: 300, sm: 400, md: 500 } }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" } }}
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" } }}
        >
          The page you're looking for doesn't exist or might have been moved.
          Let's get you back on track!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#7B4C21",
            color: "white",
            mt: 2,
            borderRadius: 8,
            px: 2,
            py: 1,
            fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.8rem" },
            "&:hover": {
              backgroundColor: "#5A3215",
            },
          }}
          onClick={handleGoHome}
        >
          Back to Home
        </Button>
      </Box>

      <Box
        sx={{
          mt: { xs: 3, sm: 3, md: 0 },
          ml: { md: 3 },
        }}
      >
        <Image src={errorGif} alt="404" width={200} height={200} priority />
      </Box>
    </Container>
  );
};

export default PageNotFound;
