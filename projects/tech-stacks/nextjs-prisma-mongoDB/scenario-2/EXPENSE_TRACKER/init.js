// Initialize replica set
rs.initiate({
  _id: 'rs0',
  members: [{
    _id: 0,
    host: 'mongodb:27017'
  }]
});

// Create admin user
db.getSiblingDB('admin').createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{ role: 'root', db: 'admin' }]
});

// Create expense_tracker database user
db.getSiblingDB('expense_tracker').createUser({
  user: 'expenseuser',
  pwd: 'expensepassword',
  roles: [{ role: 'readWrite', db: 'expense_tracker' }]
});