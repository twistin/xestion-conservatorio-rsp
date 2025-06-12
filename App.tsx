import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BackendHelloTest from './pages/BackendHelloTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/backend-test" element={<BackendHelloTest />} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
}

export default App;