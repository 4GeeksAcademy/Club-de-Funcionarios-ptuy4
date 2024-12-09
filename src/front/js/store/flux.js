const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
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
		  // Acciones para gestionar libros
		  getBooks: async () => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/book`, {
					method: "GET",
				});
				if (response.ok) {
					const data = await response.json();
					return data;
				}
			} catch (error) {
				console.error("Error al obtener libros:", error);
			}
		},

		addBook: async (title, author) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/book`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ title, author }),
				});
				if (response.ok) {
					alert("Libro añadido exitosamente");
				}
			} catch (error) {
				console.error("Error al añadir libro:", error);
			}
		},

		updateBook: async (id, updatedData) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/book/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedData),
				});
				if (response.ok) {
					alert("Libro actualizado exitosamente");
				}
			} catch (error) {
				console.error("Error al actualizar libro:", error);
			}
		},

		deleteBook: async (id) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/book/${id}`, {
					method: "DELETE",
				});
				if (response.ok) {
					alert("Libro eliminado exitosamente");
				}
			} catch (error) {
				console.error("Error al eliminar libro:", error);
			}
		},

		// Acciones para gestionar lugares
		getPlaces: async () => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/place`, {
					method: "GET",
				});
				if (response.ok) {
					const data = await response.json();
					return data;
				}
			} catch (error) {
				console.error("Error al obtener lugares:", error);
			}
		},

		addPlace: async (newPlace) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/place`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newPlace),
				});
				if (response.ok) {
					alert("Lugar añadido exitosamente");
				}
			} catch (error) {
				console.error("Error al añadir lugar:", error);
			}
		},

		updatePlace: async (id, updatedData) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/place/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedData),
				});
				if (response.ok) {
					alert("Lugar actualizado exitosamente");
				}
			} catch (error) {
				console.error("Error al actualizar lugar:", error);
			}
		},

		deletePlace: async (id) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/place/${id}`, {
					method: "DELETE",
				});
				if (response.ok) {
					alert("Lugar eliminado exitosamente");
				}
			} catch (error) {
				console.error("Error al eliminar lugar:", error);
			}
		},

		// Acciones para gestionar schedules
		getSchedules: async () => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/schedule`, {
					method: "GET",
				});
				if (response.ok) {
					const data = await response.json();
					return data;
				}
			} catch (error) {
				console.error("Error al obtener horarios:", error);
			}
		},

		addSchedule: async (newSchedule) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/schedule`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newSchedule),
				});
				if (response.ok) {
					alert("Horario añadido exitosamente");
				}
			} catch (error) {
				console.error("Error al añadir horario:", error);
			}
		},

		updateSchedule: async (id, updatedData) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/schedule/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedData),
				});
				if (response.ok) {
					alert("Horario actualizado exitosamente");
				}
			} catch (error) {
				console.error("Error al actualizar horario:", error);
			}
		},

		deleteSchedule: async (id) => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/schedule/${id}`, {
					method: "DELETE",
				});
				if (response.ok) {
					alert("Horario eliminado exitosamente");
				}
			} catch (error) {
				console.error("Error al eliminar horario:", error);
			}
		},
	  },
	};
  };
  
  export default getState;
  