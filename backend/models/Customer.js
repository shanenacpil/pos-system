const customers = [];

module.exports = {
  getAll: () => customers,

  getById: (id) => customers.find(c => c.id === id),

  create: (data) => {
    const customer = {
      id: data.id || Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      group: data.group || 'retail',
      creditLimit: data.creditLimit || 0,
      balance: data.balance || 0,
      address: data.address || ''
    };
    customers.push(customer);
    return customer;
  },

  update: (id, data) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    customers[index] = { ...customers[index], ...data };
    return customers[index];
  },

  delete: (id) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    customers.splice(index, 1);
    return true;
  }
};
