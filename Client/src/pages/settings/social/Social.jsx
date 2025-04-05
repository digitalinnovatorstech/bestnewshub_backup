import {
  Backdrop,
  Box,
  Button,
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
  useMediaQuery,
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import {
  addSocialInfo,
  deleteSocialInfo,
  getSocialInfo,
  getSocialList,
  updateSocialInfo,
} from "../../../services/slices/globalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import * as MuiIcons from "@mui/icons-material";
import { urlPattern } from "../../../utility/regex";

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
  title: "",
  iconName: "",
  url: "",
};
const socialSite = [
  { id: "Facebook", name: "Facebook" },
  { id: "Twitter", name: "Twitter" },
  { id: "Instagram", name: "Instagram" },
  { id: "LinkedIn", name: "LinkedIn" },
  { id: "YouTube", name: "YouTube" },
  { id: "Pinterest", name: "Pinterest" },
  { id: "WhatsApp", name: "WhatsApp" },
  { id: "Snapchat", name: "Snapchat" },
  { id: "Reddit", name: "Reddit" },
  { id: "Telegram", name: "Telegram" },
  { id: "GitHub", name: "GitHub" },
  { id: "Others", name: "Others" },
];

// const socialMediaOptions = {
//   Facebook: [
//     { id: "Facebook", name: "Facebook" },
//     { id: "FacebookOutlined", name: "FacebookOutlined" },
//     { id: "FacebookRounded", name: "FacebookRounded" },
//     { id: "FacebookSharp", name: "FacebookSharp" },
//     { id: "FacebookTwoTone", name: "FacebookTwoTone" },
//   ],

//   Twitter: [
//     { id: "Twitter", name: "Twitter" },
//     { id: "TwitterOutlined", name: "TwitterOutlined" },
//     { id: "TwitterRounded", name: "TwitterRounded" },
//     { id: "TwitterSharp", name: "TwitterSharp" },
//     { id: "TwitterTwoTone", name: "TwitterTwoTone" },
//   ],

//   Instagram: [
//     { id: "Instagram", name: "Instagram" },
//     { id: "InstagramOutlined", name: "InstagramOutlined" },
//     { id: "InstagramRounded", name: "InstagramRounded" },
//     { id: "InstagramSharp", name: "InstagramSharp" },
//     { id: "InstagramTwoTone", name: "InstagramTwoTone" },
//   ],

//   LinkedIn: [
//     { id: "LinkedIn", name: "LinkedIn" },
//     { id: "LinkedInOutlined", name: "LinkedInOutlined" },
//     { id: "LinkedInRounded", name: "LinkedInRounded" },
//     { id: "LinkedInSharp", name: "LinkedInSharp" },
//     { id: "LinkedInTwoTone", name: "LinkedInTwoTone" },
//   ],

//   YouTube: [
//     { id: "YouTube", name: "YouTube" },
//     { id: "YouTubeOutlined", name: "YouTubeOutlined" },
//     { id: "YouTubeRounded", name: "YouTubeRounded" },
//     { id: "YouTubeSharp", name: "YouTubeSharp" },
//     { id: "YouTubeTwoTone", name: "YouTubeTwoTone" },
//   ],

//   Pinterest: [
//     { id: "Pinterest", name: "Pinterest" },
//     { id: "PinterestOutlined", name: "PinterestOutlined" },
//     { id: "PinterestRounded", name: "PinterestRounded" },
//     { id: "PinterestSharp", name: "PinterestSharp" },
//     { id: "PinterestTwoTone", name: "PinterestTwoTone" },
//   ],

//   WhatsApp: [
//     { id: "WhatsApp", name: "WhatsApp" },
//     { id: "WhatsAppOutlined", name: "WhatsAppOutlined" },
//     { id: "WhatsAppRounded", name: "WhatsAppRounded" },
//     { id: "WhatsAppSharp", name: "WhatsAppSharp" },
//     { id: "WhatsAppTwoTone", name: "WhatsAppTwoTone" },
//   ],

//   Snapchat: [
//     { id: "Snapchat", name: "Snapchat" },
//     { id: "SnapchatOutlined", name: "SnapchatOutlined" },
//     { id: "SnapchatRounded", name: "SnapchatRounded" },
//     { id: "SnapchatSharp", name: "SnapchatSharp" },
//     { id: "SnapchatTwoTone", name: "SnapchatTwoTone" },
//   ],

//   Reddit: [
//     { id: "Reddit", name: "Reddit" },
//     { id: "RedditOutlined", name: "RedditOutlined" },
//     { id: "RedditRounded", name: "RedditRounded" },
//     { id: "RedditSharp", name: "RedditSharp" },
//     { id: "RedditTwoTone", name: "RedditTwoTone" },
//   ],

//   Telegram: [
//     { id: "Telegram", name: "Telegram" },
//     { id: "TelegramOutlined", name: "TelegramOutlined" },
//     { id: "TelegramRounded", name: "TelegramRounded" },
//     { id: "TelegramSharp", name: "TelegramSharp" },
//     { id: "TelegramTwoTone", name: "TelegramTwoTone" },
//   ],

//   GitHub: [
//     { id: "GitHub", name: "GitHub" },
//     { id: "GitHubOutlined", name: "GitHubOutlined" },
//     { id: "GitHubRounded", name: "GitHubRounded" },
//     { id: "GitHubSharp", name: "GitHubSharp" },
//     { id: "GitHubTwoTone", name: "GitHubTwoTone" },
//   ],
//   others: [
//     { id: "RssFeed", name: "RssFeed" },
//     { id: "Share", name: "Share" },
//   ],
// };

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

const Social = () => {
  const dispatch = useDispatch();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);
  // const [dropdownOptions, setDropdownOptions] = useState([]);
  const socialList = useSelector((state) => state.global.socialList);
  const socialInfo = useSelector((state) => state.global.socialInfo);

  useEffect(() => {
    const fetchSocialList = async () => {
      setLoadingList(true);
      try {
        await dispatch(getSocialList());
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingList(false);
      }
    };
    fetchSocialList();
  }, [dispatch]);
  useEffect(() => {
    if (selectedEditId !== null) {
      const fetchSocialInfo = async () => {
        setLoadingInfo(true);
        try {
          await dispatch(getSocialInfo(selectedEditId));
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoadingInfo(false);
        }
      };
      fetchSocialInfo();
    }
  }, [selectedEditId, dispatch]);
  const memoizedSocialList = useMemo(() => socialList || [], [socialList]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      const urlPattern =
        /^(https?:\/\/)?(www\.)?(facebook|twitter|x|instagram|linkedin|youtube|in\.pinterest|pinterest|whatsapp|snapchat|reddit|telegram|github)\.(com|tv|co|org|me)(\/[a-zA-Z0-9._-]+)*\/?(\?[a-zA-Z0-9%&=_-]+)*$/;
      if (value === "" || urlPattern.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "Invalid URL" }));
      }
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    if (name !== "url") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const onSelectChangeHandler = (name, value) => {
    if (name?.toUpperCase() === "TITLE") {
      //   if (socialMediaOptions[value]) {
      //     // setDropdownOptions(socialMediaOptions[value]);
      //   } else {
      //     setDropdownOptions([]);
      //   }

      setFormValues((prevValues) => ({
        ...prevValues,
        iconName: value || "",
      }));
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formValues.title) newErrors.title = "Name is required";
    if (!formValues.url) newErrors.url = "URL is required";
    else if (!urlPattern.test(formValues.url)) newErrors.url = "Invalid URL";
    if (!formValues.iconName) newErrors.iconName = "Icon Name is required";
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
      const response = await dispatch(addSocialInfo(formValues)).unwrap();
      if (response.status === true) {
        toast.success(response.message);
        await dispatch(getSocialList()).unwrap();
        setFormValues({});
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // for edit
  const updatedFormValues = deepCopyFormValues(socialInfo, formValues);
  useEffect(() => {
    setFormValues((prevValue) => ({
      ...prevValue,
      ...updatedFormValues,
    }));
    // if (updatedFormValues.title) {
    //   const selectedTitle = socialSite?.find(
    //     (title) => title.id === updatedFormValues.title
    //   );
    //   setDropdownOptions(socialMediaOptions[selectedTitle?.name] || []);
    // }
  }, [socialInfo]);

  const handleupdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const updatedValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] !== socialInfo[key]) {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
    try {
      const response = await dispatch(
        updateSocialInfo({ id: selectedEditId, data: updatedValues })
      ).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getSocialList()).unwrap();
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

  // for edit
  const handleDeleteSocial = async (id) => {
    try {
      const response = await dispatch(deleteSocialInfo(id)).unwrap();
      if (response.success === true) {
        toast.success(response.message);
        await dispatch(getSocialList()).unwrap();
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
  const renderIcon = (iconName) => {
    const IconComponent = MuiIcons[iconName];
    return IconComponent ? <IconComponent fontSize="small" /> : null;
  };
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
            >
              Settings
            </Typography>
            <Typography variant="h5">/</Typography>
            <Typography variant="h5">Social Media Settings</Typography>
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
            {renderSelectField("Name", "title", socialSite, true)}
            {/* {renderSelectField("Icon", "iconName", dropdownOptions, true)} */}
            {formValues.iconName && (
              <Box
                sx={{
                  color: "#7B3300",
                  display: "flex",
                  justifyContent: {
                    lg: "start",
                    md: "start",
                    sm: "start",
                    xs: "end",
                  },
                  gap: {
                    lg: 2,
                    md: 2,
                    sm: 2,
                    xs: "0.5em",
                  },
                  mt: {
                    lg: 2,
                    md: 2,
                    sm: 2,
                    xs: "-12em",
                  },
                  mb: {
                    lg: "1em",
                    md: "1em",
                    sm: "1em",
                    xs: 20,
                  },
                }}
              >
                {(() => {
                  const IconComponent = MuiIcons[formValues.iconName];
                  return IconComponent ? (
                    <IconComponent fontSize="medium" />
                  ) : null;
                })()}
              </Box>
            )}
            {renderTextField("URL", "url", "text", true)}
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
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Social Media List
            </Typography>
            {memoizedSocialList.length > 0 ? (
              memoizedSocialList.map((social) => (
                <Box
                  key={social.id}
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
                    <IconButton
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#895129",
                        textDecoration: "none",
                      }}
                    >
                      {renderIcon(social.iconName)}
                    </IconButton>
                    <Typography
                      onClick={() => {
                        window.open(social.url, "_blank");
                      }}
                      variant="body1"
                      sx={{ fontWeight: "bold" }}
                    >
                      {social.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedEditId(social.id)}
                      aria-label="edit"
                    >
                      <EditNoteIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSocial(social.id)}
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
                No social media links available.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(Social);
