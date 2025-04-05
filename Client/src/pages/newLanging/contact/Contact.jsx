import {
  TextField,
  Button,
  Box,
  InputLabel,
  Grid,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Stack,
  CircularProgress,
  Backdrop,
  Typography,
  Skeleton,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import {
  addEnquiry,
  getLandingGoogleAdsPageList,
  getLandingNotificationAll,
  getLandingPageDetailsByParmalinks,
} from "../../../services/slices/landingSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import ThankYou from "../advertise/ThankYou";
import AdsRenderer from "../../../components/AdsRenderer";
import DynamicSEO from "../../../components/SEO/DynamicSEO";

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
  name: "",
  email: "",
  message: "",
  contactType: "ENQUIRY",
};

const Contact = () => {
  const dispatch = useDispatch();
  const pathname = location.pathname;
  const permalink = pathname.replace("/page/", "");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const landingPageDetailsByParmalinks = useSelector(
    (state) => state.landing.landingPageDetailsByParmalinks
  );
  const landingGoogleAdsPageList = useSelector(
    (state) => state.landing.landingGoogleAdsPageList
  );
  useEffect(() => {
    setLoadingView(true);
    dispatch(getLandingPageDetailsByParmalinks(permalink)).finally(() =>
      setLoadingView(false)
    );
    dispatch(getLandingGoogleAdsPageList());
  }, [dispatch]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!formValues.name) newErrors.name = "Name is required";
    else delete newErrors.name;

    if (!formValues.email) newErrors.email = "Email is required";
    else delete newErrors.email;

    if (!formValues.message) newErrors.message = "Message is required";
    else delete newErrors.message;

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
      const res = await dispatch(addEnquiry(formValues)).unwrap();
      if (res.success === true) {
        setSubmitted(true);
        toast.success(res.message);
        await dispatch(getLandingNotificationAll()).unwrap();
        setFormValues({});
      } else {
        toast.error(res.message);
      }
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

  if (submitted) {
    return <ThankYou type="enquiry" />;
  }

  return (
    <Box>
      <DynamicSEO
        SEOTitle={landingPageDetailsByParmalinks.metaTitle}
        SEODescription={landingPageDetailsByParmalinks.metaDescription}
        SEOKeywords={landingPageDetailsByParmalinks.metaTags}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress sx={{ color: "#895129" }} />
      </Backdrop>
      <ToastContainer />
      <Box
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          Width: { lg: "800px", xs: "100%" },
          margin: "auto",
          ml: { lg: "10%", xs: "1%" },
          mr: { lg: "10%", xs: "1%" },
          padding: 2,
          borderRadius: 2,
          textAlign: "center",
          overflowX: "hidden",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#895129",
            color: "#fff",
            fontSize: { xs: "10px", sm: "20px" },
            heigth: { xs: "20px", sm: "40px" },
            width: { xs: "100px", sm: "258px" },
            mb: 1,
            "&:hover": { backgroundColor: "#895129" },
          }}
        >
          CONTACT US
        </Button>
        {landingPageDetailsByParmalinks?.content ? (
          <Typography
            variant="body1"
            sx={{
              mt: "10px",
              mb: "10px",
              fontSize: { xs: "12px", sm: "14px" },
              lineHeight: "1.5",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: landingPageDetailsByParmalinks.content,
            }}
          />
        ) : (
          loadingView && <Skeleton variant="text" width="90%" height={50} />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            mt: { xs: 1, sm: 0 },
            gap: { xs: 0, sm: 2 },
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" },
            }}
          >
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              noValidate
              autoComplete="off"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                {renderTextField("Name", "name", "text")}
                {renderTextField("Email", "email", "text")}
              </Box>
              {/* {renderTextField("Subject", "subject", "text")} */}
              <Grid item xs={12}>
                <Stack sx={{ pt: 2 }}>
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
                    rows={8}
                    variant="outlined"
                    placeholder="Type your message"
                    value={formValues?.message || ""}
                    onChange={(e) => {
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        message: e.target.value,
                      }));
                      setErrors(validateForm());
                    }}
                    error={!!errors.message}
                  />
                  {errors.message && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.message}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#895129",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#6d3f23" },
                  // width: "200px",
                  width: { xs: "100%", sm: "200px" },
                }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#895129" }} />
                ) : (
                  "Send"
                )}
              </Button>
            </Box>
          </Box>
          <AdsRenderer ads={landingGoogleAdsPageList} position="Square" />
        </Box>
        <AdsRenderer ads={landingGoogleAdsPageList} position="Full Width" />
      </Box>
    </Box>
  );
};

export default memo(Contact);
