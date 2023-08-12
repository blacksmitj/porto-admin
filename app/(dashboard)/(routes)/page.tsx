import getCurrentUser from "@/actions/getCurrentUser";
import DashboardClient from "./client";

const Home = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <DashboardClient currentUser={currentUser} />
    </>
  );
};

export default Home;
