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

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog debe usarse dentro de un DialogProvider");
    }
    return context;
};

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