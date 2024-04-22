import { PropertyType } from 'notion-types';

export type NotionRecordProperty = {
  properties: Record<string, Property>;
};

export interface Property {
  id: string;
  type: PropertyType | 'status' | 'rich_text';
}

export interface TitleProperty extends Property {
  type: 'title';
  title: Array<any>;
}

export interface RichTextProperty extends Property {
  type: 'rich_text';
  rich_text: Array<any>;
}

export type TextProperty = {
  id: string;
} & (TitleProperty | RichTextProperty);

type SelectPropertyItem = {
  id: string;
  name: string;
  color: string;
};

export interface SingleSelectProperty extends Property {
  type: 'select';
  select: SelectPropertyItem;
}

export interface MultiSelectProperty extends Property {
  type: 'multi_select';
  multi_select: Array<SelectPropertyItem>;
}

export interface StatusProperty extends Property {
  type: 'status';
  status: SelectPropertyItem;
}

export type SelectProperty = {
  id: string;
} & (SingleSelectProperty | MultiSelectProperty | StatusProperty);

export interface DateProperty extends Property {
  id: string;
  type: 'date';
  date: {
    start?: Date;
    end?: Date;
    timezone: string;
  };
}

export interface NumberProperty extends Property {
  id: string;
  type: 'number';
  number: number;
  currency: boolean;
}

export interface CheckboxProperty extends Property {
  id: string;
  type: 'checkbox';
  checkbox: boolean;
}

export type NotionDictionary = Record<
  string,
  { type: Property['type']; dataSource: Array<string | boolean> }
>;

type NotionOperation = 'equal' | 'does_not_equal' | 'contains';

export type NotionFilterOperation = {
  preOperation: 'and' | 'or';
  name?: string;
  operation?: NotionOperation;
  value?: any;
  subOperations?: Array<NotionFilterOperation>;
  type?: Property['type'];
};
