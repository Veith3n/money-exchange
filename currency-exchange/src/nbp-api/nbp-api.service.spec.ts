import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { ExchangeRateResponseDto } from './dto/exchange-rate-response.dto';
import { NbpApiService } from './nbp-api.sevice';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NbpApiService', () => {
  let service: NbpApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NbpApiService],
    }).compile();

    service = module.get<NbpApiService>(NbpApiService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return exchange rate for currency from table A', async () => {
    const currencyCode = CurrencyCode.USD;
    const response: ExchangeRateResponseDto = {
      table: 'A',
      currency: 'dolar amerykański',
      code: CurrencyCode.USD,
      rates: [
        {
          no: '015/A/NBP/2025',
          effectiveDate: '2025-01-23',
          mid: 4.0515,
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: response });

    const result = await service.getExchangeRateForCurrency(currencyCode);

    expect(result).toEqual(response);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/a/USD/',
    );
  });

  it('should return exchange rate for currency from table B if table A fails', async () => {
    const currencyCode = CurrencyCode.USD;
    const response: ExchangeRateResponseDto = {
      table: 'B',
      currency: 'dolar amerykański',
      code: CurrencyCode.USD,
      rates: [
        {
          no: '015/B/NBP/2025',
          effectiveDate: '2025-01-23',
          mid: 4.0515,
        },
      ],
    };

    mockedAxios.get.mockRejectedValueOnce(new Error('Table A not found'));
    mockedAxios.get.mockResolvedValueOnce({ data: response });

    const result = await service.getExchangeRateForCurrency(currencyCode);

    expect(result).toEqual(response);

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/a/USD/',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/b/USD/',
    );
  });

  it('should throw an exception if all tables fail', async () => {
    const currencyCode = CurrencyCode.USD;

    mockedAxios.get.mockRejectedValueOnce(new Error('Table A not found'));
    mockedAxios.get.mockRejectedValueOnce(new Error('Table B not found'));
    mockedAxios.get.mockRejectedValueOnce(new Error('Table C not found'));

    await expect(
      service.getExchangeRateForCurrency(currencyCode),
    ).rejects.toThrow(
      new HttpException(
        `Failed to fetch exchange rate for currency ${currencyCode} from all tables`,
        HttpStatus.BAD_REQUEST,
      ),
    );

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/a/USD/',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/b/USD/',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.nbp.pl/api/exchangerates/rates/c/USD/',
    );
  });
});
