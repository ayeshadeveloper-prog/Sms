import { useEffect, useMemo, useState } from 'react';

const initialStudents = [
  
];

const emptyStudent = {
  name: '',
  email: '',
  course: '',
  year: '1st Year',
  age: '',
  status: 'Active',
  gender: 'Female',
};

function StudentDashboard() {
  const [students, setStudents] = useState(initialStudents);
  const [formData, setFormData] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('Demo data is active right now. Add your MongoDB URI later to persist records.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          setNotice('Connected to the backend API and loaded student records.');
        }
      } catch (error) {
        console.info('Backend not running yet, using demo data.', error.message);
      }
    };

    loadStudents();
  }, []);

  const stats = useMemo(() => {
    const activeCount = students.filter((student) => student.status === 'Active').length;
    const placementCount = students.filter((student) => student.status === 'Placement').length;
    const averageAge =
      students.length > 0
        ? Math.round(students.reduce((sum, student) => sum + Number(student.age || 0), 0) / students.length)
        : 0;

    return {
      total: students.length,
      active: activeCount,
      placement: placementCount,
      averageAge,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = [student.name, student.email, student.course]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyStudent);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, age: Number(formData.age) };

    try {
      const endpoint = editingId ? `/api/students/${editingId}` : '/api/students';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save record');

      const savedStudent = data.student || data;

      setStudents((current) => {
        if (editingId) {
          return current.map((student) => (student.id === editingId ? { ...student, ...savedStudent } : student));
        }

        const newStudent = { ...savedStudent, id: savedStudent.id ?? Date.now() };
        return [newStudent, ...current];
      });

      resetForm();
      setNotice(editingId ? 'Student updated successfully.' : 'New student added successfully.');
    } catch (error) {
      setNotice(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      year: student.year,
      age: student.age,
      status: student.status,
      gender: student.gender,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete student');

      setStudents((current) => current.filter((student) => student.id !== studentId));
      if (editingId === studentId) resetForm();
      setNotice('Student removed successfully.');
    } catch (error) {
      setNotice(error.message || 'Deletion failed.');
    }
  };

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
                Smart campus dashboard
              </p>
              <h1 className="text-3xl font-bold md:text-5xl">Student Management System</h1>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-sm text-indigo-100">School year</p>
              <p className="text-2xl font-bold">2026</p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="stats-card">
            <p>Total students</p>
            <strong>{stats.total}</strong>
          </div>
          <div className="stats-card">
            <p>Active</p>
            <strong>{stats.active}</strong>
          </div>
          <div className="stats-card">
            <p>Placement</p>
            <strong>{stats.placement}</strong>
          </div>
          <div className="stats-card">
            <p>Average age</p>
            <strong>{stats.averageAge} yrs</strong>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500">Overview</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">Student records</h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email or course"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                <option value="all">All status</option>
                <option value="Active">Active</option>
                <option value="Placement">Placement</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div id="students" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Students list</h3>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {filteredStudents.length} results
              </span>
            </div>

            <div className="space-y-4">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <article key={student.id} className="student-card">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{student.name}</h4>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>

                      <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {student.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Course</p>
                        <p className="mt-1 font-medium text-slate-700">{student.course}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Year</p>
                        <p className="mt-1 font-medium text-slate-700">{student.year}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Age</p>
                        <p className="mt-1 font-medium text-slate-700">{student.age}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(student)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                  No students match your current search.
                </div>
              )}
            </div>
          </div>

          <aside id="add-student" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500">Admission</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">
                {editingId ? 'Update student' : 'Add new student'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Student name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="name@example.com"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    min="15"
                    max="60"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Year</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="input-field">
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                  <option value="Active">Active</option>
                  <option value="Placement">Placement</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update student' : 'Add student'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>
            </form>

            {notice && (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                {notice}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default StudentDashboard;
