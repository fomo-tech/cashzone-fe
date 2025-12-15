const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => (
  <span
    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

export default StatusBadge;
