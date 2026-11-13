import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { downloadCsvReport, printReport } from '../../utils/reportExport';

const ReportExport = ({ title, filename, headers, rows }) => {
  const [error, setError] = useState('');
  const date = new Date().toISOString().slice(0, 10);
  const disabled = rows.length === 0;

  const handleCsvExport = () => {
    setError('');
    downloadCsvReport(`${filename}-${date}.csv`, headers, rows);
  };

  const handlePdfExport = () => {
    setError('');
    if (!printReport(title, headers, rows)) {
      setError('Allow pop-ups to open the PDF export window.');
    }
  };

  return (
    <div className="portal-report-export">
      <button className="portal-button portal-button-secondary" type="button" onClick={handleCsvExport} disabled={disabled}>
        <Download size={15} aria-hidden="true" /> Export CSV
      </button>
      <button className="portal-button portal-button-secondary" type="button" onClick={handlePdfExport} disabled={disabled}>
        <FileText size={15} aria-hidden="true" /> Export PDF
      </button>
      {error && <span className="portal-report-error" role="alert">{error}</span>}
    </div>
  );
};

export default ReportExport;
