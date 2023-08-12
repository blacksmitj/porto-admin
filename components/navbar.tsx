import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import MainNav from "./main-nav";
import UserButton from "./user-button";
import ThemeToggle from "./theme-toggle";

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
