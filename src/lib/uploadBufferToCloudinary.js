import streamifier from "streamifier";
import cloudinary from "./cloudinary.js"; 

export const uploadBufferToCloudinary = (buffer, folder = "contacts") => {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
};