import multer from "multer";

// memory storage (Cloudinary v2 compatible)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB
});

export default upload;

