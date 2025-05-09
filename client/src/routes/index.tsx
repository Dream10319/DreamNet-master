import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// layouts
import AuthLayout from "@/layout/Auth";
import AppLayout from "@/layout/App";

// Pages
import SignInPage from "@/pages/Auth/SignIn";
// import SignUpPage from "@/pages/Auth/SignUp";
import DashboardPage from "@/pages/App/Dashboard";
import { Event } from "@/pages/App/Events";
import RentalsPage from "@/pages/App/Rentals";
import ProjectsPage from "@/pages/App/Projects";
import OrganisationsPage from "@/pages/App/Organisations";
import ReportsPage from "@/pages/App/Reports";
import SettingsPage from "@/pages/App/Settings";
import UsersPage from "@/pages/App/Users";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const AppRouter = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={"/signin"} />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/events"
          element={
            <AppLayout>
              <Event.ListPage />
            </AppLayout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <AppLayout>
              <Event.DetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/rentals"
          element={
            <AppLayout>
              <RentalsPage />
            </AppLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <AppLayout>
              <ProjectsPage />
            </AppLayout>
          }
        />
        <Route
          path="/organisations"
          element={
            <AppLayout>
              <OrganisationsPage />
            </AppLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          }
        />
        {authUser && authUser.role === "ADMIN" ? (
          <>
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />
            <Route
              path="/users"
              element={
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              }
            />
          </>
        ) : null}
        <Route
          path="/signin"
          element={
            <AuthLayout>
              <SignInPage />
            </AuthLayout>
          }
        />
        {/* <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignUpPage />
            </AuthLayout>
          }
        /> */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
