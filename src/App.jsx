import './App.css';
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './pages/Upload';
import Download from './pages/Download';
import { Home } from './pages/Home';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/download" element={<Download />} />
        <Route path="/download/:id" element={<Download />} />

      </Routes>
    </Router>
  );
}

export default App;
