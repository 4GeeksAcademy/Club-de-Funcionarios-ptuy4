const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			user: JSON.parse(localStorage.getItem("user")) || null,
			isAuthenticated: !!localStorage.getItem("token"),
			books: [],
			places: [],
			users: []
		},
		actions: {
			// Función para registrar un usuario
			register: async (full_name, email, password) => {
				const headers = new Headers({ "Content-Type": "application/json" });

				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/user`, {
						method: "POST",
						headers,
						body: JSON.stringify({ full_name, email, password })
					});

					const data = await response.json();

					if (response.ok) {
						alert("Usuario registrado exitosamente");
						// Datos para el correo
						const emailData = {
							to: email,
							subject: "¡Bienvenido a nuestra plataforma!",
							body: `Hola ${full_name}, gracias por registrarte.`,
						};
						// Envio el correo de bienvenida
						const emailResponse = await fetch(`${process.env.BACKEND_URL}api/send-email`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(emailData),
						});
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
				const headers = new Headers({ "Content-Type": "application/json" });

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers,
						body: JSON.stringify({ email, password })
					});

					const data = await response.json();

					if (response.ok && data.token && data.user) {
						localStorage.setItem("token", data.token);
						localStorage.setItem("user", JSON.stringify(data.user));
						setStore({ token: data.token, user: data.user, isAuthenticated: true });
						return true;
					} else {
						alert(data.msg || "Error en el inicio de sesión");
						return false;
					}
				} catch (error) {
					console.error("Error en el login:", error);
					return false;
				}
			},

			// Función para cerrar sesión
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ token: null, user: null, isAuthenticated: false });
			},

			// Obtener usuarios y actualizar el store
			getUsers: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/user`);
					if (!response.ok) throw new Error("Error al obtener los usuarios");

					const data = await response.json();
					setStore({ users: data });
				} catch (error) {
					console.error("Error al obtener usuarios:", error);
				}
			},

			// Obtener libros y actualizar el store
			getBooks: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/book`);
					if (!response.ok) throw new Error("Error al obtener libros");

					const data = await response.json();
					setStore({ books: data });
				} catch (error) {
					console.error("Error al obtener libros:", error);
				}
			},

			// Obtener lugares y actualizar el store
			getPlaces: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/place`);
					if (!response.ok) throw new Error("Error al obtener lugares");

					const data = await response.json();
					setStore({ places: data });
				} catch (error) {
					console.error("Error al obtener lugares:", error);
				}
			},

			// Otros métodos de CRUD (ejemplo para libros)
			addBook: async (title, author) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/book`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ title, author })
					});
					if (response.ok) {
						alert("Libro añadido exitosamente");
						await getActions().getBooks(); // Refrescar libros
					}
				} catch (error) {
					console.error("Error al añadir libro:", error);
				}
			},
		},
	};
};

export default getState;
