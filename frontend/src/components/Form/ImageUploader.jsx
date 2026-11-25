import { useState } from "react";

export const ImageUploader = ({ maxFiles = 5, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Procesar archivos seleccionados o soltados
  const processFiles = (files) => {
    const newImages = [];
    const availableSlots = maxFiles - images.length;

    if (availableSlots <= 0) return;

    const filesToProcess = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      const url = URL.createObjectURL(file);
      newImages.push({ id, file, url });
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    if (onImagesChange) onImagesChange(updatedImages.map((img) => img.file));
  };

  // Manejadores de Input de Archivos
  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = ''; // Resetear el input
    }
  };

  // Manejadores Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Eliminar imagen y revocar URL de memoria
  const handleRemove = (idToRemove) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find((img) => img.id === idToRemove);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url); // Liberar memoria
      }
      const updatedImages = prevImages.filter((img) => img.id !== idToRemove);
      if (onImagesChange) onImagesChange(updatedImages.map((img) => img.file));
      return updatedImages;
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Zona de Drop / Input */}
      {images.length < maxFiles && (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <svg
              className="w-8 h-8 mb-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-600">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP (Máx. {maxFiles} {maxFiles === 1 ? 'imagen' : 'imágenes'})
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}

      {/* Cuadrícula de Previsualización */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm"
            >
              <img
                src={img.url}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />

              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                title="Eliminar imagen"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}