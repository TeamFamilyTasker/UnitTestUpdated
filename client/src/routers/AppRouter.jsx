import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import AuthRouter from './AuthRouter';
import CalendarScreen from '../components/calendar/CalendarScreen';
import AdminDash from '../components/AdminDash'; // Adjust the import path as necessary
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { startChecking } from '../actions/auth';
import LoadingScreen from '../components/ui/LoadingScreen';

const AppRouter = () => {
  const dispatch = useDispatch();
  const { checking, id, role } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);

  if (checking) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <PublicRoute isAuth={!!id}>
              <AuthRouter />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute isAuth={!!id && role === 'admin'}>
              <AdminDash />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute isAuth={!!id}>
              {role === 'admin' ? <Navigate to="/admin" /> : <CalendarScreen />}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
