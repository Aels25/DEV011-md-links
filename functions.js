const path = require('path');
const fs = require('fs');

// Convertir a ruta absoluta
const convertirRuta = (pathUser) => {
  return path.resolve(pathUser);
};

// Comprobar que la ruta exista en el computador
const validarRuta = (ruta) => {
  console.log(fs.existsSync(ruta));
  return fs.existsSync(ruta);
};

// Función para extraer los enlaces del contenido del archivo
const extraerLinks = (content, file) => {
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    matches.push({
      text: match[1],
      href: match[2],
      file: file,
    });
  }

  return matches;
};

module.exports = {
  convertirRuta,
  validarRuta,
  extraerLinks,
};



