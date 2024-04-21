import * as React from 'react';
import cl from 'classnames';
import { SelectProperty } from '../types';

const NotionSelect: React.FC<{
  data: SelectProperty;
}> = ({ data }) => {
  const { type, id } = data;
  let values = [];
  if (data?.type === 'select') {
    values = [data?.select];
  } else if (data?.type === 'status') {
    values = [data?.status];
  } else {
    values = data?.multi_select;
  }

  return (
    <div className="flex gap-y-1 gap-x-2">
      {values.map(({ name, color, id }) => (
        <div
          key={id}
          className={cl(
            `notion-property-${type}-item`,
            color && `notion-item-${color}`,
            'w-fit rounded-lg whitespace-nowrap px-1'
          )}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

export default NotionSelect;
