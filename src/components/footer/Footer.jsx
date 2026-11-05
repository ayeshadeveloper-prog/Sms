
function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-white">

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">

        {/* About */}
        <div>
          <h2 className="mb-3 text-xl font-bold">
            Student<span className="text-indigo-400">Hub</span>
          </h2>

          <p className="text-sm leading-7 text-slate-400">
            A simple and powerful Student Management System
            to manage student records, courses and information.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>

          <div className="space-y-3 text-sm text-slate-400">
            <a href="/" className="block hover:text-white">
              Dashboard
            </a>

            <a href="#students" className="block hover:text-white">
              Students
            </a>

            <a href="#add-student" className="block hover:text-white">
              Add Student
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold">Project Information</h3>

          <p className="mb-3 text-sm text-slate-400">
            Built with React, Node.js and MongoDB.
          </p>

          <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-300">
            MERN Stack Project
          </span>
        </div>

      </div>

      <div className="border-t border-slate-700 px-6 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} StudentHub. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;





