import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentSchedulePage: React.FC = () => (
  <PageContainer title="Horario e Calendario">
    <ComingSoon message="Aquí verás tu horario semanal, calendario de exámenes y eventos del centro." />
  </PageContainer>
);

export default StudentSchedulePage;
