const multer = require("multer");
const cloudinary = require("./cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const addUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      stream.end(req.file.buffer); // send file buffer to Cloudinary
    });

    res.status(200).send({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    // console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = { upload, addUpload };
