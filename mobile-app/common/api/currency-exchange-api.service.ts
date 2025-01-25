import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  ApiResponse,
  ExchangeCurrencyToPlnDto,
  ExchangePlnToCurrencyDto,
  ExchangeRateResponse,
  ICurrencyExchangeApiService,
  LoginResponse,
  RegisterResponse,
  SuccessApiResponse,
  WalletDto,
} from '@/common/api/currency-exchange-api.types';
import { CurrencyCode } from '@/types/currency-codes.enum';

class CurrencyExchangeApiService implements ICurrencyExchangeApiService {
  static readonly BASE_URL = 'http://localhost:3000';

  private static instance: CurrencyExchangeApiService;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  public static getInstance(): CurrencyExchangeApiService {
    if (!CurrencyExchangeApiService.instance) {
      CurrencyExchangeApiService.instance = new CurrencyExchangeApiService();
    }

    return CurrencyExchangeApiService.instance;
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    const loginUrl = `${this.baseUrl()}/auth/login`;

    return axios
      .post<LoginResponse>(loginUrl, { email: username, password })
      .then((response) => response.data);
  }

  public async register(
    username: string,
    password: string,
  ): Promise<RegisterResponse> {
    const registerUrl = `${this.baseUrl()}/api/users`;

    return axios
      .post<RegisterResponse>(registerUrl, {
        email: username,
        password,
      })
      .then((response) => response.data);
  }

  getWallets(authToken: string): Promise<WalletDto[]> {
    const url = `${this.baseUrl()}/api/wallets`;

    return this.axiosGetWithAuth({ authToken, url });
  }

  topUpWallet(
    authToken: string,
    currencyCode: CurrencyCode,
    amount: number,
  ): Promise<WalletDto> {
    const url = `${this.baseUrl()}/api/wallets/top-up`;

    return this.axiosPostWithAuth({
      authToken,
      url,
      body: {
        currencyCode,
        amount: amount.toString(),
      },
    });
  }

  public async getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
    date?: Date,
  ): Promise<ApiResponse<ExchangeRateResponse>> {
    const exchangeRateUrl = `${this.baseUrl()}/api/exchange-rate`;
    const iso8601Date = date ? date.toISOString().split('T')[0] : undefined;

    return axios
      .get<ExchangeRateResponse>(exchangeRateUrl, {
        params: { currencyCode, iso8601Date },
      })
      .then((response) => this.handleSuccessResponse(response))
      .catch((error: AxiosError) => {
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'Exchange rate not found for given dates',
          };
        }

        throw error;
      });
  }

  sellPln(authToken: string, body: ExchangePlnToCurrencyDto): Promise<void> {
    const url = `${this.baseUrl()}/api/exchange-rate/sell-pln`;

    return this.axiosPostWithAuth({ authToken, url, body });
  }

  buyPln(authToken: string, body: ExchangeCurrencyToPlnDto): Promise<void> {
    const url = `${this.baseUrl()}/api/exchange-rate/buy-pln`;

    return this.axiosPostWithAuth({ authToken, url, body });
  }

  private baseUrl(): string {
    return (
      process.env.EXPO_PUBLIC_BE_URL || CurrencyExchangeApiService.BASE_URL
    );
  }

  private handleSuccessResponse<T>(
    response: AxiosResponse<T, unknown>,
  ): SuccessApiResponse<T> {
    return {
      success: true,
      data: response.data,
    };
  }

  private axiosGetWithAuth<T>({
    authToken,
    url,
  }: {
    authToken: string;
    url: string;
  }): Promise<T> {
    return axios
      .get<T>(url, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((response) => response.data);
  }

  private axiosPostWithAuth<T>({
    authToken,
    url,
    body,
  }: {
    authToken: string;
    url: string;
    body: object;
  }): Promise<T> {
    return axios
      .post<T>(url, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data);
  }
}

export default CurrencyExchangeApiService;
