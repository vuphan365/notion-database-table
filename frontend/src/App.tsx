import { useState } from 'react';
import { SortingState, Updater } from '@tanstack/react-table';

import BaseTable from '@/components/Table';
import useData, { NotionRecordProperty } from '@/hooks/useData';

function App() {
  const { columns, data, isLoading } = useData();

  const [sorting, setSorting] = useState<SortingState>([
    // {
    //   id: 'status',
    //   desc: true,
    // },
  ]);

  const onSort = (cb: Updater<SortingState>) => {
    if (typeof cb === 'function') {
      setSorting((prev) => {
        const value = cb(prev) as any;
        return value;
      });
    }
    // return value
  };

  return (
    <div className="w-full p-16 flex">
      <BaseTable<NotionRecordProperty>
        data={data}
        columns={columns}
        manualSorting
        onSortingChange={onSort}
        state={{ sorting }}
        reorderable
        resizable
        loading={isLoading}
        defaultRow={5}
      />
    </div>
  );
}

export default App;
