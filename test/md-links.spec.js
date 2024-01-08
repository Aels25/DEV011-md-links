const { mdLinks } = require('../index');

describe('mdLinks', () => {
  it('debería retornar un arreglo de objetos con enlaces', () => {
    return mdLinks('docs/04-milestone.md').then((links) => {
      expect(Array.isArray(links)).toBe(true);

      links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
      });
    });
  });
});


