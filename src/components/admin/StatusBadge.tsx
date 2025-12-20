const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => (
  <span
    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      status
        ? "bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30"
        : "bg-red-100 text-red-800"
    }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

export default StatusBadge;
