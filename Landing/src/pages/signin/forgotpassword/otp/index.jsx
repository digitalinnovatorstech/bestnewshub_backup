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
  Dialog,
  DialogContent,
  Stack,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { otpVerify, resetPasswordOTP } from "@/services/slices/authSlice";
import { getLogoDetails } from "@/services/slices/globalSlice";
import { useRouter } from "next/router";
import SigninPage from "@/pages/signin/index";
import CreatePasswordPage from "@/pages/signin/forgotpassword/otp/createpassword/index";

const Otp = ({ openOtpVerify, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [open, setOpen] = useState(true);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openCreatePassword, setOpenCreatePassword] = useState(false);
  const [timer, setTimer] = useState(120);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    setOpen(openOtpVerify);
  }, [openOtpVerify]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const logoDetails = useSelector((state) => state.global.logoDetails);
  useEffect(() => {
    setLoadingLogo(true);
    dispatch(getLogoDetails()).finally(() => {
      setLoadingLogo(false);
    });
  }, [dispatch]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail =
      typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (!storedEmail) {
      setOpenSignIn(true);
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

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
        // setTimeout(() => {
        // router.push("/signin/forgotpassword/otp/createpassword");
        // setOpenSignIn(true);
        setOpenCreatePassword(true);

        // }, 2000);
      } else if (response && response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  // resend otp
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await dispatch(resetPasswordOTP(email)).unwrap();
      if (response && response.success === true) {
        toast.success(response.message);
        setTimer(120);
        setResendDisabled(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              background: "#fff",
              padding: { xs: "5px", sm: "24px" },
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Box sx={{}}>
                {loadingLogo ? (
                  <Skeleton variant="rectangular" width={100} height={80} />
                ) : (
                  <img
                    src={logoDetails}
                    alt="logo"
                    height="80"
                    onClick={() => router.push("/")}
                  />
                )}
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
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
                  <InputLabel sx={{ marginBottom: "10px" }}>
                    Enter OTP
                  </InputLabel>
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
                      mb: 1,
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
                <Box
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ mb: 1 }}>
                    {" "}
                    {resendDisabled
                      ? `Resend OTP in ${formatTime(timer)}`
                      : "You can now resend the OTP."}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        color: !resendDisabled ? "#895129" : "gray",
                      },
                    }}
                    onClick={!resendDisabled ? handleResendOtp : undefined}
                  >
                    <Typography sx={{ fontSize: "15px" }}>
                      Resend OTP
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      {openCreatePassword && (
        <CreatePasswordPage
          createPasswordOpen={openCreatePassword}
          onClose={() => {
            setOpenCreatePassword(false);
            onClose();
          }}
        />
      )}
      {openSignIn && (
        <SigninPage
          signInOpen={openSignIn}
          onClose={() => {
            setOpenSignIn(false);
            // onClose();
          }}
        />
      )}
    </>
  );
};

export default Otp;
