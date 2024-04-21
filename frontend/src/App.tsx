import { useState } from 'react';
import { SortingState, Updater } from '@tanstack/react-table';

import BaseTable from '@/components/Table';
import useData from '@/hooks/useData';
import { NotionRecordProperty } from '@/types/notion';

function App() {
  const [sorts, setSorting] = useState<SortingState>([]);

  const { columns, data, isLoading } = useData({ sorts });

  const onSort = (cb: Updater<SortingState>) => {
    if (typeof cb === 'function') {
      setSorting((prev) => {
        return cb(prev);
      });
    }
  };

  return (
    <div className="w-full p-16 flex">
      <BaseTable<NotionRecordProperty>
        data={data}
        columns={columns}
        manualSorting
        onSortingChange={onSort}
        state={{ sorting: sorts }}
        reorderable
        resizable
        loading={isLoading}
      />
    </div>
  );
}

export default App;
