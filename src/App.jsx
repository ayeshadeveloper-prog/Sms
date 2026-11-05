import Navbar from './components/navbar/NavBar';
import Footer from './components/footer/Footer';
import StudentDashboard from './components/dashboard/StudentDashboard';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <StudentDashboard />
      <Footer />
    </>
  );
}

export default App;
