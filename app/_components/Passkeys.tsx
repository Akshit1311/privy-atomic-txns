import {
  useLoginWithPasskey,
  useSignupWithPasskey,
} from "@privy-io/react-auth";
import Button from "./Button";

const Passkeys = () => {
  const { signupWithPasskey, state } = useSignupWithPasskey();
  const { loginWithPasskey } = useLoginWithPasskey();

  return (
    <div className="flex flex-col gap-2 border border-zinc-800 p-2 rounded-sm">
      <div className="mb-2">Passkeys</div>
      <div className="p-2 bg-zinc-800 rounded-lg">{JSON.stringify(state)}</div>
      <Button className="flex" onClick={() => signupWithPasskey()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
          />
        </svg>
        SignUp with Passkeys
      </Button>
      <Button className="flex" onClick={() => loginWithPasskey()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
          />
        </svg>
        Login with Passkeys
      </Button>
    </div>
  );
};

export default Passkeys;
