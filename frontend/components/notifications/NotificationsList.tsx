import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Notification } from '../../types';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../../services/dataService';

const NotificationCard: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onRead, onDelete }) => (
  <Card style={{ marginBottom: 16, background: notification.lido ? '#f5f5f5' : '#e6f7ff' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>{notification.titulo}</strong>
        <div style={{ fontSize: 13, color: '#888' }}>{new Date(notification.data_envio).toLocaleString('es-ES')}</div>
        <div style={{ marginTop: 8 }}>{notification.mensaxe}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          {notification.tipo === 'automatico' ? 'Automática' : notification.tipo === 'aviso' ? 'Aviso' : 'Xeral'}
          {notification.lido && notification.data_lectura && (
            <span> · Lida o {new Date(notification.data_lectura).toLocaleString('es-ES')}</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!notification.lido && (
          <Button onClick={() => onRead(notification.id)} size="small" color="primary">Marcar como lida</Button>
        )}
        <Button onClick={() => onDelete(notification.id)} size="small" color="danger">Eliminar</Button>
      </div>
    </div>
  </Card>
);

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  if (loading) return <div>Cargando notificacións...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (notifications.length === 0) return <div>Non hai notificacións.</div>;

  return (
    <div>
      {notifications.map(n => (
        <NotificationCard key={n.id} notification={n} onRead={handleRead} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default NotificationsList;
