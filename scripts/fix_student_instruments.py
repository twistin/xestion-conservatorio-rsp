# Script para actualizar instrument_id de los alumnos según el nombre del instrumento
# Ejecuta esto en el entorno remoto con: python manage.py shell < scripts/fix_student_instruments.py

from api.models import Student, Instrument

# Mapea nombres de instrumento a su ID real en la base de datos
instrument_map = {i.name: str(i.id) for i in Instrument.objects.all()}
print('Instrumentos encontrados:')
for name, id_ in instrument_map.items():
    print(f'  {name}: {id_}')

# Opcional: mapea los alumnos que tienen instrument_id tipo instr-X a los IDs reales
changed = 0
for student in Student.objects.all():
    # Busca el instrumento por nombre si el instrument_id no es numérico
    if not student.instrument_id.isdigit():
        # Intenta deducir el nombre del instrumento a partir del instrument_id
        # Por ejemplo, si instrument_id es 'instr-2', busca el instrumento con id=2
        if student.instrument_id.startswith('instr-'):
            try:
                idx = int(student.instrument_id.split('-')[1])
                # Busca el instrumento con ese índice (asumiendo orden de creación)
                # Mejor: busca por nombre si tienes esa info
                # Aquí puedes personalizar según tus datos
                # Por ahora, solo lo muestra
                print(f'Alumno {student.first_name} {student.last_name} tiene instrument_id={student.instrument_id} (no numérico)')
            except Exception as e:
                print(f'No se pudo parsear instrument_id para alumno {student.id}: {student.instrument_id}')
        # Si tienes el nombre del instrumento en otro campo, puedes mapearlo aquí
        # Si quieres forzar un valor, hazlo así:
        # student.instrument_id = instrument_map["Guitarra"]
        # student.save()
    else:
        # Ya es numérico, no hace falta cambiar
        pass

print('Script finalizado. Revisa la salida para ver qué alumnos necesitan ser corregidos.')
