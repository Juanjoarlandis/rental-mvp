// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clsx from "clsx";

import { register as apiRegister } from "../features/auth/register";
import { login as apiLogin } from "../features/auth/login";
import { useAuth } from "../hooks/useAuth";

import Container from "../components/shared/Container";
import SocialButton from "../components/ui/SocialButton";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

/* -------- validation schema -------- */
const schema = z
  .object({
    username: z.string().min(3, "Mín. 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mín. 8 caracteres"),
    confirm: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Acepta los términos" }),
    }),
  })
  .refine(data => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { login: saveToken } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const pwd = watch("password", "");

  /* -------------------------------------------------------------------- */
  const onSubmit = async (data: FormData) => {
    try {
      // 1) signup
      await apiRegister(data.username, data.email, data.password);

      // 2) auto-login
      const token = await apiLogin(data.username, data.password);
      saveToken(token);

      toast.success("Cuenta creada, ¡bienvenido!");
      navigate("/dashboard");
    } catch (err: any) {
      // FastAPI devuelve detail en .response.data.detail
      const msg =
        err?.response?.data?.detail ??
        "No se pudo crear la cuenta. Inténtalo más tarde.";
      toast.error(msg);
    }
  };

  /* -------------------------------------------------------------------- */
  const strength = zxcvbn(pwd).score; // 0-4

  return (
    <Container>
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-card">
          <h1 className="text-center text-2xl font-bold">Crear cuenta</h1>

          {/* ───── login social ───── */}
          <div className="space-y-3">
            <SocialButton provider="google" icon={FcGoogle} label="Con Google" />
            <SocialButton provider="github" icon={FaGithub} label="Con GitHub" />
          </div>

          <div className="relative text-xs text-gray-400">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white px-2">
              o regístrate con email
            </span>
          </div>

          {/* ───── formulario ───── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("username")}
              placeholder="Nombre de usuario"
              className="form-input w-full"
            />
            {errors.username && (
              <p className="text-xs text-red-600">{errors.username.message}</p>
            )}

            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="form-input w-full"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}

            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className="form-input w-full"
            />

            {/* strength meter */}
            {pwd && (
              <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                <div
                  style={{ width: `${(strength + 1) * 20}%` }}
                  className={clsx(
                    "h-full transition-all",
                    [
                      "bg-red-500",
                      "bg-orange-400",
                      "bg-yellow-400",
                      "bg-lime-500",
                      "bg-green-600",
                    ][strength],
                  )}
                />
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-600">
                {errors.password.message}
              </p>
            )}

            <input
              {...register("confirm")}
              type="password"
              placeholder="Repite contraseña"
              className="form-input w-full"
            />
            {errors.confirm && (
              <p className="text-xs text-red-600">{errors.confirm.message}</p>
            )}

            {/* terms */}
            <label className="flex gap-2 text-xs text-gray-600">
              <input type="checkbox" {...register("terms")} />
              Acepto los&nbsp;
              <a href="/terms" className="text-brand hover:underline">
                Términos y la Política de privacidad
              </a>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-600">{errors.terms.message}</p>
            )}

            <button className="btn w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando…" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </main>
    </Container>
  );
}
