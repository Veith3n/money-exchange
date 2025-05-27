import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { WalletDto } from '@/common/api/currency-exchange-api.types';
import { ThemedText, ThemedTextInput } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CurrencyCode } from '@/types/currency-codes.enum';

const AddWalletModal = ({
  modalVisible,
  setModalVisible,
  existingWallets,
  handleAddWallet,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  existingWallets: WalletDto[];
  handleAddWallet: (
    currencyCode: CurrencyCode,
    amount: number,
  ) => Promise<void>;
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
    null,
  );
  const [amount, setAmount] = useState<number>(0);

  // Filter out currencies that the user already has in their wallets
  const availableCurrencies = Object.values(CurrencyCode).filter(
    (currency) =>
      !existingWallets.some((wallet) => wallet.currencyCode === currency),
  );

  const handleConfirm = async () => {
    if (selectedCurrency) {
      console.log('Adding wallet:', selectedCurrency, amount);
      await handleAddWallet(selectedCurrency, amount);
      console.log('After awaiting handleAddWallet');
      setSelectedCurrency(null);
      setAmount(0);
      setModalVisible(false);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Add New Wallet</ThemedText>

          <FlatList
            data={availableCurrencies}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Button
                mode={selectedCurrency === item ? 'contained' : 'outlined'}
                onPress={() => setSelectedCurrency(item)}
                style={styles.currencyButton}
              >
                {item}
              </Button>
            )}
            contentContainerStyle={[
              styles.currencyList,
              availableCurrencies.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={
              <ThemedText style={styles.emptyMessage}>
                No currencies available to add.
              </ThemedText>
            }
          />

          {selectedCurrency && (
            <>
              <ThemedText style={styles.selectedCurrency}>
                Selected Currency: {selectedCurrency}
              </ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="Enter initial amount"
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9.]/g, '');
                  setAmount(parseFloat(numericValue) || 0);
                }}
              />
            </>
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              onPress={handleConfirm}
              disabled={!selectedCurrency}
            >
              Confirm
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currencyList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  currencyButton: {
    marginVertical: 4,
  },
  selectedCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AddWalletModal;
