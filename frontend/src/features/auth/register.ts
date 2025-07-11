import { api } from "../../api";

/** Lanza 400 si el username o el email ya están en uso. */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  await api.post("/auth/signup", { username, email, password });
}
