import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import store from "@/store/store";
import "@/styles/globals.css";
import Header from "@/components/newLandingLayout/header/Header";
import Footer from "@/components/newLandingLayout/footer/Footer";
import { Container, Box } from "@mui/material";
import { DefaultSeo } from "next-seo";
import SEOConfig from "../next-seo.config";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
  typography: {
    h1: { fontSize: "2rem", margin: 0 },
    h2: { fontSize: "1.5rem", margin: 0 },
  },
});

export default function App({ Component, pageProps }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [assets, setAssets] = useState({});
  const hasFetchedData = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;

      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/landing/setting/appearance/get`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setAssets(response?.data?.data);
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      fetchData();
    }
  }, []);

  // useEffect(() => {
  //   if (!window.adsbygoogle) {
  //     const script = document.createElement("script");
  //     script.src =
  //       "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9632557061063857";
  //     script.async = true;
  //     script.dataset.adClient = "ca-pub-9632557061063857";
  //     script.crossOrigin = "anonymous";
  //     document.body.appendChild(script);
  //   }
  // }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost"
    ) {
      if (!window.adsbygoogle) {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9632557061063857";
        script.async = true;
        script.dataset.adClient = "ca-pub-9632557061063857";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
      }
    }
    console.error = () => {};
    return () => {
      console.error = console.error;
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-SN3EG24FYY";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

  // useEffect(() => {
  //   if (assets?.customJS) {
  //     const existingScript = document.querySelector("#custom-script");
  //     if (existingScript) existingScript.remove();

  //     const script = document.createElement("script");
  //     script.id = "custom-script";
  //     script.innerHTML = assets.customJS;
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }

  //   if (assets?.customCSS) {
  //     const existingStyle = document.querySelector("#custom-style");
  //     if (existingStyle) existingStyle.remove(); // Prevent duplicate styles

  //     const style = document.createElement("style");
  //     style.id = "custom-style";
  //     style.innerHTML = assets.customCSS;
  //     document.head.appendChild(style);
  //   }
  // }, [assets]);

  useEffect(() => {
    if (Array.isArray(assets)) {
      // Apply JavaScript
      assets.forEach(({ customJS, src, id }) => {
        if (customJS) {
          const existingScript = document.querySelector(`#custom-script-${id}`);
          if (existingScript) existingScript.remove();

          const script = document.createElement("script");
          script.id = `custom-script-${id}`;
          script.innerHTML = JSON.stringify(customJS);
          script.async = true;
          if (src) {
            script.src = src;
          } else if (customJS) {
            script.innerHTML = customJS;
          }
          document.body.appendChild(script);
        }
      });

      assets.forEach(({ customCSS, id }) => {
        if (customCSS) {
          const existingStyle = document.querySelector(`#custom-style-${id}`);
          if (existingStyle) existingStyle.remove();
          const style = document.createElement("style");
          style.id = `custom-style-${id}`;
          try {
            const parsedCSS = JSON.parse(customCSS);
            if (parsedCSS.selector && parsedCSS.rules) {
              style.innerHTML = `${parsedCSS.selector} { ${parsedCSS.rules} }`;
            } else {
              style.innerHTML = customCSS;
            }
          } catch (error) {
            style.innerHTML = customCSS;
          }
          document.head.appendChild(style);
        }
      });
    }
  }, [assets]);

  // if (router.pathname === "/404") {
  //   return <Component {...pageProps} />;
  // }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <link
            rel="icon"
            type="image/png"
            href="https://admin.bestnewshub.com/api/favicon.ico"
          />
          {/* {assets.customCSS && <style>{assets.customCSS}</style>} */}
        </Head>

        <Container
          maxWidth="xxl"
          disableGutters
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            width: "100%",
          }}
        >
          <Header />
          <Box sx={{ flexGrow: 1 }}>
            <DefaultSeo {...SEOConfig} />
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Container>
      </ThemeProvider>
    </Provider>
  );
}
