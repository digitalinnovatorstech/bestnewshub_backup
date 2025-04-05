import moment from "moment";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function getIdList(arr) {
  if (arr && arr?.length > 0) {
    let result = arr?.map((item) => ({
      id: item?.id,
      name: item?.name,
    }));
    return result;
  }
}

export function capitalizeFirstLetter(word) {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1);
}

export function formatDate(dateString) {
  return moment(dateString).format("DD-MM-YYYY");
}

export function formatStatus(status) {
  return status?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}
export const truncateDescription = (description) => {
  if (!description) return "";
  const words = description.trim().split(" ");
  if (words.length > 3) {
    return `${words[0]} ${words[1]} ${words[2]} ...`;
  }
  return description;
};

export const truncateName = (name) => {
  if (!name) return "";
  const capitalizeFirstLetter = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  const words = name.trim().split(" ").map(capitalizeFirstLetter);
  if (words.length > 3) {
    return `${words[0]} ${words[1]} ...`;
  }
  return words.join(" ");
};

export const sanitizeURL = (url) => {
  try {
    const validatedUrl = new URL(url);
    const sanitizedUrl = validatedUrl.href.replace(
      /[^a-zA-Z0-9:/?&=._-]/g,
      "-"
    );
    return sanitizedUrl;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export const formatNameLowerUpper = (name) => {
  if (!name) return "";
  return name.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};

export function getCountryIdList(arr) {
  if (arr && arr?.length > 0) {
    let result = arr?.map((item) => ({
      id: item?.name,
      name: item?.name,
    }));
    return result;
  }
}

export function getStateIdList(arr) {
  if (arr && arr?.length > 0) {
    let result = arr?.map((item) => ({
      id: item?.name,
      name: item?.name,
    }));
    return result;
  }
}

export function getCityIdList(arr) {
  if (arr && arr?.length > 0) {
    let result = arr?.map((item) => ({
      id: item?.name,
      name: item?.name,
    }));
    return result;
  }
}

export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}

// export const AdsRenderer = ({ ads, position }) => {
//   const ad = ads?.find((ad) => ad.adsPosition === position);
//   if (!ad) return null;
//   return <div dangerouslySetInnerHTML={{ __html: ad.adsScript }} />;
// };
// export const AdsRenderer = ({ ads, position }) => {
//   const ad = ads?.find((ad) => ad.adsPosition === position);
//   if (!ad) return null;

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.innerHTML = ad.adsScript;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [ad]);

//   return <div id={`ad-container-${position}`} />;
// };
