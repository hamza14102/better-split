import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import theme from '../theme';

const GroupDetailsScreen = ({ route, navigation }) => {
    const groupId = route?.params?.groupId;
    const { getGroupById, getGroupExpenses, calculateGroupBalances, getUserById } = useApp();

    const group = useMemo(() => getGroupById(groupId), [getGroupById, groupId]);
    const expenses = useMemo(() => getGroupExpenses(groupId), [getGroupExpenses, groupId]);
    const groupBalances = useMemo(() => calculateGroupBalances(groupId), [calculateGroupBalances, groupId]);

    // Build a simplified debt list for this group from "You"
    const myDebts = useMemo(() => {
        if (!groupBalances['1']) return [];
        const list = [];
        const me = groupBalances['1'];

        Object.entries(me.owed).forEach(([userId, amount]) => {
            if (amount > 0.005) {
                const user = getUserById(userId);
                list.push({ userId, name: user?.name || 'Unknown', amount, type: 'owed' });
            }
        });
        Object.entries(me.owes).forEach(([userId, amount]) => {
            if (amount > 0.005) {
                const user = getUserById(userId);
                list.push({ userId, name: user?.name || 'Unknown', amount, type: 'owes' });
            }
        });
        return list;
    }, [groupBalances, getUserById]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const renderExpenseItem = ({ item }) => {
        const paidByUser = getUserById(item.paidBy);
        const isPaidByCurrentUser = item.paidBy === '1';
        const perPerson = item.amount / item.splitBetween.length;

        return (
            <View style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                    <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.paidByText}>
                        {isPaidByCurrentUser ? 'You paid' : `${paidByUser?.name || 'Unknown'} paid`}
                        {' · '}
                        <Text style={styles.perPersonText}>${perPerson.toFixed(2)}/person</Text>
                    </Text>
                </View>
                <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
            </View>
        );
    };

    if (!groupId || !group) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Group not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{group.name}</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.groupInfoContainer}>
                <Text style={styles.membersTitle}>Members</Text>
                <View style={styles.membersContainer}>
                    {group.members.map(memberId => {
                        const user = getUserById(memberId);
                        return (
                            <Text key={memberId} style={styles.memberBadge}>
                                {memberId === '1' ? 'You' : user?.name || 'Unknown'}
                            </Text>
                        );
                    })}
                </View>

                {myDebts.length > 0 && (
                    <View style={styles.balancesSection}>
                        <Text style={styles.balancesTitle}>Your balances in this group</Text>
                        {myDebts.map(debt => (
                            <Text
                                key={debt.userId}
                                style={[styles.debtLine, debt.type === 'owed' ? styles.positiveText : styles.negativeText]}
                            >
                                {debt.type === 'owed'
                                    ? `${debt.name} owes you $${debt.amount.toFixed(2)}`
                                    : `You owe ${debt.name} $${debt.amount.toFixed(2)}`}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>
                    Expenses
                    <Text style={styles.expenseCountBadge}> ({expenses.length})</Text>
                </Text>
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExpenseItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No expenses yet. Add one!</Text>
                    }
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddExpense', { groupId })}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: { padding: theme.sizes.spacing.xs },
    backButtonText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.primary },
    title: { ...theme.fonts.bold, fontSize: theme.sizes.lg, color: theme.colors.text, flex: 1, textAlign: 'center' },
    groupInfoContainer: {
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.card,
        marginBottom: theme.sizes.spacing.md,
    },
    membersTitle: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.textLight, marginBottom: theme.sizes.spacing.sm },
    membersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.sizes.spacing.sm },
    memberBadge: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.sizes.spacing.xs,
        paddingHorizontal: theme.sizes.spacing.sm,
        borderRadius: theme.sizes.borderRadius.sm,
        marginRight: theme.sizes.spacing.sm,
        marginBottom: theme.sizes.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    balancesSection: { marginTop: theme.sizes.spacing.sm, paddingTop: theme.sizes.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.divider },
    balancesTitle: { ...theme.fonts.medium, fontSize: theme.sizes.xs, color: theme.colors.textLight, marginBottom: theme.sizes.spacing.xs },
    debtLine: { ...theme.fonts.regular, fontSize: theme.sizes.sm, marginBottom: 2 },
    positiveText: { color: theme.colors.success },
    negativeText: { color: theme.colors.error },
    listContainer: { flex: 1, padding: theme.sizes.spacing.md },
    sectionTitle: { ...theme.fonts.bold, fontSize: theme.sizes.lg, color: theme.colors.text, marginBottom: theme.sizes.spacing.md },
    expenseCountBadge: { ...theme.fonts.regular, fontSize: theme.sizes.sm, color: theme.colors.textLight },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    expenseInfo: { flex: 1 },
    expenseDescription: { ...theme.fonts.medium, fontSize: theme.sizes.md, color: theme.colors.text, marginBottom: theme.sizes.spacing.xs },
    expenseDate: { ...theme.fonts.regular, fontSize: theme.sizes.xs, color: theme.colors.textLight, marginBottom: theme.sizes.spacing.xs },
    paidByText: { ...theme.fonts.regular, fontSize: theme.sizes.sm, color: theme.colors.textLight },
    perPersonText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.primary },
    amountText: { ...theme.fonts.bold, fontSize: theme.sizes.md, color: theme.colors.text },
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

export default GroupDetailsScreen;
