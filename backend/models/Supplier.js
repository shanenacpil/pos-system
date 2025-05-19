const suppliers = [];

module.exports = {
  getAll: () => suppliers,
  getById: id => suppliers.find(s => s.id === id),
  create: data => {
    const supplier = {
      id: data.id || `SUP${Date.now().toString().slice(-5)}`,
      name: data.name,
      contact: data.contact || '',
      address: data.address || ''
    };
    suppliers.push(supplier);
    return supplier;
  },
  update: (id, data) => {
    const i = suppliers.findIndex(s => s.id === id);
    if (i === -1) return null;
    suppliers[i] = { ...suppliers[i], ...data };
    return suppliers[i];
  },
  delete: id => {
    const i = suppliers.findIndex(s => s.id === id);
    if (i === -1) return false;
    suppliers.splice(i, 1);
    return true;
  }
};
