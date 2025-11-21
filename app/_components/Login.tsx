"use client";

import { usePrivy } from "@privy-io/react-auth";

import LogoutButton from "./LogoutButton";
import Passkeys from "./Passkeys";
import LoginWithPrivy from "./LoginWithPrivy";

export default function Login() {
  const { ready, authenticated, user } = usePrivy();

  return (
    <div className="border border-zinc-800 p-4 rounded-lg grid grid-cols-5 gap-4 w-3/4">
      <div className="col-span-3 border-r border-zinc-800 pr-2 h-[400px] overflow-scroll">
        <pre>authenticated: {JSON.stringify(authenticated, null, 2)}</pre>
        <pre>ready: {JSON.stringify(ready, null, 2)}</pre>
        <pre className="text-wrap wrap-break-word">
          user: {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="grid place-items-center col-span-2">
        <div className="w-full flex-1 flex flex-col gap-2">
          <Passkeys />

          <LoginWithPrivy />

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
