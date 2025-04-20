// User model definition
// todo: connect this to a database and save there
interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

const users: User[] = [];

const UserModel = {
  findByCredentials: (email: string, password: string) => {
    return users.find(user => user.email === email && user.password === password);
  },
  
  exists: (username: string, email: string) => {
    return users.some(user => user.username === username || user.email === email);
  },
  
  create: (username: string, email: string, password: string) => {
    const newUser = {
      _id: Date.now().toString(),
      username,
      email,
        password, // i will do hashing later!
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    return newUser;
  }
};

export { User, UserModel };