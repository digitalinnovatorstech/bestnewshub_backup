import {
  Box,
  Container,
  Stack,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WelcomeUser from "./WelcomeUser";
import Welcomepage from "./Welcomepage";
import { postalCodeRegex } from "../../../utility/regex";
import axios from "axios";
import WelcomSignup from "./WelcomSignup";

const Welcom = () => {
  const isTabMode = useMediaQuery("(max-width: 768px)");
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (loginUserDetails) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [loginUserDetails]);

  const [formValues, setFormValues] = useState({
    firstName: datakey?.userData?.firstName || "",
    lastName: datakey?.userData?.lastName || "",
    email: datakey?.userData?.email || "",
    password: "",
    confirmPassword: "",
    countryCode: "+91",
    phoneNumber: datakey?.userData?.phoneNumber || "",
    userType: "GUEST AUTHOR",
    joiningDate: new Date().toISOString().split("T")[0],
    displayName: "",
    country: "India",
    state: "",
    city: "",
    zipCode: "",
    streetName: "",
    houseNo: "",
    qualification: "",
    idType: "Aadhar",
    idNumber: "",
    frontSide: "",
    backSide: "",
    preference: [],
    profilePhoto: "",
  });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const validationErrors = validateForm();
    if (
      Object.keys(validationErrors).length === 0 &&
      currentStep < totalSteps
    ) {
      setCurrentStep(currentStep + 1);
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    if (!loginUserDetails) {
      if (currentStep === 1 && !formValues.password)
        newErrors.password = "Password is required";
      else if (!passwordRegex.test(formValues.password))
        newErrors.password = "Password must be at least 8 characters long";

      if (currentStep === 1 && !formValues.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      else if (formValues.password !== formValues.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    if (currentStep === 1 && !formValues.firstName)
      newErrors.firstName = "First Name is required";
    if (currentStep === 1 && !formValues.lastName)
      newErrors.lastName = "Last Name is required";
    if (currentStep === 1 && !formValues.email)
      newErrors.email = "Email is required";
    if (currentStep === 1 && !formValues.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";

    if (currentStep === 2 && !formValues.displayName) {
      newErrors.displayName = "Display Name is required";
    }
    if (currentStep === 2 && !formValues.state) {
      newErrors.state = "State is required";
    }
    if (currentStep === 2 && !formValues.city) {
      newErrors.city = "City is required";
    }
    if (currentStep === 2 && !formValues.zipCode) {
      newErrors.zipCode = "Postal Code is required";
    } else if (currentStep === 2 && !postalCodeRegex.test(formValues.zipCode))
      newErrors.zipCode = "Invalid Postal Code format";
    if (currentStep === 2 && !formValues.streetName) {
      newErrors.streetName = "Street Name is required";
    }
    if (currentStep === 2 && !formValues.houseNo) {
      newErrors.houseNo = "House No is required";
    }
    if (currentStep === 2 && !formValues.qualification) {
      newErrors.qualification = "Qualification is required";
    }
    if (currentStep === 3 && !formValues.idNumber) {
      newErrors.idNumber = "ID Number is required.";
    }
    if (currentStep === 3 && !formValues.frontSide) {
      newErrors.frontSide = "Front side is required.";
    }
    if (currentStep === 3 && !formValues.backSide) {
      newErrors.backSide = "Front side is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
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
    setLoading(true);
    try {
      let response;
      if (!loginUserDetails) {
        response = await axios.post(`${apiUrl}/landing/create/user`, data, {
          headers: {
            Authorization: `Bearer ${datakey?.token?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.put(
          `${apiUrl}/landing/user/update/${datakey?.userData?.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${datakey?.token?.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate("/Verification");
        }, 1000);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xxl"
      disableGutters
      sx={{
        background: "#FCF8E7",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        // overflow: "hidden",
        overflow: "auto",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          // width: "80%",
          width: isTabMode ? "80%" : "100%",
          height: "100%",
        }}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "700px" },
            maxWidth: isTabMode ? "900px" : "700px",
            height: "auto",
            background: "#fff",
            padding: "25px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            sx={{
              heigth: "auto",
              // height: "calc(100vh - 120px)",
              // overflow: "auto",
              position: "relative",
            }}
          >
            <Box>
              {currentStep === 1 && (
                <WelcomSignup
                  formValues={formValues}
                  setFormValues={setFormValues}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {currentStep === 2 && (
                <WelcomeUser
                  formValues={formValues}
                  setFormValues={setFormValues}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {currentStep === 3 && (
                <Welcomepage
                  formValues={formValues}
                  setFormValues={setFormValues}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
            </Box>

            <Stack
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                position: "sticky",
                bottom: 0,
                backgroundColor: "#fff",
                zIndex: 1,
                padding: "10px 0",
              }}
            >
              <Box sx={{ mr: 2 }}>
                {!currentStep === 1 ||
                  (!currentStep === 2 && loginUserDetails === null && (
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
                      onClick={handlePrevious}
                      // disabled={currentStep === 1}
                      disabled={
                        currentStep === 1 ||
                        (currentStep === 2 && loginUserDetails !== null)
                      }
                    >
                      Previous
                    </Button>
                  ))}
              </Box>
              <Box>
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
                  onClick={
                    currentStep === totalSteps ? handleSubmit : handleNext
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#895129" }} />
                  ) : currentStep === totalSteps ? (
                    "Submit"
                  ) : (
                    "Next"
                  )}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(Welcom);
