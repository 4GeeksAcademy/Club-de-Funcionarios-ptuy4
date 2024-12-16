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
						await getActions().getPlaces(); // Refrescar Locales
					}
				} catch (error) {
					console.error("Error al añadir Local:", error);
				}
			},

			addSchedule: async (reserv) => {
				try {
					// Obtener las reservas existentes
					const getSchedulesResponse = await fetch(`${process.env.BACKEND_URL}api/schedule`);
					if (!getSchedulesResponse.ok) throw new Error("Error al obtener reservas");
					const reservations = await getSchedulesResponse.json();

					// Comprobar si el ítem está libre considerando book_id o location_id
					const isItemFree = (item_id, isBook, start_date, end_date, reservations, status) => {
						const formatDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
						const startDate = formatDate(new Date(start_date));
						const endDate = formatDate(new Date(end_date));

						for (const reserva of reservations) {
							const reservaItemId = isBook ? reserva.book_id : reserva.location_id;
							if (reservaItemId === item_id) {
								const reservaInicio = formatDate(new Date(reserva.start_time));
								const reservaFin = formatDate(new Date(reserva.end_time));

								if (reserva.status !== "cancelado" && !(startDate > reservaFin || endDate < reservaInicio)) {
									return false; // no está disponible
								}
							}
						}
						return true; // Está disponible
					};

					// Comprobar si la fecha de la reserva es anterior a hoy
					const today = new Date();
					today.setHours(0, 0, 0, 0);
					const startDate = new Date(reserv.start_time);
					const endDate = new Date(reserv.end_time);

					if (startDate < today || endDate < today) {
						return { error: "La fecha seleccionada no puede ser anterior a hoy." };
					}

					// Verificar si el usuario ya tiene 3 reservas activas de libros
					if (reserv.book_id !== null) {
						const activeBookReservations = reservations.filter(
							(reservation) => reservation.user_id === reserv.user_id && reservation.book_id !== null && reservation.status === "reservado"
						);

						if (activeBookReservations.length >= 3) {
							return { error: "El usuario no puede realizar más de 3 reservas de libros." };
						}
					}

					// Determinar si se trata de un libro o una ubicación
					const isBook = reserv.book_id !== null;
					const itemId = isBook ? reserv.book_id : reserv.location_id;

					// Verificar disponibilidad
					const available = isItemFree(itemId, isBook, reserv.start_time, reserv.end_time, reservations, reserv.status);

					if (!available) {
						return { error: "El ítem no está disponible en las fechas seleccionadas." };
					}

					// Realizar la reserva si está disponible
					const response = await fetch(`${process.env.BACKEND_URL}api/schedule`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							user_id: reserv.user_id,
							book_id: reserv.book_id,
							location_id: reserv.location_id,
							start_time: reserv.start_time,
							end_time: reserv.end_time,
							status: reserv.status
						})
					});

					const resp = await response.json();

					if (response.ok) {
						await getActions().getSchedules(); // Actualiza el store llamando a la acción
						return { success: "Reserva realizada exitosamente." };
					} else {
						return { error: "Error al realizar la reserva. Intenta nuevamente." };
					}

				} catch (error) {
					console.error("Error al añadir reserva:", error);
					return { error: "Hubo un problema al procesar la reserva. Intenta nuevamente." };
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
						await getActions().getBooks();
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
