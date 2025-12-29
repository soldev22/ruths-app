export default function Footer() {
  return (
    <footer className="w-full bg-[var(--secondary)] text-[var(--background)] pt-8 pb-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Logo */}
            <div className="mb-2 md:mb-0 flex items-center">
              {/* Replace with your SVG or logo image if available */}
              <span className="block w-10 h-10 bg-[var(--background)] rounded flex items-center justify-center mr-3">
                <span className="text-[var(--secondary)] font-bold text-2xl">S</span>
              </span>
              <span className="font-bold text-lg tracking-wide">SkillScan</span>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm mt-2 md:mt-0">
              <a href="/about" className="hover:underline">About</a>
              <a href="/user-guide" className="hover:underline">User guide</a>
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/faq" className="hover:underline">FAQs</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>
        <hr className="my-6 border-[var(--background)]/30" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-[var(--background)]/80">
          <div>
            SkillScan<br />
            © {new Date().getFullYear()} Solutions Developed
          </div>
        </div>
      </div>
    </footer>
  );
}
