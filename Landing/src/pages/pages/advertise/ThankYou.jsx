import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/router";

const ThankYou = ({ type }) => {
  const router = useRouter();

  const submissionMessage =
    type === "advertisement"
      ? "Your advertisement request has been successfully submitted. We will get back to you soon!"
      : "Your enquiry has been successfully submitted. We will get back to you soon!";

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: 2,
        textAlign: "center",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#895129" }}>
        Thank You!
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          color: "#895129",
          fontWeight: "medium",
        }}
      >
        {submissionMessage}
      </Typography>

      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{
            backgroundColor: "#895129",
            "&:hover": { backgroundColor: "#895129" },
            padding: "10px 20px",
            fontSize: {
              xs: "px",
              sm: "10px",
              md: "12px",
              lg: "14px",
            },
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYou;
