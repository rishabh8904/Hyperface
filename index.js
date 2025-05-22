const express = require('express');
const app = express();
const port = 5000;

const transactions = [];

app.use(express.json());  

// Transaction schema
class Transaction {
    constructor(id, amount, type, category) {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new Error('id is required and must be a non-empty string');
        }

        if (typeof amount !== 'number' || amount < 0) {
            throw new Error('amount is required and must be a non-negative number');
        }

        this.id = id.trim();  
        this.amount = amount;
        this.category = category;
        this.type = type;
        this.createdAt = new Date();  
    }
}


app.get('/', (req, res) => {
    res.send('Welcome to the Transaction API!');
});


app.post('/transactions', (req, res) => {
    try {
        const { id, amount, type, category } = req.body; // Include all properties
        const transaction = new Transaction(id, amount, type, category);
        transactions.push(transaction);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Fetch all transactions
app.get('/transactions', (req, res) => {
    res.json(transactions);
});

// Fetch a particular transaction
app.get('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
});

// Update transaction
app.put('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({ error: 'Amount must be a non-negative number' });
    }

    transaction.amount = amount;  
    res.json(transaction);
});

// Delete transaction
app.delete('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const index = transactions.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    transactions.splice(index, 1);  
    res.status(204).send();  
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
