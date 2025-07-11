// src/features/auth/register.ts
import axios from "axios";

/** Lanza 400 si el username o el email ya están en uso. */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  await axios.post("/api/auth/signup", { username, email, password });
}
