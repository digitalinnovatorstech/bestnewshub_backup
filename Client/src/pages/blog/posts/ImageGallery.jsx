import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import Image from "@mui/icons-material/Image";
import { AccessTime, Delete, Upload, CheckCircle } from "@mui/icons-material"; // Import CheckCircle icon
import {
  uploadFileToS3,
  removeFileFromS3,
  listFilesInS3,
} from "../../../utility/s3.util"; // Adjust the import path according to your project structure

const ImageGallery = ({ onImageSelect }) => {
  const imageInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("recent");

  const fetchFilesFromS3 = async () => {
    try {
      const fileUrls = await listFilesInS3();
      setFileList(fileUrls);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Error fetching files from S3.");
    }
  };

  const handleClickOpen = () => {
    fetchFilesFromS3();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImageUrl = await uploadFileToS3(file);
        setSelectedImages((prev) => [...prev, uploadedImageUrl]);
        setFileList((prevFiles) => [uploadedImageUrl, ...prevFiles]);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUploadClick = () => {
    imageInputRef.current.click();
  };

  const handleToggleImageSelection = (imgUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imgUrl)
        ? prev.filter((url) => url !== imgUrl)
        : [...prev, imgUrl]
    );
  };

  const handleConfirmSelection = () => {
    onImageSelect(selectedImages);
    setOpen(false);
  };

  const handleRemoveImage = async (imgUrl) => {
    const fileName = imgUrl.split("/").pop(); // Extract the file name from the URL
    try {
      await removeFileFromS3(fileName);
      setFileList((prev) => prev.filter((url) => url !== imgUrl));
      setSelectedImages((prev) => prev.filter((url) => url !== imgUrl));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Image />}
        sx={{ mt: 1 }}
        onClick={handleClickOpen}
      >
        Choose image
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Button
            variant={mode === "recent" ? "contained" : "outlined"}
            onClick={() => setMode("recent")}
            sx={{ mr: 1 }}
            startIcon={<AccessTime />}
          >
            Recent Images
          </Button>
          <Button
            variant={mode === "upload" ? "contained" : "outlined"}
            onClick={handleUploadClick}
            startIcon={<Upload />}
          >
            Upload Image
          </Button>
          <input
            type="file"
            accept="image/jpeg, image/png, image/svg+xml"
            ref={imageInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </DialogTitle>

        <DialogContent>
          {mode === "upload" ? (
            <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
          ) : (
            <Grid container spacing={2}>
              {fileList.map((imgUrl, index) => (
                <Grid item xs={4} key={index}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={imgUrl}
                      alt={`S3 Image ${index}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        margin: "0",
                        padding: "0",
                        cursor: "pointer",
                        border: selectedImages.includes(imgUrl)
                          ? "1px solid blue"
                          : "none",
                      }}
                      onClick={() => handleToggleImageSelection(imgUrl)}
                    />
                    {selectedImages.includes(imgUrl) && (
                      <CheckCircle
                        style={{
                          position: "absolute",
                          top: 5,
                          left: 5,
                          color: "green",
                          fontSize: "24px",
                          zIndex: 2,
                        }}
                      />
                    )}
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => handleRemoveImage(imgUrl)}
                      sx={{
                        position: "absolute",
                        top: 5, // Position the button at the top right
                        right: 5,
                        zIndex: 3, // Ensure this button is on top of everything
                        background: "none",
                        border: "none",
                        padding: 0,
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.5)",
                          color: "#f96c6c",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            color="primary"
            disabled={selectedImages.length === 0}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageGallery;
