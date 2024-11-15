import { Router } from "express";
import { getDomiciliarios, patchStatusDomiciliario, patchStatusDomiciliario2, postAsignarPedido, postDomiciliario, getDisponibilidad, getPerfilDomiciliario } from "../controllers/Domiciliarios.js";
import { check } from "express-validator";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";


const DomiciliariosRouter = Router()

DomiciliariosRouter.get('/getDomiciliarios', getDomiciliarios)
DomiciliariosRouter.get('/getPerfilDomiciliario/:id_usuario', verifyToken, verifyRole(['domiciliario']), getPerfilDomiciliario)
DomiciliariosRouter.post('/postDomiciliario',verifyToken, [check('id_usuario', 'El id del domiciliario es requerido').notEmpty(), check('licencia_vehiculo', 'La licencia del vehiculo es requerida').notEmpty()], validateFields,verifyRole(['administrador']), postDomiciliario)
DomiciliariosRouter.patch('/patchStatusDomiciliario/:id_usuario',verifyToken, verifyRole(['administrador','domiciliario']), [check('id_usuario', 'El id del domiciliario es requerido').notEmpty()], validateFields, patchStatusDomiciliario)
DomiciliariosRouter.patch('/patchStatusDomiciliario2/:id_usuario',verifyToken, verifyRole(['administrador','domiciliario']), [check('id_usuario', 'El id del domiciliario es requerido').notEmpty()], validateFields, patchStatusDomiciliario2)
DomiciliariosRouter.post('/postAsignarPedido/:id_usuario',verifyToken, verifyRole(['administrador','negocio','particular']), [check('id_usuario', 'El id del usuario es requerido').notEmpty(), check('direccion_recogida', 'La direccion de recogida es requerida').notEmpty(), check('direccion_entrega', 'La direccion de entrega es requerida').notEmpty()], validateFields, postAsignarPedido)
DomiciliariosRouter.get('/getDisponibilidad/:id_usuario', verifyToken, verifyRole(['administrador', 'domiciliario']), getDisponibilidad)

export default DomiciliariosRouter
