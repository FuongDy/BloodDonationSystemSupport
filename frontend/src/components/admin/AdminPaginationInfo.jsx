// src/components/admin/AdminPaginationInfo.jsx

const AdminPaginationInfo = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  isLoading = false,
}) => (
  <div className='flex items-center justify-between mt-4 text-sm text-gray-600'>
    <div>
      Trang {currentPage + 1} / {totalPages} ({totalElements} bản ghi)
    </div>
    <div className='space-x-2'>
      <button
        className='px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || isLoading}
      >
        Trước
      </button>
      <button
        className='px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || isLoading}
      >
        Sau
      </button>
    </div>
  </div>
);

export default AdminPaginationInfo;
