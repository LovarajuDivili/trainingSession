const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

const bodyParser = require('./middleware/bodyParser');
bodyParser(app);

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const openingsEventsRoutes = require('./routes/openingsEventsRoutes');
const uploadRoutes = require('./routes/upload');
const logRoutes = require('./routes/logRoutes');   
const accountantRoutes = require("./routes/accountantRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/accountant", accountantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/openings-events', openingsEventsRoutes);

app.use('/api/logs', logRoutes);     
app.use("/api/chat", require("./routes/chatRoutes"));


app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoURI = process.env.MONGOURI;

if (!mongoURI) {
  console.error('MONGOURI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
