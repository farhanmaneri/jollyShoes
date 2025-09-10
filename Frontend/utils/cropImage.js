export const getCroppedImg = (imageSrc, crop, zoom = 1, rotation = 0) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const radians = (rotation * Math.PI) / 180;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.translate(-cropX, -cropY);
      ctx.translate(image.width / 2, image.height / 2);
      ctx.rotate(radians);
      ctx.translate(-image.width / 2, -image.height / 2);

      ctx.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        1
      );
    };
    image.onerror = (err) => reject(err);
  });
};
