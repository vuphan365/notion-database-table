import { PropertyType } from 'notion-types';
import type { Client } from '@notionhq/client';

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
/** RICH TEXT */

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PartialPage = Awaited<
  ReturnType<InstanceType<typeof Client>['pages']['retrieve']>
>;

export type Page = Extract<
  Awaited<ReturnType<InstanceType<typeof Client>['pages']['retrieve']>>,
  { url: string }
>;

export type PartialBlock = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['retrieve']>
>;

export type Block = Extract<PartialBlock, { type: string }>;

export type BlockChildren = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['children']['list']>
>['results'];

export type RichText = Extract<
  Block,
  { type: 'paragraph' }
>['paragraph']['rich_text'];
export type RichTextItem = ArrayElement<RichText>;
