import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PantryPage } from './pages/PantryPage';
import { StoragePage } from './pages/StoragePage';
import { PlannerPage } from './pages/PlannerPage';
import { CommunityPage } from './pages/CommunityPage';
import { LearnPage } from './pages/LearnPage';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './layouts/AppLayout';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="pantry"
          element={
            <ProtectedRoute>
              <PantryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="storage"
          element={
            <ProtectedRoute>
              <StoragePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="planner"
          element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="learn"
          element={
            <ProtectedRoute>
              <LearnPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
