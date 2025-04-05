import {
  Backdrop,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, memo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, Image, Close } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getAllCategories,
  getGenralInfo,
  getLogoDetails,
} from "../../services/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const loginUserDetails = localStorage.getItem("loginUser");
const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;
const userType = data?.userData?.userType;

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
  _defaultCategory: null,
  siteTitle: "",
  siteTagline: "",
  isTagline: false,
  siteLogo: "",
  favicon: "",
  SEOImageUrl: "",
  emailNotification: false,
  notification: false,
  postNotification: false,
  commentNotification: false,
  metaTitle: "",
  metaDescription: "",
  metaTags: [],
};

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
        target[key] = source[key];
      }
    }
  }

  let copiedFormValue = JSON.parse(JSON.stringify(formValues));
  deepCopy(copiedFormValue, UserDetails);
  return copiedFormValue;
}
const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loadingV, setLoadingV] = useState(false);
  const genralInfo = useSelector((state) => state.global.genralInfo);
  // const allcategoryList = useSelector((state) => state.global.allcategoryList);
  useEffect(() => {
    setLoadingV(true);
    dispatch(getGenralInfo()).finally(() => {
      setLoadingV(false);
    });
    dispatch(getAllCategories());
  }, [dispatch]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedDashboardImage, setUploadedDashboardImage] = useState(null);
  const [openDashbaordPopup, setOpenDashbaordPopup] = useState(false);
  const [uploadedFavImage, setUploadedFavImage] = useState(null);
  const [openFavPopup, setOpenFavPopup] = useState(false);
  const [seoImage, setSeoImage] = useState(null);
  const seoImageInputRef = useRef(null);
  const [openSeoImagePopup, setOpenSeoImagePopup] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // const handleToggle = (field) => {
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [field]: !prevValues[field],
  //   }));
  // };
  const handleToggle = (field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: prevValues[field] === 1 ? 0 : 1,
    }));
  };

  // category
  // const handleCategoryChange = (e) => {
  //   const selectedSlug = e.target.value;
  //   const findCategoryBySlug = (categories, slug, path = []) => {
  //     for (let category of categories) {
  //       if (category.slug === slug) {
  //         return { category, path: [...path, category.slug] };
  //       }
  //       if (category.children && category.children.length > 0) {
  //         const result = findCategoryBySlug(category.children, slug, [
  //           ...path,
  //           category.slug,
  //         ]);
  //         if (result) return result;
  //       }
  //     }
  //     return null;
  //   };

  //   const result = findCategoryBySlug(allcategoryList, selectedSlug);
  //   const selectedCategory = result?.category || null;
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     _defaultCategory: selectedCategory ? selectedCategory.id : null,
  //   }));
  //   setErrors((prevErrors) => ({ ...prevErrors, _defaultCategory: "" }));
  // };
  // const findCategoryById = (categories, id) => {
  //   for (let category of categories) {
  //     if (category.id === id) {
  //       return category;
  //     }
  //     if (category.children && category.children.length > 0) {
  //       const result = findCategoryById(category.children, id);
  //       if (result) return result;
  //     }
  //   }
  //   return null;
  // };
  // const renderCategories = (categories, depth = 0) => {
  //   if (!categories || categories.length === 0) {
  //     return <option disabled>Loading...</option>;
  //   }

  //   return categories.map((category) => {
  //     const prefix = "\u00A0\u00A0\u00A0- ".repeat(depth);
  //     let options = [
  //       <option key={category.id} value={category.slug}>
  //         {`${prefix}${category.name}`}
  //       </option>,
  //     ];
  //     if (category.children && category.children.length > 0) {
  //       options = options.concat(
  //         renderCategories(category.children, depth + 1)
  //       );
  //     }

  //     return options;
  //   });
  // };
  const [inputValue, setInputValue] = useState("");
  const addMetaTag = () => {
    const metaTags = Array.isArray(formValues.metaTags)
      ? formValues.metaTags
      : [];

    if (inputValue.trim() !== "" && !metaTags.includes(inputValue.trim())) {
      setFormValues((prevValues) => ({
        ...prevValues,
        metaTags: [...metaTags, inputValue.trim()],
      }));
      setInputValue("");
    }
  };
  const handleAddMetaTag = (event) => {
    if (event.key === "Enter") {
      addMetaTag();
    }
  };
  const handleDeleteMetaTag = (tagToDelete) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      metaTags: prevValues.metaTags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {};
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== genralInfo[key]) {
        payload[key] = formValues[key];
      }
    });
    if (uploadedDashboardImage) {
      payload.siteLogo = uploadedDashboardImage;
    }
    if (uploadedFavImage) {
      payload.favicon = uploadedFavImage;
    }
    if (seoImage) {
      payload.SEOImageUrl = seoImage;
    }
    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.");
      setLoading(false);
      return;
    }
    const data = new FormData();
    Object.keys(payload).forEach((key) => {
      data.append(key, payload[key]);
    });
    try {
      const response = await axios.put(
        `${apiUrl}/admin/setting/general`,
        data,
        {
          headers: {
            Authorization: `Bearer ${datakey.token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success === true) {
        toast.success(response.data.message);
        await dispatch(getGenralInfo()).unwrap();
        await dispatch(getLogoDetails()).unwrap();
      } else {
        toast.error(response.data.message);
      }
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

  const updatedFormValues = deepCopyFormValues(genralInfo, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
      metaTags: genralInfo?.metaTags?.split(",") || [],
    }));
    if (genralInfo && genralInfo.siteLogo) {
      setUploadedDashboardImage(genralInfo.siteLogo);
    }
    if (genralInfo && genralInfo.favicon) {
      setUploadedFavImage(genralInfo.favicon);
    }
    if (genralInfo && genralInfo.SEOImageUrl) {
      setSeoImage(genralInfo.SEOImageUrl);
    }
  }, [genralInfo]);

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        height: "95vh",
        display: "flex",
        overflow: "hidden",
        padding: "15px",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingV}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <ToastContainer />
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
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "", sm: "space-between" },
            backgroundColor: "#F9F9F9",
            padding: "10px",
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              variant="h5"
              sx={{ cursor: "pointer", color: "#895129" }}
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">General Settings</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#895129",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#895129",
                },
                width: { xs: "100%", sm: "auto" },
              }}
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#895129" }} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Stack>
        <Stack
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: isTabMode ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: isTabMode ? "100%" : "48%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack sx={{ background: "#fff", padding: "10px 0px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  marginLeft: "20px",
                }}
              >
                General Informations
              </Typography>
              <Divider flexItem />
              {userType === "ADMIN" && (
                <Box sx={{ padding: "10px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: "10px",
                    }}
                  >
                    {renderTextField("Site Title", "siteTitle", "text")}
                    <Box sx={{ width: "100%" }}>
                      {renderTextField("Tagline", "siteTagline", "text")}
                      <FormControlLabel
                        control={
                          <Switch
                            // checked={formValues.isTagline}
                            checked={Boolean(formValues?.isTagline === 1)}
                            onChange={() => handleToggle("isTagline")}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#895129",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#895129",
                              },
                            }}
                          />
                        }
                        label="Tagline is visible"
                        sx={{
                          ml: "6px",
                          display: "flex",
                          flexDirection: "row-reverse",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Stack>
            {/* <Stack
              sx={{
                marginTop: "10px",
                background: "#fff",
                padding: "10px 0px",
              }}
            >
              <Box sx={{ padding: "10px" }}>
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: "2px", marginLeft: "2px" }}
                  >
                    Default Category
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!errors._defaultCategory}
                  >
                    <select
                      style={{
                        padding: "10px",
                        width: "100%",
                        borderRadius: "4px",
                        border: "1px solid #895129",
                        fontSize: "14px",
                        "&:hover": { border: "1px solid #895129" },
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
                      value={
                        formValues._defaultCategory
                          ? findCategoryById(
                              allcategoryList,
                              formValues._defaultCategory
                            )?.slug || ""
                          : ""
                      }
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select a category</option>
                      {renderCategories(allcategoryList)}
                    </select>
                    {errors._defaultCategory && (
                      <FormHelperText>{errors._defaultCategory}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Box>
            </Stack> */}
            {userType === "ADMIN" && (
              <Stack
                sx={{
                  marginTop: "10px",
                  background: "#fff",
                  padding: "10px 0px",
                }}
              >
                <Box sx={{ padding: "10px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                        Logo
                      </Typography>
                      <Stack
                        sx={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="text"
                            component="label"
                            sx={{
                              width: "100%",
                              maxWidth: "260px",
                              color: "#895129",
                              border: "1px dotted",
                              padding: "8px 16px",
                              textAlign: "center",
                            }}
                          >
                            Upload Logo
                            <input
                              type="file"
                              accept="image/jpeg, image/png"
                              hidden
                              onChange={(e) => {
                                if (e.target.files.length > 0) {
                                  setUploadedDashboardImage(e.target.files[0]);
                                }
                              }}
                            />
                          </Button>
                          <FormHelperText
                            sx={{
                              fontSize: "0.8rem",
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            JPG, JPEG, PNG formats supported
                          </FormHelperText>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: "260px",
                            height: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: uploadedDashboardImage
                              ? "none"
                              : "1px dashed #9e9e9e",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          {uploadedDashboardImage ? (
                            <img
                              src={
                                uploadedDashboardImage instanceof File
                                  ? URL.createObjectURL(uploadedDashboardImage)
                                  : uploadedDashboardImage
                              }
                              onClick={() => setOpenDashbaordPopup(true)}
                              alt="Uploaded Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                maxHeight: "100px",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{ color: "#9e9e9e" }}
                            >
                              No image uploaded
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                    <Dialog
                      open={openDashbaordPopup}
                      onClose={() => setOpenDashbaordPopup(false)}
                    >
                      <Box sx={{ position: "relative", padding: "10px" }}>
                        <IconButton
                          onClick={() => setOpenDashbaordPopup(false)}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          <Close />
                        </IconButton>
                        <img
                          src={
                            uploadedDashboardImage instanceof File
                              ? URL.createObjectURL(uploadedDashboardImage)
                              : uploadedDashboardImage
                          }
                          alt="Selected"
                          style={{
                            width: "100%",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            display: "block",
                            margin: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Dialog>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                        Favicon
                      </Typography>
                      <Stack
                        sx={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="text"
                            component="label"
                            sx={{
                              width: "100%",
                              maxWidth: "260px",
                              color: "#895129",
                              border: "1px dotted",
                              padding: "8px 16px",
                              textAlign: "center",
                            }}
                          >
                            Upload Favicon
                            <input
                              type="file"
                              accept="image/png, image/svg+xml"
                              hidden
                              onChange={(e) => {
                                if (e.target.files.length > 0) {
                                  setUploadedFavImage(e.target.files[0]);
                                }
                              }}
                            />
                          </Button>
                          <FormHelperText
                            sx={{
                              fontSize: "0.8rem",
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            PNG/SVG formats supported.
                          </FormHelperText>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: "260px",
                            height: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: uploadedFavImage
                              ? "none"
                              : "1px dashed #9e9e9e",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          {uploadedFavImage ? (
                            <img
                              src={
                                uploadedFavImage instanceof File
                                  ? URL.createObjectURL(uploadedFavImage)
                                  : uploadedFavImage
                              }
                              onClick={() => setOpenFavPopup(true)}
                              alt="Uploaded Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                maxHeight: "100px",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{ color: "#9e9e9e" }}
                            >
                              No image uploaded
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                    <Dialog
                      open={openFavPopup}
                      onClose={() => setOpenFavPopup(false)}
                    >
                      <Box sx={{ position: "relative", padding: "10px" }}>
                        <IconButton
                          onClick={() => setOpenFavPopup(false)}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          <Close />
                        </IconButton>
                        <img
                          src={
                            uploadedFavImage instanceof File
                              ? URL.createObjectURL(uploadedFavImage)
                              : uploadedFavImage
                          }
                          alt="Selected"
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "500px",
                            display: "block",
                            margin: "auto",
                          }}
                        />
                      </Box>
                    </Dialog>
                  </Grid>
                </Box>
              </Stack>
            )}
            {userType === "ADMIN" && (
              <Box
                sx={{
                  background: "#fff",
                  marginTop: "10px",
                  padding: "10px 0px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6" sx={{ marginLeft: "10px" }}>
                      Feature Image
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
                        onClick={() => seoImageInputRef.current.click()}
                      >
                        Upload Feature image
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/svg+xml"
                          hidden
                          ref={seoImageInputRef}
                          onChange={(e) => setSeoImage(e.target.files[0])}
                        />
                      </Button>
                    </Box>
                  </Box>
                  {seoImage && (
                    <Box
                      sx={{
                        marginLeft: "10px",
                        width: "60px",
                        height: "60px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpenSeoImagePopup(true)}
                    >
                      <img
                        src={
                          seoImage instanceof File
                            ? URL.createObjectURL(seoImage)
                            : seoImage
                        }
                        alt="Selected"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
                {seoImage && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2, marginTop: "5px", textAlign: "center" }}
                  >
                    {typeof seoImage === "object"
                      ? seoImage.name
                      : seoImage?.split("/").pop() || "no name"}
                  </Typography>
                )}
              </Box>
            )}
            <Dialog
              open={openSeoImagePopup}
              onClose={() => setOpenSeoImagePopup(false)}
            >
              <Box sx={{ position: "relative", padding: "10px" }}>
                <IconButton
                  onClick={() => setOpenSeoImagePopup(false)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <Close />
                </IconButton>
                <img
                  src={
                    seoImage instanceof File
                      ? URL.createObjectURL(seoImage)
                      : seoImage
                  }
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "500px",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </Box>
            </Dialog>
          </Stack>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              width: isTabMode ? "100%" : "48%",
            }}
          >
            <Stack sx={{ background: "#fff", padding: "10px 0px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  marginLeft: "20px",
                }}
              >
                Notification
              </Typography>
              <Divider flexItem />
              <Box sx={{ padding: "10px" }}>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                  <FormControlLabel
                    control={
                      <Switch
                        // checked={formValues.emailNotification}
                        checked={Boolean(formValues?.emailNotification === 1)}
                        onChange={() => handleToggle("emailNotification")}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#895129",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#895129",
                          },
                        }}
                      />
                    }
                    label="Email Notification"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(formValues?.notification === 1)}
                        onChange={() => handleToggle("notification")}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#895129",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#895129",
                          },
                        }}
                      />
                    }
                    label="General Notification"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(formValues?.postNotification === 1)}
                        onChange={() => handleToggle("postNotification")}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#895129",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#895129",
                          },
                        }}
                      />
                    }
                    label="New Post Notification"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(formValues?.commentNotification === 1)}
                        onChange={() => handleToggle("commentNotification")}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#895129",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#895129",
                          },
                        }}
                      />
                    }
                    label="New Comment Notification"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {userType === "ADMIN" && (
              <Stack
                sx={{
                  background: "#fff",
                  marginTop: "10px",
                  padding: "10px 0px",
                  mt: 1,
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Search Engine Optimize
                </Typography>
                <Divider flexItem />
                <Box sx={{ padding: "10px" }}>
                  <Typography
                    variant="h7"
                    sx={{
                      fontSize: "14px",
                      marginBottom: "10px",
                      // marginLeft: "20px",
                    }}
                  >
                    Setup meat title & description to make your site easy to
                    discovered on search engines such as Google
                  </Typography>
                  <Divider
                    flexItem
                    sx={{ borderWidth: "1px", background: "black" }}
                  />
                  {renderTextField("SEO Title", "metaTitle", "text")}
                  {renderTextField(
                    "SEO description",
                    "metaDescription",
                    "text"
                  )}
                  <Grid container pt={2} style={{ width: "100%" }}>
                    <Grid item xs={12} style={{ width: "100%" }}>
                      <InputLabel sx={inputLabelStyle}>SEO Tag</InputLabel>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <OutlinedInput
                          fullWidth
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
                            flex: 1,
                          }}
                          placeholder="Add SEO Tags"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleAddMetaTag}
                        />
                        <Button
                          variant="contained"
                          onClick={addMetaTag}
                          sx={{
                            marginLeft: "8px",
                            bgcolor: "#895129",
                            color: "#fff",
                            height: "40px",
                            "&:hover": {
                              backgroundColor: "#73411f",
                            },
                          }}
                        >
                          Add
                        </Button>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {formValues?.metaTags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDeleteMetaTag(tag)}
                        color="primary"
                        sx={{ bgcolor: "#895129" }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(Settings);
