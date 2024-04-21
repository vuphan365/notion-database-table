import * as React from 'react';
import { CheckboxProperty } from '../types';

import CheckIcon from './check';

export const Checkbox: React.FC<{
  data: CheckboxProperty;
}> = ({ data }) => {
  let content = null;

  if (data?.checkbox) {
    content = (
      <div className="notion-property-checkbox-checked">
        <CheckIcon />
      </div>
    );
  } else {
    content = <div className="notion-property-checkbox-unchecked" />;
  }

  return (
    <span className="notion-property notion-property-checkbox">{content}</span>
  );
};
