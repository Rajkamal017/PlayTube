import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!filePath) {
            return null
        }
        const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" })
        fs.unlinkSync(filePath)
        return result.secure_url

    } catch (error) {
        console.log(error)
        fs.unlinkSync(filePath)
    }
}

export const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        
        let publicIdWithExtension = parts[1];
        publicIdWithExtension = publicIdWithExtension.replace(/^v\d+\//, '');
        
        const dotIndex = publicIdWithExtension.lastIndexOf('.');
        if (dotIndex !== -1) {
            return publicIdWithExtension.substring(0, dotIndex);
        }
        return publicIdWithExtension;
    } catch (error) {
        console.error("Error parsing public ID from Cloudinary URL:", error);
        return null;
    }
};

export const deleteFromCloudinary = async (url, resourceType = "auto") => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        const publicId = getPublicIdFromUrl(url);
        if (!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export default uploadOnCloudinary