const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => (
  <span
    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      status
        ? "bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600] border border-[orange-600]/30"
        : "bg-red-100 text-red-800"
    }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

export default StatusBadge;
