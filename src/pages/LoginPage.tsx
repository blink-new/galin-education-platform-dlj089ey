import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  adminLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ adminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleTutorLogin = () => {
    window.open('https://galined.teachworks.com/accounts/login', '_blank');
  };

  const handleCounselorLogin = () => {
    window.open('https://www.customcollegeplan.com/signin', '_blank');
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  if (adminLogin) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Administrator Login</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0085c2] focus:border-[#0085c2]"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0085c2] focus:border-[#0085c2]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-[#0085c2] text-white font-medium rounded-md hover:bg-[#FFB546] transition-colors duration-200"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Login Portal</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tutors Column */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Tutors</h2>
            <p className="text-gray-600 mb-8">
              Manage your lessons and see room assignments in TeachWorks
            </p>
            <button
              onClick={handleTutorLogin}
              className="inline-flex items-center px-6 py-3 bg-[#0085c2] text-white font-medium rounded-md hover:bg-[#FFB546] transition-colors duration-200"
            >
              Tutor Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Counselors Column */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Counselors</h2>
            <p className="text-gray-600 mb-8">
              Manage your applications, track communication, and enter test scores
            </p>
            <button
              onClick={handleCounselorLogin}
              className="inline-flex items-center px-6 py-3 bg-[#0085c2] text-white font-medium rounded-md hover:bg-[#FFB546] transition-colors duration-200"
            >
              Counselor Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Administrator Login */}
        <div className="mt-12 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center px-6 py-3 text-[#0085c2] font-medium hover:text-[#FFB546] transition-colors duration-200"
          >
            Administrator Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;