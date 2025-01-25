import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
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
      <ThemedText style={styles.title}>Select a currency:</ThemedText>

      <CurrencyPicker
        currencies={currencies}
        setSelectedCurrency={setSelectedCurrency}
        selectedCurrency={selectedCurrency}
      />

      <View style={styles.buttonContainer}>
        <Button title="Check Exchange Rate" onPress={handleCheckExchangeRate} />
      </View>

      {exchangeRateResult && (
        <ExchangeRateResultText exchangeRateResult={exchangeRateResult} />
      )}

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </ThemedView>
  );
}

const ExchangeRateResultText = ({
  exchangeRateResult,
}: {
  exchangeRateResult: ExchangeRateResult;
}) => {
  return (
    <ThemedText style={styles.result}>
      Exchange Rate: 1 {exchangeRateResult.convertedCurrency} ={' '}
      {exchangeRateResult.exchangeRate} PLN
    </ThemedText>
  );
};

const CurrencyPicker = ({
  currencies,
  setSelectedCurrency,
  selectedCurrency,
}: {
  currencies: { label: string; value: CurrencyCode }[];
  setSelectedCurrency: (currency: CurrencyCode) => void;
  selectedCurrency: CurrencyCode;
}) => {
  const textColor = useThemeColor({}, 'text');

  return (
    <RNPickerSelect
      onValueChange={(itemValue: CurrencyCode) =>
        itemValue && setSelectedCurrency(itemValue)
      }
      items={currencies}
      style={{
        inputAndroid: { ...pickerSelectStyles.inputAndroid, color: textColor },
        inputIOS: { ...pickerSelectStyles.inputIOS, color: textColor },
      }}
      value={selectedCurrency}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
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
    width: '80%',
    alignSelf: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingRight: 30, // to ensure the text is never behind the icon
    width: '80%',
    alignSelf: 'center',
  },
});
