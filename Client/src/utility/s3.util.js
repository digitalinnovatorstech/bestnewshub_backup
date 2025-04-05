import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import config from "../config.json";

const S3_BUCKET = config.S3_BUCKET;
const REGION = config.REGION;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

// Function to upload a file to S3
export const uploadFileToS3 = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const uploadedImageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    return uploadedImageUrl; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image. Please try again.");
  }
};

// Function to remove a file from S3
export const removeFileFromS3 = async (fileName) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Error deleting image. Please try again.");
  }
};

// Function to list files in S3
export const listFilesInS3 = async () => {
  try {
    const command = new ListObjectsCommand({ Bucket: S3_BUCKET });
    const data = await s3.send(command);
    if (data.Contents) {
      const sortedFiles = data.Contents.sort(
        (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
      );
      const fileUrls = sortedFiles.map(
        (file) => `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.Key}`
      );
      return fileUrls; // Return the array of file URLs
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Error fetching files from S3.");
  }
};
