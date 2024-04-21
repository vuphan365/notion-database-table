import React from 'react';
import {
  CheckboxProperty,
  DateProperty,
  NumberProperty,
  Property,
  RichTextProperty,
  SelectProperty,
  TitleProperty,
} from './types';
import { convertRichText } from './utils/notion-utils';
import NotionText from './NotionText';
import NotionSelect from './NotionSelect';
import NotionDate from './NotionDate';
import NotionNumber from './NotionNumber';
import { Checkbox } from './NotionCheckbox';

interface NotionPropertyProps {
  property: Property;
}

const NotionProperty: React.FC<NotionPropertyProps> = ({ property }) => {
  switch (property?.type) {
    case 'rich_text': {
      const values = convertRichText((property as RichTextProperty).rich_text);
      return <NotionText value={values} />;
    }
    case 'title': {
      const values = convertRichText((property as TitleProperty).title);
      return <NotionText value={values} />;
    }
    case 'multi_select':
    case 'status':
    case 'select': {
      return <NotionSelect data={property as SelectProperty} />;
    }
    case 'date': {
      return <NotionDate data={property as DateProperty} />;
    }
    case 'number': {
      return <NotionNumber data={property as NumberProperty} />;
    }
    case 'checkbox': {
      return <Checkbox data={property as CheckboxProperty} />;
    }
    default:
      return null;
  }
};

export default NotionProperty;

export * from './types';
