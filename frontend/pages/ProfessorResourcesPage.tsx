import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as dataService from '../services/dataService';
import { isIAEnabled } from '../services/dataService';

// ErrorBoundary local para evitar pantallas en blanco
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Se puede loguear el error si se desea
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded text-red-900 text-center">
          <b>Ocurrió un erro inesperado nesta páxina.</b><br />
          Por favor, recarga ou contacta co administrador se persiste.
        </div>
      );
    }
    return this.props.children;
  }
}

const ProfessorResourcesPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await dataService.reviewDocumentIA(file);
      setResult(res.result);
    } catch {
      setError('Error al revisar el documento.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recursos Didácticos IA interactivo ---
  const [level, setLevel] = useState('');
  const [instrument, setInstrument] = useState('');
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggesting(true);
    setSuggestions([]);
    setSuggestionError(null);
    try {
      const res = await dataService.getResourceSuggestionsIA({ level, instrument, topic });
      setSuggestions(res.suggestions);
    } catch {
      setSuggestionError('Error al obtener sugerencias IA.');
    } finally {
      setIsSuggesting(false);
    }
  };

  // --- Mensajes automáticos IA a familias ---
  const [motivo, setMotivo] = useState('');
  const [alumno, setAlumno] = useState('');
  const [mensajeIA, setMensajeIA] = useState<string | null>(null);
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  const handleMsgIA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMsgLoading(true);
    setMensajeIA(null);
    setMsgError(null);
    try {
      const res = await dataService.generateFamilyMessageIA(motivo, alumno);
      setMensajeIA(res.mensaje);
    } catch {
      setMsgError('Error al generar el mensaje IA.');
    } finally {
      setIsMsgLoading(false);
    }
  };

  const iaActive = isIAEnabled();

  return (
    <ErrorBoundary>
      {!iaActive && (
        <div className="max-w-xl mx-auto mt-8 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-900 text-center">
          <b>La IA administrativa está desactivada por el administrador.</b><br />
          Las funciones automáticas de recursos, revisión de documentos y mensajes no están disponibles temporalmente.
        </div>
      )}
      <Card title="Revisión IA de Documentos" className="max-w-xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Sube un documento para revisión automática:</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
          </div>
          <Button type="submit" variant="primary" disabled={isLoading || !file}>
            {isLoading ? 'Revisando...' : 'Revisar Documento'}
          </Button>
        </form>
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-900">
            <b>Resultado IA:</b> {result}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-900">
            {error}
          </div>
        )}
        <div className="mt-6 text-xs text-neutral-medium">
          Solo se aceptan archivos PDF o imagen (máx. 2MB). Si el nombre contiene "firma", se validará como firmado.
        </div>
      </Card>
      {/* --- Recursos Didácticos IA interactivo --- */}
      <Card title="Recursos Didácticos IA" className="max-w-xl mx-auto mt-8">
        <form onSubmit={handleSuggest} className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" className="border rounded px-2 py-1" placeholder="Nivel (opcional)" value={level} onChange={e => setLevel(e.target.value)} />
            <input type="text" className="border rounded px-2 py-1" placeholder="Instrumento (opcional)" value={instrument} onChange={e => setInstrument(e.target.value)} />
            <input type="text" className="border rounded px-2 py-1" placeholder="Tema o palabra clave" value={topic} onChange={e => setTopic(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" disabled={isSuggesting || !topic}>
            {isSuggesting ? 'Buscando...' : 'Obtener Sugerencias IA'}
          </Button>
        </form>
        {suggestionError && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 mb-2">{suggestionError}</div>}
        {suggestions.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        )}
        <div className="mt-4 text-xs text-neutral-medium">
          Introduce un tema, instrumento o nivel para recibir sugerencias automáticas de materiales y recursos.
        </div>
      </Card>
      {/* --- Mensajes automáticos IA a familias --- */}
      <Card title="Generador Automático de Mensajes a Familias (IA)" className="max-w-xl mx-auto mt-8">
        <form onSubmit={handleMsgIA} className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" className="border rounded px-2 py-1" placeholder="Nombre del alumno/a" value={alumno} onChange={e => setAlumno(e.target.value)} required />
            <input type="text" className="border rounded px-2 py-1" placeholder="Motivo (ausencia, felicitación, reunión...)" value={motivo} onChange={e => setMotivo(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" disabled={isMsgLoading || !motivo || !alumno}>
            {isMsgLoading ? 'Generando...' : 'Generar Mensaje IA'}
          </Button>
        </form>
        {msgError && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 mb-2">{msgError}</div>}
        {mensajeIA && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900">
            <b>Mensaje generado:</b> {mensajeIA}
          </div>
        )}
        <div className="mt-4 text-xs text-neutral-medium">
          Escribe el nombre del alumno/a y el motivo para obtener un mensaje automático listo para enviar a las familias.
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default ProfessorResourcesPage;
