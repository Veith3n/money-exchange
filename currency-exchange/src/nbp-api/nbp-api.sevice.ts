import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
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
    date?: string,
  ): Promise<ExchangeRateResponseDto> {
    const responses: FailedApiResponse[] = [];

    for (const table of this.TABLES) {
      try {
        const response = await this.fetchExchangeRateForCurrency(
          currencyCode,
          table,
          date,
        );

        if (response.success) {
          return response.data;
        }

        if (!isSuccessResponse(response)) {
          responses.push(response);
        }
      } catch (error: unknown) {
        console.error(
          `Failed to fetch exchange rate from table ${table}:`,
          error,
        );
      }
    }

    const noDataFound = responses.length === this.TABLES.length;

    if (noDataFound) {
      throw new HttpException(
        `Failed to fetch exchange rate for currency ${currencyCode} for given date`,
        HttpStatus.NOT_FOUND,
      );
    }

    throw new HttpException(
      `Failed to fetch exchange rate for currency ${currencyCode} from all tables`,
      HttpStatus.BAD_REQUEST,
    );
  }

  private async fetchExchangeRateForCurrency(
    currencyCode: CurrencyCode,
    table: string,
    date?: string,
  ): Promise<ApiResponse<ExchangeRateResponseDto>> {
    const baseUrl = `${this.BASE_URL}/${table}/${currencyCode}/`;

    // If the date is provided, append it to the URL so we fetch date for that specific day
    const endpointUrl = date ? `${baseUrl}/${date}/` : baseUrl;

    return axios
      .get<ExchangeRateResponseDto>(endpointUrl)
      .then((response) => this.handleSuccessResponse(response))
      .catch((error: AxiosError) =>
        this.handleErrorResponse(error, table, date),
      );
  }

  private handleSuccessResponse<T>(
    response: AxiosResponse<T, any>,
  ): SuccessApiResponse<T> {
    return {
      success: true,
      data: response.data,
    };
  }

  private handleErrorResponse(
    error: AxiosError,
    table: string,
    date?: string,
  ): FailedApiResponse {
    let responseData: string | undefined;

    if (typeof error.response?.data === 'string') {
      responseData = error.response.data;
    }
    const noDataMsg = 'Brak danych';
    const isNoDataResponse =
      date && responseData && responseData.includes(noDataMsg);

    if (isNoDataResponse) {
      console.error(`No data for the given date: ${date} in table: ${table}`);

      return { success: false, message: 'No data for the given date' };
    }

    console.error(`Failed to fetch exchange rate from table: ${table}:`);

    return { success: false };
  }
}

const isSuccessResponse = (
  response: ApiResponse<ExchangeRateResponseDto>,
): response is SuccessApiResponse<ExchangeRateResponseDto> => {
  return response.success === true;
};

type ApiResponse<T> = SuccessApiResponse<T> | FailedApiResponse;

type SuccessApiResponse<T> = { success: true; data: T };
type FailedApiResponse = { success: false; message?: string };
