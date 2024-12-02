from datetime import datetime

reservas = [
    {
        "id_reserva": 1,
        "id_item": 101,
        "fecha_inicio": "2024-12-01",
        "fecha_fin": "2024-12-05",
        "devuelto": False,
        "usuario_id": 10,
        "estado": "pendiente",
        "created_at": "2024-11-01T10:30:00",
        "updated_at": "2024-11-01T10:30:00"
    },
    {
        "id_reserva": 2,
        "id_item": 102,
        "fecha_inicio": "2024-12-10",
        "fecha_fin": "2024-12-15",
        "devuelto": False,
        "usuario_id": 11,
        "estado": "confirmada",
        "created_at": "2024-11-15T14:20:00",
        "updated_at": "2024-11-16T10:00:00"
    },
    {
        "id_reserva": 3,
        "id_item": 103,
        "fecha_inicio": "2024-12-20",
        "fecha_fin": "2024-12-25",
        "devuelto": True,
        "usuario_id": 12,
        "estado": "completada",
        "created_at": "2024-11-10T09:00:00",
        "updated_at": "2024-12-26T11:45:00"
    }
]


def is_item_free(item_id, start_date, end_date, reservations):

    # inicializo variables como objeto datetime.date para poder comparar luego

    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    for reserva in reservations:

        # Filtro por el ítem que queremos reservar

        if reserva["id_item"] == item_id:

            # Convertir las fechas a objetos datetime.date
            
            reserva_inicio = datetime.strptime(reserva["fecha_inicio"], '%Y-%m-%d').date()
            reserva_fin = datetime.strptime(reserva["fecha_fin"], '%Y-%m-%d').date()

            # Comprobar si hay solapamiento entre el rango solicitado y la reserva

            if (start_date > reserva_fin or end_date < reserva_inicio):
            
                return True  # Si no hay solapamiento, el ítem está libre
            
            else:
            
                return False # Si hay solapamiento, el ítem no está libre
        
    
   
 

if is_item_free (103, "2024-12-26", "2024-12-28", reservas):
    print ("Disponible")
else:
    print ("No disponible")