import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      {/* Main content với responsive margin */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-1 lg:p-4 overflow-y-auto  md:pt-4">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
