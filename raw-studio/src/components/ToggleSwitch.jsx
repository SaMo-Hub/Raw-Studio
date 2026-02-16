export default function ToggleSwitch({ isActive, onChange, disabled = false }) {
  return (
    <button
      onClick={() => onChange(!isActive)}
      disabled={disabled}
      className={`group relative inline-flex h-5.5 w-10.5 items-center rounded-full bg-gray-300 transition-all duration-300 ease-out active:scale-90 overflow-hidden ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      title={isActive ? "Desactivate" : "Activate"}
    >
      {/* Fond noir qui slide de la droite */}
      <span
        className={`absolute inset-0 bg-black rounded-full transition-transform duration-300 ease-out ${
          isActive ? "-translate-x-0" : "-translate-x-11"
        }`}
      />
      
      {/* Badge blanc */}
      <span
        className={`relative z-10 inline-block h-4 w-4 rounded-full bg-white transition-all duration-300 ease-out group-active:scale-125 ${
          isActive ? "translate-x-5.5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
