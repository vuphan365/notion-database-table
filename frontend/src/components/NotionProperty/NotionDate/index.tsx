import * as React from 'react';
import dayjs from 'dayjs';
import { DateProperty } from '../types';
import NotionText from '../NotionText';

const NotionDate: React.FC<{
  data: DateProperty;
}> = ({ data }) => {
  const { start, end, timezone } = data?.date || {};
  const strs = [];
  if (start) {
    strs.push(dayjs(start, timezone).format('MMMM DD, YYYY hh:mm A'));
  }
  if (end) {
    strs.push(dayjs(end, timezone).format('MMMM DD, YYYY hh:mm A'));
  }
  const content = strs.join(' - ');

  return <NotionText value={[[content]]} />;
};

export default NotionDate;
