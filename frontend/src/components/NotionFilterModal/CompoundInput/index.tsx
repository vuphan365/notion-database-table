import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import {
  NotionDictionary,
  Property,
  NotionFilterOperation,
} from '@/types/notion';
import { FormValues } from '../types';
import { OperationByType } from '@/utils/filter';
import Select from '@/components/Select';
import Button from '@/components/Button';
import Input from '@/components/Input';
import NotionText from '@/components/NotionProperty/NotionText';
import DeleteIcon from '../DeleteIcon';

interface CompoundInputParams {
  keyName: string;
  dictionary: NotionDictionary;
  index: number;
  onRemove: () => void;
  currentLevel: number;
  isPrimary?: boolean;
}

const MAX_LEVEL = 2;

export const defaultFilterOperation = {
  name: '',
  value: '',
  preOperation: 'and',
} as NotionFilterOperation;

const CompoundInput = ({
  dictionary,
  keyName,
  index,
  onRemove,
  currentLevel,
  isPrimary,
}: CompoundInputParams) => {
  const { control, watch, setValue } = useFormContext<FormValues>();
  const nameField = `${keyName}.${index}.name`;
  const nameType = dictionary[watch(nameField as any)]?.type;

  const nameDataSource = (Object.keys(dictionary) || []).filter((key) =>
    OperationByType.hasOwnProperty(dictionary[key]?.type)
  );

  const operationField = `${keyName}.${index}.operation`;
  const operationDataSource =
    OperationByType[nameType as Property['type']] || [];

  const isSupportedSelect =
    ['checkbox', 'status', 'multi_select', 'select'].indexOf(
      nameType as Property['type']
    ) > -1; // Sample input

  const subOperations = useFieldArray({
    control: control,
    // @ts-ignore
    name: `${keyName}.${index}.subOperations`,
  });

  return (
    <div className="flex gap-4 items-start">
      {isPrimary ? (
        <div className="w-[100px]">
          <NotionText value={[['Where']]} />
        </div>
      ) : (
        <Controller
          control={control}
          // @ts-ignore
          name={`${keyName}.${index}.preOperation`}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              onChange={(evt) => {
                const value = evt.target.value;
                onChange(value);
                const items = watch(`${keyName}` as any);
                for (let i = 0; i < items?.length; i += 1) {
                  // @ts-ignore
                  setValue(`${keyName}.${i}.preOperation`, value);
                }
              }}
              dataSource={['and', 'or']}
              className="w-[100px]"
              isDisabledEmpty
              disabled={currentLevel === 1 ? index !== 1 : index !== 0}
            />
          )}
        />
      )}
      <div className="flex flex-col gap-2 items-start bg-gray-100 rounded-lg p-4 border border-gray-150">
        <div className="flex gap-4 items-center">
          <Controller
            control={control}
            name={nameField as any}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Select
                value={value}
                onChange={(evt) => {
                  onChange(evt);
                  // @ts-ignore
                  setValue(operationField, '');
                  const selectValue = evt.target.value;
                  setValue(
                    // @ts-ignore
                    `${keyName}.${index}.type`,
                    dictionary[selectValue]?.type
                  );
                  // @ts-ignore
                  setValue(`${keyName}.${index}.value` as any, '');
                }}
                dataSource={nameDataSource}
                className="w-[200px]"
              />
            )}
          />
          <Controller
            control={control}
            name={operationField as any}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Select
                value={value}
                onChange={(evt) => {
                  onChange(evt);
                  // @ts-ignore
                  setValue(`${keyName}.${index}.value` as any, '');
                }}
                dataSource={operationDataSource}
                className="w-[200px]"
                disabled={!watch(nameField as any)}
              />
            )}
          />
          <Controller
            control={control}
            // @ts-ignore
            name={`${keyName}.${index}.value`}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              const disabled = !watch(operationField as any);
              if (isSupportedSelect) {
                const valueDataSource =
                  dictionary[watch(nameField as any)]?.dataSource || [];
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    dataSource={valueDataSource as string[]}
                    className="w-[200px]"
                    disabled={disabled}
                  />
                );
              }
              return (
                <Input
                  value={value}
                  onChange={onChange}
                  className="w-[200px]"
                  disabled={disabled}
                />
              );
            }}
          />
          {!isPrimary && (
            <Button variant="danger" onClick={onRemove}>
              <DeleteIcon />
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          {subOperations?.fields?.map((subField, subIndex) => (
            <CompoundInput
              // @ts-ignore
              keyName={`${keyName}.${index}.subOperations`}
              key={subField.id}
              dictionary={dictionary}
              index={subIndex}
              onRemove={() => {
                subOperations.remove(subIndex);
              }}
              currentLevel={currentLevel + 1}
            />
          ))}
        </div>
        {!isPrimary && currentLevel < MAX_LEVEL && (
          <Button
            variant="primary"
            onClick={() => {
              subOperations.append({
                ...defaultFilterOperation,
                preOperation: watch(
                  // @ts-ignore
                  `${keyName}.${index}.subOperations.${0}.preOperation`
                ) as any,
              });
            }}
          >
            Add a filter
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompoundInput;
