import React from 'react';

const ExportButtons = ({ type = 'bookings' }) => {
  const handleExport = async (format) => {
    try {
      const endpoint = type === 'bookings' 
        ? `http://localhost:8000/api/export/bookings/${format}/`
        : `http://localhost:8000/api/export/menu/${format}/`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Ошибка экспорта');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.${format === 'word' ? 'docx' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Ошибка при экспорте: ' + error.message);
    }
  };

  return (
    <div className="export-buttons">
      <button onClick={() => handleExport('excel')} className="btn-export">
        📊 Excel
      </button>
      <button onClick={() => handleExport('word')} className="btn-export">
        📄 Word
      </button>
      <button onClick={() => handleExport('pdf')} className="btn-export">
        📕 PDF
      </button>
    </div>
  );
};

export default ExportButtons;
