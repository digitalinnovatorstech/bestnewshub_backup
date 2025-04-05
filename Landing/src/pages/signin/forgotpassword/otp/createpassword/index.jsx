import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  FormHelperText,
  CircularProgress,
  Skeleton,
  Stack,
  DialogContent,
  Dialog,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/services/slices/authSlice";
import { getLogoDetails } from "@/services/slices/globalSlice";
import { useRouter } from "next/router";
import SigninPage from "@/pages/signin/index";
import { stubTrue } from "lodash";

const CreatePassword = ({ createPasswordOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [open, setOpen] = useState(true);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    setOpen(createPasswordOpen);
  }, [createPasswordOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
    window.location.href = router?.asPath;
    // router.push("/");
  };
  const logoDetails = useSelector((state) => state.global.logoDetails);
  useEffect(() => {
    setLoadingLogo(true);
    dispatch(getLogoDetails()).finally(() => {
      setLoadingLogo(false);
    });
  }, [dispatch]);
  // const email = localStorage.getItem("email");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch email from localStorage on client side
    const storedEmail =
      typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (!storedEmail) {
      setOpenSignIn(true);
      // router.push("/signin"); // Redirect if email is missing
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const validatePassword = (password) => {
    const regex = {
      minLength: /.{8,}/,
      uppercase: /[A-Z]/,
      number: /[0-8]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    };

    if (!regex.minLength.test(password)) {
      return "Password should be at least 8 characters.";
    }
    if (!regex.uppercase.test(password)) {
      return "Password needs at least one uppercase letter";
    }
    if (!regex.number.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!regex.specialChar.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (password.includes("firstName")) {
      return "Password should not contain your first name.";
    }
    if (password.includes("lastName")) {
      return "Password should not contain your last name.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await dispatch(
        resetPassword({ email: email, newPassword: newPassword })
      ).unwrap();
      setLoading(false);
      if (response && response.success === true) {
        toast.success(response.message);
        setTimeout(() => {
          // router.push("/signin");
          setOpenSignIn(stubTrue);
        }, 2000);
      } else if (response && response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "An error occurred. Please try again.");
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
                  Create New Password
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ marginTop: "6px", fontSize: "14px" }}
                >
                  Enter and confirm your new password.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={2} pt={2} pb={1}>
                    <Grid item xs={12}>
                      <InputLabel>New Password</InputLabel>
                      <FormControl variant="outlined" fullWidth size="small">
                        <OutlinedInput
                          fullWidth
                          type="password"
                          placeholder="Enter New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                        {!!error && (
                          <FormHelperText error>{error}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel>Confirm Password</InputLabel>
                      <FormControl variant="outlined" fullWidth size="small">
                        <OutlinedInput
                          fullWidth
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
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
                    startIcon={
                      loading && (
                        <CircularProgress size={20} sx={{ color: "#895129" }} />
                      )
                    }
                  >
                    {loading ? "Changing Password..." : "Save"}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
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
  );
};

export default CreatePassword;
