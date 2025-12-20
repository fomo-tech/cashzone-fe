import React, { useMemo } from "react";

interface PaginationProps {
  page: number;
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const PAGE_RANGE = 2;

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 1) return [1];

    const start = Math.max(1, page - PAGE_RANGE);
    const end = Math.min(totalPages, page + PAGE_RANGE);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  const startItem = Math.min(totalItems, (page - 1) * limit + 1);
  const endItem = Math.min(totalItems, page * limit);

  const baseBtn =
    "px-4 py-2 mx-1 rounded-lg text-sm font-medium transition duration-150 shadow-md";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4   mx-auto space-y-3 sm:space-y-0">
      <div className="text-sm text-gray-600">
        Đang hiển thị <span className="font-semibold">{startItem}</span> đến{" "}
        <span className="font-semibold">{endItem}</span> trên{" "}
        <span className="font-bold text-[#E91E63]">{totalItems}</span> kết quả
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className={`${baseBtn} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-3 py-2 text-gray-500 font-semibold select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => goToPage(p as number)}
              className={
                p === page
                  ? `${baseBtn} bg-[#E91E63] text-white ring-2 ring-pink-300`
                  : `${baseBtn} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className={`${baseBtn} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
