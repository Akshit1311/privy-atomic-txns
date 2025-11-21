import { useLogin, usePrivy } from "@privy-io/react-auth";
import Button from "./Button";

function LoginWithPrivy() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="border border-zinc-800 p-2 rounded-sm">
      <div className="mb-2">Privy Modal</div>
      <Button disabled={disableLogin} onClick={login}>
        Log in with Privy
      </Button>
    </div>
  );
}

export default LoginWithPrivy;
