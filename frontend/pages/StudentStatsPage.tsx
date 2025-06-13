import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentStatsPage: React.FC = () => (
  <PageContainer title="Estadísticas de Progreso">
    <ComingSoon message="Aquí verás tu progreso, logros y gamificación musical." />
  </PageContainer>
);

export default StudentStatsPage;
