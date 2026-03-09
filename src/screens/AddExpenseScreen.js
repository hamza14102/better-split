import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Switch,
    Alert
} from 'react-native';
import { USERS, GROUPS } from '../data/mockData';
import theme from '../theme';

const AddExpenseScreen = ({ route, navigation }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState({});
    const [splitEqually, setSplitEqually] = useState(true);
    const [paidBy, setPaidBy] = useState('1'); // Default to current user

    const preselectedGroupId = route?.params?.groupId;

    const selectedGroupData = useMemo(
        () => GROUPS.find(g => g.id === selectedGroup),
        [selectedGroup]
    );

    const paidByOptions = useMemo(() => {
        if (!selectedGroupData) return USERS;
        return USERS.filter(user => selectedGroupData.members.includes(user.id));
    }, [selectedGroupData]);

    useEffect(() => {
        if (preselectedGroupId && GROUPS.some(group => group.id === preselectedGroupId)) {
            setSelectedGroup(preselectedGroupId);
            initializeMembers(preselectedGroupId);
        }
    }, [preselectedGroupId]);

    useEffect(() => {
        if (paidByOptions.length === 0) {
            return;
        }

        const isCurrentPayerValid = paidByOptions.some(user => user.id === paidBy);
        if (!isCurrentPayerValid) {
            setPaidBy(paidByOptions[0].id);
        }
    }, [paidBy, paidByOptions]);

    // Initialize all members as selected
    const initializeMembers = (groupId) => {
        const group = GROUPS.find(g => g.id === groupId);
        if (!group) return;

        const newSelectedMembers = {};
        group.members.forEach(memberId => {
            newSelectedMembers[memberId] = true;
        });

        setSelectedMembers(newSelectedMembers);
    };

    const handleGroupSelect = (groupId) => {
        setSelectedGroup(groupId);
        initializeMembers(groupId);
    };

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev => ({
            ...prev,
            [memberId]: !prev[memberId]
        }));
    };

    const handleSaveExpense = () => {
        // Validate inputs
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!selectedGroup) {
            Alert.alert('Error', 'Please select a group');
            return;
        }

        const selectedMemberIds = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
        if (selectedMemberIds.length === 0) {
            Alert.alert('Error', 'Please select at least one member to split with');
            return;
        }

        // Create new expense object
        const _newExpense = {
            id: String(Date.now()), // Generate a unique ID
            groupId: selectedGroup,
            description,
            amount: parseFloat(amount),
            paidBy,
            splitBetween: selectedMemberIds,
            splitType: splitEqually ? 'equal' : 'custom', // We only implement equal splitting for now
            date: new Date().toISOString(),
        };

        // Navigate back
        Alert.alert('Success', 'Expense added successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Add Expense</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveExpense}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What was this expense for?"
                        placeholderTextColor={theme.colors.textLight}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        placeholderTextColor={theme.colors.textLight}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Group</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.groupsScrollView}
                    >
                        {GROUPS.map(group => (
                            <TouchableOpacity
                                key={group.id}
                                style={[
                                    styles.groupItem,
                                    selectedGroup === group.id && styles.selectedGroupItem
                                ]}
                                onPress={() => handleGroupSelect(group.id)}
                            >
                                <Text
                                    style={[
                                        styles.groupItemText,
                                        selectedGroup === group.id && styles.selectedGroupItemText
                                    ]}
                                >
                                    {group.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Paid by</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.usersScrollView}
                    >
                        {paidByOptions.map(user => (
                            <TouchableOpacity
                                key={user.id}
                                style={[
                                    styles.userItem,
                                    paidBy === user.id && styles.selectedUserItem
                                ]}
                                onPress={() => setPaidBy(user.id)}
                            >
                                <Text
                                    style={[
                                        styles.userItemText,
                                        paidBy === user.id && styles.selectedUserItemText
                                    ]}
                                >
                                    {user.id === '1' ? 'You' : user.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                    <View style={styles.splitHeader}>
                        <Text style={styles.label}>Split options</Text>
                        <View style={styles.splitTypeToggle}>
                            <Text style={styles.splitTypeText}>Split equally</Text>
                            <Switch
                                value={splitEqually}
                                onValueChange={setSplitEqually}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={theme.colors.surface}
                            />
                        </View>
                    </View>

                    {selectedGroup && (
                        <View style={styles.membersContainer}>
                            {selectedGroupData?.members.map(memberId => {
                                const user = USERS.find(u => u.id === memberId);
                                return (
                                    <TouchableOpacity
                                        key={user.id}
                                        style={[
                                            styles.memberItem,
                                            selectedMembers[user.id] && styles.selectedMemberItem
                                        ]}
                                        onPress={() => toggleMemberSelection(user.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.memberItemText,
                                                selectedMembers[user.id] && styles.selectedMemberItemText
                                            ]}
                                        >
                                            {user.id === '1' ? 'You' : user.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        color: theme.colors.textLight,
    },
    title: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.lg,
        color: theme.colors.text,
    },
    saveButton: {
        padding: theme.sizes.spacing.xs,
    },
    saveButtonText: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.primary,
    },
    formContainer: {
        flex: 1,
        padding: theme.sizes.spacing.md,
    },
    inputGroup: {
        marginBottom: theme.sizes.spacing.lg,
    },
    label: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
        marginBottom: theme.sizes.spacing.sm,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.sizes.borderRadius.md,
        paddingHorizontal: theme.sizes.spacing.md,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        ...theme.fonts.regular,
        fontSize: theme.sizes.md,
    },
    groupsScrollView: {
        flexGrow: 0,
        marginBottom: theme.sizes.spacing.sm,
    },
    groupItem: {
        marginRight: theme.sizes.spacing.md,
        paddingVertical: theme.sizes.spacing.sm,
        paddingHorizontal: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    selectedGroupItem: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    groupItemText: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
    },
    selectedGroupItemText: {
        color: theme.colors.surface,
    },
    usersScrollView: {
        flexGrow: 0,
        marginBottom: theme.sizes.spacing.sm,
    },
    userItem: {
        marginRight: theme.sizes.spacing.md,
        paddingVertical: theme.sizes.spacing.sm,
        paddingHorizontal: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    selectedUserItem: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    userItemText: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
    },
    selectedUserItemText: {
        color: theme.colors.text,
    },
    splitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.sizes.spacing.sm,
    },
    splitTypeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    splitTypeText: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.xs,
        color: theme.colors.text,
        marginRight: theme.sizes.spacing.sm,
    },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    memberItem: {
        marginRight: theme.sizes.spacing.md,
        marginBottom: theme.sizes.spacing.md,
        paddingVertical: theme.sizes.spacing.sm,
        paddingHorizontal: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    selectedMemberItem: {
        backgroundColor: theme.colors.tertiary,
        borderColor: theme.colors.tertiary,
    },
    memberItemText: {
        ...theme.fonts.medium,
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
    },
    selectedMemberItemText: {
        color: theme.colors.surface,
    },
});

export default AddExpenseScreen;
