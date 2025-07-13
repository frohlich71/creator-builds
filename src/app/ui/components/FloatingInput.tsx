'use client';

import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type FloatingInputProps = {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FloatingInput({ label, id, register, type, ...rest }: FloatingInputProps) {
  return (
    <div className="relative">
      <input
        {...register}
        id={id}
        type={type || 'text'}
        placeholder=" "
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-600 peer"
        {...rest}
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:text-rose-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
      >
        {label}
      </label>
    </div>
  );
}