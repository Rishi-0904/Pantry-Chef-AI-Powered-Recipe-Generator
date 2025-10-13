const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER;

function buildUploadUrl() {
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is not configured. Set VITE_CLOUDINARY_CLOUD_NAME in your environment.');
  }
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
}

export async function uploadImageToCloudinary(file) {
  if (!(file instanceof File)) {
    throw new Error('A valid image file is required for upload.');
  }

  if (!UPLOAD_PRESET) {
    throw new Error('Cloudinary upload preset is not configured. Set VITE_CLOUDINARY_UPLOAD_PRESET in your environment.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (UPLOAD_FOLDER) {
    formData.append('folder', UPLOAD_FOLDER);
  }

  const response = await fetch(buildUploadUrl(), {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const payload = await response.json();
  if (!payload?.secure_url) {
    throw new Error('Cloudinary upload did not return a secure URL.');
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id
  };
}
