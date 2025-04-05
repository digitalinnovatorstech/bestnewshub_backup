// import { Helmet } from "react-helmet-async";
// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";

// const DynamicSEO = ({ SEOTitle, SEODescription, SEOKeywords, SEOImage }) => {
//   const location = useLocation();
//   const [currentURL, setCurrentURL] = useState("");

//   useEffect(() => {
//     setCurrentURL(window.location.origin + location.pathname);
//   }, [location]);

//   // Ensure the SEO image is absolute and does not use dynamic query parameters
//   const validSEOImage = SEOImage.startsWith("http")
//     ? SEOImage
//     : `https://bestnewshub.com${SEOImage}`;

//   return (
//     <Helmet>
//       <title>{SEOTitle}</title>
//       <meta name="description" content={SEODescription} />
//       <meta name="keywords" content={SEOKeywords} />

//       {/* Open Graph (Facebook, LinkedIn, etc.) */}
//       <meta property="og:title" content={SEOTitle} />
//       <meta property="og:description" content={SEODescription} />
//       <meta property="og:image" content={validSEOImage} />
//       <meta property="og:image:width" content="1200" />
//       <meta property="og:image:height" content="630" />
//       <meta property="og:type" content="article" />
//       <meta property="og:url" content={currentURL} />

//       {/* Twitter Card (for Twitter previews) */}
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content={SEOTitle} />
//       <meta name="twitter:description" content={SEODescription} />
//       <meta name="twitter:image" content={validSEOImage} />

//       {/* Canonical URL */}
//       <link rel="canonical" href={currentURL} />
//     </Helmet>
//   );
// };

// export default DynamicSEO;

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const DynamicSEO = ({ SEOTitle, SEODescription, SEOKeywords, SEOImage }) => {
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    setCurrentURL(window.location.origin + location.pathname);
  }, [location]);

  // Ensure the SEO image is absolute and does not use dynamic query parameters
  const validSEOImage = SEOImage?.startsWith("http")
    ? SEOImage
    : `https://bestnewshub.com${SEOImage}`;

  // Add image dimensions (example: width: 1200px, height: 630px)
  const imageWidth = 1200; // Example width
  const imageHeight = 630; // Example height

  return (
    <Helmet>
      <title>{SEOTitle}</title>
      <meta name="description" content={SEODescription} />
      <meta name="keywords" content={SEOKeywords} />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={SEOTitle} />
      <meta property="og:description" content={SEODescription} />
      <meta property="og:image" content={validSEOImage} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={currentURL} />

      {/* Twitter Card (for Twitter previews) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SEOTitle} />
      <meta name="twitter:description" content={SEODescription} />
      <meta name="twitter:image" content={validSEOImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentURL} />
      <link rel="icon" href="/api/favicon.ico" />
    </Helmet>
  );
};

export default DynamicSEO;
