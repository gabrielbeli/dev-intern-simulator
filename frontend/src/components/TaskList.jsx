function TaskList({ tasks, onComplete, completingTaskId }) {
  return (
    <div>
      <h2>Tasks</h2>

      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>XP: {task.xpReward}</p>
          
          {task.status === "pending" && (
            <button
              onClick={() => onComplete(task.id)}
              disabled={completingTaskId === task.id}
            >
              {completingTaskId === task.id
                ? "Completing..."
                : "Complete Task"}
            </button>
)}
        </div>
      ))}
    </div>
  )
}

export default TaskList