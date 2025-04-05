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
} from "@mui/material";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { resetPassword } from "../../../services/slices/authSlice";

const CreatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email");

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
          navigate("/signin");
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
                  {!!error && <FormHelperText error>{error}</FormHelperText>}
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
      </Box>
    </Container>
  );
};

export default CreatePassword;
