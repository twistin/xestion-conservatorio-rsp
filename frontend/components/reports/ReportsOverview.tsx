import React from "react";
import Card from "../ui/Card";

const reportTypes = [
	{
		title: "Informes Académicos",
		description: "Para evaluar y documentar el progreso del alumnado.",
		items: [
			"Boletines de evaluación (por trimestre o cuatrimestre)",
			"Informes individuales de progreso (comentarios cualitativos)",
			"Actas de evaluación",
			"Historial académico (asignaturas superadas, notas finales)",
		],
	},
	{
		title: "Informes de Asistencia",
		description: "Para seguimiento y control del alumnado y profesorado.",
		items: [
			"Informe de faltas de asistencia del alumnado",
			"Informe de puntualidad del profesorado",
			"Resumen mensual de asistencia por grupo",
		],
	},
	{
		title: "Informes Pedagógicos",
		description: "Elaborados por docentes o equipos pedagógicos.",
		items: [
			"Informes de seguimiento personalizado",
			"Adaptaciones curriculares",
			"Informe para tutores legales",
			"Valoraciones de repertorio",
		],
	},
	{
		title: "Informes de Actividad Artística",
		description: "Relativos a actuaciones, audiciones y conciertos.",
		items: [
			"Informe de participación en audiciones",
			"Crónica de conciertos",
			"Repertorio interpretado",
			"Memorias anuales de actividad artística",
		],
	},
	{
		title: "Informes Administrativos",
		description: "Útiles para la dirección y administración del centro.",
		items: [
			"Informe de matrícula y promoción",
			"Estadísticas de matrícula por instrumento/curso",
			"Informe de plazas vacantes",
			"Presupuestos y recursos utilizados",
		],
	},
];

const ReportsOverview: React.FC = () => {
	return (
		<div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
			<h1 style={{ textAlign: "center", marginBottom: 32 }}>
				Tipos de Informes en un Conservatorio de Música
			</h1>
			<div style={{ display: "grid", gap: 24 }}>
				{reportTypes.map((type) => (
					<Card key={type.title}>
						<h2 style={{ marginBottom: 8 }}>{type.title}</h2>
						<p style={{ color: "#666", marginBottom: 12 }}>
							{type.description}
						</p>
						<ul style={{ paddingLeft: 20 }}>
							{type.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</Card>
				))}
			</div>
		</div>
	);
};

export default ReportsOverview;
