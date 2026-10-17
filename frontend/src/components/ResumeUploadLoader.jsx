export default function ResumeUploadLoader() {
  return (
    <div className="folio-upload-overlay" role="status" aria-live="polite" aria-label="Uploading and reading your resume">
      <div className="folio-upload-dialog">
        <div className="folio-book" aria-hidden="true">
          <div className="folio-book-shadow" />
          <div className="folio-book-page folio-book-page-1" />
          <div className="folio-book-page folio-book-page-2" />
          <div className="folio-book-page folio-book-page-3" />
          <div className="folio-book-page folio-book-page-4" />
          <div className="folio-book-page folio-book-page-5" />
        </div>
        <p className="folio-upload-title">Reading your resume</p>
        <p className="folio-upload-caption">Uploading and pulling out the text…</p>
      </div>
    </div>
  );
}
