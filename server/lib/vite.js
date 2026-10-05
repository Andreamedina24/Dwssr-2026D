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