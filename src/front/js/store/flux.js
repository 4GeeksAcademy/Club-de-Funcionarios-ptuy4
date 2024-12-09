const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		token: localStorage.getItem("token") || null, // Guardar el token si existe
		user: null, // Información del usuario autenticado
		isAuthenticated: localStorage.getItem("token") ? true : false, // Añadir esta línea para saber si está autenticado
	  },
	  actions: {
		// Función para registrar un usuario
		register: async (full_name, email, password) => {
		  const myHeaders = new Headers();
		  myHeaders.append("Content-Type", "application/json");
  
		  try {
			const response = await fetch(`${process.env.BACKEND_URL}api/user`, {
			  method: "POST",
			  headers: myHeaders,
			  body: JSON.stringify({ full_name, email, password }),
			});
  
			const data = await response.json();
  
			if (response.ok) {
			  alert("Usuario registrado exitosamente");
			  return true;
			} else {
			  alert(data.msg || "Error al registrar usuario");
			  return false;
			}
		  } catch (error) {
			console.error("Error en el registro:", error);
			return false;
		  }
		},
  
		// Función para iniciar sesión
		login: async (email, password) => {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
		
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
					method: "POST",
					headers: myHeaders,
					body: JSON.stringify({ email, password }),
				});
		
				const data = await response.json();
		
				if (response.ok) {
					if (data.token && data.user) {
						// Guarda el token y el user completo en el localStorage
						localStorage.setItem("token", data.token);
						localStorage.setItem("user", JSON.stringify(data.user)); // Guardar el usuario completo
		
						// Actualiza el estado global con el token y el usuario
						setStore({ token: data.token, user: data.user, isAuthenticated: true });
						return true;  // Login exitoso
					} else {
						console.error("No se recibió el token o el usuario.");
						alert("Error: El servidor no envió los datos necesarios.");
						return false;
					}
				} else {
					console.error("Error en la respuesta del servidor:", data.msg || response.statusText);
					alert(data.msg || "Credenciales inválidas");
					return false;
				}
			} catch (error) {
				console.error("Error en el login:", error);
				alert("Error al conectar con el servidor.");
				return false;
			}
		},
		
		  
  
		// Función para cerrar sesión
		logout: () => {
		  // Eliminar el token del localStorage y limpiar el estado global
		  localStorage.removeItem("token");
		  setStore({ token: null, user: null, isAuthenticated: false });
		},
  
		// Verificar si el usuario está autenticado
		isAuthenticated: () => {
		  const store = getStore();
		  return !!store.token; // Devuelve true si el token existe
		},
  
		// Obtener datos protegidos del backend
		getProtectedData: async () => {
			const store = getStore();
		  
			// Si no hay token, no podemos hacer la solicitud
			if (!store.token) {
			  console.error("Usuario no autenticado");
			  return;
			}
		  
			try {
			  const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
				method: "GET",
				headers: {
				  Authorization: `Bearer ${store.token}`, // Enviar el token en los encabezados
				},
			  });
		  
			  if (response.ok) {
				const data = await response.json();
				console.log("Datos protegidos:", data); // Mostrar datos obtenidos
			  } else {
				alert("No autorizado o el token es inválido");
			  }
			} catch (error) {
			  console.error("Error al obtener datos protegidos:", error);
			}
		  },

		  
		  
	  },
	};
  };
  
  export default getState;
  