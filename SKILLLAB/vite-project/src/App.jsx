import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: newTask } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    }
    setNewTask("");
  };

  const handleDelete = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const handleEdit = (id, text) => {
    setEditId(id);
    setNewTask(text);
  };
  const handleToggle = (id) =>
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

  const filteredTasks =
    filter === "All"
      ? tasks
      : filter === "Completed"
      ? tasks.filter((task) => task.completed)
      : tasks.filter((task) => !task.completed);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8 text-white">
      <div className="w-full max-w-3xl bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md p-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 tracking-wide">
          TaskFlow ✨
        </h1>
        <p className="text-center text-gray-200 mb-6 text-sm italic">
          Manage your daily goals efficiently.
        </p>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter your task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 text-white font-semibold"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {["All", "Completed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-medium text-sm ${
                filter === f
                  ? "bg-pink-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-white/20 rounded-lg overflow-hidden">
            <thead className="bg-white/20 text-white">
              <tr>
                <th className="p-3 w-10">#</th>
                <th className="p-3">Task</th>
                <th className="p-3 w-20 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className={`transition-colors ${
                      index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                    } hover:bg-white/30`}
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td
                      className={`p-3 ${
                        task.completed
                          ? "line-through text-gray-300"
                          : "text-white"
                      }`}
                    >
                      {task.text}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(task.id, task.text)}
                        className="text-yellow-300 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-white/70">
                    No tasks found. Add a new one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="text-center text-gray-300 text-xs mt-6 italic">
          Made with ❤️ using React + TailwindCSS
        </footer>
      </div>
    </div>
  );
}

export default App;
