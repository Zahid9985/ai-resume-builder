export default function ResumeGenerateLoader() {
  return (
    <div className="folio-upload-overlay" role="status" aria-live="polite" aria-label="Generating your optimized resume">
      <div className="folio-upload-dialog folio-generate-dialog">
        <div className="folio-generate-spinner" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => <div key={index} />)}
        </div>
        <p className="folio-generate-message">Wait a moment — your optimized resume is on the way.</p>
      </div>
    </div>
  );
}
