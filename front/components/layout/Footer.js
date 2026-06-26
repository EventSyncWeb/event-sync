export default function Footer() {
  return (
    <footer className="mt-auto border-t border-blue-800/30 bg-slate-900/95 backdrop-blur-sm py-6 text-center">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm text-blue-200/60">
          &copy; {new Date().getFullYear()} EventSync - Real time event management
        </p>
      </div>
    </footer>
  );
}