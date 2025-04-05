import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addGoogleAds,
  deleteGoogleAds,
  getGoogleAdsDetails,
  getGoogleAdsList,
  updateGoogleAds,
  updateGoogleAdsCustom,
} from "../../../services/slices/advisementSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

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

function formatValue(value) {
  return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
}

function deepCopyFormValues(Details, formValues) {
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
        if (key === "status") {
          target[key] = formatValue(source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  let copiedFormValue = JSON.parse(JSON.stringify(formValues));
  deepCopy(copiedFormValue, Details);
  return copiedFormValue;
}

const GoogleAds = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    adsPosition: "",
    page: "",
    adsScript: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const googleAdsList = useSelector((state) => state.ads.googleAdsList);
  const googleAdsDetails = useSelector((state) => state.ads.googleAdsDetails);
  const [opertions, setOpertions] = useState("All");

  useEffect(() => {
    const fetchSocialList = async () => {
      setLoadingList(true);
      try {
        const payload = {
          params: {
            position: opertions,
          },
        };
        await dispatch(getGoogleAdsList(payload));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingList(false);
      }
    };

    fetchSocialList();
  }, [dispatch, opertions]);
  // useEffect(() => {
  //   const fetchSocialList = async () => {
  //     setLoadingList(true);
  //     try {
  //       await dispatch(getGoogleAdsList());
  //     } catch (error) {
  //       toast.error(error.message);
  //     } finally {
  //       setLoadingList(false);
  //     }
  //   };
  //   fetchSocialList();
  // }, [dispatch]);
  useEffect(() => {
    if (selectedEditId !== null) {
      const fetchSocialInfo = async () => {
        setLoadingInfo(true);
        try {
          await dispatch(getGoogleAdsDetails(selectedEditId));
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoadingInfo(false);
        }
      };
      fetchSocialInfo();
    }
  }, [selectedEditId, dispatch]);
  const memoizedAdsList = useMemo(() => googleAdsList || [], [googleAdsList]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.adsPosition) newErrors.adsPosition = "Position is required";
    if (!formValues.page) newErrors.page = "Page is required";
    if (!formValues.adsScript) newErrors.adsScript = "Script is required";
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
      const response = await dispatch(addGoogleAds(formValues)).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getGoogleAdsList()).unwrap();
        setFormValues({});
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormValues({});
      setLoading(false);
    }
  };

  // for edit
  const updatedFormValues = deepCopyFormValues(googleAdsDetails, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
  }, [googleAdsDetails]);

  const handleupdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const updatedValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] !== googleAdsDetails[key]) {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
    try {
      const response = await dispatch(
        updateGoogleAds({ id: selectedEditId, data: updatedValues })
      ).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getGoogleAdsList()).unwrap();
        setFormValues({});
        setSelectedEditId(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // for delete
  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteGoogleAds(id)).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getGoogleAdsList()).unwrap();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
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
  const [localAdsList, setLocalAdsList] = useState(memoizedAdsList);

  useEffect(() => {
    setLocalAdsList(memoizedAdsList);
  }, [memoizedAdsList]);

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
        open={loadingList || loadingInfo}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <ToastContainer />
      <Stack
        sx={{
          width: "98%",
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
              onClick={() =>
                navigate("/admin/advertisement", {
                  state: { activeItem: "All Advertisements" },
                })
              }
            >
              Advertisements
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Google Advertisements</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 1, sm: 2 },
            }}
          ></Box>
        </Stack>
        <Stack
          sx={{
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
            {renderTextField("Position", "adsPosition", "text", true)}
            {renderTextField("Page", "page", "text", true)}
            <Grid item xs={12}>
              <Stack sx={{ pt: 2 }}>
                <InputLabel sx={inputLabelStyle}>
                  Script<span style={redStarStyle}>*</span>
                </InputLabel>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.adsScript}
                >
                  <TextField
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "0.8rem",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#895129 !important",
                      },
                    }}
                    id="description"
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Add Script here"
                    value={formValues?.adsScript || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        adsScript: value,
                      }));
                      if (errors.adsScript) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          adsScript: "",
                        }));
                      }
                    }}
                    error={!!errors.adsScript}
                  />
                  {errors.adsScript && (
                    <FormHelperText>{errors.adsScript}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                mt: 2,
              }}
            >
              {selectedEditId != null && (
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
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={() => {
                    setFormValues({});
                    setSelectedEditId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
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
                onClick={selectedEditId != null ? handleupdate : handleSave}
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
              width: isTabMode ? "100%" : "48%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Typography variant="h5" sx={{}}>
                Google Ads List
              </Typography>
              <FormControl
                sx={{
                  width: "30%",
                }}
              >
                <Select
                  value={opertions}
                  onChange={(e) => setOpertions(e.target.value)}
                  sx={{
                    height: "40px",
                    width: "100%",
                    color: "#895129",
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
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Header">Header</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Category">Category</MenuItem>
                  <MenuItem value="Article">Article</MenuItem>
                  <MenuItem value="Pages">Pages</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
              {memoizedAdsList.length > 0 ? (
                memoizedAdsList.map((ads) => (
                  <Box
                    key={ads.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 2,
                      padding: 1.5,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {ads.adsPosition} <small>- {ads.page}</small>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              localAdsList.find((ad) => ad.id === ads.id)
                                ?.isCustomAds || false
                            }
                            onChange={async (e) => {
                              try {
                                const newValue = e.target.checked;
                                setLocalAdsList((prevAds) =>
                                  prevAds.map((ad) =>
                                    ad.id === ads.id
                                      ? { ...ad, isCustomAds: newValue }
                                      : ad
                                  )
                                );
                                await dispatch(
                                  updateGoogleAdsCustom({
                                    id: ads.id,
                                    data: { status: newValue },
                                  })
                                ).unwrap();

                                await dispatch(getGoogleAdsList()).unwrap();
                                await dispatch(getGoogleAdsDetails()).unwrap();

                                toast.success(
                                  "Successfully Category added in home page."
                                );
                              } catch (error) {}
                            }}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#895129",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: "#895129",
                                },
                            }}
                          />
                        }
                        label="Custom Ads"
                      />

                      <IconButton
                        color="primary"
                        onClick={() => setSelectedEditId(ads.id)}
                        aria-label="edit"
                      >
                        <EditNoteIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(ads.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    marginTop: 4,
                    color: "gray",
                    fontStyle: "italic",
                  }}
                >
                  No Google Ads available.
                </Typography>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(GoogleAds);
