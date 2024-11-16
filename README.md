Introducción:

Runway Domicilios es una aplicación que permite gestionar pedidos de manera eficiente. Esta documentación te guiará a través del proceso de instalación y uso de la aplicación en sistemas operativos Linux y Windows.

Requisitos Previos:
* Node.js: Necesario para ejecutar la aplicación.
* Git: Para clonar el repositorio.
* MySQL: Para que la aplicación funcione correctamente, necesitas tener MySQL instalado y configurado.
* Laragon (opcional): Laragon es un entorno de desarrollo local que facilita la instalación y gestión de aplicaciones web

Clonación del Repositorio:

Abre una terminal (ya sea sistema en Windows o Linux) y ejecuta el siguiente comando para clonar el repositorio:
git clone https://github.com/victor-losada/RunWay-Project.git

Instalación de Dependencias
* Navega al directorio del proyecto tanto el frontend(FRONTEND) como el backend(Runwaydomicilios):
cd Runwaydomicilios o FRONTEND

* Instala las dependencias necesarias ejecutando:
npm install

IMPORTA LA BASE DE DATOS "runway.." EN TU MAQUINA

Configuración de la Base de Datos:

Antes de ejecutar la aplicación, es necesario configurar algunas variables de entorno. Ingresa al archivo .env en la raíz del proyecto (Runwaydomicilios) y añade las siguientes líneas:

DB_HOST=localhost

DB_USER=tu_usuario

DB_PASSWORD=tu_contraseña

DB_NAME=nombre_de_tu_base_de_datos

CONFIGURACION FRONTEND - variables de entorno 

* luego de tener configurada la base de datos en el backend nos dirigimos al frontend al archivo "config.js" que se encuentra en la carperta SRC.
* Ahi lo que hacemos es cambiar el API_HOST por la direccion ip local que tenemos en el dispositivo.
   Nota: Asegúrate de que la dirección IP y el puerto sean correctos y accesibles desde tu dispositivo. Si no encuentras o no sabes cual direccion ip se habla simplemente pon a correr el frontend con el siguiente codigo:
npm run dev -- --host o npm run dev

AHI LO QUE TE SALE VA SER ALGO PARECIDO A ESTO:

  VITE v5.4.10  ready in 951 ms

  ➜  Local:   http://localhost:5173/
  
  ➜  Network: http://192.168.100.6:5173/
  
  ➜  press h + enter to show help
  
y donde dice Network se copia y pega en las variables unicamente la ip. en este caso la ip seria: 192.168.100.6

¿POR QUE SE HACE ESTO?

El sitema esta diseñado tanto para que sirva en computador como en celular tambien. tener encuenta que no es un software desplegado en algun servidor o nube por lo cual para que en dado caso el sistema se piense porbar en algun dispositivo movil o computador unicamente por medio de url, el backend y frontend debe estar corriendo en la maquina local. Y como dato importante, para que funcione en varios dispositivos, todos deben estar conectados a la misma red wifi de la maquina local.

CONFIGURACION NOTIFICACIONES (socket.io)

* Una vez completado lo anterior nos dirigimos ahi mismo en el frontend a una carpeta llamada "context" que dentro de ella tiene un archivo de configuracion para las notificaciones(SocketContext)
* una vez ahi adentro vamos a modificar la url que comunica las notificaciones de el backend con el mismo frontend:
 useEffect(() => {

    if (auth?.user) {
  
      const newSocket = io('http://---ip----:3000/', {
  
        transports: ['websocket', 'polling'],
  
        withCredentials: true
  
      });
  
* ahi hacemos lo mismo que el paso anterior, cambiamos la ip☝️.
* 
  - Nota: se conserva el 3000. A no ser que en el backend hayas cambiado el puerto por cualquier otro
    
Ejecución de la Aplicación

- por ultimo una vez teniendo corriendo el frontend bien, nos dirigimos al backend al archivo "index.js" en la raiz del backend. y vamos a moficar el cors  del sockect:
  
  const io = new SocketIOServer(server, {
  
    cors: {
  
        origin: ["http://192.168.100.6:5173/"],
  
        methods: ["GET", "POST", "PATCH", "PUT"],
  
        credentials: true
    }
  
});

* cambiamos la url origin por la dada en la terminal donde estamos corroiendo el frontend☝️

Uso de la Aplicación

* Una vez que la aplicación esté configurada, ejecuta el backend (estando corriendo el frontend) con el siguiente codigo:
npm run dev

* puedes acceder a ella a través de tu navegador web. Simplemente ingresa la URL  http://localhost:5173/ en caso de unicamente porbar el software de forma local. ya que lo quieras probar en otros dispositivos con otras personas..ingresas la segunda url. ejemplo:
  
Network: http://192.168.100.6:5173/

* NOTA IMPORTANTE *
para empezar a probar el sistema, ya la base de datos trae Uno o varios usuarios(u usuarui por rol) y los daros de logueo de cada usuario viene en el archivo USUARIOS.txt de este repositorio


LINUX

Consideraciones para Linux

Si estás utilizando Linux, asegúrate de que:

* Tienes permisos para abrir los puertos necesarios (3000 y 5173).
  
* El firewall no esté bloqueando las conexiones. Puedes usar ufw para permitir el tráfico:

- sudo ufw allow 3000
  
- sudo ufw allow 5173

tambien asegurate de que tu sistema este actualizado. abre una terminal y ejecuta los siguientes comandos:

- sudo apt-get update
  
- sudo apt-get upgrade

En linux despues de verificar lo anterior , ya puedes seguir configurando y desplegando el proyecto de la misma manera como se nombra al inicio


Solución de Problemas

* Si encuentras problemas al ejecutar la aplicación, verifica lo siguiente:
  
* Asegúrate de que Node.js y npm estén correctamente instalados.
  
* Verifica que las variables de entorno estén configuradas correctamente.
  
* Revisa la consola de la terminal para ver si hay mensajes de error.
