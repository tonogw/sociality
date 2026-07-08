"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { loginSchema, type LoginInputs } from "@/lib/validations/index";
import { authService } from "@/services/authService";
import { setToken } from "@/store";
import Logo from "@/components/shared/logo";
import { AuthResponse } from "@/types/auth";
import { AxiosResponse } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    // onSuccess: (axiosResponse: AxiosResponse<AuthResponse>) => {
    //   // Menangkap token dari response data API
    //   const token = axiosResponse?.data?.data.token; // || axiosResponse?.data?.token;
    onSuccess: (apiResponse: AuthResponse) => {
      const token = apiResponse.data.token;

      if (token) {
        localStorage.setItem("token", token);
        dispatch(setToken(token));

        // Bersihkan cache profile user lama agar ter-fetch yang baru
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        router.push("/");
      } else {
        setErrorMessage("Token not found in response payload.");
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error.response?.data?.message || "Invalid email or password.";
      setErrorMessage(msg);
    },
  });

  const onSubmit = (data: LoginInputs) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden px-4">
      {/* Mesh Gradients Background (Konsisten dengan Figma) */}
      <div className="absolute -bottom-[242px] -left-[86px] right-[-113px] h-[531px] bg-gradient-to-r from-[#5613A3] to-[#522BC8] blur-[32px] opacity-60 pointer-events-none" />
      <div className="absolute -bottom-[140px] -left-[96px] right-[72px] h-[493px] bg-gradient-to-r from-[#AC88FF] to-[#AD3AE7] blur-[32px] rotate-[45.32deg] opacity-40 pointer-events-none" />

      {/* Main Glassmorphic Container Card (Height: 450px sesuai Figma) */}
      <div className="z-10 w-full max-w-[345px] min-h-[450px] bg-black/20 border border-[#181D27] backdrop-blur-[20px] rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        {/* Reusable Shared Logo */}
        <Logo />

        <h1 className="text-xl font-bold text-[#FDFDFD] tracking-tight mt-2">
          Welcome Back!
        </h1>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="w-full p-2.5 bg-red-950/50 border border-red-900/50 text-red-400 rounded-xl text-xs font-medium text-center">
            ⚠ {errorMessage}
          </div>
        )}

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mt-2"
        >
          {/* Field: Email */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold text-white tracking-wide">
              Email
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                <input
                  id="current-email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  autoComplete="current-email"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-sm focus:outline-hidden"
                />
              </div>
            </label>
            {errors.email && (
              <p className="text-red-400 text-[11px] mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Field: Password */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold text-white tracking-wide">
              Password
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center justify-between">
                <input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  autoComplete="current-password"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-sm focus:outline-hidden pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#717680] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {errors.password && (
              <p className="text-red-400 text-[11px] mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Action Button & Navigation Link */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-11 bg-[#6936F2] hover:bg-[#522BC8] disabled:bg-zinc-800 disabled:text-zinc-500 text-[#FDFDFD] font-bold rounded-full text-sm tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {mutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {mutation.isPending ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center gap-1 text-xs tracking-tight text-[#FDFDFD]/90">
              <span>Don&apos;t have an account?</span>
              <Link
                href="/register"
                className="text-[#7F51F9] font-bold hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
