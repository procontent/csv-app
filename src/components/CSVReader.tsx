// src/components/CSVReader.tsx
import React, { useState } from 'react';
import * as Papa from 'papaparse';

type CSVRow = { [key: string]: string };

const CSVReader: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [filter, setFilter] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        if (target?.result) {
          const results = Papa.parse(target.result as string, { header: true });
          setData(results.data as CSVRow[]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <input type="text" placeholder="Filter..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <table border={1}>
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVReader;