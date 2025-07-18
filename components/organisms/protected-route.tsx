import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Esperar a que los parámetros de la ruta estén disponibles
        if (router.isReady) {
            setIsReady(true);
        }
    }, [router.isReady]);

    useEffect(() => {
        if (!loading && !user && isReady) {
            let nextPath = router.asPath;
            if (id && typeof id === "string") {
                nextPath = nextPath.replace("[id]", id).replace("%5Bid%5D", id);
            }
            const query = `/login?next=${encodeURIComponent(nextPath)}`;
            router.replace(query);
        }
    }, [user, loading, router, id, isReady]);

    // Mientras está cargando o no hay usuario, no renderizamos nada
    if (loading || !user || !isReady) {
        return null;
    }

    return <>{children}</>;
}
