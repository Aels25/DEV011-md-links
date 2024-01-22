const axios = require('axios');
const { convertirRuta, validarRuta, extraerLinks } = require("./functions.js");
const fs = require('fs/promises');
const path = require('path');

const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

const mdLinks = (path2, validate) => {
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

        if (validate) {
          validarLinks(links)
            .then((linksValidados) => {
              resolve(linksValidados);
            })
            .catch((error) => {
              reject('Error al validar los links', error);
            });
        } else {
          resolve(links);
        }
      })
      .catch((error) => {
        reject('Error al leer el archivo.' , error);
      });
  });
};

// Nueva función para validar links
const validarLinks = (links) => {
  const promises = links.map((link) => {
    return axios.head(link.href)
      .then((response) => {
          link.status = response.status;
          link.ok = response.status >= 200 && response.status < 300;
          return link
      })
      .catch((error) => {
        link.status = error.response ? error.response.status : 'unknown';
        link.ok = 'fail';
        return link;
      });
  });

  return Promise.all(promises);
};

module.exports = {
  mdLinks,
};
