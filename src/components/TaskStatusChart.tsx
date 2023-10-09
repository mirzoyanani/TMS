import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/persistReducer";
import Chart, { ChartConfiguration, ChartData } from "chart.js/auto";

const TaskStatusChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const statuses = useSelector((state: RootState) => state.task.allStatuses);

  const chartInstanceRef = useRef<Chart<"bar"> | null>(null);

  useEffect(() => {
    const statusCount: { [key: string]: number } = {
      todo: 0,
      "in progress": 0,
      done: 0,
    };

    statuses.forEach((task: { status: string }) => {
      statusCount[task.status] += 1;
    });

    const chartData: ChartData<"bar"> = {
      labels: ["todo", "in progress", "done"],
      datasets: [
        {
          label: "Task Statistics",
          data: [statusCount.todo, statusCount["in progress"], statusCount.done],
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
  }, [statuses]);

  return (
    <div>
      <canvas ref={chartRef} width={400} height={400} className="chart-canvas"></canvas>
    </div>
  );
};

export default TaskStatusChart;
