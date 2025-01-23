import axios from 'axios';

import {
  ICurrencyExchangeApiService,
  LoginResponse,
  RegisterResponse,
} from '@/common/api/currency-exchange-api.types';

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

  private baseUrl(): string {
    return (
      process.env.EXPO_PUBLIC_BE_URL || CurrencyExchangeApiService.BASE_URL
    );
  }
}

export default CurrencyExchangeApiService;
