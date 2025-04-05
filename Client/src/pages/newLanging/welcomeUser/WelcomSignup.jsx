import {
  Box,
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
import { memo, useState } from "react";
import logo from "../../../assets/news/logo.png";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const inputLabelStyle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: "3px",
};

const redStarStyle = { color: "red", marginLeft: "4px" };

const WelcomSignup = ({ formValues, setFormValues, errors, setErrors }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

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

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
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
      <Stack
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ mt: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="logo" height="80" />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontSize: "24px", fontWeight: "bold", color: "#895129" }}
          >
            Welcome User
          </Typography>
          {/* <Typography variant="body2" sx={{ color: "gray" }}>
            Email : username@gmail.com
          </Typography> */}
          <Grid container spacing={2}>
            {renderTextField("First Name", "firstName", "text", true)}
            {renderTextField("Last Name", "lastName", "text", true)}
            {renderTextField("Email", "email", "email", true)}
            {renderTextField("Phone Number", "phoneNumber", "tel", true)}
            {renderTextField("Password", "password", "password", true)}
            {renderTextField(
              "Confirm Password",
              "confirmPassword",
              "password",
              true
            )}
          </Grid>
        </Box>
      </Stack>
    </>
  );
};

WelcomSignup.propTypes = {
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default memo(WelcomSignup);
