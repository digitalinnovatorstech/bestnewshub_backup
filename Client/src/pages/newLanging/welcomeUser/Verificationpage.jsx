import {
  Container,
  Box,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import logo from "../../../assets/news/logo.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

function VerificationPage() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2EBE6",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: isSmallScreen ? "90%" : "600px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: isSmallScreen ? "20px" : "40px",
          textAlign: "center",
        }}
      >
        <Box sx={{ marginBottom: isSmallScreen ? "10px" : "20px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: isSmallScreen ? "100px" : "200px",
              marginBottom: isSmallScreen ? "10px" : "20px",
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#895129",
            fontSize: isSmallScreen ? "18px" : "24px",
            marginBottom: isSmallScreen ? "10px" : "20px",
          }}
        >
          Your Application Sent for Verification
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#555",
            fontSize: isSmallScreen ? "14px" : "16px",
            marginBottom: isSmallScreen ? "15px" : "20px",
            textAlign: "center",
            padding: isSmallScreen ? "0 10px" : "0 40px",
          }}
        >
          Your application is currently being processed, and verification will
          be completed within 12 to 24 hours. Thank you for your patience.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#000000",
            fontWeight: "bold",
            fontSize: isSmallScreen ? "14px" : "16px",
            marginBottom: isSmallScreen ? "15px" : "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Check your application status
          <ChevronRightIcon
            sx={{
              fontSize: isSmallScreen ? "16px" : "20px",
              color: "#000000",
              marginLeft: "4px",
            }}
          />
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#895129",
            color: "#fff",
            textTransform: "none",
            fontWeight: "bold",
            padding: isSmallScreen ? "8px 16px" : "10px 20px",
            fontSize: isSmallScreen ? "14px" : "16px",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#73411f",
            },
          }}
          onClick={() => navigate("/")}
        >
          Done
        </Button>
      </Container>
    </Box>
  );
}

export default VerificationPage;
