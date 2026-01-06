import type { RoleEnum } from "@/utils/types";

const RoleBadge: React.FC<{ roles: RoleEnum[] }> = ({ roles }) => {
  let colorClass = "bg-gradient-to-r from-orange-400/10 to-orange-1000/10 text-orange-500 border border-orange-500/30";
  // lây hết role của user
  const role = roles?.join(", ");
  if (roles?.includes("admin")) {
    colorClass = "bg-red-100 text-red-800";
  } else if (roles?.includes("user")) {
    colorClass = "bg-gradient-to-r from-orange-400/10 to-orange-1000/10 text-orange-500 border border-orange-500/30";
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
