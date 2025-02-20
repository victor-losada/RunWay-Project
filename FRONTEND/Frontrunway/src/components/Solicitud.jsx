import React, { useState } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import { API_URL } from '../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


const Solicitud = () => {
  const BASEURL = `${API_URL}/domiciliarios/postAsignarPedido`;
  const { postApiById, error, loading } = UseCrud(BASEURL);
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    direccion_recogida: '',
    direccion_entrega: '',
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!auth.user || !auth.user.id_usuario) {
        Toastify({
          text: 'Error: No se pudo obtener la información del usuario',
          duration: 3000,
          gravity: 'top',
          backgroundColor: 'red',
        }).showToast();
        return;
      }

      const response = await postApiById(formData, auth.user.id_usuario);
      
      if (response && response.nombre_domiciliario) {
        Toastify({
          text: `Solicitud creada exitosamente. Asignada al domiciliario: ${response.nombre_domiciliario}`,
          duration: 3000,
          gravity: 'top',
          backgroundColor: 'green',
        }).showToast();
        setFormData({
          direccion_recogida: '',
          direccion_entrega: '',
          descripcion: ''
        });
      } else {
        Toastify({
          text: 'Error: No se pudo asignar el domiciliario.',
          duration: 3000,
          gravity: 'top',
          backgroundColor: 'red',
        }).showToast();
      }
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      Toastify({
        text: 'Error al crear la solicitud. Por favor, intente nuevamente.',
        duration: 3000,
        gravity: 'top',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="text-center">
              No hay información del usuario disponible
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="Crear Solicitud" />
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-6 text-center">Nueva Solicitud de Domicilio</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dirección de Recogida
                    </label>
                    <input
                      type="text"
                      name="direccion_recogida"
                      value={formData.direccion_recogida}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dirección de Entrega
                    </label>
                    <input
                      type="text"
                      name="direccion_entrega"
                      value={formData.direccion_entrega}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {loading ? 'Creando solicitud...' : 'Crear Solicitud'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Solicitud;