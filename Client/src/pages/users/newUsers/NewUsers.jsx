import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { memo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../../utility/regex";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { getUserList } from "../../../services/slices/userSlice";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const inputLabelStyle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: "3px",
};

const redStarStyle = {
  color: "red",
  marginLeft: "4px",
};

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phoneNumber: "",
  userType: "",
  // profilePhoto: "",
  joiningDate: "",
  password: "",
  confirmPassword: "",
};

const roleList = [
  { id: "Admin", name: "Admin" },
  // { id: "User", name: "User" },
  { id: "Blogger", name: "Blogger" },
  { id: "Guest Author", name: "Guest Author" },
  { id: "Freelance Writer", name: "Freelance Writer" },
  { id: "Subscriber", name: "Subscriber" },
];

const NewUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const payload = {
    params: {
      currentPage: 1,
      perPage: 10,
      status: "",
      userType: "",
      searchQuery: "",
    },
  };
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const profileInputRef = useRef(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (!value || emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Invalid email format",
        }));
      }
    }
    if (name === "phoneNumber") {
      if (value.length <= 10 && /^\d*$/.test(value)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));

        if (value.length === 10) {
          if (!/^[5-9]/.test(value)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: "Phone number must start with 5, 6, 7, 8, or 9",
            }));
          } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Phone number must be exactly 10 digits",
          }));
        }
      }
      return;
    }

    if (name === "joiningDate") {
      const today = new Date();
      const selectedDate = new Date(value);

      if (selectedDate > today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Joining date cannot be in the future",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
      return;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+{}:<>?-=[];,.";

    const getRandomChar = (chars) =>
      chars[Math.floor(Math.random() * chars.length)];

    let password =
      getRandomChar(uppercase) +
      getRandomChar(lowercase) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);

    for (let i = password.length; i < 8; i++) {
      password += getRandomChar(uppercase + lowercase + numbers + specialChars);
    }

    return password;
  };

  const onGeneratePassword = () => {
    const generatedPassword = generatePassword();
    setFormValues((prevValues) => ({
      ...prevValues,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    }));
  };

  const validatePassword = (password, firstName, lastName) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (firstName && password.toLowerCase().includes(firstName.toLowerCase())) {
      return "Password should not contain your first name.";
    }
    if (lastName && password.toLowerCase().includes(lastName.toLowerCase())) {
      return "Password should not contain your last name.";
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.firstName) newErrors.firstName = "First Name is required";
    if (!formValues.lastName) newErrors.lastName = "Last Name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    else if (formValues.email && !emailRegex.test(formValues.email))
      newErrors.email = "Invalid email format";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(
        formValues.password,
        formValues.firstName,
        formValues.lastName
      );
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      const passwordError = validatePassword(
        formValues.confirmPassword,
        formValues.firstName,
        formValues.lastName
      );
      if (passwordError) {
        newErrors.confirmPassword = passwordError;
      }
    }

    return newErrors;
  };

  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const data = new FormData();
    Object.keys(formValues).forEach((key) => {
      data.append(key, formValues[key]);
    });
    if (profilePicture) {
      data.append("profilePhoto", profilePicture);
    }
    try {
      const response = await axios.post(`${apiUrl}/admin/create/user`, data, {
        headers: {
          Authorization: `Bearer ${datakey.token.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      await dispatch(getUserList(payload)).unwrap();
      setFormValues({});
      setProfilePicture(null);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (label, name, type = "text", required = false) => (
    <Grid pt={2} item style={{ width: "100%" }}>
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
              // color: "#895129",
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
          id={name}
          placeholder={`Enter ${label}`}
          size="small"
          name={name}
          type={type}
          value={formValues[name] || ""}
          onChange={onChangeHandler}
          error={!!errors[name]}
        />
        {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
    </Grid>
  );
  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "95vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          mt: 1,
          padding: "0px 15px",
          position: "sticky",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          sx={{ position: "sticky" }}
        >
          <Typography
            variant="h5"
            sx={{ cursor: "pointer", color: "#895129" }}
            onClick={() => navigate("/admin/users/allUsers")}
          >
            Users
          </Typography>
          <Typography variant="h5">/</Typography>
          <Typography variant="h5">Create New User</Typography>
        </Stack>
        <Box sx={{ display: "flex", gap: "5%" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              width: "120px",
              padding: "4px 20px",
              bgcolor: "#895129",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#895129",
              },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#895129" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
      <Stack
        sx={{
          background: "#fff",
          flex: 1,
          width: "98%",
          // maxHeight: "80%",
          overflow: "auto",
          borderRadius: "8px",
          marginTop: "15px",
          padding: "20px",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: isTabMode ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: isTabMode ? "100%" : "50%",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {renderTextField("First Name", "firstName", "text", true)}
              {renderTextField("Last Name", "lastName", "text", true)}
            </Box>
            {renderTextField("Email", "email", "text", true)}
            {renderTextField("Phone Number", "phoneNumber", "text", true)}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              {renderTextField("Password", "password", "password", true)}
              {renderTextField("Confirm Password", "confirmPassword", "text")}
              <Button
                variant="contained"
                size="small"
                sx={{
                  mt: 4,
                  height: "100%",
                  bgcolor: "#895129",
                  "&:hover": {
                    backgroundColor: "#895129",
                  },
                }}
                onClick={onGeneratePassword}
              >
                Generate
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box sx={{ width: "50%" }}>
                {renderTextField("Joining Date", "joiningDate", "date")}
              </Box>
              <Box sx={{ width: "50%" }}>
                <Grid container spacing={2} pt={2}>
                  <Grid item style={{ width: "100%" }}>
                    <InputLabel sx={inputLabelStyle}>Role</InputLabel>
                    <FormControl variant="outlined" fullWidth size="small">
                      <SingleSelect
                        placeholder={"Select"}
                        width={"100%"}
                        value={formValues?.userType || ""}
                        data={roleList}
                        onChange={(e) =>
                          setFormValues((prevValues) => ({
                            ...prevValues,
                            userType: e,
                          }))
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {/* <Box sx={{ mt: 2, display: "flex" }}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Send the new user an email about their account"
              />
            </Box> */}
          </Box>
          <Box
            sx={{
              width: isTabMode ? "100%" : "40%",
            }}
          >
            <Card variant="outlined" sx={{ marginTop: "20px" }}>
              <CardContent sx={{ height: "180px" }}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    height: "120px",
                  }}
                >
                  <Avatar
                    src={
                      profilePicture
                        ? URL.createObjectURL(profilePicture)
                        : undefined
                    }
                    sx={{ width: "100px", height: "100px" }}
                  />
                  <Button
                    variant="contained"
                    tabIndex={-1}
                    sx={{
                      background: "#FCF8E7",
                      color: "#895129",
                      padding: "20px",
                      "&:hover": {
                        background: "#FCF8E7",
                        color: "#895129",
                      },
                    }}
                    onClick={() => profileInputRef.current.click()}
                  >
                    Upload Photo Here
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/svg+xml"
                      hidden
                      ref={profileInputRef}
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                  </Button>
                </Stack>
                {profilePicture && (
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      flexDirection: "column",
                      color: "#895129",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CloudUploadIcon sx={{ marginRight: "5px" }} />
                      {profilePicture.name}
                    </div>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(NewUsers);
