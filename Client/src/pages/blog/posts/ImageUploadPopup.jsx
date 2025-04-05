import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import {
  AccessTime,
  Delete,
  Upload,
  CheckCircle,
  Image,
} from "@mui/icons-material";
import {
  uploadFileToS3,
  removeFileFromS3,
  listFilesInS3,
} from "../../../utility/s3.util"; // Adjust as needed

const ImageUploadPopup = ({ isOpen, onClose, onImageUpload }) => {
  const imageInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
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

  const handleRemoveImage = async (imgUrl) => {
    const fileName = imgUrl.split("/").pop();
    try {
      await removeFileFromS3(fileName);
      setFileList((prev) => prev.filter((url) => url !== imgUrl));
      setSelectedImages((prev) => prev.filter((url) => url !== imgUrl));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmSelection = () => {
    onImageUpload(selectedImages);
    onClose();
  };

  const handleDownloadImage = (imgUrl) => {
    const link = document.createElement("a");
    link.href = imgUrl; // URL of the image
    link.download = imgUrl.split("/").pop(); // Use the file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isOpen) {
    fetchFilesFromS3();
  }
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Button
          variant={mode === "recent" ? "contained" : "outlined"}
          onClick={() => setMode("recent")}
          startIcon={<AccessTime />}
          sx={{ mr: 1 }}
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
                    color="primary"
                    size="small"
                    onClick={() => handleDownloadImage(imgUrl)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 70, // Adjusted position for the download button
                      zIndex: 3,
                      padding: 0,
                      background: "none",
                      border: "none",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.5)",
                      },
                    }}
                  >
                    <Image fontSize="small" />
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => handleRemoveImage(imgUrl)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 20, // Adjusted position for the delete button
                      zIndex: 3,
                      padding: 0,
                      margin: 0,
                      background: "none",
                      border: "none",
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
        <Button onClick={onClose} color="primary">
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
  );
};

export default ImageUploadPopup;
