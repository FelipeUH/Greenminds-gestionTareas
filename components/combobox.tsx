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

export type Item = {
  value: string;
  label: string;
};

export function ComboBox({
  items,
  nullText,
}: {
  items: Item[];
  nullText: string;
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
                key={item.value}
                value={item.value}
                onSelect={(value) => {
                  setSelected(
                    items.find((item) => item.value === value) ||
                      null
                  );
                  setOpen(false);
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
