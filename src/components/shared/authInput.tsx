import { useState } from "react";
import Image from "next/image";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface AuthInputProps {
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
}

export default function AuthInput({
  id,
  type = "text",
  placeholder,
  register,
  error,
  autoComplete,
}: AuthInputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
          className={`w-full px-4 py-3.5 rounded-xl border ${error ? "border-red-500" : "border-gray-200"} text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400 ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <Image
              src={show ? "/icons/icon-eye.svg" : "/icons/icon-eye-off.svg"}
              alt="toggle"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-600 text-xs font-semibold pl-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
