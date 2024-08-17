import __dirname from './utils.js';
import path from 'path'; //pathh para utilizar rutas relativas
import express from 'express'; //importo extress
import {engine} from 'express-handlebars';//importo handlebar
import {Server} from "socket.io" //importo server de socket

const PORT=8080;//inicializamos un puerto
console.log(import.meta.dirname)
const app=express();//inicializamos express

//3 lineas de inicializacion del handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views')); //definimos la carpeta para guardas las vistas import.meta.dirname

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
})


const usuarios=[]//guardo usuarios con su id, tipo base de datos, para avisar cuando se desconecta un usuario
const mensajes=[]//creo base de datos de mjes

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(server)

io.on("connection", socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)
    socket.emit("mensajesPrevios", mensajes)

    socket.on("id", nombre=>{
        usuarios.push({id:socket.id, nombre})
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", (nombre, mensaje)=>{
        mensajes.push({
            nombre, 
            mensaje
        })
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        const usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("saleUsuario", usuario.nombre)
        }
    })

})