const fs = require('fs');
let words = fs.readFileSync('./palabras/newords.txt').toString().toLowerCase().split("\n")
function eliminarDiacriticosEs(texto) {
    return texto
           .normalize('NFD')
           .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
           .normalize();
}
words.forEach((w,i) =>{
    console.log(eliminarDiacriticosEs(words[i]))
})