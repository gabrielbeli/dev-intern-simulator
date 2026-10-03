const API_URL = "http://localhost:3000"

export async function getIntern(internId) {
  const response = await fetch(
    `${API_URL}/intern/${internId}`
  )

  if (!response.ok) {
    throw new Error("Could not load intern")
  }

  return response.json()
}

export async function getTasks(internId, status) {
  let url = `${API_URL}/intern/${internId}/tasks`

  if (status !== "all") {
    url += `?status=${status}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Could not load tasks")
  }

  return response.json()
}

export async function completeTask(taskId) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/complete`,
    {
      method: "PATCH"
    }
  )

  if (!response.ok) {
    throw new Error("Could not complete task")
  }

  return response.json()
}