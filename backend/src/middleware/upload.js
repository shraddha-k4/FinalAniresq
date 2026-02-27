// import multer from "multer";

// // memory storage (Cloudinary v2 compatible)
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 5MB
// });

// export default upload;


import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter
});

export default upload;