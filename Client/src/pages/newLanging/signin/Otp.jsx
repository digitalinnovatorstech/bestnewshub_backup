import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  CircularProgress,
} from "@mui/material";
import logo from "../../../assets/logo.png";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { otpVerify } from "../../../services/slices/authSlice";

const Otp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email");

  // Handle OTP input change
  const onChangeHandler = (e, index) => {
    const { value } = e.target;
    if (/^\d{0,1}$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (error) setError(""); // Clear error when typing
    }
  };

  // Automatically focus on the next input
  const handleKeyUp = (e, index) => {
    if (e.target.value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join(""); // Combine all digits into one string

    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    // If valid, handle submission logic
    setLoading(true);
    try {
      const response = await dispatch(
        otpVerify({ otp: otpValue, email: email })
      ).unwrap();
      setLoading(false);
      if (response && response.success === true) {
        toast.success(response.message);
        setTimeout(() => {
          navigate("/forgotpassword/createpassword");
        }, 2000);
      } else if (response && response.success === false) {
        toast.error(
          response.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        background: "#F5F5F5",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Box
        sx={{ width: "80%", height: "100%" }}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{
            height: "80%",
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            sx={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={logo} alt="logo" height={"auto"} width={"50%"} />
          </Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontSize: "24px", fontWeight: "bold" }}
          >
            Enter OTP
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ marginTop: "6px", fontSize: "14px" }}
          >
            We've sent a 6-digit OTP to your email.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <InputLabel sx={{ marginBottom: "10px" }}>Enter OTP</InputLabel>
            <Grid container spacing={2} justifyContent="center">
              {otp.map((data, index) => (
                <Grid item key={index} xs={2}>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id={`otp-${index}`}
                      type="text"
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={otp[index]}
                      onChange={(e) => onChangeHandler(e, index)}
                      onKeyUp={(e) => handleKeyUp(e, index)}
                      sx={{
                        width: "50px",
                        height: "50px",
                        fontSize: "24px",
                        padding: 0,
                        "& .MuiInputBase-input::placeholder": {
                          fontSize: "0.8rem",
                          color: "#895129",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#895129",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#895129",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#895129",
                        },
                      }}
                    />
                  </FormControl>
                </Grid>
              ))}
            </Grid>
            {!!error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#895129",
                // padding: "8px 20px",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#895129",
                },
              }}
              disabled={loading}
              startIcon={
                loading && (
                  <CircularProgress size={20} sx={{ color: "#895129" }} />
                )
              }
            >
              {loading ? "Verifing OTP..." : "Verify OTP"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Otp;
