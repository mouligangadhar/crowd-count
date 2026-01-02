import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
// Auth
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { SignupScreen } from './pages/SignupScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { RoleSelectionScreen } from './pages/RoleSelectionScreen';
// Dashboard
import { HomeDashboard } from './pages/HomeDashboard';
import { CameraListScreen } from './pages/CameraListScreen';
import { LiveFeedScreen } from './pages/LiveFeedScreen';
import { HeatmapScreen } from './pages/HeatmapScreen';
import { AnalyticsScreen } from './pages/AnalyticsScreen';
import { AlertCenterScreen } from './pages/AlertCenterScreen';
import { AreaMapScreen } from './pages/AreaMapScreen';
import { ZoneComparisonScreen } from './pages/ZoneComparisonScreen';
import { ThresholdSettingsScreen } from './pages/ThresholdSettingsScreen';
// IoT
import { AddCameraScreen } from './pages/AddCameraScreen';
import { CameraHealthScreen } from './pages/CameraHealthScreen';
import { IoTDashboardScreen } from './pages/IoTDashboardScreen';
import { SensorDetailScreen } from './pages/SensorDetailScreen';
// Operations
import { IncidentReportScreen } from './pages/IncidentReportScreen';
import { TeamChatScreen } from './pages/TeamChatScreen';
import { StaffAllocationScreen } from './pages/StaffAllocationScreen';
import { FlowPredictionScreen } from './pages/FlowPredictionScreen';
import { EventConfigScreen } from './pages/EventConfigScreen';
import { QueueMonitorScreen } from './pages/QueueMonitorScreen';
// Reporting
import { ReportGeneratorScreen } from './pages/ReportGeneratorScreen';
import { FileManagerScreen } from './pages/FileManagerScreen';
// User
import { ProfileScreen } from './pages/ProfileScreen';
import { ThemePreferencesScreen } from './pages/ThemePreferencesScreen';
// Admin
import { AdminDashboardScreen } from './pages/AdminDashboardScreen';
import { UserManagementScreen } from './pages/UserManagementScreen';
export function App() {
  return <ThemeProvider>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/role-selection" element={<RoleSelectionScreen />} />

          {/* Main */}
          <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
          <Route path="/cameras" element={<ProtectedRoute><CameraListScreen /></ProtectedRoute>} />
          <Route path="/camera/add" element={<ProtectedRoute><AddCameraScreen /></ProtectedRoute>} />
          <Route path="/camera/:id" element={<ProtectedRoute><LiveFeedScreen /></ProtectedRoute>} />
          <Route path="/camera/health" element={<ProtectedRoute><CameraHealthScreen /></ProtectedRoute>} />

          <Route path="/heatmap" element={<ProtectedRoute><HeatmapScreen /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsScreen /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertCenterScreen /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><AreaMapScreen /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ZoneComparisonScreen /></ProtectedRoute>} />
          <Route path="/thresholds" element={<ProtectedRoute><ThresholdSettingsScreen /></ProtectedRoute>} />

          {/* IoT */}
          <Route path="/iot" element={<ProtectedRoute><IoTDashboardScreen /></ProtectedRoute>} />
          <Route path="/sensor/:id" element={<ProtectedRoute><SensorDetailScreen /></ProtectedRoute>} />

          {/* Operations */}
          <Route path="/incident/report" element={<ProtectedRoute><IncidentReportScreen /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><TeamChatScreen /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute><StaffAllocationScreen /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute><FlowPredictionScreen /></ProtectedRoute>} />
          <Route path="/event-config" element={<ProtectedRoute><EventConfigScreen /></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><QueueMonitorScreen /></ProtectedRoute>} />

          {/* Reporting */}
          <Route path="/reports" element={<ProtectedRoute><ReportGeneratorScreen /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><FileManagerScreen /></ProtectedRoute>} />

          {/* User */}
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/profile/theme" element={<ProtectedRoute><ThemePreferencesScreen /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardScreen /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagementScreen /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>;
}