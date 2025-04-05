// import React, { useState, useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "react-advanced-cropper/dist/style.css";
// import { Cropper } from "react-advanced-cropper";

// const ReactEditorWithCropper = () => {
//   const [editorHtml, setEditorHtml] = useState("");
//   const [image, setImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const cropperRef = useRef(null);
//   const quillRef = useRef(null);

//   const handleChange = (html) => {
//     setEditorHtml(html);
//   };

//   const handleImageUpload = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = () => setImage(reader.result);
//         reader.readAsDataURL(file);
//       }
//     };
//   };

//   const onCrop = () => {
//     if (cropperRef.current) {
//       const canvas = cropperRef.current.getCanvas();
//       if (canvas) {
//         console.log("canvas-------", canvas);

//         setCroppedImage(canvas.toDataURL("image/png"));
//       }
//     }
//   };

//   const cancelCrop = () => {
//     setCroppedImage(null);
//   };

//   // Quill editor modules
//   const modules = {
//     toolbar: {
//       container: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
//         [
//           { list: "ordered" },
//           { list: "bullet" },
//           { indent: "-1" },
//           { indent: "+1" },
//         ],
//         ["link", "image"], // Add image upload option
//       ],
//       handlers: {
//         image: handleImageUpload,
//       },
//     },
//   };

//   // Quill editor formats
//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//   ];

//   return (
//     <div>
//       {/* React Quill Editor */}
//       <ReactQuill
//         ref={quillRef} // Attach ref to Quill editor
//         value={editorHtml}
//         onChange={handleChange}
//         theme="snow"
//         modules={modules}
//         formats={formats}
//         style={{ minHeight: "300px", marginBottom: "20px" }}
//       />

//       {/* Image Cropper */}
//       {image && (
//         <div>
//           <div>
//             <Cropper
//               src={image}
//               ref={cropperRef}
//               style={{
//                 width: "auto",
//                 height: "400px",
//                 marginBottom: "20px",
//                 border: "5px solid #ddd",
//               }}
//               //   onChange={onCrop}
//             />
//           </div>
//           <button onClick={onCrop}>Crop Image</button>
//           <button onClick={cancelCrop}>revert</button>
//         </div>
//       )}

//       {croppedImage && (
//         <div>
//           <h3>Cropped Image Preview:</h3>
//           <img
//             src={croppedImage}
//             alt="Cropped Preview"
//             style={{
//               width: "100%",
//               maxWidth: "400px",
//               marginBottom: "20px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReactEditorWithCropper;

import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill editor styling
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css"; // Cropper styling
import Table from "quill-table-ui"; // Import table module
import "quill-table-ui/dist/index.css"; // Table module styling

// Register the table module
import Quill from "quill";
Quill.register(
  {
    "modules/table": Table,
  },
  true
);

const ReactEditorWithCropper = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cropperRef = useRef(null);
  const quillRef = useRef(null); // React Quill editor ref

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  // Custom Image Upload Handler
  const handleImageUpload = () => {
    const input = document.createElement("input");

    // console.log("inputinput", input);

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    // console.log("---------------------------");

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result); // Set image for cropping
          setIsModalOpen(true); // Open crop modal
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Crop Button Handler
  const onCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const croppedImageData = canvas.toDataURL("image/png");

        // Get the Quill editor instance
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            // Insert cropped image at cursor position
            quill.insertEmbed(range.index, "image", croppedImageData);
          } else {
            // Insert image at the end of editor if no selection
            quill.insertEmbed(quill.getLength(), "image", croppedImageData);
          }
        }
      }
    }
    setIsModalOpen(false); // Close modal after cropping
  };

  // Cancel Cropping
  const cancelCrop = () => {
    setImage(null);
    setIsModalOpen(false); // Close modal without cropping
  };

  // Quill Editor Modules
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "table"], // Enable image and table in toolbar
      ],
      handlers: {
        image: handleImageUpload, // Custom image handler
      },
    },
    table: true, // Enable table module
  };

  // console.log("modulesmodules", modules);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "table", // Add table to formats
  ];

  return (
    <div>
      {/* React Quill Editor */}
      <ReactQuill
        ref={quillRef} // Attach quillRef
        value={editorHtml}
        onChange={handleChange}
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ minHeight: "300px", marginBottom: "20px" }}
      />

      {/* Image Cropper Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
            }}
          >
            <div>
              <Cropper
                src={image}
                ref={cropperRef} // Attach cropper ref
                style={{
                  width: "100%",
                  height: "400px",
                  marginBottom: "20px",
                  border: "5px solid #ddd",
                }}
              />
            </div>
            <button onClick={onCrop}>Crop Image</button>
            <button onClick={cancelCrop}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactEditorWithCropper;
