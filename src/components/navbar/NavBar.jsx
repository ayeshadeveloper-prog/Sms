
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Student<span className="text-indigo-600">Hub</span>
            </h1>
            <p className="text-xs text-slate-500">
              Management System
            </p>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">

          <a href="/" className="font-medium text-indigo-600">
            Dashboard
          </a>

          <a href="#students" className="font-medium text-slate-600 hover:text-indigo-600">
            Students
          </a>

          <a href="#add-student" className="font-medium text-slate-600 hover:text-indigo-600">
            Add Student
          </a>

        </div>

        {/* Right Button */}
        <div className="hidden md:block">
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Admin Panel
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg bg-slate-100 px-3 py-2 text-xl text-slate-700 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="space-y-3 border-t border-slate-100 bg-white px-6 py-5 md:hidden">

          <a href="/" onClick={() => setMenuOpen(false)}
            className="block font-medium text-slate-700">
            Dashboard
          </a>

          <a href="#students" onClick={() => setMenuOpen(false)}
            className="block font-medium text-slate-700">
            Students
          </a>

          <a href="#add-student" onClick={() => setMenuOpen(false)}
            className="block font-medium text-slate-700">
            Add Student
          </a>

        </div>
      )}

    </nav>
  );
}

export default Navbar;



