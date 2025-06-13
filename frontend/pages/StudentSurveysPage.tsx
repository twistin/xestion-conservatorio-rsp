import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentSurveysPage: React.FC = () => (
  <PageContainer title="Encuestas e Opiniones">
    <ComingSoon message="Aquí podrás valorar clases, responder encuestas y dejar sugerencias." />
  </PageContainer>
);

export default StudentSurveysPage;
