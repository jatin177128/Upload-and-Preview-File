// src/components/FileUpload.jsx
import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const type = uploadedFile.type.split("/")[0]; // image, video, audio, application
    setFileType(type);

    // Create a preview URL
    setPreview(URL.createObjectURL(uploadedFile));
    setError(""); // Reset any previous errors
  };

  const handleFileUpload = async () => {
    if (!file) return; // Ensure a file is selected
  
    setLoading(true); // Set loading state
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("https://upload-and-preview-file.vercel.app", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error('File upload failed');
      }
  
      const blob = await res.blob(); // Get the response as a blob
      const previewUrl = URL.createObjectURL(blob); // Create a URL for the image
      setPreview(previewUrl); // Set the preview to the manipulated image URL
  
      alert("File uploaded and manipulated successfully!"); // Notify success
    } catch (error) {
      setError(error.message); // Set error state
      console.error("Error during file upload:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Upload and Preview File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Preview:</h3>
          {fileType === "image" && (
            <img
              src={preview}
              alt="Image Preview"
              className="w-full h-auto rounded-md shadow-md"
            />
          )}
          {fileType === "video" && (
            <video controls className="w-full rounded-md shadow-md">
              <source src={preview} />
            </video>
          )}
          {fileType === "audio" && (
            <audio controls className="w-full">
              <source src={preview} />
            </audio>
          )}
          {fileType === "application" && (
            <iframe
              src={preview}
              className="w-full h-64 border rounded-md"
              title="Document Preview"
            ></iframe>
          )}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleFileUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;
