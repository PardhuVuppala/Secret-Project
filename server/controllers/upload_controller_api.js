require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const CloudinaryAsset = require("../modals/upload_schema"); // Adjust the path to your CloudinaryAsset model

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function getResourceType(mimetype) {
  if (mimetype.startsWith("image/")) {
    return "image";
  } else if (mimetype === "application/pdf") {
    return "raw"; 
  }

  return "raw"; 
}

async function handleUpload(file, mimetype) {
  const resourceType = getResourceType(mimetype);
  const res = await cloudinary.uploader.upload(file, {
    resource_type: resourceType,
  });
  return res;
}

const storage = Multer.memoryStorage();
const upload = Multer({ storage });

router.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload the file to Cloudinary
    const cldRes = await handleUpload(dataURI, req.file.mimetype);
    
    // Create a new CloudinaryAsset document using the response from Cloudinary
    const cloudinaryAsset = new CloudinaryAsset({
      assetId: cldRes.asset_id,
      publicId: cldRes.public_id,
      version: cldRes.version,
      versionId: cldRes.version_id,
      signature: cldRes.signature,
      width: cldRes.width || 0, // Default to 0 for non-image files
      height: cldRes.height || 0, // Default to 0 for non-image files
      format: cldRes.format || "pdf", // Set default format for PDFs
      resourceType: cldRes.resource_type,
      createdAt: cldRes.created_at,
      tags: cldRes.tags || [], // Default to an empty array if no tags
      bytes: cldRes.bytes,
      type: cldRes.type,
      etag: cldRes.etag,
      placeholder: cldRes.placeholder,
      url: cldRes.url,
      secureUrl: cldRes.secure_url,
      assetFolder: cldRes.asset_folder || '', // Ensure this field is optional
      displayName: cldRes.public_id, // Or any other relevant display name
      apiKey: process.env.API_KEY, // Assuming you want to store the API key too
    });

    // Save the asset information to the database
    await cloudinaryAsset.save();
    
    // Send the response back
    res.json({ message: "File uploaded successfully!", cloudinaryAsset });
    console.log(cldRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});




router.get("/cloudinary-assets", async (req, res) => {
    try {
      const assets = await CloudinaryAsset.find();
  
      if (!assets || assets.length === 0) {
        return res.status(404).json({ message: "No assets found." });
      }
  
      res.status(200).json({ message: "Assets retrieved successfully!", assets });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });


  
module.exports = router;
