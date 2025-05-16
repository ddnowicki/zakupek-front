import { Button } from "../ui/button";
import type { PaginationMetadata } from "../../types";

interface PaginationProps {
  pagination: PaginationMetadata;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button variant="outline" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
        Poprzednia
      </Button>
      <div className="flex items-center px-4">
        Strona {pagination.page} z {pagination.totalPages}
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages}
      >
        Następna
      </Button>
    </div>
  );
};
