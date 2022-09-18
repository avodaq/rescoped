import { GlobalRules, ItemRules } from '../cdk-spreadsheet-data.manager';

export type Item = {
  id: number;
  name: string;
};

export const itemRules: ItemRules<Item> = {
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
};

export const globalRules: GlobalRules<Item> = {
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
