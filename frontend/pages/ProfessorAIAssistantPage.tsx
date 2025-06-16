import React, { useState } from 'react';
import Button from '../components/ui/Button';
import * as dataService from '../../services/dataService';

const ProfessorAIAssistantPage: React.FC = () => {
  // Estado para análisis de grabación
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Estado para análisis de partitura
  const [scoreFile, setScoreFile] = useState<File | null>(null);
  const [scoreResult, setScoreResult] = useState<string | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  // Estado para explicador teórico
  const [theoryQuestion, setTheoryQuestion] = useState('');
  const [theoryAnswer, setTheoryAnswer] = useState<string | null>(null);
  const [theoryLoading, setTheoryLoading] = useState(false);
  const [theoryError, setTheoryError] = useState<string | null>(null);

  // Handlers análisis de grabación
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(e.target.files?.[0] || null);
    setAudioResult(null);
    setAudioError(null);
  };
  const handleAudioAnalyze = async () => {
    if (!audioFile) return;
    setAudioLoading(true); setAudioResult(null); setAudioError(null);
    try {
      const res = await dataService.analyzeStudentRecording(audioFile);
      setAudioResult(res.result || JSON.stringify(res));
    } catch (e: any) {
      setAudioError(e.message || 'Error al analizar la grabación');
    }
    setAudioLoading(false);
  };

  // Handlers análisis de partitura
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScoreFile(e.target.files?.[0] || null);
    setScoreResult(null);
    setScoreError(null);
  };
  const handleScoreAnalyze = async () => {
    if (!scoreFile) return;
    setScoreLoading(true); setScoreResult(null); setScoreError(null);
    try {
      const res = await dataService.analyzeScore(scoreFile);
      setScoreResult(res.result || JSON.stringify(res));
    } catch (e: any) {
      setScoreError(e.message || 'Error al analizar la partitura');
    }
    setScoreLoading(false);
  };

  // Handler explicador teórico
  const handleTheoryAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoryQuestion.trim()) return;
    setTheoryLoading(true); setTheoryAnswer(null); setTheoryError(null);
    try {
      const res = await dataService.explainMusicTheory(theoryQuestion);
      setTheoryAnswer(res.answer || JSON.stringify(res));
    } catch (e: any) {
      setTheoryError(e.message || 'Error al consultar el explicador');
    }
    setTheoryLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white dark:bg-neutral-dark rounded shadow space-y-8">
      <h2 className="text-3xl font-bold mb-4 text-neutral-dark dark:text-neutral-light">Asistente IA del Profesor</h2>

      {/* 1. Retroalimentación y Análisis Musical Automatizado */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold text-primary dark:text-secondary">1. Análisis Musical Automatizado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ia-block p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
            <b>Subir grabación de estudiante</b>
            <input type="file" accept="audio/*,video/*" className="block mt-2" onChange={handleAudioChange} />
            <Button variant="primary" className="mt-2" onClick={handleAudioAnalyze} disabled={!audioFile || audioLoading}>{audioLoading ? 'Analizando...' : 'Analizar'}</Button>
            {audioResult && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{audioResult}</div>}
            {audioError && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{audioError}</div>}
          </div>
          <div className="ia-block p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
            <b>Subir partitura (PDF/MIDI)</b>
            <input type="file" accept=".pdf,.midi,.mid" className="block mt-2" onChange={handleScoreChange} />
            <Button variant="primary" className="mt-2" onClick={handleScoreAnalyze} disabled={!scoreFile || scoreLoading}>{scoreLoading ? 'Analizando...' : 'Analizar'}</Button>
            {scoreResult && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{scoreResult}</div>}
            {scoreError && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{scoreError}</div>}
          </div>
        </div>
      </section>

      {/* 2. Personalización del Aprendizaje y Contenido */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold text-primary dark:text-secondary">2. Personalización del Aprendizaje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ia-block"><PersonalizedLearningBlock /></div>
          <div className="ia-block"><CustomExerciseBlock /></div>
        </div>
      </section>

      {/* 3. Apoyo Teórico y Didáctico (ya implementado arriba) */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold text-primary dark:text-secondary">3. Apoyo Teórico y Didáctico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ia-block p-4 bg-neutral-50 dark:bg-neutral-800 rounded max-w-lg">
            <b>Explicador interactivo de teoría musical</b>
            <form onSubmit={handleTheoryAsk} className="flex flex-col gap-2 mt-2">
              <input type="text" className="input bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border border-neutral-200 dark:border-neutral-700" placeholder="Ej: ¿Qué es un modo lidio?" value={theoryQuestion} onChange={e => setTheoryQuestion(e.target.value)} />
              <Button type="submit" variant="primary" disabled={theoryLoading || !theoryQuestion.trim()}>{theoryLoading ? 'Consultando...' : 'Preguntar'}</Button>
            </form>
            {theoryAnswer && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{theoryAnswer}</div>}
            {theoryError && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{theoryError}</div>}
          </div>
          <div className="ia-block"><QuizGeneratorBlock /></div>
        </div>
      </section>

      {/* 4. Asistencia Administrativa y Organizativa */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold text-primary dark:text-secondary">4. Asistencia Administrativa y Organizativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ia-block"><TasksAndRehearsalsBlock /></div>
          <div className="ia-block"><ProgressAndFAQBlock /></div>
        </div>
      </section>

      {/* El resto de bloques se implementarán progresivamente */}
    </div>
  );
};

export default ProfessorAIAssistantPage;

// --- COMPONENTES AUXILIARES ---

const PersonalizedLearningBlock: React.FC = () => {
  const [repertoire, setRepertoire] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState({ nivel: '', instrumento: '', intereses: '' });

  const handleSuggest = async () => {
    setLoading(true); setError(null); setRepertoire(null);
    try {
      const res = await dataService.getRepertoireSuggestions(params);
      setRepertoire(res.sugerencias || res.repertoire || []);
    } catch (e: any) {
      setError(e.message || 'Error al obtener sugerencias');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
      <b>Rutas de aprendizaje adaptativas y sugerencias de repertorio</b>
      <div className="flex flex-col gap-2 mt-2">
        <input className="input" placeholder="Nivel (ej: elemental, profesional)" value={params.nivel} onChange={e => setParams(p => ({ ...p, nivel: e.target.value }))} />
        <input className="input" placeholder="Instrumento" value={params.instrumento} onChange={e => setParams(p => ({ ...p, instrumento: e.target.value }))} />
        <input className="input" placeholder="Intereses musicales" value={params.intereses} onChange={e => setParams(p => ({ ...p, intereses: e.target.value }))} />
        <Button variant="primary" onClick={handleSuggest} disabled={loading}>{loading ? 'Buscando...' : 'Ver sugerencias'}</Button>
      </div>
      {repertoire && (
        <ul className="mt-2 text-xs text-neutral-dark dark:text-neutral-light list-disc pl-4">
          {repertoire.length === 0 ? <li>No se encontraron sugerencias.</li> : repertoire.map((r, i) => <li key={i}>{typeof r === 'string' ? r : r.titulo || JSON.stringify(r)}</li>)}
        </ul>
      )}
      {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{error}</div>}
    </div>
  );
};

const CustomExerciseBlock: React.FC = () => {
  const [params, setParams] = useState({ tipo: '', nivel: '', instrumento: '' });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await dataService.generateCustomExercise(params);
      setResult(res.ejercicio || res.result || JSON.stringify(res));
    } catch (e: any) {
      setError(e.message || 'Error al generar ejercicio');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
      <b>Generador de ejercicios personalizados</b>
      <div className="flex flex-col gap-2 mt-2">
        <input className="input" placeholder="Tipo de ejercicio (solfeo, dictado, etc.)" value={params.tipo} onChange={e => setParams(p => ({ ...p, tipo: e.target.value }))} />
        <input className="input" placeholder="Nivel" value={params.nivel} onChange={e => setParams(p => ({ ...p, nivel: e.target.value }))} />
        <input className="input" placeholder="Instrumento" value={params.instrumento} onChange={e => setParams(p => ({ ...p, instrumento: e.target.value }))} />
        <Button variant="primary" onClick={handleGenerate} disabled={loading}>{loading ? 'Generando...' : 'Generar ejercicio'}</Button>
      </div>
      {result && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{result}</div>}
      {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{error}</div>}
    </div>
  );
};

const QuizGeneratorBlock: React.FC = () => {
  const [params, setParams] = useState({ tema: '', nivel: '' });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await dataService.generateQuiz(params);
      setResult(res.cuestionario || res.result || JSON.stringify(res));
    } catch (e: any) {
      setError(e.message || 'Error al generar cuestionario');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
      <b>Generador de cuestionarios</b>
      <div className="flex flex-col gap-2 mt-2">
        <input className="input" placeholder="Tema (teoría, historia, etc.)" value={params.tema} onChange={e => setParams(p => ({ ...p, tema: e.target.value }))} />
        <input className="input" placeholder="Nivel" value={params.nivel} onChange={e => setParams(p => ({ ...p, nivel: e.target.value }))} />
        <Button variant="primary" onClick={handleGenerate} disabled={loading}>{loading ? 'Generando...' : 'Crear cuestionario'}</Button>
      </div>
      {result && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{result}</div>}
      {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{error}</div>}
    </div>
  );
};

const TasksAndRehearsalsBlock: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGet = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await dataService.getTasksAndRehearsals();
      setResult(res.tareas || res.result || JSON.stringify(res));
    } catch (e: any) {
      setError(e.message || 'Error al obtener tareas/ensayos');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
      <b>Gestión de tareas y ensayos</b>
      <Button variant="primary" className="mt-2" onClick={handleGet} disabled={loading}>{loading ? 'Cargando...' : 'Ver tareas y ensayos'}</Button>
      {result && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{result}</div>}
      {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{error}</div>}
    </div>
  );
};

const ProgressAndFAQBlock: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [faqLoading, setFaqLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqError, setFaqError] = useState<string | null>(null);

  const handleReport = async () => {
    setLoading(true); setError(null); setReport(null);
    try {
      const res = await dataService.generateProgressReport(studentId);
      setReport(res.informe || res.result || JSON.stringify(res));
    } catch (e: any) {
      setError(e.message || 'Error al generar informe');
    }
    setLoading(false);
  };
  const handleFAQ = async () => {
    setFaqLoading(true); setFaqError(null); setFaqA(null);
    try {
      const res = await dataService.askIntelligentFAQ(faqQ);
      setFaqA(res.respuesta || res.answer || JSON.stringify(res));
    } catch (e: any) {
      setFaqError(e.message || 'Error al consultar FAQ');
    }
    setFaqLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded flex flex-col gap-4">
      <div>
        <b>Resúmenes de progreso</b>
        <div className="flex gap-2 mt-2">
          <input className="input" placeholder="ID del estudiante" value={studentId} onChange={e => setStudentId(e.target.value)} />
          <Button variant="primary" onClick={handleReport} disabled={loading || !studentId}>{loading ? 'Generando...' : 'Generar informe'}</Button>
        </div>
        {report && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{report}</div>}
        {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{error}</div>}
      </div>
      <div>
        <b>FAQ inteligente</b>
        <div className="flex gap-2 mt-2">
          <input className="input" placeholder="Pregunta frecuente" value={faqQ} onChange={e => setFaqQ(e.target.value)} />
          <Button variant="primary" onClick={handleFAQ} disabled={faqLoading || !faqQ.trim()}>{faqLoading ? 'Consultando...' : 'Preguntar'}</Button>
        </div>
        {faqA && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-900 text-xs whitespace-pre-line">{faqA}</div>}
        {faqError && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">{faqError}</div>}
      </div>
    </div>
  );
};
