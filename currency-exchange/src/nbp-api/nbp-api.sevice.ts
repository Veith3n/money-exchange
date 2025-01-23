import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { ExchangeRateResponseDto } from './dto/exchange-rate-response.dto';

@Injectable()
export class NbpApiService {
  private readonly BASE_URL = 'https://api.nbp.pl/api/exchangerates/rates';

  private readonly TABLE_A = 'a';
  private readonly TABLE_B = 'b';
  private readonly TABLE_C = 'c';
  private readonly TABLES = [this.TABLE_A, this.TABLE_B, this.TABLE_C];

  constructor() {}

  /**
   * Fetches the exchange rate for a given currency code.
   * Tries to fetch the exchange rate from multiple tables (A, B, C) until a successful response is received.
   * If all requests fail, throws an HttpException.
   *
   * @param {CurrencyCode} currencyCode - The ISO 4217 currency code.
   * @returns {Promise<ExchangeRateResponseDto>} The exchange rate response DTO.
   * @throws {HttpException} If all requests fail to fetch the exchange rate.
   */
  public async getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ExchangeRateResponseDto> {
    const getExchangeRateForCurrency = async (
      currencyCode: CurrencyCode,
      table: string,
    ) => {
      const endpointUrl = `${this.BASE_URL}/${table}/${currencyCode}/`;

      return axios
        .get<ExchangeRateResponseDto>(endpointUrl)
        .then((response) => response.data)
        .catch((error) =>
          console.error(
            `Failed to fetch exchange rate from table ${table}:`,
            error.message,
          ),
        );
    };

    for (const table of this.TABLES) {
      try {
        const response = await getExchangeRateForCurrency(currencyCode, table);

        if (response) {
          return response;
        }
      } catch (error: unknown) {
        console.error(
          `Failed to fetch exchange rate from table ${table}:`,
          error,
        );
      }
    }

    // If all requests fail, throw an exception
    throw new HttpException(
      `Failed to fetch exchange rate for currency ${currencyCode} from all tables`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
