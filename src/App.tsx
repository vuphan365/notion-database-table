import { useCallback, useState } from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import BaseTable from '@/components/Table';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
] as ColumnDef<Person>[];

function App() {
  const [count, setCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'status',
      desc: true,
    },
  ]);

  const onSort = (cb: Updater<SortingState>) => {
    // console.log('value', value);
    if (typeof cb === 'function') {
      setSorting((prev) => {
        const value = cb(prev) as any;
        return value;
      });
    }
    // return value
  };
  return (
    <div className="w-full p-16 flex justify-center">
      <BaseTable<Person>
        data={defaultData}
        columns={columns}
        manualSorting
        onSortingChange={onSort}
        state={{ sorting }}
      />
    </div>
  );
}

export default App;
