//cli.js, ejecuta la herramienta desde comandos y ver como funcona
const {mdLinks} = require('./index.js');
mdLinks('docs/04-milestone.md')
.then((response)=>{

console.log(response)
})
.catch((error)=>{
console.log(error)

})
