import React, { useState, memo, useRef } from "react";
import ReactQuill from "react-quill";
import ImageUploadPopup from "./ImageUploadPopup";
import "react-quill/dist/quill.snow.css";
import { uploadFileToS3 } from "../../../utility/s3.util";

const Editor = () => {
  const [formValues, setFormValues] = useState({ content: "", images: [] });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const reactQuillRef = useRef(null);

  const handleImageUpload = async (files) => {
    try {
      const uploadedImageUrls = [];
      for (const file of files) {
        uploadedImageUrls.push(file);

        const quill = reactQuillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, "image", imageUrl);
          quill.setSelection(range.index + 1);
        }
      }

      setFormValues((prevValues) => ({
        ...prevValues,
        images: [...prevValues.images, ...uploadedImageUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setPopupOpen(false);
    }
  };

  const imageHandler = () => {
    setPopupOpen(true);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }],
        [{ size: ["small", "normal", "large", "huge"] }],
        [{ font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    return newErrors;
  };

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        value={formValues.content}
        onChange={(content) =>
          setFormValues((prevValues) => ({ ...prevValues, content }))
        }
        modules={modules}
        formats={[
          "header",
          "font",
          "size",
          "list",
          "bullet",
          "indent",
          "bold",
          "italic",
          "underline",
          "strike",
          "align",
          "color",
          "background",
          "blockquote",
          "code-block",
          "link",
          "image",
          "video",
          "clean",
        ]}
        style={{
          height: "300px",
          maxHeight: "300px",
          marginBottom: "20px",
        }}
      />
      <ImageUploadPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onImageUpload={handleImageUpload}
      />
    </>
  );
};

export default memo(Editor);
