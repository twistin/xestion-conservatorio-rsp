import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentMessagesPage: React.FC = () => (
  <PageContainer title="Comunicación">
    <ComingSoon message="Aquí podrás comunicarte con docentes y administración, y ver notificaciones importantes." />
  </PageContainer>
);

export default StudentMessagesPage;
