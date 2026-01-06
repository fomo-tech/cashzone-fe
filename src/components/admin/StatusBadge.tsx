const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => (
  <span
    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      status
        ? "bg-gradient-to-r from-orange-400/10 to-orange-1000/10 text-orange-500 border border-orange-500/30"
        : "bg-red-100 text-red-800"
    }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

export default StatusBadge;
