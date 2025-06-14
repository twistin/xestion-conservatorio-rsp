import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as dataService from '../services/dataService';

const ProfessorResourcesPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState('');
  const [instrument, setInstrument] = useState('');
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

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

  return (
    <>
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
      {/* Espacio para recursos didácticos IA */}
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
    </>
  );
};

export default ProfessorResourcesPage;
