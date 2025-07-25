import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { User } from "@/types/database";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	register: (data: {
		email: string;
		full_name: string;
		username: string;
		password: string;
	}) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Se crea un componente proveedor de contexto de autenticación para manejar con mayor facilidad la autenticación de los usuarios
// permitiendo el acceso a la información de autenticación y funciones como login, logout y register
// Se guardan además el estado user y loading, utilizados para guardar la información del usuario autenticado
// y poder manejar que se muestra en pantalla mientras la información se está cargando
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const restoreSession = async () => {
			const access_token = localStorage.getItem("access_token");
			if (access_token) {
				setLoading(true);
				try {
					const res = await fetch("/api/auth/me", {
						method: "GET",
						headers: { Authorization: `Bearer ${access_token}` },
					});
					const result = await res.json();
					if (res.ok && result.data.user) {
						setUser(result.data.user);
					} else {
						setUser(null);
						localStorage.removeItem("access_token");
					}
				} finally {
					setLoading(false);
				}
			}
		};
		restoreSession();
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const result = await res.json();
			if (res.ok) {
				setUser(result.data.user);
				localStorage.setItem("access_token", result.data.session.access_token);
			} else {
				throw new Error(result.error || "Error en en inicio de sesión");
			}
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await fetch("/api/auth/logout", { method: "POST" });
			setUser(null);
			localStorage.removeItem("access_token");
		} finally {
			setLoading(false);
		}
	};

	const register = async (data: {
		email: string;
		full_name: string;
		username: string;
		password: string;
	}) => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const result = await res.json();
			if (!res.ok) {
				throw new Error(result.error || "Error al registrarse");
			}
		} finally {
			setLoading(false);
		}
	};

	// De esta forma, el proveedor de contexto se encarga de pasar toda esta información y funciones
	// a los componentes que envuelve, de forma que en cualquier parte de la aplicación es posible 
	// acceder a las funciones e información de autenticación
	return (
		<AuthContext.Provider value={{ user, loading, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
}

// Para consumir el contexto de autenticación se crea el Hook personalizado useAuth, con
// el que es posible acceder a toda la información de autenticacion. Lanzará un error si se usa
// fuera de un AuthProvider
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuth debe usarse dentro de un AuthProvider");
	return context;
}
