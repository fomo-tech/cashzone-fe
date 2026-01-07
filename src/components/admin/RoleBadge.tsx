import type { RoleEnum } from "@/utils/types";

const RoleBadge: React.FC<{ roles: RoleEnum[] }> = ({ roles }) => {
  let colorClass = "bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30";
  // lây hết role của user
  const role = roles?.join(", ");
  if (roles?.includes("admin")) {
    colorClass = "bg-red-100 text-red-800";
  } else if (roles?.includes("user")) {
    colorClass = "bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30";
  }

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
    >
      {role}
    </span>
  );
};
export default RoleBadge;
