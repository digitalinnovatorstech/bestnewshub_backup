import {
  Typography,
  Box,
  TextField,
  IconButton,
  Switch,
  Avatar,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingDisplayNameUpdate,
  getLandingNotification,
  getLandingUserNavbarDetails,
  updateNotifications,
} from "../../../services/slices/landingSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function MyProfile() {
  const dispatch = useDispatch();
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;
  const userId = data?.userData?.id;
  const landinguserNavbarDetails = useSelector(
    (state) => state.landing.landinguserNavbarDetails
  );
  const landingNotificationList = useSelector(
    (state) => state.landing.landingNotificationList
  );
  useEffect(() => {
    dispatch(getLandingUserNavbarDetails(userId));
    dispatch(getLandingNotification());
  }, [dispatch]);

  const [editing, setEditing] = useState({
    displayName: false,
  });

  const [formValues, setFormValues] = useState({
    firstname: landinguserNavbarDetails?.firstName,
    lastname: landinguserNavbarDetails?.lastName,
    displayName: landinguserNavbarDetails?.displayName,
    email: landinguserNavbarDetails?.email,
    address: "Telecom Nagar, 9-335/d... ",
    Password: "****",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const toggleEditing = (field) => {
    setEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const changeData = {
    displayName: formValues.displayName,
  };
  const handleDisplayNameUpdate = async () => {
    try {
      const response = await dispatch(
        getLandingDisplayNameUpdate({ id: userId, data: changeData })
      ).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getLandingUserNavbarDetails(userId)).unwrap();
        setEditing((prev) => ({
          ...prev,
          displayName: false,
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  // profile Photo update
  const [profilePhoto, setProfilePhoto] = useState(
    landinguserNavbarDetails?.profilePhoto || ""
  );
  const fileInputRef = useRef(null);
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;
        setProfilePhoto(fileData);
        const data = new FormData();
        data.append("profilePhoto", file);

        try {
          const response = await axios.put(
            `${apiUrl}/landing/user/update/${userId}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${datakey?.token?.accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.success === true) {
            toast.success(response.data.message);
            await dispatch(getLandingUserNavbarDetails(userId)).unwrap();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message || "Something went wrong.";
          toast.error(errorMessage);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read the file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ width: "100%", maxWidth: "90%", margin: "auto", mt: "2em" }}>
        <Typography variant="h4" sx={{ color: "#7B3300", fontWeight: 600 }}>
          My Profile
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            mb: "2em",
            alignItems: "center",
            gap: { xs: 2, lg: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              mb: { xs: 4, lg: 0 },
            }}
          >
            <Avatar
              sx={{
                width: 150,
                height: 150,
                fontSize: "2.5rem",
              }}
              src={profilePhoto || landinguserNavbarDetails?.profilePhoto}
            />
            <IconButton
              onClick={handleClick}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#7B3300",
                "&:hover": {
                  bgcolor: "#895129",
                },
              }}
            >
              <EditIcon sx={{ color: "#fff" }} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/svg+xml"
                hidden
                onChange={handleFileChange}
              />
            </IconButton>
          </Box>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
            noValidate
            autoComplete="off"
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                "@media (max-width: 600px)": {
                  flexDirection: "column",
                },
              }}
            >
              <TextField
                fullWidth
                // label="First Name"
                variant="standard"
                name="firstname"
                // value={formValues.firstname}
                value={landinguserNavbarDetails?.firstName}
                InputProps={{
                  sx: {
                    fontSize: "20px",
                    fontWeight: 600,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: "#000000",
                    "&.Mui-focused": {
                      color: "#000000",
                    },
                  },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#777777",
                  },
                }}
              />

              <TextField
                fullWidth
                // label="Last Name"
                variant="standard"
                name="lastname"
                value={landinguserNavbarDetails?.lastName}
                InputProps={{
                  sx: {
                    fontSize: "20px",
                    fontWeight: 600,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: "#000000",
                    "&.Mui-focused": {
                      color: "#000000",
                    },
                  },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#777777",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: "1em",
                "@media (max-width: 600px)": {
                  flexDirection: "column",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  // mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  name="displayName"
                  value={landinguserNavbarDetails?.displayName}
                  onChange={handleChange}
                  disabled={!editing.displayName}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontWeight: 600,
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontWeight: 600,
                      color: "#000000",
                      "&.Mui-focused": {
                        color: "#000000",
                      },
                    },
                  }}
                  sx={{
                    mr: 2,
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#777777",
                    },
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "#777777",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#777777",
                    },
                  }}
                />
                {editing.displayName ? (
                  <IconButton onClick={handleDisplayNameUpdate}>
                    <CheckIcon sx={{ color: "green" }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => toggleEditing("displayName")}>
                    <EditIcon sx={{ color: "#000000" }} />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                // label="Email"
                variant="standard"
                name="email"
                value={landinguserNavbarDetails?.email}
                InputProps={{
                  sx: {
                    fontSize: "20px",
                    fontWeight: 600,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: "#000000",
                    "&.Mui-focused": {
                      color: "#000000",
                    },
                  },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#777777",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#777777",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ my: 4, maxWidth: "90%", margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            mt: "1em",
            mb: 2,
            borderBottom: "1px solid #000000",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#7B3300",
            }}
          >
            Notifications
          </Typography>
          <Switch
            checked={landingNotificationList?.notification || false}
            onChange={async (e) => {
              try {
                const newValue = e.target.checked;
                await dispatch(
                  updateNotifications({
                    data: {
                      notification: newValue,
                      emailNotification: newValue,
                      postNotification: newValue,
                      commentNotification: newValue,
                    },
                  })
                ).unwrap();
                await dispatch(getLandingNotification()).unwrap();
              } catch (error) {
                const errorMessage =
                  error?.response?.data?.message ||
                  "Failed to update notification.";
                toast.error(errorMessage);
              }
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#895129",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#895129",
              },
            }}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid #ccc", py: 2 }}
        >
          <Typography>
            Turn On Notifications for the registered Email
          </Typography>
          <Switch
            checked={landingNotificationList?.emailNotification || false}
            onChange={async (e) => {
              try {
                const newValue = e.target.checked;
                await dispatch(
                  updateNotifications({
                    data: {
                      emailNotification: newValue,
                    },
                  })
                ).unwrap();
                await dispatch(getLandingNotification()).unwrap();
              } catch (error) {
                const errorMessage =
                  error?.response?.data?.message ||
                  "Failed to update notification.";
                toast.error(errorMessage);
              }
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#895129",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#895129",
              },
            }}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid #ccc", py: 2 }}
        >
          <Typography>New Post Notification</Typography>
          <Switch
            checked={landingNotificationList?.postNotification || false}
            onChange={async (e) => {
              try {
                const newValue = e.target.checked;
                await dispatch(
                  updateNotifications({
                    data: {
                      postNotification: newValue,
                    },
                  })
                ).unwrap();
                await dispatch(getLandingNotification()).unwrap();
              } catch (error) {
                const errorMessage =
                  error?.response?.data?.message ||
                  "Failed to update notification.";
                toast.error(errorMessage);
              }
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#895129",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#895129",
              },
            }}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid #ccc", py: 2 }}
        >
          <Typography>New Comment Notification</Typography>
          <Switch
            checked={landingNotificationList?.commentNotification || false}
            onChange={async (e) => {
              try {
                const newValue = e.target.checked;
                await dispatch(
                  updateNotifications({
                    data: {
                      commentNotification: newValue,
                    },
                  })
                ).unwrap();
                await dispatch(getLandingNotification()).unwrap();
              } catch (error) {
                const errorMessage =
                  error?.response?.data?.message ||
                  "Failed to update notification.";
                toast.error(errorMessage);
              }
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#895129",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#895129",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default MyProfile;
