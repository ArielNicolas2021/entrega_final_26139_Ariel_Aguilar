const CLOUD_NAME = "s9zokivg"; // Reemplaza con tu Cloud Name
const UPLOAD_PRESET = "wr0sgedx"; // Reemplaza con tu Upload Preset (Unsigned)

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Retorna la URL HTTPS pública de la imagen
};

// Subir múltiples imágenes en paralelo
export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return await Promise.all(uploadPromises);
};
