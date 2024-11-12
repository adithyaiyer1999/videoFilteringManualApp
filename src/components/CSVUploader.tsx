import React from 'react';
import Papa from 'papaparse';

interface CSVUploaderProps {
  onVideosLoad: (videos: { path: string }[]) => void;
}

export function CSVUploader({ onVideosLoad }: CSVUploaderProps) {
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = React.useState<string>('');
  const [csvData, setCsvData] = React.useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = Object.keys(results.data[0] || {});
          setHeaders(headers);
          setCsvData(results.data);
          if (headers.length > 0) {
            setSelectedColumn(headers[0]);
          }
        },
      });
    }
  };

  const handleColumnSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColumn(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedColumn && csvData.length > 0) {
      const videos = csvData
        .filter(row => row[selectedColumn])
        .map(row => ({ path: row[selectedColumn] }));
      onVideosLoad(videos);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Upload CSV file:
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </label>
      </div>

      {headers.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Select video path column:
              <select
                value={selectedColumn}
                onChange={handleColumnSelect}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white py-2 px-3"
              >
                {headers.map(header => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition"
          >
            Load Videos
          </button>
        </div>
      )}
    </div>
  );
}