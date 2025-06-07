import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { GROUPS, getUserById } from '../data/mockData';
import theme from '../theme';

const GroupsScreen = ({ navigation }) => {
    const renderGroupMember = (memberId, index, total) => {
        const user = getUserById(memberId);
        return (
            <Text key={memberId} style={styles.memberName}>
                {user.name}{index < total - 1 ? ', ' : ''}
            </Text>
        );
    };

    const renderGroupItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.groupItem}
                onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            >
                <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <View style={styles.membersContainer}>
                        {item.members.slice(0, 3).map((memberId, index) =>
                            renderGroupMember(memberId, index, Math.min(item.members.length, 3))
                        )}
                        {item.members.length > 3 && (
                            <Text style={styles.memberName}>
                                {` +${item.members.length - 3} more`}
                            </Text>
                        )}
                    </View>
                </View>
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
                    data={GROUPS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGroupItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No groups found</Text>
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
    listContainer: {
        flex: 1,
        padding: theme.sizes.spacing.md,
    },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.sizes.borderRadius.md,
        ...theme.shadows.small,
    },
    groupInfo: {
        flex: 1,
    },
    groupName: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.sizes.spacing.xs,
    },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    memberName: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.sm,
        color: theme.colors.textLight,
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

export default GroupsScreen;
