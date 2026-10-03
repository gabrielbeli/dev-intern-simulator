import './App.css'
import { useEffect, useState } from "react"
import InternCard from './components/InternCard'
import TaskList from "./components/TaskList.jsx"
import { getIntern, getTasks, completeTask } from "./api/simulatorApi.js"

function App() {
  const [intern, setIntern] = useState(null)

  const internId = "6ab9ae0c07981b87a439bbed"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [taskStatus, setTaskStatus] = useState("all")
  const [completingTaskId, setCompletingTaskId] = useState(null)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function loadIntern() {
      try {
        const data = await getIntern(internId)

        setIntern(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadIntern()
  }, [])

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks(internId, taskStatus)

        setTasks(data)
      } catch (error) {
        setError(error.message)
      }
    }

    loadTasks()
  }, [taskStatus])

  async function handleCompleteTask(taskId) {
    try {
      setCompletingTaskId(taskId)
      setError(null)

      const data = await completeTask(taskId)

      setIntern(data.intern)

      const updatedTasks = await getTasks(
        internId,
        taskStatus
      )

      setTasks(updatedTasks)
    } catch (error) {
      setError(error.message)
      } finally {
      setCompletingTaskId(null)
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

      <div>
        <button onClick={() => setTaskStatus("all")}>
          All
        </button>

        <button onClick={() => setTaskStatus("pending")}>
          Pending
        </button>

        <button onClick={() => setTaskStatus("completed")}>
          Completed
        </button>
      </div>

      <TaskList 
        tasks={tasks}
        onComplete={handleCompleteTask}
        completingTaskId={completingTaskId}
      />
    </div>
  )
}

export default App
