import { memo, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { emailRegex } from "../../../utility/regex";
import { getLandingLogin } from "../../../services/slices/authSlice";

const SigninPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = localStorage.getItem("loginUser");

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

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        navigate("/");
        window.location.reload();
        setLoading(false);
      }
    };
    fetchData();
  }, [userData]);

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

    // Validate password
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
          setLoading(false);
        } else {
          toast.error(
            response.message ||
              "Login failed. Please check your email and password."
          );
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        background: "#FCF8E7",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Box
        sx={{ width: "80%", height: "100%" }}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "700px" },
            maxWidth: "700px",
            height: "auto",
            background: "#fff",
            padding: "25px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            // flexDirection: { xs: "row", sm: "column" },
            // boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              // flexDirection: "row",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ mt: 6, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="logo" height="80" />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: "24px", fontWeight: "bold", color: "#895129" }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                SIGNIN TO CONTINUE
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2} pt={1} pb={1}>
                  <Grid item style={{ width: "100%" }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>
                      Email Address
                    </InputLabel>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!error.email}
                    >
                      <OutlinedInput
                        fullWidth
                        id="email"
                        placeholder="Enter Email Address"
                        size="small"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={loginData.email || ""}
                        onChange={onChangeHandler}
                        error={!!error.email}
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
                      />
                      {!!error.email && (
                        <FormHelperText error>{error.email}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2} pt={1} pb={1}>
                  <Grid item style={{ width: "100%" }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>
                      Password
                    </InputLabel>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!error.password}
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
                        placeholder="Enter Password"
                        size="small"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        value={loginData.password || ""}
                        onChange={onChangeHandler}
                        error={!!error.password}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {!!error.password && (
                        <FormHelperText error>{error.password}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Stack
                    justifyContent={"center"}
                    onClick={() => navigate("/forgotpassword")}
                    pt={0}
                    ml={2}
                    mt={1}
                    sx={{
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "blue",
                      textDecoration: "underline",
                      "&:hover": { color: "blue" },
                    }}
                  >
                    Forgot Password?
                  </Stack>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  pt={0}
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#895129",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#895129",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#895129" }} />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Stack
                  justifyContent={"center"}
                  onClick={() => navigate("/signup")}
                  pt={0}
                  ml={2}
                  sx={{
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "blue",
                    textDecoration: "underline",
                    "&:hover": { color: "blue" },
                  }}
                >
                  New User SignUp?
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(SigninPage);
