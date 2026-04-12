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

// Create study_planner database user
db.getSiblingDB('study_planner').createUser({
  user: 'studyuser',
  pwd: 'studypassword',
  roles: [{ role: 'readWrite', db: 'study_planner' }]
});

print("Initialization complete");