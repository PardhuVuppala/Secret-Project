require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const CloudinaryAsset = require("../modals/upload_schema"); 
const userModel = require('../modals/user_schema');
const mailservice = require('../services/registrationServices')

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

      const cldRes = await handleUpload(dataURI, req.file.mimetype);

      const { email, password } = req.body;  
      
      const UserExist = await userModel.findOne({ useremail: req.body.email });
       if(UserExist) {
      const cloudinaryAsset = new CloudinaryAsset({
          userid: UserExist.id,
          password : req.body.password,
          assetId: cldRes.asset_id,
          publicId: cldRes.public_id,
          version: cldRes.version,
          versionId: cldRes.version_id,
          signature: cldRes.signature,
          width: cldRes.width || 0, 
          height: cldRes.height || 0, 
          format: cldRes.format || "pdf", 
          resourceType: cldRes.resource_type,
          createdAt: cldRes.created_at,
          tags: cldRes.tags || [], 
          bytes: cldRes.bytes,
          type: cldRes.type,
          etag: cldRes.etag,
          placeholder: cldRes.placeholder,
          url: cldRes.url,
          secureUrl: cldRes.secure_url,
          assetFolder: cldRes.asset_folder || '', 
          displayName: cldRes.public_id, 
          apiKey: process.env.API_KEY 
      });
      mailservice.sendmail(
        req.body.email,
        "New PDF as been uploaded plaese check that and name of the pdf" + cldRes.public_id,
        req.body.password
     )

      await cloudinaryAsset.save();

      res.json({ message: "File uploaded successfully!", cloudinaryAsset });
    }
    else
    {
     res.json({message:"Email doesn't exist"})
    }
  } catch (error) {
      // console.log(error);
      res.status(500).send({ message: error.message });
  }
});


router.get("/cloudinary-assets/:user_id", async (req, res) => {
  try {
      const user_id = req.params.user_id;
      // console.log(user_id)
      const assets = await CloudinaryAsset.find({ userid: user_id }); 
      if (!assets || assets.length === 0) {
          return res.status(404).json({ message: "No assets found." });
      }
      // console.log(assets)
      res.status(200).json({ assets });
  } catch (error) {
      // console.log(error);
      res.status(500).send({ message: error.message });
  }
});

router.delete("/cloudinary-asset/:id", async (req, res) => {
  try {
      const assetId = req.params.id;
      const deletedAsset = await CloudinaryAsset.findByIdAndDelete(assetId);

      if (!deletedAsset) {
          return res.status(404).json({ message: "Asset not found." });
      }

      res.status(200).json({ message: "Asset deleted successfully." });
  } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ message: error.message });
  }
});
  
module.exports = router;
