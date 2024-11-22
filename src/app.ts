import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to express auth service');
});

export default app;
