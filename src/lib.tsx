import axios from "axios";
const pageItemsCount = 12;
export const HOST_NAME: string = "http://localhost:8088";
export const statuses: string[] = ["todo", "in progress", "done"];

export async function get_tasks(page: number, token: string | null) {
  try {
    const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}`, {
      headers: { token },
    });
    return {
      items: response.data.data.items,
      totalPages: response.data.data.pagination.totalPages,
    };
  } catch (error) {
    throw new Error(`Error fetching tasks: ${error}`);
  }
}

export async function get_tasks_by_search(query: string, page: number, token: string | null) {
  const response = await axios.get(`${HOST_NAME}/task?query=${query}&page=${page}&pageSize=${pageItemsCount}`, {
    headers: { token },
  });
  return {
    items: response.data.data.items,
    totalPages: response.data.data.pagination.totalPages,
  };
}
export async function update_task_status(taskId: number, taskStatus: string, token: string | null): Promise<void> {
  await axios.put(
    `${HOST_NAME}/task/status`,
    { id: taskId, status: taskStatus },
    {
      headers: { token },
    },
  );
}

export async function fetch_tasks_by_status(page: number, status: string, token: string | null) {
  const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}&status=${status}`, {
    headers: { token },
  });

  return {
    items: response.data.data.items,
    totalPages: response.data.data.pagination.totalPages,
  };
}

export function get_ordered_tasks_path(
  context: string,
  orderBy: string,
  page: number,
  searchValue: string,
  status: string,
) {
  let path = `${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}&date=${orderBy}`;

  if (context === "search" && searchValue) {
    path += `&query=${searchValue}`;
  } else if (context === "status" && status) {
    path += `&status=${status}`;
  }
  return path;
}

export async function get_tasks_order_by_date(path: string, token: string | null) {
  const response = await axios.get(path, {
    headers: { token },
  });

  return {
    items: response.data.data.items,
    totalPages: response.data.data.pagination.totalPages,
  };
}
