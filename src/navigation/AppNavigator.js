import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import GroupDetailsScreen from '../screens/GroupDetailsScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import theme from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeIcon = ({ focused }) => (
    <View style={styles.iconContainer}>
        <View style={[styles.icon, focused ? styles.activeIcon : {}]}>
            <Text style={[styles.iconText, focused ? styles.activeIconText : {}]}>$</Text>
        </View>
        <Text style={[styles.iconLabel, focused ? styles.activeIconLabel : {}]}>Home</Text>
    </View>
);

const GroupsIcon = ({ focused }) => (
    <View style={styles.iconContainer}>
        <View style={[styles.icon, focused ? styles.activeIcon : {}]}>
            <Text style={[styles.iconText, focused ? styles.activeIconText : {}]}>G</Text>
        </View>
        <Text style={[styles.iconLabel, focused ? styles.activeIconLabel : {}]}>Groups</Text>
    </View>
);

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
);

const GroupsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GroupsScreen" component={GroupsScreen} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopColor: theme.colors.border,
                        height: 70,
                        paddingBottom: 10,
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
                    }}
                />
                <Tab.Screen
                    name="Groups"
                    component={GroupsStack}
                    options={{
                        tabBarIcon: ({ focused }) => <GroupsIcon focused={focused} />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    activeIcon: {
        backgroundColor: theme.colors.primary,
    },
    iconText: {
        ...theme.fonts.bold,
        fontSize: theme.sizes.md,
        color: theme.colors.textLight,
    },
    activeIconText: {
        color: theme.colors.surface,
    },
    iconLabel: {
        ...theme.fonts.regular,
        fontSize: theme.sizes.xxs,
        color: theme.colors.textLight,
    },
    activeIconLabel: {
        ...theme.fonts.medium,
        color: theme.colors.primary,
    },
});

export default AppNavigator;
