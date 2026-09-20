const fs = require('fs');

let content = fs.readFileSync('tapiceria/index.html', 'utf8');

// 1. Remove coverage section ("No tiene que salir de casa")
const coverageStart = content.indexOf('<!-- ============ COBERTURA ============ -->');
const coverageEnd = content.indexOf('<!-- ============ CONTACTO ============ -->');

if (coverageStart !== -1 && coverageEnd !== -1) {
  content = content.slice(0, coverageStart) + content.slice(coverageEnd);
  console.log('Removed coverage section successfully');
} else {
  console.log('Could not find coverage section offsets');
}

// 2. Replace "Hablemos de su <em>mueble</em>" with "Solicite su <em>presupuesto</em>"
if (content.includes('Hablemos de su <em>mueble</em>')) {
  content = content.replace('Hablemos de su <em>mueble</em>', 'Solicite su <em>presupuesto</em>');
  console.log('Replaced heading successfully');
} else {
  console.log('Heading not found');
}

fs.writeFileSync('tapiceria/index.html', content, 'utf8');
console.log('index.html written');
