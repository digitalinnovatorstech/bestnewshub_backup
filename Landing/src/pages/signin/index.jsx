import { memo, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { emailRegex } from "@/utility/regex";
import { getLandingLogin } from "@/services/slices/authSlice";
import { useRouter } from "next/router";
import { getLogoDetails } from "@/services/slices/globalSlice";
import SignupPage from "@/pages/signup/index";
import ForgotPasswordPage from "@/pages/signin/forgotpassword/index";

const SigninPage = ({ signInOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = router.query.open;
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(isOpen || false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgitPassword, setOpenForgotPassword] = useState(false);

  useEffect(() => {
    setOpen(signInOpen);
  }, [signInOpen]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loginUser");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  const onChangeHandler = (e) => {
    const { name = "", value = "" } = e.target;
    if (name === "email") {
      setError({ ...error, email: "" });
    } else if (name === "password") {
      setError({ ...error, password: "" });
    }
    setLoginData({ ...loginData, [name]: value });
  };

  useEffect(() => {
    const rememberedData = localStorage.getItem("rememberedData");
    if (rememberedData) {
      setLoginData(JSON.parse(rememberedData));
      setRememberMe(true);
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let emailError = "";
    let passwordError = "";

    // Validate email
    if (!loginData.email) {
      emailError = "Email is required";
      isValid = false;
    } else if (!validateEmail(loginData.email)) {
      emailError = "Invalid email format";
      isValid = false;
    }

    if (!loginData.password) {
      passwordError = "Password is required";
      isValid = false;
    } else if (!validatePassword(loginData.password)) {
      passwordError = "Password must be at least 8 characters";
      isValid = false;
    }

    setError({ email: emailError, password: passwordError });

    if (isValid) {
      if (rememberMe) {
        localStorage.setItem("rememberedData", JSON.stringify(loginData));
      } else {
        localStorage.removeItem("rememberedData");
      }

      setLoading(true);
      try {
        const response = await dispatch(getLandingLogin(loginData)).unwrap();
        if (response && response.success === true) {
          localStorage.setItem("loginUser", JSON.stringify(response.data));
          toast.success(response.message);
          window.location.href = router?.asPath;
          setOpen(false);
          // router.events.on("routeChangeComplete", () => {
          //   window.location.reload();
          // });
          // router.replace("/signin", undefined, { shallow: true });
          // setTimeout(() => {
          //   router.push("/");
          // }, 100);
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <Dialog open={open == true} onClose={handleClose} fullWidth maxWidth="sm">
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
                alignItems: "center",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Box
                sx={{ mt: { xs: 2, sm: 0 }, cursor: "pointer" }}
                onClick={() => router.push("/")}
              >
                {loadingLogo ? (
                  <Skeleton variant="rectangular" width={100} height={80} />
                ) : (
                  <img src={logoDetails} alt="logo" height="80" />
                )}
              </Box>
            </Stack>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "22px", fontWeight: "bold", color: "#895129" }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                SIGN IN TO CONTINUE
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ fontWeight: "bold" }}>
                    Email Address
                  </InputLabel>
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={!!error.email}
                  >
                    <OutlinedInput
                      id="email"
                      placeholder="Enter Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={loginData.email || ""}
                      onChange={onChangeHandler}
                      sx={{
                        "& .MuiInputBase-input::placeholder": {
                          fontSize: "0.85rem",
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
                    {!!error.email && (
                      <FormHelperText error>{error.email}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <InputLabel sx={{ fontWeight: "bold" }}>Password</InputLabel>
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={!!error.password}
                  >
                    <OutlinedInput
                      id="password"
                      placeholder="Enter Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={loginData.password || ""}
                      onChange={onChangeHandler}
                      sx={{
                        "& .MuiInputBase-input::placeholder": {
                          fontSize: "0.85rem",
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
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {!!error.password && (
                      <FormHelperText error>{error.password}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} textAlign="right">
                  <Typography
                    onClick={() => {
                      setOpen(false);
                      setOpenForgotPassword(true);
                      // onClose();
                    }}
                    sx={{
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "blue",
                      textDecoration: "underline",
                      "&:hover": { color: "blue" },
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: "#895129",
                      padding: "10px",
                      borderRadius: "8px",
                      "&:hover": { bgcolor: "#895129" },
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <>
                    <Typography
                      onClick={() => {
                        setOpen(false);
                        setOpenSignUp(true);
                      }}
                      sx={{
                        cursor: "pointer",
                        fontSize: { xs: "12px", sm: "14px" },
                        color: "blue",
                        textDecoration: "underline",
                        "&:hover": { color: "blue" },
                      }}
                    >
                      New User? Sign Up
                    </Typography>
                  </>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {openSignUp && (
        <SignupPage
          signUpOpen={openSignUp}
          onClose={() => {
            setOpenSignUp(false);
            onClose();
          }}
        />
      )}
      {openForgitPassword && (
        <ForgotPasswordPage
          forgetPasswordOpen={openForgitPassword}
          onClose={() => {
            setOpenForgotPassword(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default memo(SigninPage);
