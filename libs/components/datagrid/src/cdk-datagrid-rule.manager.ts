import { Injectable } from '@angular/core';
import { GlobalRules, ItemActionType, ItemRules, RuleTypes } from './cdk-datagrid-data.manager';
import { getItemPayload } from './cdk-datagrid.utils';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class CdkDatagridRuleManager<Item> {
  #globalItemRules!: GlobalRules<Item>;

  setGlobalRules(itemRules: GlobalRules<Item>) {
    this.#globalItemRules = itemRules;
  }

  canRule<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    return this.getRule(item, key, actionType);
  }

  canValidate<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    return !!this.canRule(item, key, actionType)?.validate;
  }

  canRender<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    return !!this.canRule(item, key, actionType)?.render;
  }

  canDisable<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    return !!this.canRule(item, key, actionType)?.disable;
  }

  canAction<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    return !!this.canRule(item, key, actionType)?.action;
  }

  getActionRule<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    const action = this.getRule(item, key, actionType)?.action;
    if (!action) {
      return null;
    }

    if (typeof action?.cond === 'function' && action.cond() === true) {
      return action;
    } else if (typeof action?.cond === 'boolean' && action.cond === true) {
      return action;
    } else if (typeof action?.cond === 'undefined') {
      return action;
    } else {
      return null;
    }
  }

  applyRules<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
    formControl: AbstractControl | null,
    initialValue: string,
  ) {
    const rule = this.getRule(item, key, actionType);
    this.#applyRules(rule, formControl, initialValue);
  }

  #getItemRules(item: Item) {
    return getItemPayload(item)?.rules;
  }

  #getGlobalRules<ActionType extends ItemActionType>(actionType: ActionType) {
    return this.#globalItemRules?.[actionType];
  }

  getRule<ItemKey extends keyof Item, ActionType extends ItemActionType>(
    item: Item,
    key: ItemKey,
    actionType: ActionType,
  ) {
    let rules: RuleTypes = {};

    // has global one up (e.g. override/../disable) some rules?
    const parentGlobalRules = this.#getGlobalRules(actionType) || {};
    if (parentGlobalRules) rules = this.#mergeRules(parentGlobalRules, rules);

    // has global override rules?
    const globalOverrideRules = this.#getGlobalRules(actionType)?.overrides?.[key] || {};
    if (globalOverrideRules) rules = this.#mergeRules(globalOverrideRules, rules);

    // has item one up (e.g. override/../disable) some rules?
    const parentItemRules = this.#getItemRules(item) || {};
    if (parentItemRules) rules = this.#mergeRules(parentItemRules, rules);

    // has item override rules?
    const itemOverrideRules = this.#getItemRules(item)?.overrides?.[key] || {};
    if (itemOverrideRules) rules = this.#mergeRules(itemOverrideRules, rules);

    return rules;
  }

  #mergeRules(intoRule: RuleTypes, fromRule: RuleTypes) {
    return {
      validate: intoRule.validate ?? fromRule.validate,
      disable: intoRule.disable ?? fromRule.disable,
      render: intoRule.render ?? fromRule.render,
      placeholder: intoRule.placeholder ?? fromRule.placeholder,
      action: intoRule.action ?? fromRule.action,
    };
  }

  #applyRules(
    rules: ItemRules<Item> | null | undefined,
    formControl: AbstractControl | null,
    initialValue: string,
  ) {
    if (formControl?.value !== initialValue) {
      rules?.render === undefined && formControl?.setValue(initialValue);
      rules?.render === true && formControl?.setValue(initialValue);
    }

    if (rules?.render === false && formControl?.value !== '') {
      formControl?.setValue('');
    }

    if (rules?.disable === true && !formControl?.disabled) {
      formControl?.disable();
    }

    if (!rules?.disable && !formControl?.enabled) {
      formControl?.enable();
    }

    if (!formControl?.disabled && (rules?.validate === false || rules?.validate === undefined)) {
      formControl?.setValidators([]);
      formControl?.setAsyncValidators([]);
      formControl?.updateValueAndValidity();
    }
  }
}
