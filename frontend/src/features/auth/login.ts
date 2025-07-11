import { api } from "../../api";

export async function login(username: string, password: string): Promise<string> {
  const { data } = await api.post(
    "/auth/token",
    new URLSearchParams({ username, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return data.access_token as string;
}
