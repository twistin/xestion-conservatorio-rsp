import React from 'react';
import NotificationsList from '../components/notifications/NotificationsList';

const NotificationsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Centro de notificacións</h2>
      <NotificationsList />
    </div>
  );
};

export default NotificationsPage;
