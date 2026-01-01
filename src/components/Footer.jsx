export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-700 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-sm">© {new Date().getFullYear()} Crypto Sim</p>
        <p className="text-sm">Built with React + Tailwind</p>
      </div>
    </footer>
  );
}
