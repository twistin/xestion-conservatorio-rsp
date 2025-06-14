# Generated by Django 5.2 on 2025-06-14 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_fix_student_instruments'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('mensaxe', models.TextField()),
                ('data_envio', models.DateTimeField(auto_now_add=True)),
                ('usuario_destino', models.CharField(blank=True, max_length=100, null=True)),
                ('canal_preferido', models.CharField(blank=True, max_length=50, null=True)),
                ('lido', models.BooleanField(default=False)),
                ('data_lectura', models.DateTimeField(blank=True, null=True)),
                ('tipo', models.CharField(choices=[('xeral', 'Xeral'), ('aviso', 'Aviso'), ('automatico', 'Automático')], default='xeral', max_length=20)),
                ('segmento', models.CharField(blank=True, max_length=100, null=True)),
                ('datos_extra', models.JSONField(blank=True, null=True)),
            ],
        ),
    ]
