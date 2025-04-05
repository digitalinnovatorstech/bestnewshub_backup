import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Radio,
  RadioGroup,
  Stack,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Avatar,
  FormHelperText,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import logo from "../../../assets/news/logo.png";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getLandingPopularCategoryList } from "../../../services/slices/landingSlice";
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

function Welcomepage({ formValues, setFormValues, errors, setErrors }) {
  const navigate = useNavigate();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const landingPopularCategoryList = useSelector(
    (state) => state.landing.landingPopularCategoryList
  );
  useEffect(() => {
    dispatch(getLandingPopularCategoryList());
  }, [dispatch]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleCategoryVisibility = () => {
    setShowAllCategories((prev) => !prev);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }));
  };

  const [profilePicture, setProfilePicture] = useState(null);
  const profileInputRef = useRef(null);
  const handleProfilePhotoChange = (file) => {
    setProfilePicture(file);
    setFormValues((prev) => ({
      ...prev,
      profilePhoto: file,
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const renderTextField = (label, name, type = "text", required = false) => (
    <Grid pt={1} item style={{ width: "100%" }}>
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
          <Typography variant="body2" sx={{ color: "gray" }}>
            Email : {formValues?.email || ""}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
              Upload Your ID Proof
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                name="idType"
                value={formValues.idType || "Aadhar"}
                onChange={(e) =>
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    idType: e.target.value,
                  }))
                }
                row
              >
                <FormControlLabel
                  value="Aadhar"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#895129",
                        },
                      }}
                    />
                  }
                  label="Aadhar card"
                />
                <FormControlLabel
                  value="Voter"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#895129",
                        },
                      }}
                    />
                  }
                  label="Voter ID"
                />
                <FormControlLabel
                  value="Passport"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#895129",
                        },
                      }}
                    />
                  }
                  label="Passport"
                />
              </RadioGroup>
            </FormControl>
            {renderTextField("ID Number", "idNumber", "text", true)}
            <Grid
              container
              mt={1}
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: isTabMode ? "column" : "row",
              }}
            >
              <Grid item xs={12} sm={6}>
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
                  component="label"
                  fullWidth
                  color={errors.frontSide ? "error" : "primary"}
                >
                  {formValues.frontSide ? "File Uploaded" : "Front Side"}
                  <input
                    type="file"
                    name="frontSide"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.frontSide && (
                  <Typography variant="caption" color="error">
                    {errors.frontSide}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  component="label"
                  fullWidth
                  color={errors.backSide ? "error" : "primary"}
                >
                  {formValues.backSide ? "File Uploaded" : "Back Side"}
                  <input
                    type="file"
                    name="backSide"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.backSide && (
                  <Typography variant="caption" color="error">
                    {errors.backSide}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              sx={{ mt: 2, fontStyle: "italic", color: "gray" }}
            >
              Note: Your privacy is of the utmost importance to us, and we take
              all necessary measures to protect your personal data.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                Select your Preferences
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                You can select max two categories only
              </Typography>
              {landingPopularCategoryList?.map((category, index) => {
                const isVisible =
                  showAllCategories || index < 4 * (showAllCategories ? 2 : 1);
                return (
                  isVisible && (
                    <Button
                      key={category.name || index}
                      variant="outlined"
                      onClick={() => {
                        setFormValues((prevState) => {
                          let updatedPreference = [...prevState.preference];
                          if (updatedPreference.includes(category.categoryId)) {
                            updatedPreference = updatedPreference.filter(
                              (item) => item !== category.categoryId
                            );
                          } else if (updatedPreference.length < 2) {
                            updatedPreference.push(category.categoryId);
                          }
                          return {
                            ...prevState,
                            preference: updatedPreference,
                          };
                        });
                      }}
                      sx={{
                        backgroundColor: formValues.preference.includes(
                          category.categoryId
                        )
                          ? "#895129"
                          : "white",
                        color: formValues.preference.includes(
                          category.categoryId
                        )
                          ? "white"
                          : "#895129",
                        fontWeight: 500,
                        textTransform: "none",
                        flex: "0 1 auto",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        margin: "5px",
                        borderColor: "#895129",
                        "&:hover": {
                          backgroundColor: formValues.preference.includes(
                            category.categoryId
                          )
                            ? "#b5651d"
                            : "#f0f0f0",
                          color: formValues.preference.includes(
                            category.categoryId
                          )
                            ? "white"
                            : "#333",
                          borderColor: formValues.preference.includes(
                            category.categoryId
                          )
                            ? "#b5651d"
                            : "#ddd",
                        },
                      }}
                    >
                      {category.name}
                    </Button>
                  )
                );
              })}
              {landingPopularCategoryList.length > 8 && (
                <span
                  onClick={toggleCategoryVisibility}
                  style={{
                    color: "#895129",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {showAllCategories ? "Show Less" : "More"}
                </span>
              )}
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                Upload Profile Photo
              </Typography>
              <Card variant="outlined" sx={{}}>
                <CardContent sx={{ height: { xs: "auto", sm: "150px" } }}>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      height: { xs: "150px", sm: "120px" },
                    }}
                  >
                    <Avatar
                      src={
                        profilePicture
                          ? URL.createObjectURL(profilePicture)
                          : undefined
                      }
                      sx={{
                        width: { xs: "80px", sm: "100px" },
                        height: { xs: "80px", sm: "100px" },
                      }}
                    />
                    <Button
                      variant="contained"
                      tabIndex={-1}
                      sx={{
                        background: "#FCF8E7",
                        color: "#895129",
                        padding: "12px 20px",
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
                        onChange={(e) =>
                          handleProfilePhotoChange(e.target.files[0])
                        }
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
                        marginTop: "10px",
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
          </Box>
        </Box>
      </Stack>
    </>
  );
}

Welcomepage.propTypes = {
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default Welcomepage;
