const sales = [];

module.exports = {
  getAll: () => sales,

  getById: (id) => sales.find(s => s.id === id),

  create: (data) => {
    const id = Date.now().toString();
    const newSale = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    sales.push(newSale);
    return newSale;
  },

  update: (id, data) => {
    const index = sales.findIndex(s => s.id === id);
    if (index === -1) return null;
    sales[index] = { ...sales[index], ...data };
    return sales[index];
  },

  delete: (id) => {
    const index = sales.findIndex(s => s.id === id);
    if (index === -1) return false;
    sales.splice(index, 1);
    return true;
  }
};

