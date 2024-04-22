import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { act, render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NotionDictionary, NotionFilterOperation } from '@/types/notion';
import { FormValues } from '../types';
import CompoundInput, { defaultFilterOperation } from './index';
import dictionary from '@/mocks/dictionary';
import { OperationByType } from '@/utils/filter';

const WrapperCompoundInput = ({
  defaultFormValues,
  dictionary,
}: {
  defaultFormValues: FormValues;
  dictionary: NotionDictionary;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const fieldArray = useFieldArray({
    control: methods.control,
    name: 'filter',
  });

  return (
    <form>
      <FormProvider {...methods}>
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
      </FormProvider>
    </form>
  );
};

describe('CompountInput', () => {
  it('should render default UI', async () => {
    const { findByTestId } = render(
      <WrapperCompoundInput
        defaultFormValues={{
          filter: [Object.assign({}, defaultFilterOperation)],
        }}
        dictionary={dictionary}
      />
    );
    expect(
      await findByTestId('compound_input_select_filter.0.name')
    ).toBeEnabled();
    expect(
      await findByTestId('compound_input_select_filter.0.operation')
    ).not.toBeEnabled();
    expect(
      await findByTestId('compound_input_input_filter.0.value')
    ).not.toBeEnabled();
  });
  it('should render multiple row ui, only allow change first preOperation select', async () => {
    const defaultFormValues = [
      Object.assign({}, defaultFilterOperation),
      Object.assign({}, defaultFilterOperation),
      Object.assign({}, defaultFilterOperation),
    ] as Array<NotionFilterOperation>;
    const { findByTestId, queryByTestId } = render(
      <WrapperCompoundInput
        defaultFormValues={{
          filter: defaultFormValues,
        }}
        dictionary={dictionary}
      />
    );
    defaultFormValues.forEach(async (_, index) => {
      if (index === 0) {
        expect(
          queryByTestId(`compound_input_select_filter.${index}.preOperation`)
        ).not.toBeInTheDocument();
      } else if (index === 1) {
        expect(
          await findByTestId(
            `compound_input_select_filter.${index}.preOperation`
          )
        ).toBeEnabled();
      } else {
        expect(
          await findByTestId(
            `compound_input_select_filter.${index}.preOperation`
          )
        ).not.toBeEnabled();
      }
      expect(
        await findByTestId(`compound_input_select_filter.${index}.name`)
      ).toBeEnabled();
      expect(
        await findByTestId(`compound_input_select_filter.${index}.operation`)
      ).not.toBeEnabled();
      expect(
        await findByTestId(`compound_input_input_filter.${index}.value`)
      ).not.toBeEnabled();
    });
  });

  it('should handle filter with single operation (name, operation, value)', async () => {
    const { findByTestId, getByTestId } = render(
      <WrapperCompoundInput
        defaultFormValues={{
          filter: [Object.assign({}, defaultFilterOperation)],
        }}
        dictionary={dictionary}
      />
    );
    // Set value for name, expect the operation to be enable
    await act(async () => {
      await userEvent.selectOptions(
        getByTestId('compound_input_select_filter.0.name'),
        'Result'
      );
    });

    expect(
      await findByTestId('compound_input_select_filter.0.operation')
    ).toBeEnabled();

    const firstOperationByType = OperationByType[
      dictionary.Result.type
    ]?.[0] as string;

    expect(
      await within(
        await findByTestId('compound_input_select_filter.0.operation')
      ).findByText(firstOperationByType) // datasource inside operation
    ).toBeVisible();

    await act(async () => {
      await userEvent.selectOptions(
        getByTestId('compound_input_select_filter.0.operation'),
        firstOperationByType
      );
    });

    expect(
      await findByTestId('compound_input_select_filter.0.value')
    ).toBeEnabled();

    const firstValue = dictionary.Result.dataSource?.[0] as string;

    expect(
      await within(
        await findByTestId('compound_input_select_filter.0.value')
      ).findByText(firstValue) // datasource inside operation
    ).toBeVisible();
  });
  it('should button Add new filter and remove work, from at least second condition', async () => {
    const { findByTestId, queryByTestId } = render(
      <WrapperCompoundInput
        defaultFormValues={{
          filter: [
            Object.assign({}, defaultFilterOperation),
            Object.assign({}, defaultFilterOperation),
          ],
        }}
        dictionary={dictionary}
      />
    );

    expect(
      queryByTestId('compound-input_filter.1.subOperations')
    ).not.toBeInTheDocument();

    expect(
      await findByTestId('compound-input_filter.1.add-filter')
    ).toBeEnabled();

    // add filter
    await act(async () => {
      userEvent.click(await findByTestId('compound-input_filter.1.add-filter'));
    });

    expect(
      await findByTestId('compound-input_filter.1.subOperations')
    ).toBeInTheDocument();

    // remove filter

    expect(
      await findByTestId('compound_input_filter.1.subOperations.0.remove-btn')
    ).toBeEnabled();

    await act(async () => {
      userEvent.click(
        await findByTestId('compound_input_filter.1.subOperations.0.remove-btn')
      );
    });

    await waitFor(async () => {
      expect(
        queryByTestId('compound-input_filter.1.subOperations')
      ).not.toBeInTheDocument();
    });
  });
});
