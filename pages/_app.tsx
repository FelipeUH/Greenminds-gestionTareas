import { GenericDialog } from "@/components/organisms/generic-dialog";
import { AuthProvider } from "@/context/AuthContext";
import { DialogProvider } from "@/context/DialogContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DialogProvider>
      <AuthProvider>
        <GenericDialog />
        <Component {...pageProps} />
      </AuthProvider>
    </DialogProvider>
  );
}
