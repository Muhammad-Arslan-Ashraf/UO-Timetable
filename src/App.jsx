import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TimetableProvider } from './context/TimetableContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './admin/components/AdminLayout';

import HomePage from './pages/HomePage';
import TimetablePage from './pages/TimetablePage';
import NotificationsPage from './pages/NotificationsPage';

import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import UploadPage from './admin/pages/UploadPage';
import BuilderPage from './admin/pages/BuilderPage';
import AdminNotifications from './admin/pages/AdminNotifications';
import AllTimetables from './admin/pages/AllTimetables';

const StudentLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TimetableProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'DM Sans, sans-serif', fontSize: '13px', borderRadius: '12px' },
              success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<StudentLayout><HomePage /></StudentLayout>} />
            <Route path="/timetable" element={<StudentLayout><TimetablePage /></StudentLayout>} />
            <Route path="/notifications" element={<StudentLayout><NotificationsPage /></StudentLayout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="builder" element={<BuilderPage />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="timetables" element={<AllTimetables />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TimetableProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
