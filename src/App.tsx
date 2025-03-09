// src/App.tsx
import React from 'react';
import CSVReader from './components/CSVReader';

const App: React.FC = () => {
  return (
    <div>
      <h1>CSV File Reader</h1>
      <CSVReader />
    </div>
  );
};

export default App;