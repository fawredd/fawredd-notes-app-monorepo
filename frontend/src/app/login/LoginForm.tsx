"use client";

import { useActionState, useCallback } from "react"
import { useFormStatus } from "react-dom"
import { login } from "./actions"
import {redirect} from 'next/navigation'

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);
  
  const handleCreateNewUser = ()=>{
    redirect('/register')
  }

  return (
    <form action={loginAction} className="flex max-w-[300px] flex-col gap-2 mx-auto">
      <div className="flex flex-col gap-2 border-b border-gray-300 pb-2">
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2 border-b border-gray-300 pb-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
      <SubmitButton />
      <button className='ml-2' onClick={handleCreateNewUser}>Create new user</button>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Login
    </button>
  );
}
