export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Skillet & Stack Studios</span>
        <span>Built with the MERN stack.</span>
      </div>
    </footer>
  );
}
