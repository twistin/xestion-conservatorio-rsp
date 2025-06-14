# Script para actualizar instrument_id de los alumnos según el nombre del instrumento
# Ejecuta esto en el entorno remoto con: python manage.py shell < scripts/fix_student_instruments.py

from api.models import Student, Instrument

# Mapea nombres de instrumento a su ID real en la base de datos
instrument_map = {i.name.lower(): str(i.id) for i in Instrument.objects.all()}
print('Instrumentos encontrados:')
for name, id_ in instrument_map.items():
    print(f'  {name}: {id_}')

# Relación entre instrument_id tipo instr-X y nombre real (ajusta según tus datos)
instr_id_to_name = {
    'instr-1': 'piano',
    'instr-2': 'guitarra',
    'instr-3': 'violín',
    'instr-4': 'flauta',
    'instr-5': 'clarinete',
    'instr-6': 'saxofón',
    'instr-7': 'trompeta',
    'instr-8': 'percusión',
}

changed = 0
for student in Student.objects.all():
    instr_id = student.instrument_id
    if instr_id in instr_id_to_name:
        name = instr_id_to_name[instr_id]
        real_id = instrument_map.get(name)
        if real_id and student.instrument_id != real_id:
            print(f'Corrigiendo alumno {student.first_name} {student.last_name}: {student.instrument_id} -> {real_id}')
            student.instrument_id = real_id
            student.save()
            changed += 1
print(f'Corrección finalizada. Alumnos actualizados: {changed}')
