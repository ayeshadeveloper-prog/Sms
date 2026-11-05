import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

const students = [
  {
    id: 1,
    name: 'Aisha Rahman',
    email: 'aisha.rahman@example.com',
    course: 'Computer Science',
    year: '2nd Year',
    age: 20,
    status: 'Active',
    gender: 'Female',
  },
  {
    id: 2,
    name: 'Daniel James',
    email: 'daniel.james@example.com',
    course: 'Business Administration',
    year: '3rd Year',
    age: 22,
    status: 'Placement',
    gender: 'Male',
  },
  {
    id: 3,
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    course: 'Data Science',
    year: '1st Year',
    age: 19,
    status: 'On Leave',
    gender: 'Female',
  },
];

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Student API is running.' });
});

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.post('/api/students', (req, res) => {
  const { name, email, course, year, age, status, gender } = req.body;

  if (!name || !email || !course || !year || !age) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  const newStudent = {
    id: Date.now(),
    name,
    email,
    course,
    year,
    age: Number(age),
    status: status || 'Active',
    gender: gender || 'Female',
  };

  students.unshift(newStudent);
  return res.status(201).json({ message: 'Student created successfully.', student: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const studentId = Number(req.params.id);
  const index = students.findIndex((student) => student.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const updatedStudent = {
    ...students[index],
    ...req.body,
    age: Number(req.body.age ?? students[index].age),
  };

  students[index] = updatedStudent;
  return res.json({ message: 'Student updated successfully.', student: updatedStudent });
});

app.delete('/api/students/:id', (req, res) => {
  const studentId = Number(req.params.id);
  const index = students.findIndex((student) => student.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  students.splice(index, 1);
  return res.json({ message: 'Student deleted successfully.' });
});

app.listen(PORT, () => {
  console.log(`Student API running on http://localhost:${PORT}`);
});
