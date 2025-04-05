import { memo, useEffect, useRef, useState } from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import store from "../src/store/store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { baseRoutes } from "../src/router/MainRoutes";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          "& .MuiPickersStaticWrapper-root .MuiPaper-root": {
            padding: "8px", // Adjust the padding to decrease height
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: "2rem",
      margin: 0,
    },
    h2: {
      fontSize: "1.5rem",
      margin: 0,
    },
    body1: {
      fontSize: "1rem",
      margin: 0,
    },
    subtitle2: {
      fontSize: "12px",
      margin: 0,
    },
    h6: {
      fontSize: "14px",
      margin: 0,
      fontWeight: "bold",
    },
    h5: {
      fontSize: "17px",
      margin: 0,
      fontWeight: 500,
    },
  },
});

function App() {
  const loginUserDetails = localStorage.getItem("loginUser");
  const datakey = JSON.parse(loginUserDetails);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [assets, setAssets] = useState({});
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;

      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/landing/setting/appearance/get`,
            {
              headers: {
                Authorization: `Bearer ${datakey?.token?.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          setAssets(response?.data?.data?.[0]);
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      fetchData();
    }
  }, []);

  // console.warn = () => {};
  // console.error = () => {};

  return (
    <>
      <HelmetProvider>
        {/* <Helmet>
          {assets.customCSS && <style>{assets.customCSS}</style>}
          {assets.customJS && <script>{assets.customJS}</script>}
        </Helmet> */}
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={baseRoutes} />
          </ThemeProvider>
        </Provider>
      </HelmetProvider>
    </>
  );
}

export default memo(App);
