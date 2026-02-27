// import express from "express";
// import multer from "multer";
// import {
//   createDetection,
//   getAllDetections,
//   getSingleDetection
// } from "../controller/detectionController.js";

// const detectionRoutes = express.Router();


// // Multer config (video upload)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });


// // Routes
// detectionRoutes.post("/detections", upload.single("video"), createDetection);

// detectionRoutes.get("/detections", getAllDetections);

// detectionRoutes.get("/detections/:id", getSingleDetection);

// export default detectionRoutes;



import express from "express";
import upload from "../middleware/upload.js";
import {
  createDetection,
  getAllDetections,
  getSingleDetection
} from "../controller/detectionController.js";

const detectionRoutes = express.Router();

// Single file upload (image OR video)
detectionRoutes.post(
  "/detections",
  upload.single("media"),
  createDetection
);

detectionRoutes.get("/getdetections", getAllDetections);
detectionRoutes.get("/getdetections/:id", getSingleDetection);

export default detectionRoutes;