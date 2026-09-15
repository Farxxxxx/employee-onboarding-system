import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const DEFAULT_TASKS = [
    "Create AD Account",
    "Set up Email",
    "Install Office",
    "Set up Epicor",
    "Assign Printer",
    "Configure VPN",
    "Join Domain"
];

function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const empRes = await api.get(`/employees/${id}`);
            setEmployee(empRes.data);

            const taskRes = await api.get(`/tasks/employee/${id}`);
            setTasks(taskRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateChecklist = async () => {
        try {
            for (const taskName of DEFAULT_TASKS) {
                await api.post("/tasks", { employeeId: id, taskName });
            }
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleTask = async (task) => {
        try {
            const updated = await api.put(`/tasks/${task._id}`, {
                completed: !task.completed,
                completedDate: !task.completed ? new Date() : null
            });

            const newTasks = tasks.map((t) => (t._id === task._id ? updated.data : t));
            setTasks(newTasks);

            const completedCount = newTasks.filter((t) => t.completed).length;
            let newStatus = "pending";
            if (completedCount === newTasks.length && newTasks.length > 0) {
                newStatus = "completed";
            } else if (completedCount > 0) {
                newStatus = "in_progress";
            }

            if (newStatus !== employee.status) {
                await api.put(`/employees/${id}`, { status: newStatus });
                setEmployee({ ...employee, status: newStatus });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteEmployee = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${employee.employeeName}? This cannot be undone.`
        );
        if (!confirmed) return;

        try {
            await api.delete(`/employees/${id}`);
            navigate("/employees");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete employee");
        }
    };

    if (loading) return <p style={{ padding: 30 }}>Loading...</p>;
    if (!employee) return <p style={{ padding: 30 }}>Employee not found.</p>;

    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <div className="employee-details-page">
            <button className="back-link" onClick={() => navigate("/employees")}>
                ← Back to Employees
            </button>

            <div className="details-card">
                <h2>{employee.employeeName}</h2>

                <div className="details-top">
                    <div>
                        <p className="details-sub">
                            {employee.department} {employee.position ? `· ${employee.position}` : ""}
                            {employee.computerType ? ` · ${employee.computerType}` : ""}
                        </p>
                    </div>
                    <button className="delete-btn" onClick={handleDeleteEmployee}>
                        Delete
                    </button>
                </div>

                <div className="progress-wrap">
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{progress}%</span>
                </div>

                {tasks.length === 0 ? (
                    <button className="checklist-init-btn" onClick={handleCreateChecklist}>
                        Create Onboarding Checklist
                    </button>
                ) : (
                    <div className="checklist">
                        {tasks.map((task) => (
                            <label key={task._id} className="checklist-item">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleTask(task)}
                                />
                                <span className={task.completed ? "task-done" : ""}>
                                    {task.taskName}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeDetails;