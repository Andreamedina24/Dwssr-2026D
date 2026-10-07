//importando configuracion vite
import {defineConfig} from 'vite'
//importando un admin de rutas 
import {resolve} from 'node:path'

//imports para crear dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
// creando variable
const _filename= fileURLToPath(import.meta.url)
const __dirname= dirname(_filename)

export default defineConfig({
    //Directorio raix de los archivos fuente del front end
    root:'src',
    //Configurado un servidor de desarrollo
    server:{
        //puerto de escucha
        port:5173,
        //Rigidez del puerto
        strict: true
    },
    //Configurando el Build
    build:{
        //directorio de salida del js para produccion
        outDir: "../dist",
        //Asegurando limpieza del folder del folder de produccion
        empatyOutDir: true,
        //Generar manifiesto para el servidor
        manifest:true,
        //Opciones de empaquetado
        rollupOptions:{
            input: {
                main: resolve(__dirname,'src/main.js')
            }
        }
    },
    //Configuracion para el desarrollo 
    publicDir: false
})