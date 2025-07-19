import { createContext, ReactNode, useContext, useState } from "react";

interface DialogContent {
    title: string;
    description: string;
}

interface DialogContextType {
    dialogOpen: boolean;
    dialogContent: DialogContent | null;
    openDialog: (content: DialogContent) => void;
    closeDialog: () => void;
}

// Creamos un context personalizado para manejar un componente GenericDialog para mostrar
// al usuario mensajes de exito o error personalizado en la parte de la aplicación que la 
// requeramos
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Se crea el hook personalizado para consumir el contexto y usar el GenericDialog en 
// cualquier parte de nuestra aplicación, siempre y cuando se encuentre envuelta por el
// DialogProvider
export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog debe usarse dentro de un DialogProvider");
    }
    return context;
};

// El proveedor se va a encargar de brindar las funciones tanto para abrir o cerrar el componente
// de GenericDialog y cambiar su titulo y descripción, para mandar mensajes al usuario del estado
// de las peticiones que se hagan en la aplicación
export const DialogProvider = ({ children }: { children: ReactNode}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);

    const openDialog = (content: DialogContent) => {
        setDialogContent(content);
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
        setDialogContent(null);
    }

    return (
        <DialogContext.Provider value={{ dialogOpen, dialogContent, openDialog, closeDialog}}>
            {children}
        </DialogContext.Provider>
    )

}