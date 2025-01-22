export interface ICurrencyExchangeApiService {
    login(username: string, password: string): Promise<LoginResponse>;

    register(username: string, password: string): Promise<RegisterResponse>;
}

export interface LoginResponse {
    accessToken: string;
}

export interface RegisterResponse {
    email: string;
}
