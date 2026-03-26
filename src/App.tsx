import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SubmitTestimonial from './pages/SubmitTestimonial';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
        <Route path="/admin-testimonials" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;