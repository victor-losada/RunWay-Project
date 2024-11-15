import React, { useState } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { FaEnvelope, FaLock, FaRunning } from 'react-icons/fa';
import { API_URL } from '../config';

const BASEURL = `${API_URL}/login`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { postApi, error, loading } = UseCrud(BASEURL);
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await postApi({ email, password });
      if (data.token && data.tipo_usuario) {
        login(data, data.token);
        
        if (data.tipo_usuario === 'domiciliario') {
          navigate('/domiciliario');
        }
        else if (data.tipo_usuario === 'negocio') {
          navigate('/negocio-home');
        }
        else {
          navigate('/home');
        }
      } else {
        console.error("Datos incompletos en la respuesta del login:", data);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-300">
        <div className="text-center mb-6">
          <div className="flex justify-center animate-bounce">
            <FaRunning className="h-16 w-16 text-blue-600 mb-2" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Bienvenido a RunwayDomicilios
          </h2>
          <p className="text-sm text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? 'Ocultar' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p className="text-sm">Error: {error}</p>
          </div>
        )}

        <div className="mt-6 text-center space-y-4">
          <p className="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros términos y condiciones

          </p>
          <Link to='/info'>
          <p className="text-xs text-black"> 
            ¿Olvidaste tu contraseña?
          </p>

          </Link>
          <p className="text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
