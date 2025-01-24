import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

import { useSession } from '@/app/ctx';
import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';
import { WalletDto } from '@/common/api/currency-exchange-api.types';
import { ThemedText, ThemedTextInput } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CurrencyCode } from '@/types/currency-codes.enum';

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
    if (selectedWallet && topUpAmount && session?.accessToken) {
      try {
        await currencyExchangeApiService.topUpWallet(
          session.accessToken,
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

  const renderWallet = ({ item: wallet }: { item: WalletDto }) => {
    const handleWalletTopUpPress = (wallet: WalletDto) => {
      setSelectedWallet(wallet);
      setModalVisible(true);
    };
    const handleWalletSellPress = (wallet: WalletDto) => {};
    const handleWalletBuyPress = (wallet: WalletDto) => {};
    const buyButtonEnabled = wallets.some(
      (wallet) => wallet.currencyCode === CurrencyCode.PLN,
    );

    return (
      <WalletItem
        wallet={wallet}
        onWalletTopUpPress={handleWalletTopUpPress}
        onWalletBuyPress={handleWalletBuyPress}
        onWalletSellPress={handleWalletSellPress}
        buyButtonDisabled={!buyButtonEnabled}
      />
    );
  };

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Your Wallets</ThemedText>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <FlatList
          data={wallets}
          renderItem={renderWallet}
          keyExtractor={(wallet) => wallet.currencyCode}
          contentContainerStyle={styles.list}
        />

        <TopUpModal
          handleTopUp={handleTopUp}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedWallet={selectedWallet}
          setTopUpAmount={setTopUpAmount}
          topUpAmount={topUpAmount}
        />
      </ThemedView>
    </PaperProvider>
  );
}

const WalletItem = ({
  wallet,
  onWalletTopUpPress,
  onWalletBuyPress,
  onWalletSellPress,
  buyButtonDisabled,
}: {
  wallet: WalletDto;
  onWalletTopUpPress: (wallet: WalletDto) => void;
  onWalletSellPress: (wallet: WalletDto) => void;
  onWalletBuyPress: (wallet: WalletDto) => void;
  buyButtonDisabled: boolean;
}) => {
  return (
    <View style={styles.walletItem}>
      <View style={styles.walletInfo}>
        <ThemedText style={styles.walletCurrency}>
          {wallet.currencyCode}
        </ThemedText>
        <ThemedText style={styles.walletBalance}>
          Balance: {parseFloat(wallet.balance).toFixed(2)}
        </ThemedText>
      </View>
      <View style={styles.walletButtons}>
        <Button mode="contained" onPress={() => onWalletSellPress(wallet)}>
          Sell
        </Button>
        <Button
          mode="contained"
          onPress={() => onWalletBuyPress(wallet)}
          disabled={buyButtonDisabled}
        >
          Buy
        </Button>
        <Button mode="contained" onPress={() => onWalletTopUpPress(wallet)}>
          Top Up
        </Button>
      </View>
    </View>
  );
};

const TopUpModal = ({
  modalVisible,
  setModalVisible,
  selectedWallet,
  topUpAmount,
  setTopUpAmount,
  handleTopUp,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedWallet: WalletDto | null;
  topUpAmount: string;
  setTopUpAmount: (amount: string) => void;
  handleTopUp: () => void;
}) => {
  return (
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
  );
};

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  walletCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 16,
  },
  walletButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
