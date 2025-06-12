import React, { useRef } from "react";
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
	const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleUploadClick = (idx: number) => {
		fileInputRefs.current[idx]?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, typeTitle: string) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			// Aquí puedes implementar la lógica para subir el archivo
			alert(`Archivo seleccionado para '${typeTitle}': ${file.name}`);
		}
	};

	return (
		<div style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
			<h1 style={{ textAlign: "center", marginBottom: 32, fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>
				Tipos de Informes en un Conservatorio de Música
			</h1>
			<div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
				{reportTypes.map((type, idx) => (
					<Card key={type.title} className="shadow-xl border border-neutral-200 hover:shadow-2xl transition-shadow duration-200">
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<h2 style={{ marginBottom: 8, fontSize: 22, fontWeight: 600 }}>{type.title}</h2>
							<button
								onClick={() => handleUploadClick(idx)}
								style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 500, cursor: "pointer" }}
								title="Subir informe"
							>
								<i className="fa-solid fa-upload" style={{ marginRight: 6 }}></i>Subir
							</button>
							<input
								type="file"
								accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								ref={el => { fileInputRefs.current[idx] = el as HTMLInputElement | null; }}
								onChange={e => handleFileChange(e, type.title)}
								style={{ display: "none" }}
							/>
						</div>
						<p style={{ color: "#666", marginBottom: 12 }}>{type.description}</p>
						<ul style={{ paddingLeft: 20, marginBottom: 0 }}>
							{type.items.map((item) => (
								<li key={item} style={{ marginBottom: 4 }}>{item}</li>
							))}
						</ul>
					</Card>
				))}
			</div>
		</div>
	);
};

export default ReportsOverview;
