import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "../ui/textarea";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { UserTable } from "../molecules/user-table";
import { UserRowProps } from "../atoms/user-row";

export function SettingsTabs({ users } : {users: UserRowProps[]}) {
	return (
		<div className="flex w-full max-w-3xl flex-col gap-6">
			<Tabs defaultValue="proyect">
				<TabsList className="bg-primary">
					<TabsTrigger value="proyect" className="data-[state=active]:bg-secondary">Proyecto</TabsTrigger>
					<TabsTrigger value="members" className="data-[state=active]:bg-secondary">Miembros</TabsTrigger>
				</TabsList>
				<TabsContent value="proyect">
					<Card className="bg-primary">
						<CardHeader>
							<CardTitle>Editar Proyecto</CardTitle>
							<CardDescription>
								Modifica la información de tu proyecto aquí. Presiona el botón
								Guardar cambios cuando termines.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col h-full w-full gap-4">
								<div className="flex flex-col gap-2">
									<Label htmlFor="project-name">Nombre del proyecto</Label>
									<Input id="project-name" />
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="project-description">Descripción</Label>
									<Textarea id="project-description" />
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="project-endDate">Fecha de finalización</Label>
									<Input id="project-endDate" type="date" />
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex gap-4">
							<ButtonWithIcon
								Icon={Edit}
								variant="default"
								type="submit"
								className="text-primary"
							>
								Guardar cambios
							</ButtonWithIcon>
                            <ButtonWithIcon
                            Icon={Trash2}
                            variant="destructive"
                            className="text-primary"
                            >
                                Borrar proyecto
                            </ButtonWithIcon>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="members">
					<Card className="bg-primary">
						<CardHeader>
							<CardTitle>Agregar o eliminar miembros</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-6">
                            <UserTable users={users}/>
						</CardContent>
						<CardFooter className="flex justify-end">
							<ButtonWithIcon
								Icon={UserPlus}
								variant="default"
								type="submit"
								className="text-primary"
							>
								Agregar miembros
							</ButtonWithIcon>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
