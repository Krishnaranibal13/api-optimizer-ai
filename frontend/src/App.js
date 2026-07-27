import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConnectedApis from "./pages/ConnectedApis";
import LogExplorer from "./pages/LogExplorer";
import ExecutiveDashboardPage from "./pages/ExecutiveDashboardPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";

import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Default Home & Dashboard */}
                    <Route path="/" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Feature Explorers */}
                    <Route path="/executive-dashboard" element={<ExecutiveDashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/logs" element={<LogExplorer darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/ai-insights" element={<AIInsightsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/alerts" element={<AlertsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />

                    {/* Protected Action Routes (Requires Login) */}
                    <Route
                        path="/connected-apis"
                        element={
                            <ProtectedRoute message="Please log in to add and connect your REST APIs.">
                                <ConnectedApis darkMode={darkMode} setDarkMode={setDarkMode} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute message="Please log in to view profile settings and manage security.">
                                <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;