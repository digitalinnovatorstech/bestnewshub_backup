import React, { useState } from "react";
import { Box } from "@mui/material";
import ImageGallery from "./ImageGallery";

const TempPost = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageSelection = (images) => {
    // setSelectedImages(images);
    setSelectedImages((prevImages) => [...prevImages, ...images]);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ImageGallery onImageSelect={handleImageSelection} />

      {selectedImages.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <h3>Selected Images Preview:</h3>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {selectedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Selected ${index}`}
                style={{ maxWidth: "150px", height: "auto", margin: "5px" }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TempPost;
