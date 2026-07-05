import type { ReactNode } from "react";

interface TableColumn {
  key: string;
  title: string;
}

interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  renderRow: (item: T) => ReactNode;
}

export default function Table<T>({
  columns,
  data,
  renderRow,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b px-4 py-3 text-left text-sm font-semibold"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50"
              >
                {renderRow(item)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};