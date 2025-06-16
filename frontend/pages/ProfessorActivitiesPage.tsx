import React, { useState } from 'react';
import ConcertsSection from '../components/professors/activities/ConcertsSection';
import MasterclassesSection from '../components/professors/activities/MasterclassesSection';
import CompetitionsSection from '../components/professors/activities/CompetitionsSection';
import ProjectsSection from '../components/professors/activities/ProjectsSection';
import AcademicEventsSection from '../components/professors/activities/AcademicEventsSection';

const TABS = [
  { label: 'Conciertos y Recitales', component: <ConcertsSection /> },
  { label: 'Clases Magistrales y Talleres', component: <MasterclassesSection /> },
  { label: 'Concursos y Certámenes', component: <CompetitionsSection /> },
  { label: 'Proyectos Colaborativos y de Extensión', component: <ProjectsSection /> },
  { label: 'Actividades Académicas Especiales', component: <AcademicEventsSection /> },
];

const ProfessorActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Actividades Artísticas</h1>
      <div className="flex space-x-2 mb-6">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded-t font-semibold focus:outline-none transition-colors ${
              activeTab === idx
                ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{TABS[activeTab].component}</div>
    </div>
  );
};

export default ProfessorActivitiesPage;
