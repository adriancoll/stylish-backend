const path = require("path");
const { v4: uuidv4 } = require("uuid");

const VALID_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

const fileUpload = (files, validExtensions = VALID_IMAGE_EXTENSIONS) => {
  return new Promise((resolve, reject) => {
    // handle image change
      const { file } = files;

      // Validar extensiones
      let extension = file.name.split(".");
      extension = extension[extension.length - 1];

      if (!validExtensions.includes(extension)) {
        reject("Extension de imagen no válida");
      }

      const tempName = uuidv4() + "." + extension;
      const uploadPath = path.join(__dirname, "../uploads/", tempName);

      file.mv(uploadPath, function (err) {
        console.log("hola")
        reject(err);
      });

      resolve(uploadPath);
  });
};

module.exports = {
  fileUpload,
  VALID_IMAGE_EXTENSIONS,
};
