import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { calculateBalances, getUserById } from '../data/mockData';
import theme from '../theme';

const HomeScreen = ({ navigation }) => {
    const [balances, setBalances] = useState({});
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        // Calculate balances between users
        const userBalances = calculateBalances();
        setBalances(userBalances);

        // Set total balance for current user (id: '1')
        setTotalBalance(userBalances['1'].total);
    }, []);

    // Create a list of all users who owe money or are owed money
    const getBalancesList = () => {
        const currentUserBalances = balances['1'] || { owes: {}, owed: {} };
        const list = [];

        // People who owe you money
        Object.keys(currentUserBalances.owed).forEach(userId => {
            const amount = currentUserBalances.owed[userId];
            if (amount > 0) {
                const user = getUserById(userId);
                list.push({
                    id: userId,
                    name: user?.name || 'Unknown user',
                    amount,
                    type: 'owed' // They owe you
                });
            }
        });

        // People you owe money to
        Object.keys(currentUserBalances.owes).forEach(userId => {
            const amount = currentUserBalances.owes[userId];
            if (amount > 0) {
                const user = getUserById(userId);
                list.push({
                    id: userId,
                    name: user?.name || 'Unknown user',
                    amount,
                    type: 'owes' // You owe them
                });
            }
        });

        return list;
    };

    const renderBalanceItem = ({ item }) => {
        const isOwed = item.type === 'owed';

        return (
            <TouchableOpacity
                style={styles.balanceItem}
                onPress={() => {
                    // Navigation to user details could go here
                }}
            >
                <View style={styles.balanceInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={[
                        styles.balanceText,
                        isOwed ? styles.positiveBalance : styles.negativeBalance
                    ]}>
                        {isOwed
                            ? `owes you $${item.amount.toFixed(2)}`
                            : `you owe $${item.amount.toFixed(2)}`
                        }
                    </Text>
                </View>
            </TouchableOpacity>
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
                    {totalBalance >= 0 ? 'Total balance' : 'Total owed'}
                </Text>
                <Text style={[
                    styles.totalBalance,
                    totalBalance >= 0 ? styles.positiveBalance : styles.negativeBalance
                ]}>
                    ${Math.abs(totalBalance).toFixed(2)}
                </Text>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Balances</Text>
                <FlatList
                    data={getBalancesList()}
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
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.xl,
        color: theme.colors.primary,
    },
    balanceSummary: {
        padding: theme.sizes.spacing.md,
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        marginHorizontal: theme.sizes.spacing.md,
        marginTop: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    balanceTitle: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.md,
        color: theme.colors.textLight,
        marginBottom: theme.sizes.spacing.xs,
    },
    totalBalance: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.xxl,
        marginVertical: theme.sizes.spacing.sm,
    },
    positiveBalance: {
        color: theme.colors.success,
    },
    negativeBalance: {
        color: theme.colors.error,
    },
    listContainer: {
        flex: 1,
        padding: theme.sizes.spacing.md,
    },
    sectionTitle: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.lg,
        color: theme.colors.text,
        marginBottom: theme.sizes.spacing.md,
    },
    balanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    balanceInfo: {
        flex: 1,
    },
    userName: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.sizes.spacing.xs,
    },
    balanceText: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.sm,
    },
    separator: {
        height: theme.sizes.spacing.md,
    },
    emptyText: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.sm,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: theme.sizes.spacing.xl,
    },
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
    addButtonText: {
        color: theme.colors.surface,
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
