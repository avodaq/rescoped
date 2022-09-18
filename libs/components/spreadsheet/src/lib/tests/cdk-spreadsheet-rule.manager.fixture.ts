import { GlobalRules } from '../cdk-spreadsheet-data.manager';

export type Item = {
  id: number;
  name: string;
};

type CustomActionTypes =
  // item
  | 'item-has-override-rules'
  | 'item-has-not-override-rules'
  | 'item-has-one-up-override-rules'
  | 'item-has-not-one-up-override-rules'
  // global
  | 'global-has-override-rules'
  | 'global-has-not-override-rules'
  | 'global-has-one-up-override-rules'
  | 'global-has-not-one-up-override-rules';

export const customActionTypeGlobalRules: GlobalRules<Item> = {
  'global-edit': {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
  'group-edit': {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
  'single-edit': {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
  'search-replace': {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
  filter: {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
  empty: {
    validate: true,
    disable: false,
    render: true,
    overrides: {
      id: {
        validate: false,
        disable: true,
        render: false,
      },
      name: {
        validate: true,
        disable: false,
        render: true,
      },
    },
  },
};
