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
import { Event } from "@/pages/App/Events";
import RentalsPage from "@/pages/App/Rentals";
import ProjectsPage from "@/pages/App/Projects";
import OrganisationsPage from "@/pages/App/Organisations";
import ReportsPage from "@/pages/App/Reports";
import SettingsPage from "@/pages/App/Settings";
import UsersPage from "@/pages/App/Users";
import { ACCESS_TOKEN } from "@/constants";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  role: string;
  name: string;
  exp: number;
  iat?: number;
}

const AppRouter = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken =  token ? jwtDecode<JwtPayload>(token) : null;
  console.log(decodedToken);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={"/signin"} />} />
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
        {decodedToken && decodedToken.role === "ADMIN" ? (
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
      </Routes>
    </Router>
  );
};

export default AppRouter;
