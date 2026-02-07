
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Feed } from './pages/Feed';
import { MyNetwork } from './pages/MyNetwork';
import { Jobs } from './pages/Jobs';
import { Profile } from './pages/Profile';
import { CompanySearch } from './pages/CompanySearch';
import { CareerStrategy } from './pages/CareerStrategy';
import { Interview } from './pages/Interview';
import { Applications } from './pages/Applications';
import { Recommendations } from './pages/Recommendations';
import { Scribe } from './pages/Scribe';
import { SignIn } from './pages/SignIn';
import { BusinessHub } from './pages/BusinessHub';
import { AuthUser } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hireai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('hireai_user');
      }
    }
  }, []);

  const handleSignIn = (userData: AuthUser) => {
    localStorage.setItem('hireai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hireai_user');
    setUser(null);
  };

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/network" element={<MyNetwork />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/companies" element={<CompanySearch />} />
          <Route path="/scribe" element={<Scribe />} />
          <Route path="/strategy" element={<CareerStrategy />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/business" element={<BusinessHub user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
