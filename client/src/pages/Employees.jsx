import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        employeeName: "",
        department: "",
        position: "",
        computerType: ""
    });
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await api.post("/employees", formData);
            setFormData({ employeeName: "", department: "", position: "", computerType: "" });
            setShowForm(false);
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add employee");
        }
    };

    const filteredEmployees = employees.filter((emp) =>
        emp.employeeName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="employees-page">
            <div className="employees-header">
                <h2>Employees</h2>
                <button onClick={() => setShowForm(!showForm)}>+ New Employee</button>
            </div>

            <input
                className="search-input"
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {showForm && (
                <form className="employee-form" onSubmit={handleAddEmployee}>
                    <input
                        type="text"
                        name="employeeName"
                        placeholder="Employee Name"
                        value={formData.employeeName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="position"
                        placeholder="Position"
                        value={formData.position}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="computerType"
                        placeholder="Computer Type"
                        value={formData.computerType}
                        onChange={handleChange}
                    />
                    <button type="submit">Save Employee</button>
                </form>
            )}

            <div className="employee-list">
                {filteredEmployees.map((emp) => (
                    <div
                        key={emp._id}
                        className="employee-row"
                        onClick={() => navigate(`/employees/${emp._id}`)}
                    >
                        <div>
                            <strong>{emp.employeeName}</strong>
                            <p>{emp.department}</p>
                        </div>
                        <span className={`status-badge ${emp.status}`}>
                            {emp.status.replace("_", " ")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Employees;