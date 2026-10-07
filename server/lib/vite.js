//Biblioteca File Stream
import fs from 'node:fs'
//Biblioteca de rutas
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// creando variable
const _filename= fileURLToPath(import.meta.url)
const __dirname= dirname(_filename)
/**
 * Helper para Handlebars que geneta las etiquetas de vite 
 * EN DESARROLLO: Conecta al servodor de desarrollo de vite
 * EN PRODUCCION: Usa los compilados de vite  
 */
export function viteAssets(){
    //obtener modo de ejecucion
    const isDev = process.env.NODE_ENV !=='production'
    //Rescatando la URL del servidor de desarrollo 
    const viteDevServer =
    process.env.VITE_DEV_SERVER || 'http:localhost:5173'

    //si estamos en modo desarrollo
    if(isDev){
        //En desarrollo, cargamos los archivos
        //del front-end directamente del servidor 
        //de desarrollo de vite
        return`
        <script type="module" src="${viteDevServer}/@vite/client"></script>
        <script type="module" src="${viteDevServer}"></script>
        `
    }
    //En produccion leemos el manifest
    // y generamos las etiquetas finales de produccion
    const manifestPath =path.join(__dirname,'..','..','dist','.vite', 'manifest.json')

    //Si no existe el manifest 
    if(!fs.existsSync(manifestPath)){
        console.warn("vite manifest not found. Run 'nmp run build'")
        return''
    }
}

//leyendo y parseando a JSON el archivo 
//de manifiesto que genera vite en la compilación
// de los archivos de front-end
 const  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
//Obteniendo la ruta del punto de entrada del front-end
 const mainEntry= manifest ['main.js']
 //guarda el main.js
 if(!mainEntry){
    console.warn('Archivo main.js no esta disponible en el manifiesto de vite')
    return''
 }
 let tags =''
 //CSS files
 if (mainEntry.css){
    mainEntry.css.forEach(cssFiles =>{
        tags += `<link rel ="stylesheet"href="/${cssfiles}">\n`
    });
 }
//js files 
tags+=`<script type="module" src="/${mainEntry.file}"defer></script>`;
return tags;

/*
Funcion registradora
*/
export function registrerViteHelper(hbs){
    hbs.registrerHelper('viteAssets',()=>{
        return new hbs.sefesString(viteAssets())
    })
}
