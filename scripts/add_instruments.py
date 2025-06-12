from api.models import Instrument

# Lista de instrumentos básicos
instrumentos = [
    ("Piano", "Instrumento de teclado"),
    ("Violín", "Instrumento de cuerda frotada"),
    ("Guitarra", "Instrumento de cuerda pulsada"),
    ("Flauta", "Instrumento de viento madera"),
    ("Clarinete", "Instrumento de viento madera"),
    ("Saxofón", "Instrumento de viento madera"),
    ("Trompeta", "Instrumento de viento metal"),
    ("Percusión", "Familia de instrumentos de percusión"),
]

for nombre, descripcion in instrumentos:
    inst, created = Instrument.objects.get_or_create(name=nombre, defaults={"description": descripcion})
    if created:
        print(f"Instrumento creado: {nombre}")
    else:
        print(f"Instrumento ya existente: {nombre}")
