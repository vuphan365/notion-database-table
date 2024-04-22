import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import {
  act,
  render,
  queries,
  waitFor,
  within,
  screen,
  queryByTestId,
  getByTestId,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NotionDictionary, NotionFilterOperation } from '@/types/notion';
import { defaultFilterOperation } from './CompoundInput';
import { FormValues } from '../types';
import dictionary from '@/mocks/dictionary';
import { OperationByType } from '@/utils/filter';
import NotionFilterModal from './index';

describe('NotionFilterModal', () => {
  it('should prevent submit when missing required data', async () => {
    const onSubmit = jest.fn();
    const defaultValue = {
      filter: [Object.assign({}, defaultFilterOperation)],
    };
    const { findByTestId } = render(
      <NotionFilterModal
        defaultValues={defaultValue}
        isOpen={true}
        onClose={jest.fn()}
        dictionary={dictionary}
        onSubmit={onSubmit}
      />
    );
    expect(await findByTestId('notion-filter-submit')).not.toBeEnabled();
  });
  it('should allow to submit when fullfill data', async () => {
    const onSubmit = jest.fn();
    const defaultValue = {
      filter: [
        {
          name: 'Status',
          value: 'Cancelled',
          preOperation: 'and',
          operation: 'equals',
          subOperations: [],
          type: 'select',
        },
        {
          name: 'Completion Time',
          value: '100',
          preOperation: 'and',
          operation: 'equals',
          subOperations: [],
          type: 'number',
        },
      ] as unknown as Array<NotionFilterOperation>,
    };

    const expectResult = {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'Cancelled',
          },
        },
        {
          property: 'Completion Time',
          number: {
            equals: 100,
          },
        },
      ],
    };

    const { findByTestId } = render(
      <NotionFilterModal
        defaultValues={defaultValue}
        isOpen={true}
        onClose={jest.fn()}
        dictionary={dictionary}
        onSubmit={onSubmit}
      />
    );
    // screen.debug();
    await waitFor(async () => {
      expect(await findByTestId('notion-filter-submit')).toBeEnabled();
    });
    await act(async () => {
      userEvent.click(await findByTestId('notion-filter-submit'));
    });
    await waitFor(async () => {
      expect(onSubmit).toBeCalledWith(JSON.stringify(expectResult));
    });
  });

  it('should submit with nested condition', async () => {
    const onSubmit = jest.fn();
    const defaultValue = {
      filter: [
        {
          name: 'Interview',
          value: 'false',
          preOperation: 'and',
          operation: 'equals',
          subOperations: [],
          type: 'checkbox',
        },
        {
          name: 'Completion Time',
          value: '1233',
          preOperation: 'and',
          operation: 'equals',
          subOperations: [
            {
              name: 'Status',
              value: 'Scheduled',
              preOperation: 'or',
              operation: 'equals',
              subOperations: [],
              type: 'select',
            },
            {
              name: 'Salary',
              value: '1233',
              preOperation: 'or',
              operation: 'equals',
              subOperations: [],
              type: 'number',
            },
          ],
          type: 'number',
        },
      ] as unknown as Array<NotionFilterOperation>,
    };

    const expectResult = {
      and: [
        {
          property: 'Interview',
          checkbox: {
            equals: false,
          },
        },
        {
          or: [
            {
              property: 'Completion Time',
              number: {
                equals: 1233,
              },
            },
            {
              property: 'Status',
              select: {
                equals: 'Scheduled',
              },
            },
            {
              property: 'Salary',
              number: {
                equals: 1233,
              },
            },
          ],
        },
      ],
    };

    const { findByTestId } = render(
      <NotionFilterModal
        defaultValues={defaultValue}
        isOpen={true}
        onClose={jest.fn()}
        dictionary={dictionary}
        onSubmit={onSubmit}
      />
    );
    // screen.debug();
    await waitFor(async () => {
      expect(await findByTestId('notion-filter-submit')).toBeEnabled();
    });
    await act(async () => {
      userEvent.click(await findByTestId('notion-filter-submit'));
    });
    await waitFor(async () => {
      expect(onSubmit).toBeCalledWith(JSON.stringify(expectResult));
    });
  });
});
