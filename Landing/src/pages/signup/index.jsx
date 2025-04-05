import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogContent,
  Skeleton,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userSignUp } from "@/services/slices/userSlice";
import { landingOTPSend, landingOTPVerify } from "@/services/slices/authSlice";
import { getLogoDetails } from "@/services/slices/globalSlice";
import { useRouter } from "next/router";
import SigninPage from "@/pages/signin/index";

const inputLabelStyle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: "3px",
};

const redStarStyle = { color: "red", marginLeft: "4px" };

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  countryCode: "+91",
  phoneNumber: "",
  userType: "SUBSCRIBER",
  joiningDate: new Date().toISOString().split("T")[0],
};

function SignUpPage({ signUpOpen, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = router.query.open;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpButtonDisable, setOtpButtonDisable] = useState(false);
  const [otpVerifyDisable, setOtpVerifyDisable] = useState(true);
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [open, setOpen] = useState(isOpen || false);
  const [isVerified, setIsVerified] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    setOpen(signUpOpen);
  }, [signUpOpen]);

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

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (value.length <= 10 && /^\d*$/.test(value)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
      if (value.length === 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Phone number must be exactly 10 digits",
        }));
      }
      return;
    }

    if (name === "otp") {
      if (!/^\d*$/.test(value) || value.length > 6) {
        return;
      }
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

    if (!formValues.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(formValues.password))
      newErrors.password = "Password must be at least 8 characters long";

    if (!formValues.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formValues.password !== formValues.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formValues.firstName) newErrors.firstName = "First Name is required";
    if (!formValues.lastName) newErrors.lastName = "Last Name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await dispatch(userSignUp(formValues)).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        setFormValues(initialFormValues);
        // router.push("/signin");
        // router.push({
        //   pathname: "/signin",
        //   query: { open: "true" },
        // });
        setOpenSignIn(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    if (!formValues.email) newErrors.email = "Email is required";
    return newErrors;
  };
  const handleOtpSend = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmailForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoadingSendOTP(true);
    try {
      const response = await dispatch(
        landingOTPSend({ data: { email: formValues.email } })
      ).unwrap();
      if (response && response.success === true) {
        setShowOtpField(true);
        setOtpButtonDisable(true);
        toast.success(response.message);
      } else if (response && response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingSendOTP(false);
    }
  };

  const validateOTPForm = () => {
    const newErrors = {};
    if (!formValues.otp) newErrors.otp = "OTP is required";
    return newErrors;
  };
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const validationErrors = validateOTPForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoadingVerifyOTP(true);
    try {
      const response = await dispatch(
        landingOTPVerify({
          data: { email: formValues.email, otp: formValues.otp },
        })
      ).unwrap();
      if (response && response.success === true) {
        setShowOtpField(false);
        setOtpButtonDisable(false);
        setOtpVerifyDisable(false);
        setIsVerified(true);
        toast.success(response.message);
      } else if (response && response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingVerifyOTP(false);
    }
  };

  const renderTextField = (label, name, type = "text", required = false) => (
    <Grid pt={1} item xs={12} md={6}>
      <InputLabel sx={inputLabelStyle}>
        {label}
        {required && <span style={redStarStyle}>*</span>}
      </InputLabel>
      <FormControl
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors[name]}
      >
        <OutlinedInput
          sx={{
            "& .MuiInputBase-input::placeholder": {
              fontSize: "0.8rem",
              color: "#895129",
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#895129" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#895129",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#895129",
            },
          }}
          id={name}
          placeholder={`Enter ${label}`}
          size="small"
          name={name}
          type={
            name === "password" || name === "confirmPassword"
              ? showPassword[name]
                ? "text"
                : "password"
              : type
          }
          value={formValues[name] || ""}
          onChange={onChangeHandler}
          endAdornment={
            (name === "password" || name === "confirmPassword") && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility(name)}
                  edge="end"
                  size="small"
                >
                  {showPassword[name] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
        {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
    </Grid>
  );
  return (
    <>
      <ToastContainer />
      <Dialog open={open == true} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
              background: "#fff",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Container
              maxWidth={false}
              sx={{
                width: isSmallScreen ? "100%" : "850px",
                borderRadius: 0,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
              }}
            >
              <Grid
                item
                xs={12}
                sm={5}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: isSmallScreen ? "240px" : "300px",
                    height: isSmallScreen ? "100px" : "138px",
                    marginTop: isSmallScreen ? "10px" : "20px",
                  }}
                  onClick={() => router.push("/")}
                >
                  {loadingLogo ? (
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={"auto"}
                    />
                  ) : (
                    <img
                      src={logoDetails}
                      alt="Logo"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={7}
                sx={{
                  padding: isSmallScreen ? 1 : 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isSmallScreen ? "center" : "flex-start",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: isSmallScreen ? "24px" : "28px",
                    fontWeight: 900,
                    lineHeight: "33.6px",
                    textAlign: isSmallScreen ? "center" : "left",
                    color: "#895129",
                  }}
                >
                  Sign Up, User!
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "DM Sans",
                    fontSize: isSmallScreen ? "14px" : "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    textAlign: isSmallScreen ? "center" : "left",
                    color: "#A4978E",
                  }}
                >
                  Let's get you started
                </Typography>

                <form onSubmit={handleSave}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 0, sm: 1 },
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ width: { xs: "100%", sm: "49%" } }}>
                      {renderTextField("First Name", "firstName", "text", true)}
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "49%" } }}>
                      {renderTextField("Last Name", "lastName", "text", true)}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: "80%" }}>
                      {renderTextField("Email", "email", "email", true)}
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 4,
                        ml: 1,
                        border: "1px solid #895129",
                        bgcolor: "#FCF8E7",
                        color: "#895129",
                        "&:hover": {
                          backgroundColor: "#FCF8E7",
                          border: "1px solid #895129",
                        },
                      }}
                      onClick={handleOtpSend}
                      disabled={loadingSendOTP}
                    >
                      {loadingSendOTP
                        ? "Sending.."
                        : otpButtonDisable
                        ? "Resend"
                        : "Send"}
                    </Button>
                  </Box>
                  {showOtpField && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        {renderTextField("Enter OTP", "otp", "text", true)}
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          mt: 4,
                          ml: 1,
                          border: "1px solid #895129",
                          bgcolor: "#FCF8E7",
                          color: "#895129",
                          "&:hover": {
                            backgroundColor: "#FCF8E7",
                            border: "1px solid #895129",
                          },
                        }}
                        disabled={loadingVerifyOTP}
                        onClick={handleOtpVerify}
                      >
                        {loadingVerifyOTP ? "Verifing..." : "Verify"}
                      </Button>
                    </Box>
                  )}
                  {renderTextField("Phone Number", "phoneNumber", "tel", true)}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 0, sm: 1 },
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ width: { xs: "100%", sm: "49%" } }}>
                      {renderTextField(
                        "Password",
                        "password",
                        "password",
                        true
                      )}
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "49%" } }}>
                      {renderTextField(
                        "Confirm Password",
                        "confirmPassword",
                        "password",
                        true
                      )}
                    </Box>
                  </Box>

                  <Grid pt={2} item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading || otpVerifyDisable}
                      sx={{
                        bgcolor: "#895129",
                        borderRadius: "8px",
                        "&:hover": {
                          bgcolor: "#895129",
                        },
                      }}
                    >
                      {loading ? "Loading..." : "Sign Up"}
                    </Button>
                  </Grid>
                </form>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>

      {openSignIn && (
        <SigninPage
          signInOpen={openSignIn}
          onClose={() => {
            setOpenSignIn(false);
          }}
        />
      )}
    </>
  );
}

export default memo(SignUpPage);
