import './App.css'
import { useEffect, useState } from "react"
import InternCard from './components/InternCard'
import TaskList from "./components/TaskList.jsx"

function App() {
  const [intern, setIntern] = useState(null)

  const internId = "6ab9ae0c07981b87a439bbed"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function loadIntern() {
      try {
        const response = await fetch(
          `http://localhost:3000/intern/${internId}`
        )

        if (!response.ok) {
        throw new Error("Could not load intern")
        }

        const data = await response.json()

        setIntern(data)
      } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
    }

    async function loadTasks() {
      try {
        const response = await fetch(
          `http://localhost:3000/intern/${internId}/tasks`
        )

        if (!response.ok) {
          throw new Error("Could not load tasks")
        }

        const data = await response.json()

        setTasks(data)
      } catch (error) {
        setError(error.message)
      }
    }

    loadIntern()
    loadTasks()
  }, [])

  async function handleCompleteTask(taskId) {
  try {
    const response = await fetch(
      `http://localhost:3000/tasks/${taskId}/complete`,
      {
        method: "PATCH"
      }
    )

    if (!response.ok) {
      throw new Error("Could not complete task")
    }

    const data = await response.json()

    setIntern(data.intern)

    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === data.task.id
          ? data.task
          : task
      )
    )
  } catch (error) {
    setError(error.message)
  }
}

  return (
    <div>
      <h1>Dev Intern Simulator</h1>

      {loading && <p>Loading intern...</p>}

      {error && <p>{error}</p>}

      {intern && (
        <InternCard
          name={intern.name}
          level={intern.level}
          xp={intern.xp}
        />
      )}

      <TaskList 
        tasks={tasks}
        onComplete={handleCompleteTask} 
      />
    </div>
  )
}

export default App
