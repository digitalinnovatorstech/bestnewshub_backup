import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserNavbarDetails } from "../../../services/slices/userSlice";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import axios from "axios";
import { formatNameLowerUpper } from "../../../utility/helpers/globalHelpers";
import { emailRegex, phoneNumberRegex } from "../../../utility/regex";
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

function deepCopyFormValues(userSettingDetails, formValues) {
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
        target[key] = source[key];
      }
    }
  }

  let copiedFormValue = JSON.parse(JSON.stringify(formValues));
  deepCopy(copiedFormValue, userSettingDetails);
  return copiedFormValue;
}
const Profile = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const loginUserDetails = localStorage.getItem("loginUser");
  const dataKey = JSON.parse(loginUserDetails);
  const userType = dataKey?.userData?.userType;
  const isAdmin = userType === "ADMIN";
  const id = dataKey?.userData?.id;
  const [loadingView, setLoadingView] = useState(false);
  const userNavbarDetails = useSelector(
    (state) => state.users.userNavbarDetails
  );
  useEffect(() => {
    setLoadingView(true);
    dispatch(getUserNavbarDetails(id)).finally(() => {
      setLoadingView(false);
    });
  }, [dispatch]);
  const [peronalDetailsEdit, setPeronalDetailsEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const profileInputRef = useRef(null);
  const capitalize = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    language: "",
    countryCode: "+91",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const updatedFormValues = deepCopyFormValues(userNavbarDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
  }, [userNavbarDetails]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      const emailRegex = /^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]{1,255}\.[A-Za-z]{2,63}$/;
      if (value && !emailRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Invalid email format",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      }
      return;
    }
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
      [name]: value.trim() || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.firstName) newErrors.firstName = "First Name is required";
    if (!formValues.lastName) newErrors.lastName = "Last Name is required";
    if (formValues.email && !emailRegex.test(formValues.email))
      newErrors.email = "Invalid email format";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    else if (!phoneNumberRegex.test(formValues.phoneNumber))
      newErrors.phoneNumber = "Invalid Phone Number";
    return newErrors;
  };
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
    if (profile) {
      data.append("profilePhoto", profile);
    }
    try {
      const response = await axios.put(
        `${apiUrl}/admin/user/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${dataKey.token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      await dispatch(getUserNavbarDetails(id)).unwrap();
      setTimeout(() => {
        setPeronalDetailsEdit(false);
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (
    label,
    name,
    type = "text",
    required = false,
    disabled = false
  ) => (
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
          fullWidth
          id={name}
          disabled={disabled}
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
        height: "92vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <Stack
        sx={{
          width: "98%",
          // maxHeight: "85%",
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9F9F9",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography
              variant="h5"
              sx={{ cursor: "pointer", color: "#895129" }}
            >
              Profile
            </Typography>
          </Box>
          <Box sx={{}}>
            {!peronalDetailsEdit ? (
              <Button
                variant="outlined"
                sx={{
                  border: "1px solid #895129",
                  bgcolor: "#FCF8E7",
                  color: "#895129",
                  "&:hover": {
                    backgroundColor: "#FCF8E7",
                    border: "1px solid #895129",
                  },
                }}
                size="small"
                onClick={() => setPeronalDetailsEdit(true)}
              >
                Edit
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: "5%" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "120px",
                    padding: "4px 20px",
                    border: "1px solid #895129",
                    bgcolor: "#FCF8E7",
                    color: "#895129",
                    "&:hover": {
                      backgroundColor: "#FCF8E7",
                      border: "1px solid #895129",
                    },
                  }}
                  onClick={() => setPeronalDetailsEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: "120px",
                    padding: "4px 20px",
                    bgcolor: "#895129",
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
            )}
          </Box>
        </Stack>
        <Stack
          sx={{
            flex: 1,
            overflow: "auto",
            marginTop: "10px",
            display: "flex",
            background: "#fff",
            padding: "10px",
          }}
        >
          <Box sx={{ marginTop: "10px" }}>
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {!peronalDetailsEdit ? (
                    <Avatar
                      src={userNavbarDetails?.profilePhoto}
                      sx={{ width: "80px", height: "80px" }}
                    />
                  ) : (
                    <Avatar
                      src={
                        profile
                          ? URL.createObjectURL(profile)
                          : userNavbarDetails?.profilePhoto
                      }
                      sx={{
                        width: "80px",
                        height: "80px",
                      }}
                    />
                  )}
                  {peronalDetailsEdit && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        borderRadius: "50%",
                        padding: "4px",
                      }}
                    >
                      <IconButton
                        onClick={() => profileInputRef.current.click()}
                      >
                        <CameraAltOutlinedIcon sx={{ color: "white" }} />
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            setProfile(e.target.files[0]);
                          }}
                          ref={profileInputRef}
                        />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>
                    <strong>Name: </strong>
                    {capitalize(userNavbarDetails?.firstName)}{" "}
                    {capitalize(userNavbarDetails?.lastName)}
                  </Typography>
                  <Typography>
                    <strong>Username:</strong>{" "}
                    {userNavbarDetails?.userName || ""}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong>{" "}
                    {formatNameLowerUpper(userNavbarDetails?.userType) || ""}
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card
              variant="outlined"
              sx={{
                marginTop: "20px",
                padding: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: "22px", fontWeight: "bold" }}>
                  Personal Information
                </Typography>
              </Box>
              {!peronalDetailsEdit ? (
                <Box>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={8} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        First Name
                      </Typography>
                      <Card variant="outlined" sx={{ padding: "10px" }}>
                        <Typography variant="body1">
                          {" "}
                          {userNavbarDetails?.firstName || ""}{" "}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        Last Name
                      </Typography>
                      <Card variant="outlined" sx={{ padding: "10px" }}>
                        <Typography variant="body1">
                          {userNavbarDetails?.lastName || ""}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={8} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        Email
                      </Typography>
                      <Card variant="outlined" sx={{ padding: "10px" }}>
                        <Typography variant="body1">
                          {userNavbarDetails?.email || ""}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        Phone Number
                      </Typography>
                      <Card variant="outlined" sx={{ padding: "10px" }}>
                        <Typography variant="body1">
                          {" "}
                          {userNavbarDetails?.phoneNumber || ""}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sm={4}>
                      {renderTextField(
                        "First Name",
                        "firstName",
                        "text",
                        true,
                        false
                      )}
                    </Grid>
                    <Grid item xs={8} sm={4}>
                      {renderTextField(
                        "Last Name",
                        "lastName",
                        "text",
                        true,
                        false
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sm={4}>
                      {renderTextField(
                        "Email",
                        "email",
                        "text",
                        true,
                        !isAdmin
                      )}
                    </Grid>
                    <Grid item xs={8} sm={4}>
                      {renderTextField(
                        "Phone Number",
                        "phoneNumber",
                        "text",
                        true,
                        !isAdmin
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(Profile);
