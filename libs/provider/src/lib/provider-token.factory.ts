import {
  HostDecorator,
  InjectionToken,
  OptionalDecorator,
  Provider,
  SelfDecorator,
  SkipSelfDecorator,
} from '@angular/core';

/**
 * @todo:
 * InjectionTokenName => toUpperCase() + TypeScript`a UpperCase Type
 * InjectionTokenName => camelCase to underscoreCase
 **/

type ProviderTokenMap<TokenName extends string, TokenValue, ExtName extends string> = {
  [_ in TokenName as `${string & TokenName}_${string & ExtName}`]: TokenValue;
};

// prettier-ignore
type ProviderTokenFactoryReturns<TokenName extends string, TokenValue> =
  ProviderTokenMap<TokenName, InjectionToken<TokenValue>,  'TOKEN'> &
  ProviderTokenMap<TokenName, Provider,'PROVIDER'>;

export type ConstructorDecorator =
  | SelfDecorator
  | SkipSelfDecorator
  | OptionalDecorator
  | HostDecorator;

export const providerTokenFactory = <TokenName extends string, TokenValue>(
  tokenName: TokenName,
  tokenValue: TokenValue,
  decorators: ConstructorDecorator[] = [],
): ProviderTokenFactoryReturns<TokenName, TokenValue> => {
  const decoratorInstances = decorators.map(decorator => new decorator());
  const injectionToken = new InjectionToken<TokenValue>(tokenName);

  const provider: Provider = {
    provide: injectionToken,
    deps: [[...decoratorInstances, tokenValue]],
    useFactory: function useFactory(instance: TokenValue) {
      return instance;
    },
  };

  return {
    [`${tokenName}_TOKEN`]: injectionToken,
    [`${tokenName}_PROVIDER`]: provider,
  } as ProviderTokenFactoryReturns<TokenName, TokenValue>;
};
