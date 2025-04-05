import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, Image } from "@mui/icons-material";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getadvisementDetails } from "../../../services/slices/advisementSlice";

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

const positionList = [
  { id: "HEADER", name: "Header" },
  { id: "HOME-1", name: "Home-1" },
  { id: "HOME-2", name: "Home-2" },
  { id: "HOME-3", name: "Home-3" },
  { id: "HOME-4", name: "Home-4" },
  { id: "CATEGORY-1", name: "Category-1" },
  { id: "CATEGORY-2", name: "Category-2" },
  { id: "ARTICLE-1", name: "Article-1" },
  { id: "ARTICLE-2", name: "Article-2" },
];

function formatDate(dateString) {
  return moment(dateString).format("YYYY-MM-DD");
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
        if (key === "startDate") {
          target[key] = formatDate(source[key]);
        } else if (key === "endDate") {
          target[key] = formatDate(source[key]);
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

const EditAdvertisement = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const advisementId = localStorage.getItem("advisementId");
  const [loadingV, setLoadingV] = useState(false);
  const advisementDetails = useSelector((state) => state.ads.advisementDetails);
  useEffect(() => {
    setLoadingV(true);
    dispatch(getadvisementDetails(advisementId)).finally(() => {
      setLoadingV(false);
    });
  }, [dispatch]);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    advertisementUrl: "",
    startDate: "",
    endDate: "",
    position: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verticalImage, setverticalImage] = useState(null);
  const verticalImageInputRef = useRef(null);
  const [horizontalImage, sethorizontalImage] = useState(null);
  const horizontalImageInputRef = useRef(null);
  const [squareImage, setsquareImage] = useState(null);
  const squareImageInputRef = useRef(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      startDate: newStartDate,
    }));

    if (newStartDate >= formValues.endDate) {
      setFormValues((prevValues) => ({
        ...prevValues,
        endDate: "",
      }));
    }
  };
  const handleEndDateChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      endDate: event.target.value,
    }));
  };

  const onSelectChangeHandler = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.title) newErrors.title = "Title is required";
    if (!formValues.advertisementUrl)
      newErrors.advertisementUrl = "Advertisement Url is required";
    if (!formValues.position) newErrors.position = "Position is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = new FormData();
    Object.keys(formValues).forEach((key) => {
      data.append(key, formValues[key]);
    });
    if (verticalImage) {
      data.append("verticalImageUrl", verticalImage);
    }
    if (horizontalImage) {
      data.append("horizontalImageUrl", horizontalImage);
    }
    if (squareImage) {
      data.append("squareImageUrl", squareImage);
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/admin/advertisement/update/${advisementId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${datakey?.token?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setFormValues({});
      setverticalImage(null);
      sethorizontalImage(null);
      setsquareImage(null);
      setTimeout(() => {
        navigate("/admin/advertisement");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
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

  const renderSelectField = (
    label,
    name,
    data,
    required = false,
    disabled = false
  ) => (
    <Grid item pt={2} style={{ width: "100%" }}>
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
        <SingleSelect
          width={"100%"}
          disabled={disabled}
          data={data}
          value={formValues[name] || ""}
          onChange={(value) => onSelectChangeHandler(name, value)}
          placeholder={`Select ${label}`}
        />
        {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
      </FormControl>
    </Grid>
  );

  const ImageSections = {
    HEADER: ["Horizontal"],
    "HOME-1": ["Vertical"],
    "HOME-2": ["Horizontal"],
    "HOME-3": ["Vertical"],
    "HOME-4": ["Horizontal"],
    "CATEGORY-1": ["Vertical"],
    "CATEGORY-2": ["Horizontal"],
    "ARTICLE-1": ["Vertical"],
    "ARTICLE-2": ["Horizontal"],
  };

  const renderImageField = (type, image, setImage, inputRef) => (
    <Box
      sx={{
        background: "#fff",
        marginTop: "15px",
        padding: "10px 0px",
        border: "1px solid #ccc",
      }}
    >
      <Typography variant="h6" sx={{ marginLeft: "20px" }}>
        {type} Image
      </Typography>
      <Box sx={{ padding: "10px" }}>
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
          startIcon={<Image />}
          onClick={() => inputRef.current.click()}
        >
          Choose image
          <input
            type="file"
            accept="image/jpeg, image/png, image/svg+xml"
            hidden
            ref={inputRef}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        {image && (
          <Typography
            variant="body2"
            component="div"
            sx={{
              marginLeft: "10px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              flexDirection: "column",
              color: "#895129",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CloudUploadIcon sx={{ marginRight: "5px" }} />
              {image.name}
            </div>
          </Typography>
        )}
      </Box>
    </Box>
  );

  const updatedFormValues = deepCopyFormValues(advisementDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
  }, [advisementDetails]);

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
          // background: "#fff",
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
            onClick={() =>
              navigate("/admin/advertisement", {
                state: { activeItem: "All Advertisements" },
              })
            }
          >
            Advertisements
          </Typography>
          <Typography variant="h5">/</Typography>
          <Typography variant="h5">Update Advertisements</Typography>
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
            startIcon={<Save />}
            onClick={handleSave}
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
              //  width: "40%"
              width: isTabMode ? "100%" : "50%",
            }}
          >
            {renderTextField("Title", "title", "text", true)}
            {renderTextField(
              "Advertisement URL",
              "advertisementUrl",
              "text",
              true
            )}
            {renderSelectField("Position", "position", positionList, true)}
            <Grid item xs={12}>
              <Stack sx={{ pt: 2 }}>
                <InputLabel sx={inputLabelStyle}>Description</InputLabel>
                <TextField
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
                  id="description"
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Add description here"
                  value={formValues?.description || ""}
                  onChange={(e) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      description: e.target.value,
                    }))
                  }
                />
              </Stack>
            </Grid>
          </Box>
          <Box
            sx={{
              //  width: "40%"
              width: isTabMode ? "100%" : "40%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                marginTop: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{ width: "50%", display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" gutterBottom>
                  Start Date
                </Typography>
                <TextField
                  // label="Start EDD"
                  type="date"
                  value={formValues.startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: {
                      padding: "0px",
                      height: "40px",
                      lineHeight: "normal",
                    },
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box
                sx={{ width: "50%", display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" gutterBottom>
                  End Date
                </Typography>
                <TextField
                  // label="End EDD"
                  type="date"
                  value={formValues.endDate}
                  onChange={handleEndDateChange}
                  inputProps={{
                    min: formValues.startDate,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: {
                      padding: "0px",
                      height: "40px",
                      lineHeight: "normal",
                    },
                  }}
                  sx={{ flex: 1 }}
                  disabled={formValues.startDate === ""}
                />
              </Box>
            </Box>
            {ImageSections[formValues.position]?.includes("Horizontal") &&
              renderImageField(
                "Horizontal",
                horizontalImage,
                sethorizontalImage,
                horizontalImageInputRef
              )}
            {ImageSections[formValues.position]?.includes("Vertical") &&
              renderImageField(
                "Vertical",
                verticalImage,
                setverticalImage,
                verticalImageInputRef
              )}
            {ImageSections[formValues.position]?.includes("Square") &&
              renderImageField(
                "Square",
                squareImage,
                setsquareImage,
                squareImageInputRef
              )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(EditAdvertisement);
