import ClientOnly from "@/components/ui/client-only";
import RegisterForm from "./components/register-form";

const RegisterPage = () => {
  return (
    <ClientOnly>
      <div className="flex justify-center h-screen items-center">
        <RegisterForm />
      </div>
    </ClientOnly>
  );
};

export default RegisterPage;
