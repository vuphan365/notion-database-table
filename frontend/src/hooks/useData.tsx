import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { queryNotionDatabase } from '@/services/database';
import cl from 'classnames';
import NotionProperty, { Property } from '@/components/NotionProperty';
import { useMemo } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export type NotionRecordProperty = {
  properties: Record<string, Property>;
};

interface UseDataValue {
  columns: ColumnDef<NotionRecordProperty>[];
  data: NotionRecordProperty[];
  isLoading: boolean;
}

const useData = (): UseDataValue => {
  const { data, isFetching } = useQuery({
    queryKey: ['post'],
    queryFn: queryNotionDatabase,
  });

  const columns = useMemo(() => {
    if (!data || data?.length === 0) {
      return Array(5)
        .fill(null)
        .map((_, index) => ({
          id: `cell_${index}`,
          header: <LoadingSkeleton />,
          cell: () => <LoadingSkeleton />,
        }));
    }
    const item = data?.[0]?.properties;

    const keys = Object.keys(data?.[0]?.properties || {}) || [];

    return keys.map((key) => ({
      id: key,
      header: () => (
        <div
          className={cl({
            'min-w-[200px]': item?.[key]?.type === 'date',
            'max-w-[50px]': item?.[key]?.type === 'checkbox',
            'min-w-[100px]': item?.[key]?.type === 'title',
          })}
        >
          {key}
        </div>
      ),
      cell: (info) => (
        <NotionProperty property={info.row.original.properties?.[key]} />
      ),
    }));
  }, [data]) as ColumnDef<NotionRecordProperty>[];

  return {
    columns,
    data: data || [],
    isLoading: isFetching,
  };
};

export default useData;
