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
import { useApp } from '../context/AppContext';
import theme from '../theme';

const AddExpenseScreen = ({ route, navigation }) => {
    const { groups, getUserById, addExpense } = useApp();

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState({});
    const [splitEqually, setSplitEqually] = useState(true);
    const [paidBy, setPaidBy] = useState('1');

    const preselectedGroupId = route?.params?.groupId;

    const selectedGroupData = useMemo(
        () => groups.find(g => g.id === selectedGroup),
        [groups, selectedGroup]
    );

    const paidByOptions = useMemo(() => {
        if (!selectedGroupData) return [];
        return selectedGroupData.members.map(id => getUserById(id)).filter(Boolean);
    }, [selectedGroupData, getUserById]);

    useEffect(() => {
        if (preselectedGroupId && groups.some(g => g.id === preselectedGroupId)) {
            setSelectedGroup(preselectedGroupId);
            initializeMembers(preselectedGroupId);
        }
    }, [preselectedGroupId]);

    useEffect(() => {
        if (paidByOptions.length === 0) return;
        const isValid = paidByOptions.some(u => u.id === paidBy);
        if (!isValid) setPaidBy(paidByOptions[0].id);
    }, [paidBy, paidByOptions]);

    const initializeMembers = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;
        const init = {};
        group.members.forEach(id => { init[id] = true; });
        setSelectedMembers(init);
    };

    const handleGroupSelect = (groupId) => {
        setSelectedGroup(groupId);
        initializeMembers(groupId);
    };

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev => ({ ...prev, [memberId]: !prev[memberId] }));
    };

    const handleSaveExpense = () => {
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
        const splitBetween = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
        if (splitBetween.length === 0) {
            Alert.alert('Error', 'Please select at least one member to split with');
            return;
        }

        addExpense({
            id: String(Date.now()),
            groupId: selectedGroup,
            description: description.trim(),
            amount: parseFloat(amount),
            paidBy,
            splitBetween,
            splitType: 'equal',
            date: new Date().toISOString(),
        });

        Alert.alert('Success', 'Expense added successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Add Expense</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
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
                        style={styles.chipsScrollView}
                    >
                        {groups.map(group => (
                            <TouchableOpacity
                                key={group.id}
                                style={[styles.chip, selectedGroup === group.id && styles.chipSelected]}
                                onPress={() => handleGroupSelect(group.id)}
                            >
                                <Text style={[styles.chipText, selectedGroup === group.id && styles.chipTextSelected]}>
                                    {group.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {selectedGroup && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Paid by</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.chipsScrollView}
                        >
                            {paidByOptions.map(user => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={[styles.chip, styles.chipSecondary, paidBy === user.id && styles.chipSecondarySelected]}
                                    onPress={() => setPaidBy(user.id)}
                                >
                                    <Text style={[styles.chipText, paidBy === user.id && styles.chipTextSelected]}>
                                        {user.id === '1' ? 'You' : user.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {selectedGroup && (
                    <View style={styles.inputGroup}>
                        <View style={styles.splitHeader}>
                            <Text style={styles.label}>Split between</Text>
                            <View style={styles.splitTypeToggle}>
                                <Text style={styles.splitTypeText}>Equally</Text>
                                <Switch
                                    value={splitEqually}
                                    onValueChange={setSplitEqually}
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    thumbColor={theme.colors.surface}
                                />
                            </View>
                        </View>

                        <View style={styles.membersContainer}>
                            {selectedGroupData?.members.map(memberId => {
                                const user = getUserById(memberId);
                                if (!user) return null;
                                return (
                                    <TouchableOpacity
                                        key={user.id}
                                        style={[styles.chip, styles.chipTertiary, selectedMembers[user.id] && styles.chipTertiarySelected]}
                                        onPress={() => toggleMemberSelection(user.id)}
                                    >
                                        <Text style={[styles.chipText, selectedMembers[user.id] && styles.chipTextSelected]}>
                                            {user.id === '1' ? 'You' : user.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {splitEqually && (() => {
                            const count = Object.values(selectedMembers).filter(Boolean).length;
                            const parsed = parseFloat(amount);
                            if (count > 0 && !isNaN(parsed) && parsed > 0) {
                                return (
                                    <Text style={styles.perPersonText}>
                                        ${(parsed / count).toFixed(2)} per person
                                    </Text>
                                );
                            }
                            return null;
                        })()}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: { padding: theme.sizes.spacing.xs },
    backButtonText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.textLight },
    title: { ...theme.fonts.bold, fontSize: theme.sizes.lg, color: theme.colors.text },
    saveButton: { padding: theme.sizes.spacing.xs },
    saveButtonText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.primary },
    formContainer: { flex: 1, padding: theme.sizes.spacing.md },
    inputGroup: { marginBottom: theme.sizes.spacing.lg },
    label: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.text, marginBottom: theme.sizes.spacing.sm },
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
    chipsScrollView: { flexGrow: 0 },
    chip: {
        marginRight: theme.sizes.spacing.sm,
        paddingVertical: theme.sizes.spacing.sm,
        paddingHorizontal: theme.sizes.spacing.md,
        borderRadius: theme.sizes.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    chipSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipSecondary: { borderColor: theme.colors.border },
    chipSecondarySelected: { backgroundColor: theme.colors.secondary, borderColor: theme.colors.secondary },
    chipTertiary: { borderColor: theme.colors.border },
    chipTertiarySelected: { backgroundColor: theme.colors.tertiary, borderColor: theme.colors.tertiary },
    chipText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.text },
    chipTextSelected: { color: theme.colors.surface },
    splitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.sizes.spacing.sm },
    splitTypeToggle: { flexDirection: 'row', alignItems: 'center' },
    splitTypeText: { ...theme.fonts.regular, fontSize: theme.sizes.xs, color: theme.colors.text, marginRight: theme.sizes.spacing.sm },
    membersContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    perPersonText: { ...theme.fonts.medium, fontSize: theme.sizes.sm, color: theme.colors.primary, marginTop: theme.sizes.spacing.sm },
});

export default AddExpenseScreen;
