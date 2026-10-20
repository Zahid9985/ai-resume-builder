const cubeColors = [
  ['#b84b35', '#d07860', '#c45d45'],
  ['#aa563e', '#d18970', '#bd684e'],
  ['#956047', '#c89478', '#b47a5c'],
  ['#806d50', '#b6a184', '#a18a68'],
  ['#6c7959', '#a4b18a', '#899b6e'],
  ['#587d61', '#92b59b', '#74a17e']
];
const cubeOffsets = ['6.25em', '3.125em', '0em', '-3.125em', '-6.25em', '-9.375em'];
const cubeDelays = ['-1.2s', '-1s', '-.8s', '-.6s', '-.4s', '-.2s'];

export default function ResumeAnalyzeLoader() {
  return (
    <div className="folio-upload-overlay" role="status" aria-live="polite" aria-label="Analyzing your resume against the role">
      <div className="folio-upload-dialog folio-analyze-dialog">
        <div className="folio-cube-scene" aria-hidden="true">
          <div className="folio-cube-loop">
            {cubeColors.map(([front, top, side], index) => (
              <div
                className="folio-cube"
                key={front}
                style={{
                  '--cube-color': front,
                  '--cube-top': top,
                  '--cube-side': side,
                  '--cube-offset': cubeOffsets[index],
                  '--cube-delay': cubeDelays[index]
                }}
              />
            ))}
          </div>
        </div>
        <p className="folio-upload-title">Reading the fit</p>
        <p className="folio-upload-caption">Comparing your experience with the role…</p>
      </div>
    </div>
  );
}
