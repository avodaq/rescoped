import { GlobalRules, ItemRules } from '../src/cdk-datagrid-data.manager';

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
  'row-global': {
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
  'row-group': {
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
  'row-single': {
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
  'row-search-replace': {
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
  'row-filter': {
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
  'row-empty': {
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
