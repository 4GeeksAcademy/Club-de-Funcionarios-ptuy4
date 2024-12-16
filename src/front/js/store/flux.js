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
							return { error: "El usuario no puede realizar más de 3 reservas de libros activas." };
						}
					}

					// Verificar disponibilidad del ítem
					if (reserv.book_id !== null) {
						const isAvailable = isItemFree(reserv.book_id, true, reserv.start_time, reserv.end_time, reservations, reserv.status);
						if (!isAvailable) {
							return { error: "El libro no está disponible en las fechas seleccionadas." };
						}
					}

					if (reserv.location_id !== null) {
						const isAvailable = isItemFree(reserv.location_id, false, reserv.start_time, reserv.end_time, reservations, reserv.status);
						if (!isAvailable) {
							return { error: "El local no está disponible en las fechas seleccionadas." };
						}
					}

					const response = await fetch(`${process.env.BACKEND_URL}api/schedule`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(reserv)
					});

					if (response.ok) {
						Swal.fire({
							title: "Reserva",
							text: "Reserva creada con éxito!",
							icon: "success"
						});
						return true;
					} else {
						const errorData = await response.json();
						return { error: errorData.msg || "Error al crear la reserva." };
					}
				} catch (error) {
					console.error("Error al añadir reserva:", error);
					return { error: "Error en el servidor al crear la reserva." };
				}
			}
		}
	}
};

export default getState;
