"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Los elementos de tipo items son los que muestran en la combobox
// Label es lo que el usuario ve y elige, mientras que value hace referencia
// al valor que se manda en las diferentes peticiones
export type Item = {
	value: string;
	label: string;
};

// Componente de combobox, lista desplegable con diferentes opciones 
// para elegir. Items representa los elementos a mostrar, nullText representa
// el texto mostrado si no se elige ningun elemento y onSelect permite capturar
// el valor seleccionado fuera del componente
export function ComboBox({
	items,
	nullText,
	onSelect, 
}: {
	items: Item[];
	nullText: string;
	onSelect: (item: Item | null) => void;
}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Item | null>(null);

	function ItemList({
		setOpen,
		setSelected,
	}: {
		setOpen: (open: boolean) => void;
		setSelected: (item: Item | null) => void;
	}) {
		return (
			<Command>
				<CommandList>
					<CommandGroup>
						{items.map((item) => (
							<CommandItem
								className="text-black"
								key={item.value}
								onSelect={() => {
									setSelected(item);
									setOpen(false);
									onSelect(item);
								}}
							>
								{item.label}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="default" className="w-full justify-start">
					{selected ? <>{selected.label}</> : <>{nullText}</>}
					<ChevronDown />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0" align="start">
				<ItemList setOpen={setOpen} setSelected={setSelected} />
			</PopoverContent>
		</Popover>
	);
}
