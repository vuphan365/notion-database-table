import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { queryNotionDatabase } from '@/services/database';
import NotionProperty from '@/components/NotionProperty';
import { NotionRecordProperty, NotionDictionary } from '@/types/notion';
import { useMemo } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { OperationByType, getDeepDataSource } from '@/utils/filter';

interface UseDataValue {
  columns: ColumnDef<NotionRecordProperty>[];
  data: NotionRecordProperty[];
  isLoading: boolean;
  dictionary: NotionDictionary;
}

interface UseDataParams {
  sorts: SortingState;
  filter: string;
}

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

const defaultDictionary = {};

const useData = ({ sorts, filter }: UseDataParams): UseDataValue => {
  const [dictionary, setDictionary] =
    useState<NotionDictionary>(defaultDictionary);

  const [columns, setColumns] =
    useState<ColumnDef<NotionRecordProperty>[]>(defaultColumns);

  const sortedKey = sorts?.map((item) => `${item.id}_${item?.desc}`).join(';');
  const { data, isFetching } = useQuery({
    queryKey: ['database', sortedKey, filter],
    queryFn: () => queryNotionDatabase({ sorts, filter }),
  });

  const onDictionaryUpdate = (_data: Array<NotionRecordProperty>) => {
    setDictionary((prev) => {
      if (!Array.isArray(_data)) {
        return prev;
      }
      if (prev !== defaultDictionary) return prev;
      // prevent reset dictionary when data is changed
      const coppiedData = [..._data];
      return getDeepDataSource(coppiedData);
    });
  };

  const onColumnsUpdate = (_data: Array<NotionRecordProperty>) => {
    setColumns((prev) => {
      // prevent reset columns when data is changed
      if (!Array.isArray(_data)) {
        return prev;
      }
      if (prev !== defaultColumns) return prev;
      // cache the old data
      const coppiedData = [..._data];
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
  };

  useEffect(() => {
    onDictionaryUpdate(data);
    onColumnsUpdate(data);
  }, [data]);

  const dataList = useMemo(
    () => (Array.isArray(data) || !isFetching ? data : Array(5).fill({})),
    [data, isFetching]
  );

  return {
    columns,
    data: dataList,
    isLoading: isFetching,
    dictionary,
  };
};

export default useData;
