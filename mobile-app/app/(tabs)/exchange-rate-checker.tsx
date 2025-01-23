import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CurrencyCode } from '@/types/currency-codes.enum';

interface ExchangeRateResult {
  convertedCurrency: CurrencyCode;
  exchangeRate: number;
}

export default function ExchangeRateChecker() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    CurrencyCode.USD,
  );
  const [exchangeRateResult, setExchangeRateResult] = useState<
    ExchangeRateResult | undefined
  >(undefined);

  const [error, setError] = useState<string | null>(null);

  const currencyExchangeApiService = CurrencyExchangeApiService.getInstance();
  const currencies = Object.values(CurrencyCode).map((currency) => ({
    value: currency,
    label: currency,
  }));

  const handleCheckExchangeRate = async () => {
    try {
      const response =
        await currencyExchangeApiService.getExchangeRateForCurrency(
          selectedCurrency,
        );
      setExchangeRateResult({
        exchangeRate: response.exchangeRateToPln,
        convertedCurrency: response.currencyCode,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch exchange rate. Please try again.');
      setExchangeRateResult(undefined);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Select a currency:</ThemedText>
      <RNPickerSelect
        onValueChange={(itemValue: CurrencyCode) =>
          itemValue && setSelectedCurrency(itemValue)
        }
        items={currencies}
        style={{
          inputAndroid: { ...pickerSelectStyles.inputAndroid },
          inputIOS: { ...pickerSelectStyles.inputIOS },
        }}
        value={selectedCurrency}
      />

      <Button title="Check Exchange Rate" onPress={handleCheckExchangeRate} />
      {exchangeRateResult && (
        <ThemedText style={styles.result}>
          Exchange Rate: 1 {exchangeRateResult.convertedCurrency} ={' '}
          {exchangeRateResult.exchangeRate} PLN
        </ThemedText>
      )}
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  picker: {
    height: 50,
    width: 200,
    marginVertical: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
