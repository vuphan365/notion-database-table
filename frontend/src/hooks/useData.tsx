import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { queryNotionDatabase } from '@/services/database';
import cl from 'classnames';
import NotionProperty from '@/components/NotionProperty';
import { NotionRecordProperty, Property } from '@/types/notion';
import { useMemo } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface UseDataValue {
  columns: ColumnDef<NotionRecordProperty>[];
  data: NotionRecordProperty[];
  isLoading: boolean;
}

interface UseDataParams {
  sorts: SortingState;
}

// const getColumnsAdditionalConfig = (
//   property: Property
// ): Partial<ColumnDef<NotionRecordProperty>> => {
//   if (property?.type === 'number') {
//     return {
//       enableSorting: true,
//     };
//   }
//   return { enableSorting: false };
// };

const defaultColumns = Array(5)
  .fill(null)
  .map(
    (_, index) =>
      ({
        id: `cell_${index}`,
        header: <LoadingSkeleton />,
        cell: () => <LoadingSkeleton />,
      } as unknown as ColumnDef<NotionRecordProperty>)
  );

const useData = ({ sorts }: UseDataParams): UseDataValue => {
  const [columns, setColumns] =
    useState<ColumnDef<NotionRecordProperty>[]>(defaultColumns);
  const sortedKey = sorts?.map((item) => `${item.id}_${item?.desc}`).join(';');
  const { data, isFetching } = useQuery({
    queryKey: ['database', sortedKey],
    queryFn: () => queryNotionDatabase({ sorts }),
  });

  useEffect(() => {
    setColumns((prev) => {
      // prevent reset columns when data is changed
      if (!Array.isArray(data)) {
        return prev;
      }
      if (prev !== defaultColumns) return prev;
      // cache the old data
      const coppiedData = [...data];
      const item = { ...coppiedData?.[0]?.properties };

      const keys = Object.keys(item || {}) || [];

      return keys.map((key) => ({
        id: key,
        header: key,
        accessorKey: key,
        enableSorting: true,
        cell: (info) => (
          <NotionProperty property={info.row.original.properties?.[key]} />
        ),
        // ...getColumnsAdditionalConfig(item?.[key]),
      }));
    });
  }, [data]);

  const dataList = useMemo(
    () => (Array.isArray(data) || !isFetching ? data : Array(5).fill({})),
    [data, isFetching]
  );

  return {
    columns,
    data: dataList,
    isLoading: isFetching,
  };
};

export default useData;
