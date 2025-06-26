import { Pie } from "react-chartjs-2";
import "../../chartjs-setup";

export function PriorityPieChart({ tasksCount }: { tasksCount: number[] }) {
	const data = {
		labels: ["Alta", "Media", "Baja"],
		datasets: [
			{
				label: "Prioridad de tareas por estado",
				data: tasksCount,
				backgroundColor: [
					"rgb(239, 83, 80)",
					"rgb(255, 225, 0)",
					"rgb(87, 204, 153)",
				],
				hoverOffset: 4,
			},
		],
	};

	const options = {
        responsive: true,
        maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	return <Pie data={data} options={options} />;
}
