import Swal from 'sweetalert2'

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			user: JSON.parse(localStorage.getItem("user")) || null,
			isAuthenticated: !!localStorage.getItem("token"),
			books: [],
			places: [],
			users: [],
			schedules: []
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
						Swal.fire({
							title: "Registro",
							text: "Usuario creado con éxito!",
							icon: "success"
						});

						const actions = getActions();
						const loginSuccess = await actions.login(email, password);

						if (loginSuccess) {
							// Redirigir al usuario al área protegida (ajusta la ruta según tu aplicación)
							window.location.href = "/userLogin"; // O la ruta que necesites
						} else {
							Swal.fire({
								icon: "error",
								title: "Oops...",
								text: "Error al iniciar sesión automáticamente después del registro.",
							});
						}
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
						data = emailResponse.json()
						console.log(data)

						return true;
					} else {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "Error al registrar el usuario",
							footer: data.msg
						});
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
					const response = await fetch(`${process.env.BACKEND_URL}api/login`, {
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
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "Error al iniciar sesión",
							footer: data.msg
						});
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
					const response = await fetch(`${process.env.BACKEND_URL}api/user`);
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
					const response = await fetch(`${process.env.BACKEND_URL}api/book`);
					if (!response.ok) throw new Error("Error al obtener libros");

					const data = await response.json();
					setStore({ books: data });
				} catch (error) {
					console.error("Error al obtener libros:", error);
				}
			},

			// Obtener locales y actualizar el store
			getPlaces: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/place`);
					if (!response.ok) throw new Error("Error al obtener locales");

					const data = await response.json();
					setStore({ places: data });
				} catch (error) {
					console.error("Error al obtener locales:", error);
				}
			},
			getSchedules: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/schedule`);
					if (!response.ok) throw new Error("Error al obtener reservas");

					const data = await response.json();
					setStore({ schedules: data });
				} catch (error) {
					console.error("Error al obtener reservas:", error);
				}
			},

			getUserSchedules: async (userID) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/schedule/user/${userID}`);
					if (!response.ok) {
						throw new Error(`Error al obtener reservas del usuario: ${data.message || JSON.stringify(data)}`);
					}
					const data = await response.json();
					return data;
				} catch (error) {
					console.error(`Error al obtener reservas del usuario ${userID}: ${error.message}`);
				}
			},

			// Metodos POST
			addBook: async (book) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/book`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(book)
					});
					if (response.ok) {
						Swal.fire({
							title: "Libro",
							text: "Libro creado con éxito!",
							icon: "success"
						});
						await getActions().getBooks();
					}
				} catch (error) {
					console.error("Error al añadir libro:", error);
				}
			},
			addPlace: async (place) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/place`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(place)
					});
					if (response.ok) {
						Swal.fire({
							title: "Local",
							text: "Local creado con éxito!",
							icon: "success"
						});
						await getActions().getPlaces();
						const data = await response.json();
						return data
					}
				} catch (error) {
					console.error("Error al añadir Local:", error);
				}
			},

			addSchedule: async (reserv) => {
				try {
					const BASE_URL = `${process.env.BACKEND_URL}api/schedule`;

					// Función para obtener reservas existentes
					const fetchReservations = async () => {
						const response = await fetch(BASE_URL);
						if (!response.ok) throw new Error("Error al obtener reservas");
						return await response.json();
					};

					// Función para verificar si una fecha está en el pasado
					const isDateInPast = (date) => {
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						return new Date(date) < today;
					};

					// Función para verificar si un ítem está disponible
					const isItemAvailable = (itemId, isBook, startDate, endDate, reservations) => {
						const formatDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
						const start = formatDate(new Date(startDate));
						const end = formatDate(new Date(endDate));

						return reservations.every((res) => {
							const reservationItemId = isBook ? res.book_id : res.location_id;
							if (reservationItemId !== itemId || res.status === "cancelado") return true;

							const resStart = formatDate(new Date(res.start_time));
							const resEnd = formatDate(new Date(res.end_time));
							return start > resEnd || end < resStart;
						});
					};

					// Función para contar reservas activas de libros por usuario
					const countActiveBookReservations = (userId, reservations) => {
						return reservations.filter(
							(res) => res.user_id === userId && res.book_id !== null && res.status === "reservado"
						).length;
					};

					// Función para realizar la reserva
					const createReservation = async (reservation) => {
						const response = await fetch(BASE_URL, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(reservation),
						});
						if (!response.ok) throw new Error("Error al realizar la reserva");
						return await response.json();
					};

					// Obtener reservas existentes
					const reservations = await fetchReservations();

					// Validar fechas
					if (isDateInPast(reserv.start_time) || isDateInPast(reserv.end_time)) {
						return { success: false, error: "La fecha seleccionada no puede ser anterior a hoy." };
					}

					// Validar límite de reservas activas para libros
					if (reserv.book_id !== null) {
						const activeBooks = countActiveBookReservations(reserv.user_id, reservations);
						if (activeBooks >= 3) {
							return { success: false, error: "El usuario no puede realizar más de 3 reservas de libros." };
						}
					}

					// Verificar disponibilidad del ítem
					const isBook = reserv.book_id !== null;
					const itemId = isBook ? reserv.book_id : reserv.location_id;
					if (!isItemAvailable(itemId, isBook, reserv.start_time, reserv.end_time, reservations)) {
						return { success: false, error: "El ítem no está disponible en las fechas seleccionadas." };
					}

					// Crear reserva
					const reservationData = {
						user_id: reserv.user_id,
						book_id: reserv.book_id,
						location_id: reserv.location_id,
						start_time: reserv.start_time,
						end_time: reserv.end_time,
						status: reserv.status,
					};
					const result = await createReservation(reservationData);
					console.log(result);
					// Actualizar store y retornar resultado
					if (result.ok) {
						await getActions().getSchedules();
						return { success: true, message: "Reserva realizada exitosamente." };
					} else {
						return { success: false, error: "Error al realizar la reserva. Intenta nuevamente." };
					}

				} catch (error) {
					console.error("Error al añadir reserva:", error);
					return { success: false, error: "Hubo un problema al procesar la reserva. Intenta nuevamente." };
				}
			},


			//UPDATES

			updateUser: async (user_id, user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/user/${user_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(user)
					});
					if (response.ok) {
						Swal.fire({
							title: "Actualizado",
							text: "Usuario actualizado con éxito!",
							icon: "success"
						});
						await getActions().getUsers();
					}
				} catch (error) {
					console.error("Error al actualizar usuario:", error);
				}
			},

			updateBook: async (book_id, book) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/book/${book_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(book)
					});
					if (response.ok) {
						Swal.fire({
							title: "Actualizado",
							text: "Libro actualizado con éxito!",
							icon: "success"
						});
						await getActions().getBooks();
					}
				} catch (error) {
					console.error("Error al actualizar libro:", error);
				}
			},

			updatePlace: async (place_id, place) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/place/${place_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(place)
					});
					if (response.ok) {
						Swal.fire({
							title: "Actualizado",
							text: "Local actualizado con éxito!",
							icon: "success"
						});
						await getActions().getPlaces();
					}
				} catch (error) {
					console.error("Error al actualizar local:", error);
				}
			},

			updateImagePlace: async (place_id, formData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/place/${place_id}`, {
						method: "PUT",
						body: formData
					});
					if (response.ok) {
						Swal.fire({
							title: "Actualizado",
							text: "Local actualizado con éxito!",
							icon: "success"
						});
						await getActions().getPlaces();
					}
				} catch (error) {
					console.error("Error al actualizar local:", error);
				}
			},

			updateSchedule: async (schedule_id, schedule) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/schedule/${schedule_id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(schedule)
					});
					if (response.ok) {
						Swal.fire({
							title: "Actualizado",
							text: "Reserva actualizada con éxito!",
							icon: "success"
						});
						await getActions().getBooks();
					}
				} catch (error) {
					console.error("Error al actualizar reserva:", error);
				}
			},

			//DELETES

			deleteUser: async (user_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/user/${user_id}`, {
						method: "DELETE",
						headers: { "Content-Type": "application/json" }
					});
					if (response.ok) {
						Swal.fire({
							title: "Eliminado",
							text: "Usuario eliminado con éxito!",
							icon: "success"
						});
						await getActions().logout();
					}
				} catch (error) {
					console.error("Error al eliminar usuario:", error);
				}
			},

			deleteBook: async (book_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/book/${book_id}`, {
						method: "DELETE",
						headers: { "Content-Type": "application/json" }
					});
					if (response.ok) {
						Swal.fire({
							title: "Eliminado",
							text: "Libro eliminado con éxito!",
							icon: "success"
						});
						await getActions().getBooks();
					}
				} catch (error) {
					console.error("Error al eliminar libro:", error);
				}
			},

			deletePlace: async (place_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/place/${place_id}`, {
						method: "DELETE",
						headers: { "Content-Type": "application/json" }
					});
					if (response.ok) {
						Swal.fire({
							title: "Eliminado",
							text: "Local eliminado con éxito!",
							icon: "success"
						});
						await getActions().getPlaces();
					}
				} catch (error) {
					console.error("Error al eliminar local:", error);
				}
			},

			recoverUserPass: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/recover-password`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email })  // Enviar el correo electrónico
					});

					if (response.ok) {
						Swal.fire({
							title: "Recuperación exitosa",
							text: "Te hemos enviado un correo con tu nueva contraseña.",
							icon: "success"
						});

					} else {
						const errorData = await response.json();
						Swal.fire({
							title: "Error",
							text: errorData.msg || "Hubo un problema al recuperar la contraseña.",
							icon: "error"
						});
					}
				} catch (error) {
					console.error("Error al intentar recuperar la contraseña:", error);
					Swal.fire({
						title: "Error",
						text: "Ocurrió un error al intentar recuperar la contraseña.",
						icon: "error"
					});
				}
			},
		}
	}
};

export default getState;
