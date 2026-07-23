import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
