import { useState } from 'react';
import { SortingState, Updater } from '@tanstack/react-table';

import BaseTable from '@/components/Table';
import useData from '@/hooks/useData';
import { NotionRecordProperty } from '@/types/notion';
import NotionFilterModal from '@/components/NotionFilterModal';
import { defaultFilterOperation } from '@/components/NotionFilterModal/CompoundInput';
import Button from './components/Button';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [sorts, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<string>('');

  const { columns, data, isLoading, dictionary } = useData({ sorts, filter });

  const onSort = (cb: Updater<SortingState>) => {
    if (typeof cb === 'function') {
      setSorting((prev) => {
        return cb(prev);
      });
    }
  };

  const onToggleOpenFilter = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full p-16 flex flex-col gap-4">
      <div className="w-full flex justify-end">
        <Button
          onClick={onToggleOpenFilter}
          disabled={isLoading}
          variant="primary"
          className="text-sm"
        >
          Advanced Filter
        </Button>
      </div>
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
      <NotionFilterModal
        defaultValues={{
          filter: [Object.assign({}, defaultFilterOperation)],
        }}
        isOpen={isOpen}
        onClose={onToggleOpenFilter}
        dictionary={dictionary}
        onSubmit={(value) => {
          setFilter(value);
          onToggleOpenFilter();
        }}
      />
    </div>
  );
}

export default App;
