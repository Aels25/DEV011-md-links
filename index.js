const { convertirRuta, validarRuta, extraerLinks } = require("./functions.js");
const fs = require('fs/promises');
const path = require('path');

const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

const mdLinks = (path2, options) => {
  return new Promise((resolve, reject) => {
    const rutaAbsoluta = convertirRuta(path2);
    const existe = validarRuta(rutaAbsoluta);

    if (existe === false) {
      reject('Error en la ruta.');
      return;
    }
    
    // Asegurar que sea markdown
    const extname = path.extname(rutaAbsoluta);

    if (!mdExtensions.includes(extname.toLowerCase())) {
      reject('El archivo no es de tipo Markdown.');
      return;
    }

    // Leer el archivo
    fs.readFile(rutaAbsoluta, 'utf-8')
      .then((content) => {
        const links = extraerLinks(content, rutaAbsoluta);
        resolve(links);
      })
      .catch((error) => {
        reject('Error al leer el archivo.');
      });
  });
};

module.exports = {
  mdLinks,
};
