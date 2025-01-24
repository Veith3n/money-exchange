import { CurrencyCode } from '../../../types/currency-codes.enum';

export class CurrencyWalletDoesNotExistsError extends Error {
  constructor(currencyCode: CurrencyCode) {
    super(`${currencyCode} wallet does not exists`);
  }
}

export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds to do operation');
  }
}
