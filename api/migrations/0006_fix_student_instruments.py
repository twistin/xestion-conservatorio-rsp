from django.db import migrations

def fix_student_instruments(apps, schema_editor):
    Student = apps.get_model('api', 'Student')
    Instrument = apps.get_model('api', 'Instrument')

    # Mapea nombres de instrumento a su ID real en la base de datos
    instrument_map = {i.name.lower(): str(i.id) for i in Instrument.objects.all()}
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
                student.instrument_id = real_id
                student.save()
                changed += 1
    print(f'[MIGRATION] Alumnos corregidos: {changed}')

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0005_enrollment'),
    ]
    operations = [
        migrations.RunPython(fix_student_instruments),
    ]
