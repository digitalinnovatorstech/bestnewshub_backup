import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on route change
  }, [location]);

  return children; // Render the children passed to this component
};

export default ScrollToTop;
