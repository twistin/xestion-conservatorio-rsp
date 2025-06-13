import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentEvaluationsPage: React.FC = () => (
  <PageContainer title="Evaluaciones e Progreso">
    <ComingSoon message="Aquí verás tus notas, informes cualitativos y feedback de profesores." />
  </PageContainer>
);

export default StudentEvaluationsPage;
