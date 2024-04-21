import * as React from 'react';
import { NumberProperty } from '../types';
import NotionText from '../NotionText';

const NotionNumber: React.FC<{
  data: NumberProperty;
}> = ({ data }) => {
  let content = data?.number?.toString();
  if (data?.currency) {
    content = data?.number?.toLocaleString();
  }

  return (
    <div className="text-right">
      <NotionText value={[[content]]} />
    </div>
  );
};

export default NotionNumber;
