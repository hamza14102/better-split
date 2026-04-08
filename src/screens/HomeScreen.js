import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import theme from '../theme';

const HomeScreen = ({ navigation }) => {
    const { calculateBalances, getUserById, settleDebt } = useApp();

    const balances = useMemo(() => calculateBalances(), [calculateBalances]);
    const totalBalance = balances['1']?.total ?? 0;

    const balancesList = useMemo(() => {
        const currentUser = balances['1'] || { owes: {}, owed: {} };
        const list = [];

        Object.entries(currentUser.owed).forEach(([userId, amount]) => {
            if (amount > 0.005) {
                const user = getUserById(userId);
                list.push({ id: userId, name: user?.name || 'Unknown', amount, type: 'owed' });
            }
        });

        Object.entries(currentUser.owes).forEach(([userId, amount]) => {
            if (amount > 0.005) {
                const user = getUserById(userId);
                list.push({ id: userId, name: user?.name || 'Unknown', amount, type: 'owes' });
            }
        });

        return list;
    }, [balances, getUserById]);

    const handleSettle = (item) => {
        const label = item.type === 'owed'
            ? `Mark ${item.name} as having paid you $${item.amount.toFixed(2)}?`
            : `Record that you paid ${item.name} $${item.amount.toFixed(2)}?`;

        Alert.alert('Settle Up', label, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm',
                onPress: () => {
                    if (item.type === 'owed') {
                        settleDebt(item.id, '1', item.amount);
                    } else {
                        settleDebt('1', item.id, item.amount);
                    }
                },
            },
        ]);
    };

    const renderBalanceItem = ({ item }) => {
        const isOwed = item.type === 'owed';
        return (
            <View style={styles.balanceItem}>
                <View style={styles.balanceInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={[styles.balanceText, isOwed ? styles.positiveBalance : styles.negativeBalance]}>
                        {isOwed
                            ? `owes you $${item.amount.toFixed(2)}`
                            : `you owe $${item.amount.toFixed(2)}`}
                    </Text>
                </View>
                <TouchableOpacity style={styles.settleButton} onPress={() => handleSettle(item)}>
                    <Text style={styles.settleButtonText}>Settle up</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <Text style={styles.title}>Better Split</Text>
            </View>

            <View style={styles.balanceSummary}>
                <Text style={styles.balanceTitle}>
                    {totalBalance >= 0 ? 'You are owed' : 'You owe'}
                </Text>
                <Text style={[
                    styles.totalBalance,
                    totalBalance >= 0 ? styles.positiveBalance : styles.negativeBalance,
                ]}>
                    ${Math.abs(totalBalance).toFixed(2)}
                </Text>
                {totalBalance === 0 && (
                    <Text style={styles.settledText}>All settled up!</Text>
                )}
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Balances</Text>
                <FlatList
                    data={balancesList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBalanceItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No balances to display</Text>
                    }
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        padding: theme.sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: { ...theme.fonts.bold, fontSize: theme.sizes.xl, color: theme.colors.primary },
    balanceSummary: {
        padding: theme.sizes.spacing.md,
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        marginHorizontal: theme.sizes.spacing.md,
        marginTop: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    balanceTitle: { ...theme.fonts.medium, fontSize: theme.sizes.md, color: theme.colors.textLight, marginBottom: theme.sizes.spacing.xs },
    totalBalance: { ...theme.fonts.bold, fontSize: theme.sizes.xxl, marginVertical: theme.sizes.spacing.sm },
    settledText: { ...theme.fonts.regular, fontSize: theme.sizes.sm, color: theme.colors.success },
    positiveBalance: { color: theme.colors.success },
    negativeBalance: { color: theme.colors.error },
    listContainer: { flex: 1, padding: theme.sizes.spacing.md },
    sectionTitle: { ...theme.fonts.bold, fontSize: theme.sizes.lg, color: theme.colors.text, marginBottom: theme.sizes.spacing.md },
    balanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    balanceInfo: { flex: 1 },
    userName: { ...theme.fonts.medium, fontSize: theme.sizes.md, color: theme.colors.text, marginBottom: theme.sizes.spacing.xs },
    balanceText: { ...theme.fonts.regular, fontSize: theme.sizes.sm },
    settleButton: {
        paddingVertical: theme.sizes.spacing.xs,
        paddingHorizontal: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    settleButtonText: { ...theme.fonts.medium, fontSize: theme.sizes.xs, color: theme.colors.primary },
    separator: { height: theme.sizes.spacing.md },
    emptyText: { ...theme.fonts.regular, fontSize: theme.sizes.sm, color: theme.colors.textLight, textAlign: 'center', marginTop: theme.sizes.spacing.xl },
    addButton: {
        position: 'absolute',
        right: theme.sizes.spacing.xl,
        bottom: theme.sizes.spacing.xl,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
    },
    addButtonText: { color: theme.colors.surface, fontSize: 30, fontWeight: 'bold' },
});

export default HomeScreen;
