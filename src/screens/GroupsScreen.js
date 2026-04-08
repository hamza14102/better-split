import React from 'react';
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

const GroupsScreen = ({ navigation }) => {
    const { groups, getUserById } = useApp();

    const renderGroupItem = ({ item }) => {
        const displayMembers = item.members.slice(0, 3);
        const overflow = item.members.length - 3;

        return (
            <TouchableOpacity
                style={styles.groupItem}
                onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            >
                <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <View style={styles.membersContainer}>
                        {displayMembers.map((memberId, index) => {
                            const user = getUserById(memberId);
                            const name = memberId === '1' ? 'You' : user?.name || 'Unknown';
                            const isLast = index === displayMembers.length - 1 && overflow <= 0;
                            return (
                                <Text key={memberId} style={styles.memberName}>
                                    {name}{!isLast ? ', ' : ''}
                                </Text>
                            );
                        })}
                        {overflow > 0 && (
                            <Text style={styles.memberName}>{` +${overflow} more`}</Text>
                        )}
                    </View>
                    <Text style={styles.expenseCount}>
                        {item.expenses.length} {item.expenses.length === 1 ? 'expense' : 'expenses'}
                    </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <Text style={styles.title}>Your Groups</Text>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGroupItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No groups yet. Create one!</Text>
                    }
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateGroup')}
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
    listContainer: { flex: 1, padding: theme.sizes.spacing.md },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    groupInfo: { flex: 1 },
    groupName: { ...theme.fonts.medium, fontSize: theme.sizes.md, color: theme.colors.text, marginBottom: theme.sizes.spacing.xs },
    membersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.sizes.spacing.xs },
    memberName: { ...theme.fonts.regular, fontSize: theme.sizes.sm, color: theme.colors.textLight },
    expenseCount: { ...theme.fonts.regular, fontSize: theme.sizes.xs, color: theme.colors.primary },
    chevron: { ...theme.fonts.bold, fontSize: 22, color: theme.colors.textLight, paddingLeft: theme.sizes.spacing.sm },
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

export default GroupsScreen;
