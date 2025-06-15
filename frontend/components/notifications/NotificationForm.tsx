import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { createNotification } from '../../services/dataService';
import { Notification } from '../../types';

const tipoOptions = [
  { value: 'xeral', label: 'Xeral' },
  { value: 'aviso', label: 'Aviso' },
  { value: 'automatico', label: 'Automática' },
];

const NotificationForm: React.FC<{ onCreated: (n: Notification) => void }> = ({ onCreated }) => {
  const [titulo, setTitulo] = useState('');
  const [mensaxe, setMensaxe] = useState('');
  const [usuario_destino, setUsuarioDestino] = useState('');
  const [tipo, setTipo] = useState('xeral');
  const [canal_preferido, setCanalPreferido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const n = await createNotification({ titulo, mensaxe, usuario_destino, tipo, canal_preferido });
      setTitulo(''); setMensaxe(''); setUsuarioDestino(''); setTipo('xeral'); setCanalPreferido('');
      onCreated(n);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f8fafc', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" required style={{ flex: 2 }} />
        <Select value={tipo} onChange={e => setTipo(e.target.value)} options={tipoOptions} style={{ flex: 1 }} />
        <Input value={usuario_destino} onChange={e => setUsuarioDestino(e.target.value)} placeholder="Usuario destino (opcional)" style={{ flex: 1 }} />
        <Input value={canal_preferido} onChange={e => setCanalPreferido(e.target.value)} placeholder="Canal (opcional)" style={{ flex: 1 }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <Input as="textarea" value={mensaxe} onChange={e => setMensaxe(e.target.value)} placeholder="Mensaxe" required rows={2} />
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        <Button type="submit" color="primary" disabled={loading}>{loading ? 'Enviando...' : 'Crear notificación'}</Button>
      </div>
    </form>
  );
};

export default NotificationForm;
