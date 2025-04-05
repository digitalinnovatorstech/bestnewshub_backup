import { memo, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Stack,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import logo from "../../../assets/news/logo.png";
import { SingleSelect } from "../../../components/singleSelect/SingleSelect";
import { City, Country, State } from "country-state-city";
import {
  getCityIdList,
  getCountryIdList,
  getStateIdList,
} from "../../../utility/helpers/globalHelpers";
import PropTypes from "prop-types";
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

function WelcomeUser({ formValues, setFormValues, errors, setErrors }) {
  const navigate = useNavigate();
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const countryList = Country.getAllCountries();
  const upDatedCountryList = getCountryIdList(countryList);
  const indiaIsoCode = Country.getCountryByCode("IN").isoCode;
  const getAllStateList = State.getStatesOfCountry(indiaIsoCode);
  const stateList = getStateIdList(getAllStateList);
  const [cityList, setCityList] = useState([]);
  const StateWishCityList = getCityIdList(cityList);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
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
    if (name === "zipCode") {
      // Only allow digits, and the zip code should be exactly 6 digits
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));

        if (value.length === 6) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Zip code must be exactly 6 digits",
        }));
      }
      return;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const onSelectChangeHandler = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "state" && value) {
      const selectedState = getAllStateList.find(
        (state) => state.name === value
      );
      if (selectedState) {
        const cities = City.getCitiesOfState(
          indiaIsoCode,
          selectedState.isoCode
        );
        setCityList(cities);
      }
    }
  };

  useEffect(() => {
    if (formValues.state) {
      const selectedState = getAllStateList.find(
        (state) => state.name === formValues.state
      );
      if (selectedState) {
        const cities = City.getCitiesOfState(
          indiaIsoCode,
          selectedState.isoCode
        );
        setCityList(cities);
        if (!cities.find((city) => city.name === formValues.city)) {
          setFormValues((prevValues) => ({
            ...prevValues,
            city: "",
          }));
        }
      }
    }
  }, [formValues.state]);

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
  const renderSelectField = (
    label,
    name,
    data,
    required = false,
    disabled = false
  ) => (
    <Grid item pt={1} style={{ width: "100%" }}>
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
          {datakey?.userData?.email && (
            <Typography variant="body2" sx={{ color: "gray" }}>
              Email : {datakey?.userData?.email || ""}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {renderTextField("Display Name", "displayName", "text", true)}
            <Stack
              sx={{ marginTop: 2, display: "flex", flexDirection: "column" }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                Address
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isTabMode ? "column" : "row",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {renderSelectField(
                  "Country",
                  "country",
                  upDatedCountryList,
                  true,
                  true
                )}
                {renderSelectField("State", "state", stateList, true, false)}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isTabMode ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {renderSelectField("City", "city", StateWishCityList, true)}
                {renderTextField("Postal Code", "zipCode", "text", true)}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isTabMode ? "column" : "row",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {renderTextField("Street name", "streetName", "text", true)}
                {renderTextField("House no", "houseNo", "text", true)}
              </Box>
            </Stack>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {renderTextField("Qualification", "qualification", "text", true)}
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
}

WelcomeUser.propTypes = {
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default memo(WelcomeUser);
