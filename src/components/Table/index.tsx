import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableOptions,
} from '@tanstack/react-table';

import { Reorder } from 'framer-motion';

import ResizeBar from '@/components/ResizeBar';

interface BaseTableProps<T>
  extends Pick<
    TableOptions<T>,
    'data' | 'columns' | 'onSortingChange' | 'manualSorting' | 'state'
  > {
  resizable?: boolean;
  reorderable?: boolean;
}

const BaseTable = <T extends object>({
  data,
  columns,
  onSortingChange,
  manualSorting,
  state,
  resizable,
  reorderable,
}: BaseTableProps<T>) => {
  const [items, setItems] = useState<Array<string>>(
    columns?.map((col) => col?.id as string) || []
  );

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    manualSorting,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    state: {
      ...(state || {}),
      columnOrder: items,
    },
  });

  return (
    <table
      className={`w-full text-sm shadow-md sm:rounded-lg text-left rtl:text-right text-gray-500`}
    >
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <Reorder.Group
            as="tr"
            key={headerGroup.id}
            axis="x"
            values={items}
            onReorder={setItems}
            draggable={false}
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{
                  width: `${header.getSize()}px`,
                }}
                className={`px-6 py-3 relative`}
              >
                {header.isPlaceholder ? null : (
                  <Reorder.Item
                    as="div"
                    key={header.id}
                    value={header.id}
                    whileDrag={{ backgroundColor: '#e3e3e3' }}
                    transition={{
                      duration: 0.01,
                      velocity: 10,
                    }}
                    drag={reorderable}
                    className={reorderable ? 'cursor-grab' : ''}
                  >
                    <div
                      className="cursor-pointer select-none flex gap-4 w-fit"
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                            ? 'Sort descending'
                            : 'Clear sort'
                          : undefined
                      }
                    >
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}

                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </Reorder.Item>
                )}
                {resizable && <ResizeBar header={header} />}
              </th>
            ))}
          </Reorder.Group>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="bg-white border-b">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`px-6 py-4 w-[${cell.column.getSize()}px] `}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BaseTable;
