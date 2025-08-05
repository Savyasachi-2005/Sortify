import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Transform from './pages/Transform';
import History from './pages/History';
import VerifySuccess from './pages/VerifySuccess';
import Profile from './pages/Profile'; // Import the new Profile component

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <main className="pt-16 flex-1 w-full min-h-[calc(100vh-4rem)]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Login />
                  </div>
                } />
                <Route path="/signup" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Signup />
                  </div>
                } />
                <Route path="/verify-success" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <VerifySuccess />
                  </div>
                } />
                <Route path="/features" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Features />
                  </div>
                } />
                <Route path="/about" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <About />
                  </div>
                } />
                <Route path="/contact" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Contact />
                  </div>
                } />
                <Route path="/transform" element={
                  <Transform />
                } />
                <Route path="/history" element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <History />
                  </div>
                } />
                {/* Add the Profile route with protection */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Profile />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Dashboard />
                      </div>
                    </ProtectedRoute>
                  }
                />
                {/* Redirect any unknown route to home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
