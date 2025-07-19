"use client"

import { Progress } from "../ui/progress"
import { Title } from "./title"

// Componente del dashboard, que muestra el progreso total de un proyecto en especifico
export function AppProgressBar({ value } : {value: number}) {
    return (
        <div className="flex justify-center items-center gap-8">
            <Title className="text-secondary">Medidor de progreso</Title>
            <Progress value={value} className="w-[25%] h-[15px] "/>
        </div>
    )
}