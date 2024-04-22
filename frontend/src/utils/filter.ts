import {
  Property,
  NotionRecordProperty,
  CheckboxProperty,
  MultiSelectProperty,
  StatusProperty,
  NotionFilterOperation,
  SingleSelectProperty,
} from '@/types/notion';

// type PossibleValues = [string] | [string, Array<string | boolean | number>]

export const OperationByType: Partial<Record<Property['type'], Array<string>>> =
  {
    checkbox: ['equals', 'does_not_contain'],
    multi_select: ['contains', 'does_not_contain'],
    number: ['equals', 'does_not_equal'],
    select: ['equals', 'does_not_equal'],
    status: ['equals', 'does_not_equal'],
  };

export const getDeepDataSource = (
  data: Array<NotionRecordProperty>
): Record<
  string,
  { type: Property['type']; dataSource: Array<string | boolean> }
> => {
  const coppiedData = [...data];
  const item = { ...coppiedData?.[0]?.properties };

  const keys = Object.keys(item || {}) || [];
  const dictionary: Record<
    (typeof keys)[number],
    { type: Property['type']; dataSet: Set<string | boolean> }
  > = keys.reduce(
    (dict, current) =>
      OperationByType.hasOwnProperty(item?.[current]?.type)
        ? {
            ...dict,
            [current]: { type: item?.[current]?.type, dataSet: new Set() },
          }
        : dict,
    {}
  );
  coppiedData?.forEach((item) => {
    keys.forEach((key) => {
      const property = item?.properties?.[key];
      switch (property.type) {
        case 'checkbox': {
          dictionary[key].dataSet.add(
            (property as CheckboxProperty)?.checkbox?.toString()
          );
          return;
        }
        case 'multi_select': {
          (property as MultiSelectProperty)?.multi_select.forEach((item) => {
            dictionary[key].dataSet.add(item?.name);
          });
          return;
        }
        case 'select': {
          dictionary[key].dataSet.add(
            (property as SingleSelectProperty)?.select?.name
          );
          return;
        }
        case 'status': {
          dictionary[key].dataSet.add(
            (property as StatusProperty)?.status?.name
          );
          return;
        }
      }
    });
  });
  return keys.reduce(
    (prev, key) => ({
      ...prev,
      [key]: {
        type: dictionary[key]?.type,
        dataSource: Array.from(dictionary[key]?.dataSet?.keys() || []),
      },
    }),
    {}
  );
};

const getFormatCompountItem = (item: NotionFilterOperation) => {
  let formatedValue = item?.value;
  if (formatedValue === 'false') {
    formatedValue = false;
  } else if (formatedValue === 'true') {
    formatedValue = true;
  }
  if (item?.type === 'number') {
    formatedValue = Number(formatedValue);
  }

  return {
    property: item?.name,
    [item?.type as string]: {
      [item?.operation as string]: formatedValue,
    },
  };
};
export const convertFormValuesToCompound = (
  values: Array<NotionFilterOperation>
): { and?: Array<any>; or?: Array<any> } => {
  let and = [] as Array<any>;
  let or = [] as Array<any>;
  if (values.length === 0) return {};
  if (values.length === 1) {
    const formatedItem = getFormatCompountItem(values[0]);
    return { [values[0]?.preOperation]: [formatedItem] };
  }

  values.forEach((item) => {
    const results = [] as Array<any>;

    const formattedItem = getFormatCompountItem(item);

    if (Array.isArray(item?.subOperations) && item?.subOperations?.length > 0) {
      const isChildOr = !!item.subOperations?.find(
        (x) => x?.preOperation === 'or'
      );
      const data = convertFormValuesToCompound(item?.subOperations);
      if (isChildOr) {
        results.push({
          or: [formattedItem, ...(data?.or || ([] as Array<any>))],
        });
      } else {
        results.push({
          and: [formattedItem, ...(data?.and || ([] as Array<any>))],
        });
      }
    } else {
      results.push(formattedItem);
    }
    if (item?.preOperation == 'or') {
      or.push(...results);
    } else {
      and.push(...results);
    }
  });

  return {
    ...(and.length > 0 ? { and } : {}),
    ...(or.length > 0 ? { or } : {}),
  };
};
