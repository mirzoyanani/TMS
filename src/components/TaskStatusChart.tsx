import { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration, ChartData } from "chart.js/auto";
import axios from "axios";
import { HOST_NAME } from "../lib";

const TaskStatusChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const token = localStorage.getItem("token");
  interface StatusCount {
    todo_count: number;
    in_progress_count: number;
    done_count: number;
  }
  const [statusCount, setStatusCount] = useState<StatusCount>({
    todo_count: 0,
    in_progress_count: 0,
    done_count: 0,
  });

  useEffect(() => {
    async function getStatuses() {
      try {
        const response = await axios.get(`${HOST_NAME}/statistics`, {
          headers: { token },
        });
        setStatusCount(response.data.data.statusCounts[0]);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    }
    getStatuses();
  }, [token]);

  const chartInstanceRef = useRef<Chart<"bar"> | null>(null);

  useEffect(() => {
    const chartData: ChartData<"bar"> = {
      labels: ["todo", "in progress", "done"],
      datasets: [
        {
          label: "Task Statistics",
          data: [statusCount.todo_count, statusCount.in_progress_count, statusCount.done_count],
          backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(95, 192, 192, 0.5)"],
        },
      ],
    };

    const chartOptions: ChartConfiguration<"bar">["options"] = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          beginAtZero: true,
          stacked: true,
        },
      },
    };

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const newChart = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        });

        chartInstanceRef.current = newChart;
      }
    }
  }, [statusCount.done_count, statusCount.in_progress_count, statusCount.todo_count]);

  return (
    <div>
      <canvas ref={chartRef} width={400} height={400} className="chart-canvas"></canvas>
    </div>
  );
};

export default TaskStatusChart;
