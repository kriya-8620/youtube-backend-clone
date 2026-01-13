import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "temp");

/*console.log("PROCESS CWD:", process.cwd());
console.log("UPLOAD DIR:", uploadDir);*/

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Upload directory created");
} else {
  console.log("Upload directory already exists");
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log("Multer destination called");
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    console.log("Saving file as:", file.originalname);
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });
