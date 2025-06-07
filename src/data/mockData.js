// Mock data for the app

export const USERS = [
    { id: '1', name: 'You', email: 'you@example.com', avatar: null },
    { id: '2', name: 'Alex Smith', email: 'alex@example.com', avatar: null },
    { id: '3', name: 'Jordan Lee', email: 'jordan@example.com', avatar: null },
    { id: '4', name: 'Taylor Wong', email: 'taylor@example.com', avatar: null },
    { id: '5', name: 'Jamie Garcia', email: 'jamie@example.com', avatar: null },
];

export const GROUPS = [
    {
        id: '1',
        name: 'Apartment',
        members: ['1', '2', '3'],
        expenses: ['1', '2', '5'],
        createdAt: '2025-05-01T12:00:00Z',
    },
    {
        id: '2',
        name: 'Trip to Hawaii',
        members: ['1', '4', '5'],
        expenses: ['3', '4'],
        createdAt: '2025-05-15T12:00:00Z',
    },
    {
        id: '3',
        name: 'Dinner Club',
        members: ['1', '2', '3', '4', '5'],
        expenses: ['6'],
        createdAt: '2025-06-01T12:00:00Z',
    },
];

export const EXPENSES = [
    {
        id: '1',
        groupId: '1',
        description: 'Groceries',
        amount: 89.97,
        paidBy: '1',
        splitBetween: ['1', '2', '3'],
        splitType: 'equal',
        date: '2025-05-25T14:30:00Z',
    },
    {
        id: '2',
        groupId: '1',
        description: 'Electricity Bill',
        amount: 124.35,
        paidBy: '2',
        splitBetween: ['1', '2', '3'],
        splitType: 'equal',
        date: '2025-05-27T09:15:00Z',
    },
    {
        id: '3',
        groupId: '2',
        description: 'Hotel Booking',
        amount: 956.80,
        paidBy: '4',
        splitBetween: ['1', '4', '5'],
        splitType: 'equal',
        date: '2025-05-20T11:45:00Z',
    },
    {
        id: '4',
        groupId: '2',
        description: 'Rental Car',
        amount: 245.50,
        paidBy: '1',
        splitBetween: ['1', '4', '5'],
        splitType: 'equal',
        date: '2025-05-21T16:20:00Z',
    },
    {
        id: '5',
        groupId: '1',
        description: 'Internet Bill',
        amount: 59.99,
        paidBy: '3',
        splitBetween: ['1', '2', '3'],
        splitType: 'equal',
        date: '2025-06-01T10:00:00Z',
    },
    {
        id: '6',
        groupId: '3',
        description: 'Dinner at Luigi\'s',
        amount: 187.45,
        paidBy: '5',
        splitBetween: ['1', '2', '3', '4', '5'],
        splitType: 'equal',
        date: '2025-06-05T19:30:00Z',
    },
];

// Helper function to calculate balances between users
export const calculateBalances = () => {
    const balances = {};

    // Initialize balances for all users
    USERS.forEach(user => {
        balances[user.id] = { total: 0, owes: {}, owed: {} };
    });

    // Calculate balances based on expenses
    EXPENSES.forEach(expense => {
        const paidBy = expense.paidBy;
        const splitBetween = expense.splitBetween;
        const splitAmount = expense.amount / splitBetween.length;

        splitBetween.forEach(userId => {
            if (userId === paidBy) return;

            // User owes money to the payer
            if (!balances[userId].owes[paidBy]) {
                balances[userId].owes[paidBy] = 0;
            }
            balances[userId].owes[paidBy] += splitAmount;
            balances[userId].total -= splitAmount;

            // Payer is owed money
            if (!balances[paidBy].owed[userId]) {
                balances[paidBy].owed[userId] = 0;
            }
            balances[paidBy].owed[userId] += splitAmount;
            balances[paidBy].total += splitAmount;
        });
    });

    return balances;
};

// Get expenses for a specific group
export const getGroupExpenses = (groupId) => {
    return EXPENSES.filter(expense => expense.groupId === groupId);
};

// Get user by ID
export const getUserById = (userId) => {
    return USERS.find(user => user.id === userId);
};

// Get group by ID
export const getGroupById = (groupId) => {
    return GROUPS.find(group => group.id === groupId);
};
