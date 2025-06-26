import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { FileCheck, FileClock } from "lucide-react";
import { PriorityPieChart } from "@/components/molecules/priority-pie-chart";
import { AppProgressBar } from "@/components/atoms/app-progress-bar";

export default function DashboardPage() {
	// Datos de la gráfica de pie: Alta - Media - Baja
	const tasksCount = [33, 33, 33];

	return (
		<ProjectLayout>
			<div className="flex flex-col p-12 gap-8">
				<div className="flex justify-start">
					<Title className="text-4xl">Análisis</Title>
				</div>
				<div className="grid grid-cols-2 gap-6">
					<div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
						<div className="flex flex-col flex-2 gap-8 text-center md:text-left">
							<Title>Tareas por prioridad</Title>
							<div className="flex flex-col items-center gap-4 w-full text-center text-3xl text-slate-800">
								<div className="flex gap-6">
									<div className="h-[30px] w-[30px] bg-[#EF5350]"></div>
									<span>Alta - 33%</span>
								</div>
								<div className="flex gap-6">
									<div className="h-[30px] w-[30px] bg-[#FFE100]"></div>
									<span>Media - 33%</span>
								</div>
								<div className="flex gap-6">
									<div className="h-[30px] w-[30px] bg-secondary"></div>
									<span>Baja - 33%</span>
								</div>
							</div>
						</div>
						<div className="flex flex-1 justify-center items-center">
							<PriorityPieChart tasksCount={tasksCount} />
						</div>
					</div>
					<div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
						<div className="flex flex-col flex-2 text-center gap-8">
							<Title>Tiempo promedio por tarea</Title>
							<Title className="text-slate-800">3 días y 5 horas</Title>
						</div>
						<div className="flex flex-1 justify-center items-center">
							<FileCheck className="flex-1 w-full h-full" strokeWidth={1} />
						</div>
					</div>
					<div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
						<div className="flex flex-col flex-2 text-center gap-8">
							<Title>Tareas retrasadas</Title>
							<Title className="text-slate-800">8 sin asignar</Title>
							<Title className="text-slate-800">4 asignadas</Title>
						</div>
						<div className="flex flex-1 justify-center items-center">
							<FileClock className="flex-1 w-full h-full" strokeWidth={1} />
						</div>
					</div>
				</div>
				<AppProgressBar value={25}/> {/* Value determina el porcentaje completado que indicará la barra*/}
			</div>
		</ProjectLayout>
	);
}