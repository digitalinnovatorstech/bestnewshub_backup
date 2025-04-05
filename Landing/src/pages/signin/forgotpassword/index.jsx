import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { resetPasswordOTP } from "@/services/slices/authSlice";
import { emailRegex } from "@/utility/regex";
import { useRouter } from "next/router";
import { getLogoDetails } from "@/services/slices/globalSlice";
import SigninPage from "@/pages/signin/index";
import OtpVerifyPage from "@/pages/signin/forgotpassword/otp/index";

const ForgotPassword = ({ forgetPasswordOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [open, setOpen] = useState(true);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openOtpVerify, setOpenOtpVerify] = useState(false);

  useEffect(() => {
    setOpen(forgetPasswordOpen);
  }, [forgetPasswordOpen]);

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

  // Handle input change for email
  const onChangeHandler = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (error) setError("");
  };

  // Validate email using regex
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email input
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    // If valid, handle submission logic
    setLoading(true);
    try {
      const response = await dispatch(resetPasswordOTP(email)).unwrap();
      setLoading(false);
      if (response && response.success === true) {
        localStorage.setItem("email", email);
        toast.success(response.message);
        // router.push("/signin/forgotpassword/otp");
        // window.location.href = router?.asPath;
        setOpenOtpVerify(true);
        setOpen(false);
        // onClose();
      } else if (response && response.success === false) {
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
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#895129",
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  FORGOT PASSWORD
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={1} pt={1} pb={1}>
                    <Grid item style={{ width: "100%" }}>
                      <InputLabel sx={{ fontWeight: "bold" }}>
                        Email Address
                      </InputLabel>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!error}
                      >
                        <OutlinedInput
                          sx={{
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
                          fullWidth
                          id="email"
                          placeholder="Enter Email Address"
                          size="small"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={email}
                          onChange={onChangeHandler}
                          error={!!error}
                        />
                        {!!error && (
                          <FormHelperText error>{error}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    pt={0}
                    // onClick={() => {
                    // }}
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: "#895129",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: "1px solid red",
                      "&:hover": {
                        bgcolor: "#895129",
                      },
                    }}
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </Box>
                <Box
                  sx={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setOpen(false);
                    setOpenSignIn(true);
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      color: "#895129",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ArrowBackIosIcon
                      sx={{ fontSize: "20px", marginRight: "5px" }}
                    />
                    Back to Login
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      {openOtpVerify && (
        <OtpVerifyPage
          openOtpVerify={openOtpVerify}
          onClose={() => {
            setOpenOtpVerify(false);
            onClose();
          }}
        />
      )}
      {openSignIn && (
        <SigninPage
          signInOpen={openSignIn}
          onClose={() => {
            setOpenSignIn(false);
            onClose();
          }}
        />
      )}
    </>

    // <Container
    //   maxWidth="xxl"
    //   disableGutters
    //   sx={{
    //     background: "#FCF8E7",
    //     height: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     flexDirection: "column",
    //     overflow: "hidden",
    //   }}
    // >
    //   <ToastContainer />
    //   <Box
    //     sx={{ width: "80%", height: "100%" }}
    //     display={"flex"}
    //     justifyContent={"center"}
    //     alignItems={"center"}
    //   >
    //     <Box
    //       sx={{
    //         width: { xs: "90%", sm: "80%", md: "700px" },
    //         maxWidth: "700px",
    //         height: "auto",
    //         background: "#fff",
    //         padding: "25px",
    //         borderRadius: "10px",
    //         display: "flex",
    //         flexDirection: "column",
    //         // boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
    //       }}
    //     >
    //       <Stack
    //         sx={{
    //           display: "flex",
    //           flexDirection: "row",
    //           justifyContent: "space-between",
    //         }}
    //       >
    //         <Box sx={{ mt: 6 }}>
    //           {loadingLogo ? (
    //             <Skeleton variant="rectangular" width={100} height={80} />
    //           ) : (
    //             <img
    //               src={logoDetails}
    //               alt="logo"
    //               height="80"
    //               onClick={() => router.push("/")}
    //             />
    //           )}
    //         </Box>
    //         <Box sx={{ width: "60%" }}>
    //           <Typography
    //             variant="subtitle1"
    //             gutterBottom
    //             sx={{ fontSize: "24px", fontWeight: "bold", color: "#895129" }}
    //           >
    //             Welcome Back
    //           </Typography>
    //           <Typography variant="body2" sx={{ color: "gray" }}>
    //             FORGOT PASSWORD
    //           </Typography>
    //           <Box
    //             component="form"
    //             onSubmit={handleSubmit}
    //             noValidate
    //             sx={{ mt: 1 }}
    //           >
    //             <Grid container spacing={2} pt={1} pb={1}>
    //               <Grid item style={{ width: "100%" }}>
    //                 <InputLabel sx={{ fontWeight: "bold" }}>
    //                   Email Address
    //                 </InputLabel>
    //                 <FormControl
    //                   variant="outlined"
    //                   fullWidth
    //                   size="small"
    //                   error={!!error}
    //                 >
    //                   <OutlinedInput
    //                     sx={{
    //                       "& .MuiInputBase-input::placeholder": {
    //                         fontSize: "0.8rem",
    //                         color: "#895129",
    //                       },
    //                       "& .MuiOutlinedInput-notchedOutline": {
    //                         borderColor: "#895129",
    //                       },
    //                       "&:hover .MuiOutlinedInput-notchedOutline": {
    //                         borderColor: "#895129",
    //                       },
    //                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //                         borderColor: "#895129",
    //                       },
    //                     }}
    //                     fullWidth
    //                     id="email"
    //                     placeholder="Enter Email Address"
    //                     size="small"
    //                     name="email"
    //                     autoComplete="email"
    //                     autoFocus
    //                     value={email}
    //                     onChange={onChangeHandler}
    //                     error={!!error}
    //                   />
    //                   {!!error && (
    //                     <FormHelperText error>{error}</FormHelperText>
    //                   )}
    //                 </FormControl>
    //               </Grid>
    //             </Grid>
    //             <Button
    //               type="submit"
    //               fullWidth
    //               variant="contained"
    //               pt={0}
    //               sx={{
    //                 mt: 3,
    //                 mb: 2,
    //                 bgcolor: "#895129",
    //                 padding: "8px 20px",
    //                 borderRadius: "8px",
    //                 "&:hover": {
    //                   bgcolor: "#895129",
    //                 },
    //               }}
    //               disabled={loading}
    //             >
    //               {loading ? "Sending OTP..." : "Send OTP"}
    //             </Button>
    //           </Box>
    //           <Box
    //             sx={{
    //               marginTop: "20px",
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //             onClick={() => router.push("/signin")}
    //           >
    //             <Typography
    //               sx={{
    //                 fontSize: "18px",
    //                 color: "#895129",
    //                 cursor: "pointer",
    //                 display: "flex",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <ArrowBackIosIcon
    //                 sx={{ fontSize: "20px", marginRight: "5px" }}
    //               />
    //               Back to Login
    //             </Typography>
    //           </Box>
    //         </Box>
    //       </Stack>
    //     </Box>
    //   </Box>
    // </Container>
  );
};

export default ForgotPassword;
