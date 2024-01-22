const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { mdLinks } = require('../index');  // Importa mdLinks desde index.js
const { convertirRuta, validarRuta, extraerLinks } = require('../functions');  // Importa funciones desde functions.js

// Mockear axios para simular respuestas exitosas de enlaces
jest.mock('axios');
axios.head.mockResolvedValue({ status: 200 });

// Mockear axios para simular respuestas con errores de enlaces
jest.mock('axios');
axios.head.mockRejectedValue({ response: { status: 404 } });

describe('convertirRuta', () => {
  it('debería convertir una ruta relativa a absoluta', () => {
    const rutaRelativa = 'docs/archivo.md';
    const rutaAbsoluta = convertirRuta(rutaRelativa);
    expect(path.isAbsolute(rutaAbsoluta)).toBe(true);
  });

  it('debería mantener la ruta absoluta si ya es absoluta', () => {
    const rutaAbsoluta = '/ruta/absoluta/archivo.md';
    const resultado = convertirRuta(rutaAbsoluta);
    expect(resultado).toBe(rutaAbsoluta);
  });s
});

describe('validarRuta', () => {
  it('debería devolver true para una ruta existente', () => {
    const rutaExistente = __filename; // Utiliza una ruta válida en tu sistema
    expect(validarRuta(rutaExistente)).toBe(true);
  });

  it('debería devolver false para una ruta inexistente', () => {
    const rutaInexistente = 'ruta/inexistente/archivo.md';
    expect(validarRuta(rutaInexistente)).toBe(false);
  });
});

describe('extraerLinks', () => {
  it('debería extraer los enlaces del contenido del archivo', () => {
    const contenido = '[Enlace 1](https://www.ejemplo.com) [Enlace 2](https://otroejemplo.com)';
    const archivo = 'ejemplo.md';
    const enlaces = extraerLinks(contenido, archivo);

    expect(enlaces).toHaveLength(2);
    expect(enlaces[0]).toEqual({ text: 'Enlace 1', href: 'https://www.ejemplo.com', file: 'ejemplo.md' });
    expect(enlaces[1]).toEqual({ text: 'Enlace 2', href: 'https://otroejemplo.com', file: 'ejemplo.md' });
  });

  it('debería devolver un array vacío si no hay enlaces', () => {
    const contenidoSinEnlaces = 'Este archivo no tiene enlaces.';
    const archivo = 'sin-enlaces.md';
    const enlaces = extraerLinks(contenidoSinEnlaces, archivo);

    expect(enlaces).toHaveLength(0);
  });
});

describe('mdLinks', () => {
  it('debería retornar un arreglo de objetos sin validar los enlaces', () => {
    return mdLinks('test/text-test.md', false).then((links) => {
      expect(Array.isArray(links)).toBe(true);

      links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
        expect(link).not.toHaveProperty('status');
        expect(link).not.toHaveProperty('ok');
      });
    });
  });

  it('debería retornar un arreglo de objetos validando los enlaces', () => {
    return mdLinks('test/text-test.md', true).then((links) => {
      expect(Array.isArray(links)).toBe(true);

      links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
        expect(link).toHaveProperty('status');
        expect(link).toHaveProperty('ok');
      });
    });
  });

  it('debería retornar un arreglo de objetos sin validar los enlaces (sin especificar validate)', () => {
    return mdLinks('test/text-test.md').then((links) => {
      expect(Array.isArray(links)).toBe(true);

      links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
        expect(link).not.toHaveProperty('status');
        expect(link).not.toHaveProperty('ok');
      });
    });
  });

  it('debería manejar correctamente los enlaces rotos al validarlos', () => {
    // Mockear axios para simular respuestas con errores de enlaces
    axios.head.mockRejectedValue({ response: { status: 404 } });

    return mdLinks('test/text-test.md', true).then((links) => {
      expect(links).toHaveLength(4);

      links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
        expect(link).toHaveProperty('status', 404);
        expect(link).toHaveProperty('ok', false);
      });
    });
  });
});
