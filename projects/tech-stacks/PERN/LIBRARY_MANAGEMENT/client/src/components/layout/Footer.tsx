export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} BookWise Public Library. All rights
        reserved.
      </p>
    </footer>
  );
}
