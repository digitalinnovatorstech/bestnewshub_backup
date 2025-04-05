import {
  Avatar,
  Backdrop,
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
import { memo, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../../utility/regex";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { getUserDetails } from "../../../services/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

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
  joiningDate: "",
};

const roleList = [
  { id: "Admin", name: "Admin" },
  { id: "Blogger", name: "Blogger" },
  { id: "Guest Author", name: "Guest Author" },
  { id: "Freelance Writer", name: "Freelance Writer" },
  { id: "Subscriber", name: "Subscriber" },
];

function formatDate(dateString) {
  return moment(dateString).format("YYYY-MM-DD");
}

function formatValue(value) {
  return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
}

function deepCopyFormValues(UserDetails, formValues) {
  function deepCopy(target, source) {
    for (let key in source) {
      if (source[key] && typeof source[key] === "object") {
        if (Array.isArray(source[key])) {
          target[key] = [...source[key]];
        } else {
          if (!target[key]) target[key] = {};
          deepCopy(target[key], source[key]);
        }
      } else {
        if (key === "joiningDate") {
          target[key] = formatDate(source[key]);
        } else if (key === "userType") {
          target[key] = formatValue(source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  let copiedFormValue = JSON.parse(JSON.stringify(formValues));
  deepCopy(copiedFormValue, UserDetails);
  return copiedFormValue;
}
const EditUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const [loadingV, setLoadingV] = useState(false);
  const id = localStorage.getItem("userIdv");
  const userDetails = useSelector((state) => state.users.userDetails);
  useEffect(() => {
    setLoadingV(true);
    dispatch(getUserDetails(id)).finally(() => {
      setLoadingV(false);
    });
  }, [dispatch]);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.firstName) newErrors.firstName = "First Name is required";
    if (!formValues.lastName) newErrors.lastName = "Last Name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    else if (formValues.email && !emailRegex.test(formValues.email))
      newErrors.email = "Invalid email format";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
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
    // Create an object with only changed fields
    const updatedFields = {};
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== userDetails[key]) {
        updatedFields[key] = formValues[key];
      }
    });
    if (profilePicture instanceof File) {
      updatedFields["profilePhoto"] = profilePicture;
    }
    const data = new FormData();
    Object.keys(updatedFields).forEach((key) => {
      data.append(key, updatedFields[key]);
    });
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/admin/user/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${datakey.token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setFormValues({});
      setProfilePicture(null);
      setTimeout(() => {
        navigate("/admin/users/allUsers");
      }, 1000);
    } catch {
      toast.error("Failed to Update User. Please try again.");
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

  const updatedFormValues = deepCopyFormValues(userDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
    if (userDetails && userDetails.profilePhoto) {
      setProfilePicture(userDetails.profilePhoto);
    }
  }, [userDetails]);

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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingV}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
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
          <Typography variant="h5">Edit User</Typography>
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
              "Update"
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
                      profilePicture instanceof File
                        ? URL.createObjectURL(profilePicture)
                        : profilePicture
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

export default memo(EditUser);
