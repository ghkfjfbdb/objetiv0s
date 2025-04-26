
const PixelBolsonaro = () => (
  <div className="flex justify-center py-4 animate-fade-in">
    <svg
      width="120"
      height="120"
      viewBox="0 0 30 30"
      style={{ imageRendering: "pixelated" }}
      className="border border-gray-400 rounded bg-gray-100 shadow-lg"
    >
      <rect x="9" y="2" width="12" height="3" fill="#C0C0C0" />
      <rect x="10" y="5" width="10" height="7" fill="#F5D5A0" />
      <rect x="8" y="12" width="14" height="4" fill="#2E8B57" />
      <rect x="11" y="16" width="3" height="4" fill="#2E8B57" />
      <rect x="16" y="16" width="3" height="4" fill="#2E8B57" />
      <rect x="12" y="7" width="1" height="1" fill="#000" />
      <rect x="17" y="7" width="1" height="1" fill="#000" />
      <rect x="12" y="10" width="6" height="1" fill="#505050" />
      <rect x="12" y="14" width="6" height="1" fill="#1E4D2B" />
    </svg>
  </div>
);

export default PixelBolsonaro;
