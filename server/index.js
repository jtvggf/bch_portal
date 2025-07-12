const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const areaRoutes = require('./routes/areas');
const containerRoutes = require('./routes/containers');
const itemRoutes = require('./routes/items');
const groupRoutes = require('./routes/groups');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const itemDefRoutes = require('./routes/itemDefinitions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/item-definitions', itemDefRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/vendors', vendorRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('Server running on port', PORT)))
  .catch(err => console.error(err));
