import Modal from '@/components/Modal';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { NotionDictionary } from '@/types/notion';
import CompoundInput, { defaultFilterOperation } from './CompoundInput';
import { convertFormValuesToCompound } from '@/utils/filter';
import Button from '@/components/Button';
import { FormValues } from './types';

interface NotionFilterModalProps {
  onClose: () => void;
  dictionary: NotionDictionary;
  onSubmit: (value: string) => void;
  isOpen: boolean;
  defaultValues: FormValues;
}

const NotionFilterModal = ({
  onClose,
  dictionary,
  onSubmit,
  isOpen,
  defaultValues,
}: NotionFilterModalProps) => {
  const methods = useForm<FormValues>({
    defaultValues,
  });

  const fieldArray = useFieldArray({
    control: methods.control,
    name: 'filter',
  });

  const onAddFilter: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    fieldArray.append({
      ...Object.assign({}, defaultFilterOperation),
      preOperation:
        (methods.watch(
          // @ts-ignore
          `filter.${1}.preOperation`
        ) as any) || defaultFilterOperation.preOperation,
    });
  };

  const _onSubmit = (values: FormValues) => {
    const result = convertFormValuesToCompound(values.filter);
    if (typeof onSubmit === 'function') {
      onSubmit(JSON.stringify(result));
    }
  };

  const {
    formState: { isValid, isDirty },
  } = methods;

  if (isOpen) {
    return (
      <>
        {createPortal(
          <Modal title="Advanced Filter" onClose={onClose}>
            <form className="w-fit" onSubmit={methods.handleSubmit(_onSubmit)}>
              <FormProvider {...methods}>
                <div className="flex flex-col gap-y-4">
                  {fieldArray?.fields?.map((field, index) => (
                    <CompoundInput
                      keyName="filter"
                      key={field.id}
                      dictionary={dictionary}
                      index={index}
                      onRemove={() => {
                        fieldArray.remove(index);
                      }}
                      currentLevel={1}
                      isPrimary={index === 0}
                    />
                  ))}
                </div>
                <Button
                  variant="primary"
                  onClick={onAddFilter}
                  className="mt-4"
                >
                  Add a filter
                </Button>
                <div className="w-full flex justify-center gap-6">
                  <Button
                    variant="danger"
                    disabled={!isDirty}
                    testid="notion-filter-reset"
                    onClick={() => {
                      methods.reset(defaultValues);
                      onSubmit('');
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!isValid}
                    type="submit"
                    testid="notion-filter-submit"
                  >
                    Filter
                  </Button>
                </div>
              </FormProvider>
            </form>
          </Modal>,
          document.body
        )}
      </>
    );
  }
  return null;
};

export default NotionFilterModal;
