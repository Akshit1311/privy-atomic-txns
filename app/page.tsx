import Login from "./_components/Login";
import Wallets from "./_components/Wallets";

export default function Home() {
  return (
    <div className="font-mono flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <Login />
      <Wallets />
    </div>
  );
}
