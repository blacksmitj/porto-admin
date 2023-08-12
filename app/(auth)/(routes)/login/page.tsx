import ClientOnly from "@/components/ui/client-only";
import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <ClientOnly>
      <div className="flex justify-center h-screen items-center">
        <LoginForm />
      </div>
    </ClientOnly>
  );
};

export default LoginPage;
