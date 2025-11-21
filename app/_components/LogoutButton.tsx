import { usePrivy } from "@privy-io/react-auth";
import Button from "./Button";

function LogoutButton() {
  const { ready, authenticated, logout } = usePrivy();

  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated);

  return (
    <Button
      className="mt-2 bg-red-500/80"
      disabled={disableLogout}
      onClick={logout}
    >
      Log out
    </Button>
  );
}

export default LogoutButton;
