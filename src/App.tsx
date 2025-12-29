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
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/cameras" element={<CameraListScreen />} />
          <Route path="/camera/add" element={<AddCameraScreen />} />
          <Route path="/camera/:id" element={<LiveFeedScreen />} />
          <Route path="/camera/health" element={<CameraHealthScreen />} />

          <Route path="/heatmap" element={<HeatmapScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/alerts" element={<AlertCenterScreen />} />
          <Route path="/map" element={<AreaMapScreen />} />
          <Route path="/comparison" element={<ZoneComparisonScreen />} />
          <Route path="/thresholds" element={<ThresholdSettingsScreen />} />

          {/* IoT */}
          <Route path="/iot" element={<IoTDashboardScreen />} />
          <Route path="/sensor/:id" element={<SensorDetailScreen />} />

          {/* Operations */}
          <Route path="/incident/report" element={<IncidentReportScreen />} />
          <Route path="/chat" element={<TeamChatScreen />} />
          <Route path="/staff" element={<StaffAllocationScreen />} />
          <Route path="/prediction" element={<FlowPredictionScreen />} />
          <Route path="/event-config" element={<EventConfigScreen />} />
          <Route path="/queue" element={<QueueMonitorScreen />} />

          {/* Reporting */}
          <Route path="/reports" element={<ReportGeneratorScreen />} />
          <Route path="/files" element={<FileManagerScreen />} />

          {/* User */}
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/profile/theme" element={<ProtectedRoute><ThemePreferencesScreen /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboardScreen />} />
          <Route path="/admin/users" element={<UserManagementScreen />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>;
}