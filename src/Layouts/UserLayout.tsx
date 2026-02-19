import { Outlet } from "react-router-dom";
import ColorfulMesh from "Components/ui/ColorfulMesh";
import { FloatingParticles } from ".utils/FloatingParticles";

const UserLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <ColorfulMesh />
      <FloatingParticles />

      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
