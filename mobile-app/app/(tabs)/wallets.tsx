import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

import { useSession } from '@/app/ctx';
import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';
import { WalletDto } from '@/common/api/currency-exchange-api.types';
import { ThemedText, ThemedTextInput } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Wallets() {
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletDto | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const { session } = useSession();

  const currencyExchangeApiService = CurrencyExchangeApiService.getInstance();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        if (session?.accessToken) {
          const wallets = await currencyExchangeApiService.getWallets(
            session.accessToken,
          );
          if (wallets) {
            setWallets(sortWallets(wallets));
            setError(null);
          } else {
            setError(wallets);
          }
        }
      } catch (err: unknown) {
        setError('Failed to fetch wallets. Please try again.');
      }
    };

    fetchWallets();
  }, [session, currencyExchangeApiService]);

  const handleTopUp = async () => {
    console.log('hit');
    console.log(session?.accessToken);
    if (selectedWallet && topUpAmount && session?.accessToken) {
      try {
        await currencyExchangeApiService.topUpWallet(
          session?.accessToken,
          selectedWallet.currencyCode,
          parseFloat(topUpAmount),
        );
        setModalVisible(false);
        setTopUpAmount('');
        // Refresh wallets
        const wallets = await currencyExchangeApiService.getWallets(
          session?.accessToken || '',
        );
        setWallets(sortWallets(wallets));
      } catch (err: unknown) {
        setError('Failed to top up wallet. Please try again.');
      }
    }
  };

  const renderItem = ({ item }: { item: WalletDto }) => (
    <View style={styles.walletItem}>
      <ThemedText style={styles.walletCurrency}>{item.currencyCode}</ThemedText>
      <ThemedText style={styles.walletBalance}>
        Balance: {item.balance}
      </ThemedText>
      <Button
        mode="contained"
        onPress={() => {
          setSelectedWallet(item);
          setModalVisible(true);
        }}
      >
        Top Up
      </Button>
    </View>
  );

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Your Wallets</ThemedText>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <FlatList
          data={wallets}
          renderItem={renderItem}
          keyExtractor={(item) => item.currencyCode}
          contentContainerStyle={styles.list}
        />

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>
                Top Up {selectedWallet?.currencyCode}
              </ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
              />
              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={handleTopUp}>
                  Confirm
                </Button>
                <Button mode="outlined" onPress={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </View>
            </ThemedView>
          </ThemedView>
        </Modal>
      </ThemedView>
    </PaperProvider>
  );
}

const sortWallets = (wallets: WalletDto[]) =>
  wallets.sort((a, b) => {
    if (a.currencyCode === 'PLN') return -1;
    if (b.currencyCode === 'PLN') return 1;

    return a.currencyCode.localeCompare(b.currencyCode);
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  walletCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 16,
  },
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
});
