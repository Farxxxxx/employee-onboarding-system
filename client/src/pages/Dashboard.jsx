import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get("/employees");
                setEmployees(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const total = employees.length;
    const completed = employees.filter((e) => e.status === "completed").length;
    const pending = employees.filter((e) => e.status === "pending").length;

    return (
        <div className="dashboard">
           <div className="dashboard-header">
                <h2>Welcome, {user?.name}</h2>
                <div>
                    <Link to="/employees" className="nav-link">Employees</Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="stats">
                    <div className="stat-card">
                        <h3>{total}</h3>
                        <p>Employees</p>
                    </div>
                    <div className="stat-card">
                        <h3>{completed}</h3>
                        <p>Completed</p>
                    </div>
                    <div className="stat-card">
                        <h3>{pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;