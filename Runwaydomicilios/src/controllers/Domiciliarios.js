import { conexion } from "../Database/Conexion.js";
import io from '../../index.js';

export const getDomiciliarios = async (req, res) => {
    try {

        
        const [respuesta] = await conexion.query(`
            SELECT domiciliarios.id_domiciliario, usuarios.nombre, domiciliarios.disponibilidad 
            FROM domiciliarios
            INNER JOIN usuarios ON domiciliarios.id_usuario = usuarios.id_usuario
            
        `);
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los domiciliarios: " + error });
    }
};

export const CambiarStado = async (req, res) =>
{
    const {id_usuario} = req.params
    const {id_domiciliario} = req.body
    try {
        const sql = 'UPDATE domiciliarios SET estado = "disponible" WHERE id_usuario = ?'
        await conexion.query(sql, [id_usuario]);
        res.status(200).json({message: "Estado del domiciliario actualizado correctamente"});
    } catch (error) {
        res.status(500).json({message: "Error en el servidor: " + error})
    }
}

export const getPerfilDomiciliario = async (req, res) => {
    try{
        const {id_usuario} = req.params
        const [respuesta] = await conexion.query(`
            SELECT d.*, u.nombre, u.tipo_usuario, u.email, u.telefono 
            FROM domiciliarios d
            INNER JOIN usuarios u ON d.id_usuario = u.id_usuario 
            WHERE d.id_usuario = ?`, 
            [id_usuario]
        )
        res.status(200).json(respuesta[0])
    }catch(error){
        res.status(500).json({message: "Error al obtener el perfil del domiciliario" + error})
    }
}
export const postDomiciliario = async (req, res) => {
    try {
        const { id_usuario } = req.body;
        const { licencia_vehiculo } = req.body;
        const disponibilidad = "disponible";

        const [existeDomiciliario] = await conexion.query('SELECT * FROM domiciliarios WHERE id_usuario = ?', [id_usuario]);
        if (existeDomiciliario.length > 0) {
            return res.status(409).json({ message: "El domiciliario ya está registrado" });
        }

        await conexion.query('INSERT INTO domiciliarios (id_usuario, licencia_vehiculo, disponibilidad) VALUES (?, ?, ?)', [id_usuario, licencia_vehiculo, disponibilidad]);
        res.status(200).json({ message: "Domiciliario asignado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al asignar el domiciliario: " + error });
    }
}


export const patchStatusDomiciliario = async (req, res) => {
    try{
        const {id_domiciliario} = req.params
        const [respuesta] = await conexion.query('update domiciliarios set estado = "no disponible" where = id_domiciliario = ?', [id_domiciliario])
        if(respuesta.affectedRows === 0){
            return res.status(404).json({message: "Domiciliario no encontrado"})
        }
        res.status(200).json({message: "Domiciliario actualizado correctamente"})
    }catch(error){
        res.status(500).json({message: "Error al actualizar el estado del domiciliario" + error})
    }
}

export const patchStatusDomiciliario2 = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        const [domiciliario] = await conexion.query(
            'SELECT id_domiciliario FROM domiciliarios WHERE id_usuario = ?', 
            [id_usuario]
        );

        if (!domiciliario || domiciliario.length === 0) {
            return res.status(404).json({ message: "Domiciliario no encontrado" });
        }

        const id_domiciliario = domiciliario[0].id_domiciliario;

        const [respuesta] = await conexion.query(
            'UPDATE domiciliarios SET disponibilidad = CASE WHEN disponibilidad = "disponible" THEN "no disponible" ELSE "disponible" END WHERE id_domiciliario = ?', 
            [id_domiciliario]
        );

        if (respuesta.affectedRows === 0) {
            return res.status(404).json({ message: "No se pudo actualizar el estado" });
        }

        const [nuevoEstado] = await conexion.query(
            'SELECT disponibilidad FROM domiciliarios WHERE id_domiciliario = ?',
            [id_domiciliario]
        );

        res.status(200).json({
            message: "Estado actualizado correctamente",
            disponibilidad: nuevoEstado[0].disponibilidad
        });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ 
            message: "Error al actualizar el estado del domiciliario",
            error: error.message 
        });
    }
}
// ASIGNAR PEDIDO

export const postAsignarPedido = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { direccion_recogida, direccion_entrega, descripcion } = req.body;
        const fecha_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const estado = 'asignado';

        const [domiciliariosDisponibles] = await conexion.query(
            'SELECT d.*, u.nombre as nombre_domiciliario FROM domiciliarios d ' +
            'INNER JOIN usuarios u ON d.id_usuario = u.id_usuario ' +
            'WHERE d.disponibilidad = "disponible" LIMIT 1'
        );

        if (domiciliariosDisponibles.length === 0) {
            const [administradores] = await conexion.query(
                'SELECT id_usuario FROM usuarios WHERE tipo_usuario = "administrador"'
            );

            administradores.forEach(admin => {
                io.to(admin.id_usuario.toString()).emit('sinDomiciliariosDisponibles', {
                    type: 'alerta',
                    message: "No hay domiciliarios disponibles para una nueva solicitud",
                    direccion_recogida,
                    direccion_entrega,
                    descripcion,
                    fecha_hora
                });
            });

            return res.status(404).json({ message: "No hay domiciliarios disponibles en este momento" });
        }

        const domiciliario = domiciliariosDisponibles[0];

        const [resultadoSolicitud] = await conexion.query(
            'INSERT INTO solicitudes (id_cliente, id_domiciliario, direccion_recogida, direccion_entrega, descripcion, fecha_hora, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_usuario, domiciliario.id_domiciliario, direccion_recogida, direccion_entrega, descripcion, fecha_hora, estado]
        );

        await conexion.query(
            'UPDATE domiciliarios SET disponibilidad = "no disponible" WHERE id_domiciliario = ?',
            [domiciliario.id_domiciliario]
        );

        console.log('Enviando notificación al domiciliario:', domiciliario.id_domiciliario);
        io.to(domiciliario.id_usuario.toString()).emit('pedidoAsignado', { 
            type: 'pedido',
            message: "Se le ha asignado un nuevo pedido",
            direccion_recogida,
            direccion_entrega,
            descripcion,
            fecha_hora,
            id_solicitud: resultadoSolicitud.insertId
        });

        console.log('Enviando notificación al cliente:', id_usuario);
        io.to(id_usuario.toString()).emit('pedidoAsignado', { 
            type: 'pedido',
            message: `Su pedido ha sido asignado al domiciliario ${domiciliario.nombre_domiciliario}`,
            direccion_recogida,
            direccion_entrega,
            descripcion,
            fecha_hora,
            estado,
            id_solicitud: resultadoSolicitud.insertId
        });

        res.status(200).json({ 
            message: "Pedido asignado correctamente", 
            id_domiciliario: domiciliario.id_domiciliario,
            nombre_domiciliario: domiciliario.nombre_domiciliario
        });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ message: "Error al asignar el pedido: " + error });
    }
};

export const getDisponibilidad = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        const [domiciliario] = await conexion.query(
            'SELECT disponibilidad FROM domiciliarios WHERE id_usuario = ?',
            [id_usuario]
        );

        if (!domiciliario || domiciliario.length === 0) {
            return res.status(404).json({ message: "Domiciliario no encontrado" });
        }

        res.status(200).json({ disponibilidad: domiciliario[0].disponibilidad });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({
            message: "Error al obtener la disponibilidad",
            error: error.message
        });
    }
}

