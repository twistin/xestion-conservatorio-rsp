import React, { useState, useEffect } from "react";
import ActivityForm from "./ActivityForm";
import { getActivities, addActivity, Activity } from "../../../services/dataService";

const MasterclassesSection: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getActivities('masterclass')
      .then(setActivities)
      .catch(() => setError('Error al cargar actividades'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: any) => {
    try {
      const newActivity = await addActivity({
        ...data,
        type: 'masterclass',
      });
      setActivities(prev => [newActivity, ...prev]);
    } catch {
      setError('Error al crear actividad');
    }
  };

  return (
    <div className="ia-block p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Clases Magistrales y Talleres</h2>
      <p>Programación, inscripción y recursos para masterclasses y talleres.</p>
      <ActivityForm type="Clase Magistral o Taller" onSubmit={handleAdd} />
      <div className="mt-6">
        <h4 className="font-bold mb-2">Próximas clases/talleres</h4>
        {loading ? (
          <p className="text-neutral-medium">Cargando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activities.length === 0 ? (
          <p className="text-neutral-medium">No hay actividades registradas.</p>
        ) : (
          <ul className="space-y-2">
            {activities.map(act => (
              <li key={act.id} className="p-3 rounded bg-gray-50 dark:bg-neutral-dark border border-neutral-light dark:border-neutral-medium">
                <div className="font-semibold">{act.title}</div>
                <div className="text-sm text-neutral-medium">{act.date}</div>
                <div className="text-sm mt-1">{act.description}</div>
                {act.fileUrl && <div className="text-xs mt-1 italic">Archivo adjunto: {act.fileUrl}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MasterclassesSection;
