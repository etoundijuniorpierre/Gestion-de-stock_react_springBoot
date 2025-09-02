import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/login-page/login';
import Register from './pages/register-page/register';
import Dashboard from './pages/dashboard-page/dachboard';
import AuthGuard from './components/guard/auth-guard';

// Composant de débogage pour tracer les changements d'URL
function DebugRouter() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('🌐 App - Changement d\'URL:', location.pathname);
  }, [location.pathname]);
  
  return null;
}

function App() {
  return (
    <>
      <Router>
        <DebugRouter />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </>
  )
}

export default App
