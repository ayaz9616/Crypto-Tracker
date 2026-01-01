export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400 mr-3"></div>
      <span className="text-teal-400 text-sm">{label}</span>
    </div>
  );
}
