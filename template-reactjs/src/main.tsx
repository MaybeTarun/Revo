import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import NotFound from './NotFound';
import LenisWrapper from './components/layout/LenisWrapper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LenisWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </LenisWrapper>
  </StrictMode>,
);
