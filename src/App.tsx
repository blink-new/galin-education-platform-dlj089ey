import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import TeamPage from './pages/about/TeamPage';
import StoryPage from './pages/about/StoryPage';
import ResultsPage from './pages/about/ResultsPage';
import BlogPage from './pages/resources/BlogPage';
import BlogPostPage from './pages/resources/BlogPostPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/resources/EventsPage';
import CareersPage from './pages/CareersPage';
import CollegeCounselingPage from './pages/services/CollegeCounselingPage';
import TestPrepPage from './pages/services/TestPrepPage';
import ExecutiveFunctioningPage from './pages/services/ExecutiveFunctioningPage';
import TutoringPage from './pages/services/TutoringPage';
import GraduateAdmissionsPage from './pages/services/GraduateAdmissionsPage';
import './utils/tailwindCustomStyles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/college-counseling" element={<CollegeCounselingPage />} />
              <Route path="/services/test-prep" element={<TestPrepPage />} />
              <Route path="/services/executive-functioning" element={<ExecutiveFunctioningPage />} />
              <Route path="/services/tutoring" element={<TutoringPage />} />
              <Route path="/services/graduate-admissions" element={<GraduateAdmissionsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<Navigate to="/about/story" replace />} />
              <Route path="/about/story" element={<StoryPage />} />
              <Route path="/about/story/results" element={<ResultsPage />} />
              <Route path="/about/team" element={<TeamPage />} />
              <Route path="/resources/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/resources/events" element={<EventsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/login" element={<LoginPage adminLogin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;