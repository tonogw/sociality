"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, type RegisterUser } from "@/lib/validations/index";
import { authService } from "@/services/authService";
import { setToken } from "@/store"; // Pastikan path ekspor store disesuaikan
// import { AxiosResponse } from "axios";
import { AuthResponse } from "@/types/auth";
// import Logo from "@/components/shared/Logo.svg";
import Image from "next/image";

interface ApiErrorResponse {
  message?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  // const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    // onSuccess: (axiosResponse: any) => {
    // onSuccess: (axiosResponse: AxiosResponse<AuthResponse>) => {
    //   const token = axiosResponse?.data.data.token; //|| axiosResponse?.data?.token;
    onSuccess: (apiResponse: AuthResponse) => {
      const token = apiResponse.data.token;

      if (token) {
        localStorage.setItem("token", token);
        dispatch(setToken(token));
        // queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        router.push("/");
      } else {
        setErrorMessage("Token not found in response payload.");
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrorMessage(msg);
    },
  });

  const onSubmit = (data: RegisterUser) => {
    setErrorMessage(null);
    const { ...payload } = data;
    mutation.mutate(payload);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden px-4">
      {/* Mesh Gradients Background (Sesuai Spesifikasi Figma) */}
      <div className="absolute -bottom-60.5 -left-21.5 right-28.25 h-132.75 bg-linear-to-r from-[#5613A3] to-[#522BC8] blur-[32px] opacity-60 pointer-events-none" />
      <div className="absolute -bottom-35 -left-24 right-18 h-123.25 bg-linear-to-r from-[#AC88FF] to-[#AD3AE7] blur-[32px] rotate-[45.32deg] opacity-40 pointer-events-none" />

      {/* Main Glassmorphic Container Card */}
      <div className="z-10 w-full max-w-86.25 bg-black/20 border border-[#181D27] backdrop-blur-[50px] rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl">
        {/* Header / Logo */}
        <div className="flex items-center gap-2.75">
          {/* Logo Sederhana Representasi SVG Figma */}
          <div className="w-7.5 h-7.5 flex items-center justify-center bg-white rounded-full">
            {/* <div className="w-4 h-4 bg-black rounded-xs" /> */}
            {/* <Logo /> */}
            <Image
              src="/icons/Logo.svg"
              alt="logo"
              sizes="54px"
              fill
              unoptimized
              className="w-14 h-14 object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-[#FDFDFD] tracking-tight">
            Sociality
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#FDFDFD] tracking-tight">
          Register
        </h1>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="w-full p-3 bg-red-950/50 border border-red-900/50 text-red-400 rounded-xl text-xs font-medium text-center">
            ⚠ {errorMessage}
          </div>
        )}

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5"
        >
          {/* Field: Name */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Name
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  autoComplete="name"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden"
                />
              </div>
            </label>
            {errors.name && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Field: Username */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Username
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                  autoComplete="username"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden"
                />
              </div>
            </label>
            {errors.username && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Field: Number Phone */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Phone Number
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter your number phone"
                  {...register("phone")}
                  autoComplete="phone"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden"
                />
              </div>
            </label>
            {errors.phone && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Field: Email */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Email
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  autoComplete="email"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden"
                />
              </div>
            </label>
            {errors.email && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Field: Password */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Password
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center justify-between">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  autoComplete="new-password"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#717680] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>
            {errors.password && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Field: Confirm Password */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-white tracking-wide">
              Confirm Password
              <div className="w-full h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center justify-between">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your confirm password"
                  {...register("confirmPassword")}
                  autoComplete="confirm-new-password"
                  className="w-full bg-transparent text-white placeholder-[#535862] text-base focus:outline-hidden pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#717680] hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </label>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button & Switch Link */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-11 bg-[#6936F2] hover:bg-[#522BC8] disabled:bg-zinc-800 disabled:text-zinc-500 text-[#FDFDFD] font-bold rounded-full text-base tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              {mutation.isPending && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>

            <div className="flex items-center gap-1 text-sm tracking-tight text-[#FDFDFD]/90">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="text-[#7F51F9] font-bold hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
