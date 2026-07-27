import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children, message }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location.pathname,
                    message: message || "Please log in to add and connect your REST APIs."
                }}
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;