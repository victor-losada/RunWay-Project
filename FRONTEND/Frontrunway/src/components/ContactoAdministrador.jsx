import React from 'react'

const ContactoAdministrador = () => {
  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Contactate con el soporte por olvido de contraseña</h1>
      <p className="text-black-600 text-center font-bold">u67hdh+22n831o10yxy8@sharklasers.com</p>
      <p className="text-lg text-gray-500 text-center mb-4">Si has olvidado tu contraseña, por favor, comunícate con el administrador a través de este enlace de correo electrónico.</p>
      <p className="text-lg text-gray-500 text-center mb-8">Antes de enviar el correo, asegúrate de incluir tu nombre de usuario y una breve descripción del problema para que podamos ayudarte de manera más eficiente.</p>
      <div className="flex justify-center">
        <a href="mailto:soporte@dominio.com?subject=Olvido de contraseña&body=Nombre de usuario: %0D%0ADescripción del problema: " className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Enviar correo electrónico</a>
      </div>
    </div>
  )
}

export default ContactoAdministrador