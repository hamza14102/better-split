import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    USERS,
    GROUPS as INITIAL_GROUPS,
    EXPENSES as INITIAL_EXPENSES,
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [groups, setGroups] = useState(INITIAL_GROUPS);
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [settlements, setSettlements] = useState([]);

    const addExpense = useCallback((expense) => {
        setExpenses(prev => [...prev, expense]);
        setGroups(prev =>
            prev.map(g =>
                g.id === expense.groupId
                    ? { ...g, expenses: [...g.expenses, expense.id] }
                    : g
            )
        );
    }, []);

    const addGroup = useCallback((group) => {
        setGroups(prev => [...prev, group]);
    }, []);

    const settleDebt = useCallback((fromUserId, toUserId, amount) => {
        setSettlements(prev => [
            ...prev,
            {
                id: String(Date.now()),
                fromUserId,
                toUserId,
                amount,
                date: new Date().toISOString(),
            },
        ]);
    }, []);

    const calculateBalances = useCallback(() => {
        const balances = {};
        USERS.forEach(user => {
            balances[user.id] = { total: 0, owes: {}, owed: {} };
        });

        expenses.forEach(expense => {
            const { paidBy, splitBetween, amount } = expense;
            const splitAmount = amount / splitBetween.length;

            splitBetween.forEach(userId => {
                if (userId === paidBy) return;

                if (!balances[userId].owes[paidBy]) balances[userId].owes[paidBy] = 0;
                balances[userId].owes[paidBy] += splitAmount;
                balances[userId].total -= splitAmount;

                if (!balances[paidBy].owed[userId]) balances[paidBy].owed[userId] = 0;
                balances[paidBy].owed[userId] += splitAmount;
                balances[paidBy].total += splitAmount;
            });
        });

        settlements.forEach(({ fromUserId, toUserId, amount }) => {
            if (balances[fromUserId].owes[toUserId] !== undefined) {
                balances[fromUserId].owes[toUserId] -= amount;
                balances[fromUserId].total += amount;
                if (balances[fromUserId].owes[toUserId] <= 0.005) {
                    delete balances[fromUserId].owes[toUserId];
                }
            }
            if (balances[toUserId].owed[fromUserId] !== undefined) {
                balances[toUserId].owed[fromUserId] -= amount;
                balances[toUserId].total -= amount;
                if (balances[toUserId].owed[fromUserId] <= 0.005) {
                    delete balances[toUserId].owed[fromUserId];
                }
            }
        });

        return balances;
    }, [expenses, settlements]);

    const calculateGroupBalances = useCallback((groupId) => {
        const groupExpenses = expenses.filter(e => e.groupId === groupId);
        const group = groups.find(g => g.id === groupId);
        if (!group) return {};

        const balances = {};
        group.members.forEach(uid => {
            balances[uid] = { total: 0, owes: {}, owed: {} };
        });

        groupExpenses.forEach(({ paidBy, splitBetween, amount }) => {
            const splitAmount = amount / splitBetween.length;
            splitBetween.forEach(userId => {
                if (userId === paidBy) return;
                if (!balances[userId]) return;

                if (!balances[userId].owes[paidBy]) balances[userId].owes[paidBy] = 0;
                balances[userId].owes[paidBy] += splitAmount;
                balances[userId].total -= splitAmount;

                if (!balances[paidBy].owed[userId]) balances[paidBy].owed[userId] = 0;
                balances[paidBy].owed[userId] += splitAmount;
                balances[paidBy].total += splitAmount;
            });
        });

        return balances;
    }, [expenses, groups]);

    const getGroupExpenses = useCallback(
        (groupId) => expenses.filter(e => e.groupId === groupId),
        [expenses]
    );

    const getUserById = useCallback(
        (userId) => USERS.find(u => u.id === userId),
        []
    );

    const getGroupById = useCallback(
        (groupId) => groups.find(g => g.id === groupId),
        [groups]
    );

    return (
        <AppContext.Provider
            value={{
                users: USERS,
                groups,
                expenses,
                settlements,
                addExpense,
                addGroup,
                settleDebt,
                calculateBalances,
                calculateGroupBalances,
                getGroupExpenses,
                getUserById,
                getGroupById,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};
