import React, { useState, useEffect } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const ReportesIncidencia = () => {
    const BASEURL = `${API_URL}/reporteIncidentes/getReporteIncidente`;
    const BASEURL3 = `${API_URL}/reporteIncidentes/putReporteIncidente`;
    const BASEURL4 = `${API_URL}/reporteIncidentes/getReportesResueltos`;
    const BASEURL5 = `${API_URL}/reporteIncidentes/getReporteTipoIncidencia`;
    
    const BASEURL6 = `${API_URL}/solicitudes/getSolicitudesByUsuario`;
    const BASEURL7 = `${API_URL}/reporteIncidentes/postReporteIncidente`;

    const { auth } = useAuth();
    const [tipoUsuario, setTipoUsuario] = useState(null);

    const { getApi, response: reportesPendientes, loading } = UseCrud(BASEURL);
    const { updateApi } = UseCrud(BASEURL3);
    const { getApi: getReportesResueltos, response: reportesResueltos } = UseCrud(BASEURL4);
    const { getApiById: getReportesPorTipo } = UseCrud(BASEURL5);
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [detalleReporte, setDetalleReporte] = useState(null);
    const [mostrarResueltos, setMostrarResueltos] = useState(false);
    const [tipoIncidencia, setTipoIncidencia] = useState('');
    const [reportesFiltrados, setReportesFiltrados] = useState([]);

    const tiposIncidencia = [
        'entrega fallida',
        'producto dañado',
        'retraso',
        'otro'
    ];

    const [solicitudesUsuario, setSolicitudesUsuario] = useState([]);
    const [formData, setFormData] = useState({
        id_solicitud: '',
        tipo_incidencia: '',
        descripcion: ''
    });

    const { getApiById: getSolicitudesUsuario } = UseCrud(BASEURL6);
    const { postApiById: crearReporte } = UseCrud(BASEURL7);

    useEffect(() => {
        if (auth && auth.user) {
            setTipoUsuario(auth.user.tipo_usuario);
        }
    }, [auth]);

    useEffect(() => {
        if (auth && auth.user && ['particular', 'negocio'].includes(auth.user.tipo_usuario)) {
            cargarSolicitudesUsuario();
        }
    }, [auth]);

    useEffect(() => {
        if (tipoUsuario === 'administrador') {
            getApi();
            getReportesResueltos();
        }
    }, [tipoUsuario]);

    const handleFiltrarPorTipo = async (tipo) => {
        setTipoIncidencia(tipo);
        if (tipo) {
            try {
                const tipoEncoded = encodeURIComponent(tipo);
                const reportes = await getReportesPorTipo(tipoEncoded);
                setReportesFiltrados(reportes || []);
            } catch (error) {
                console.error('Error al filtrar por tipo:', error);
                setReportesFiltrados([]);
            }
        } else {
            setReportesFiltrados([]);
        }
    };

    const toggleTipoReportes = () => {
        setMostrarResueltos(!mostrarResueltos);
    };

    const handleCloseDetalle = () => {
        setSelectedReporte(null);
        setDetalleReporte(null);
    };

    const handleVerDetalle = (reporte) => {
        if (selectedReporte === reporte.id_reporte) {
            handleCloseDetalle();
        } else {
            setSelectedReporte(reporte.id_reporte);
            setDetalleReporte(reporte);
        }
    };

    const handleMarcarResuelto = async (id_reporte) => {
        try {
            await updateApi({ estado: 'resuelto' }, `/${id_reporte}`);
            Toastify({
                text: 'Reporte marcado como resuelto',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'green',
            }).showToast();
            getApi();
        } catch (error) {
            console.error('Error al marcar como resuelto:', error);
            Toastify({
                text: 'Error al marcar como resuelto',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'red',
            }).showToast();
        }
    };

    const obtenerReportesActuales = () => {
        if (tipoIncidencia && reportesFiltrados.length > 0) {
            return reportesFiltrados;
        }
        return mostrarResueltos ? reportesResueltos : reportesPendientes || [];
    };

    const cargarSolicitudesUsuario = async () => {
        try {
            const response = await getSolicitudesUsuario(`/${auth.user.id_usuario}`);
            if (response) {
                setSolicitudesUsuario(response);
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        }
    };

    const handleSubmitReporte = async (e) => {
        e.preventDefault();
        try {
            const response = await crearReporte(formData, auth.user.id_usuario);
            if (response) {
                Toastify({
                    text: 'Reporte creado exitosamente',
                    duration: 3000,
                    gravity: 'top',
                    backgroundColor: 'green',
                }).showToast();
                setFormData({
                    id_solicitud: '',
                    tipo_incidencia: '',
                    descripcion: ''
                });
            }
        } catch (error) {
            console.error('Error al crear reporte:', error);
            Toastify({
                text: 'Error al crear el reporte',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'red',
            }).showToast();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (detalleReporte && !event.target.closest('.modal-detalle')) {
                handleCloseDetalle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [detalleReporte]);

    if (tipoUsuario === 'particular' || tipoUsuario === 'negocio') {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header title="Reportes de Incidencias" />
                <div className="lg:ml-64 pt-16">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmitReporte} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seleccione la Solicitud
                                    </label>
                                    <select
                                        value={formData.id_solicitud}
                                        onChange={(e) => setFormData({...formData, id_solicitud: e.target.value})}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    >
                                        <option value="">Seleccione una solicitud</option>
                                        {solicitudesUsuario.map(solicitud => (
                                            <option key={solicitud.id_solicitud} value={solicitud.id_solicitud}>
                                                Solicitud #{solicitud.id_solicitud} - {new Date(solicitud.fecha_hora).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Incidencia
                                    </label>
                                    <select
                                        value={formData.tipo_incidencia}
                                        onChange={(e) => setFormData({...formData, tipo_incidencia: e.target.value})}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    >
                                        <option value="">Seleccione el tipo</option>
                                        {tiposIncidencia.map(tipo => (
                                            <option key={tipo} value={tipo}>
                                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción de la Incidencia
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        rows="4"
                                        placeholder="Describa detalladamente la incidencia..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Enviar Reporte
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <Header title="Reportes de Incidencias" />
        <div className="min-h-screen bg-gray-100">
            <div className="lg:ml-64 pt-16">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold">
                                Reportes de Incidencias {mostrarResueltos ? 'Resueltos' : 'Pendientes'}
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <select
                                    value={tipoIncidencia}
                                    onChange={(e) => handleFiltrarPorTipo(e.target.value)}
                                    className="px-4 py-2 border rounded-lg text-sm w-full sm:w-auto"
                                >
                                    <option value="">Todos los tipos</option>
                                    {tiposIncidencia.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={toggleTipoReportes}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm w-full sm:w-auto ${
                                        mostrarResueltos
                                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {mostrarResueltos ? 'Ver Pendientes' : 'Ver Resueltos'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Lista de Reportes</h3>
                            {loading ? (
                                <p className="text-center">Cargando reportes...</p>
                            ) : (
                                <div className="space-y-4">
                                    {obtenerReportesActuales()?.map((reporte) => (
                                        <div 
                                            key={reporte.id_reporte}
                                            className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                                                selectedReporte === reporte.id_reporte
                                                    ? 'bg-blue-50 border-blue-500'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleVerDetalle(reporte)}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div>
                                                    <p className="font-semibold text-sm sm:text-base">Usuario: {reporte.nombre_usuario}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Tipo: {reporte.tipo_incidencia}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Fecha: {new Date(reporte.fecha_reporte).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                                                    reporte.estado === 'resuelto'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {reporte.estado}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedReporte && detalleReporte && (
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6 relative modal-detalle">
                                <button 
                                    onClick={handleCloseDetalle}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                    <span className="text-xl">×</span>
                                </button>
                                <h3 className="text-xl font-semibold mb-4">Detalles del Reporte</h3>
                                <div className="space-y-4">
                                    <p><span className="font-semibold">ID Reporte:</span> {detalleReporte.id_reporte}</p>
                                    <p><span className="font-semibold">ID Solicitud:</span> {detalleReporte.id_solicitud}</p>
                                    <p><span className="font-semibold">Usuario:</span> {detalleReporte.nombre_usuario}</p>
                                    <p><span className="font-semibold">Tipo:</span> {detalleReporte.tipo_incidencia}</p>
                                    <p><span className="font-semibold">Descripción:</span> {detalleReporte.descripcion}</p>
                                    <p><span className="font-semibold">Fecha:</span> {new Date(detalleReporte.fecha_reporte).toLocaleString()}</p>
                                    <Link 
                                        to={`/solicitudes?id=${detalleReporte.id_solicitud}`}
                                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-2 block text-center"
                                    >
                                        Ver Detalles de Solicitud
                                    </Link>
                                    
                                    {detalleReporte.estado !== 'resuelto' && (
                                        <button
                                            onClick={() => handleMarcarResuelto(detalleReporte.id_reporte)}
                                            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Marcar como Resuelto
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ReportesIncidencia;