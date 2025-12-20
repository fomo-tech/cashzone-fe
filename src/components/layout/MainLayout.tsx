import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content với responsive margin */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto pt-16 md:pt-4">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
