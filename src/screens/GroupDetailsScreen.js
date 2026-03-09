import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { getGroupById, getGroupExpenses, getUserById } from '../data/mockData';
import theme from '../theme';

const GroupDetailsScreen = ({ route, navigation }) => {
    const groupId = route?.params?.groupId;
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        // Get group data
        const groupData = getGroupById(groupId);
        setGroup(groupData);

        // Get expenses for this group
        const groupExpenses = getGroupExpenses(groupId);
        setExpenses(groupExpenses);
    }, [groupId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderExpenseItem = ({ item }) => {
        const paidByUser = getUserById(item.paidBy);
        const isPaidByCurrentUser = item.paidBy === '1';

        return (
            <TouchableOpacity
                style={styles.expenseItem}
                onPress={() => {
                    // Navigate to expense details screen (not implemented in this example)
                }}
            >
                <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                    <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.paidByText}>
                        {isPaidByCurrentUser
                            ? 'You paid'
                            : `${paidByUser?.name || 'Unknown user'} paid`}
                    </Text>
                </View>
                <View style={styles.expenseAmount}>
                    <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (!groupId) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Invalid group.</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!group) {
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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{group.name}</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => {
                        // Navigate to group settings (not implemented in this example)
                    }}
                >
                    <Text style={styles.settingsButtonText}>...</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.groupInfoContainer}>
                <Text style={styles.membersTitle}>Members</Text>
                <View style={styles.membersContainer}>
                    {group.members.map(memberId => {
                        const user = getUserById(memberId);
                        return (
                            <Text key={memberId} style={styles.memberName}>
                                {user?.id === '1' ? 'You' : user?.name || 'Unknown user'}
                            </Text>
                        );
                    })}
                </View>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Expenses</Text>
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExpenseItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No expenses in this group yet</Text>
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
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: theme.sizes.spacing.xs,
    },
    backButtonText: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.primary,
    },
    title: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.lg,
        color: theme.colors.text,
        flex: 1,
        textAlign: 'center',
    },
    settingsButton: {
        padding: theme.sizes.spacing.xs,
    },
    settingsButtonText: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.md,
        color: theme.colors.textLight,
    },
    groupInfoContainer: {
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.card,
        marginBottom: theme.sizes.spacing.md,
    },
    membersTitle: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.textLight,
        marginBottom: theme.sizes.spacing.sm,
    },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    memberName: {
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
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseDescription: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.sizes.spacing.xs,
    },
    expenseDate: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.xs,
        color: theme.colors.textLight,
        marginBottom: theme.sizes.spacing.xs,
    },
    paidByText: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.sm,
        color: theme.colors.textLight,
    },
    expenseAmount: {
        justifyContent: 'center',
    },
    amountText: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.md,
        color: theme.colors.text,
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

export default GroupDetailsScreen;
