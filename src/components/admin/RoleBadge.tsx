import type { RoleEnum } from "@/utils/types";

const RoleBadge: React.FC<{ roles: RoleEnum[] }> = ({ roles }) => {
  let colorClass = "bg-blue-100 text-blue-800";
  // lây hết role của user
  const role = roles?.join(", ");
  if (roles?.includes("admin")) {
    colorClass = "bg-red-100 text-red-800";
  } else if (roles?.includes("user")) {
    colorClass = "bg-green-100 text-green-800";
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
