import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import { USERS } from '../data/mockData';
import theme from '../theme';

const CreateGroupScreen = ({ navigation }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState({ '1': true }); // Current user is always selected

    const toggleMemberSelection = (memberId) => {
        if (memberId === '1') return; // Cannot deselect yourself

        setSelectedMembers(prev => ({
            ...prev,
            [memberId]: !prev[memberId]
        }));
    };

    const handleCreateGroup = () => {
        // Validate inputs
        if (!groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        const selectedMemberIds = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
        if (selectedMemberIds.length < 2) {
            Alert.alert('Error', 'Please select at least one other member');
            return;
        }

        // Create new group object (placeholder until persistence is wired)
        const _newGroup = {
            id: String(Date.now()), // Generate a unique ID
            name: groupName,
            members: selectedMemberIds,
            expenses: [],
            createdAt: new Date().toISOString(),
        };


        // Navigate back
        Alert.alert('Success', 'Group created successfully', [
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
                <Text style={styles.title}>Create Group</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleCreateGroup}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                        style={styles.input}
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholder="Enter group name"
                        placeholderTextColor={theme.colors.textLight}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Members</Text>
                    <View style={styles.membersContainer}>
                        {USERS.map(user => (
                            <TouchableOpacity
                                key={user.id}
                                style={[
                                    styles.memberItem,
                                    selectedMembers[user.id] && styles.selectedMemberItem,
                                    user.id === '1' && styles.currentUserItem
                                ]}
                                onPress={() => toggleMemberSelection(user.id)}
                                disabled={user.id === '1'} // Cannot deselect yourself
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
                        ))}
                    </View>
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
    currentUserItem: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
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

export default CreateGroupScreen;
