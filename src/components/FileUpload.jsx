import React, { useState, useEffect } from 'react';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/files/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:8000/api/files/upload/', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Файл успешно загружен!');
        loadFiles();
      } else {
        const error = await response.json();
        alert('Ошибка: ' + (error.error || 'Не удалось загрузить файл'));
      }
    } catch (error) {
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Удалить файл?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/files/${fileId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Файл удалён');
        loadFiles();
      }
    } catch (error) {
      alert('Ошибка удаления: ' + error.message);
    }
  };

  return (
    <div className="file-upload-section">
      <h3>Мои файлы</h3>
      
      <div className="upload-area">
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        {uploading && <span>Загрузка...</span>}
      </div>

      <div className="files-list">
        {files.map(file => (
          <div key={file.id} className="file-item">
            <span>📎 {file.original_name}</span>
            <span>{(file.file_size / 1024).toFixed(2)} KB</span>
            <button onClick={() => handleDelete(file.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
