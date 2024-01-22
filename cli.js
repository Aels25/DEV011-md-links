const { mdLinks } = require('./index.js');

mdLinks('docs/04-milestone.md', true)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });
