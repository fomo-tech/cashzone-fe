import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      {/* main content container */}
      <Header />
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </>
  );
};

export default MainLayout;
