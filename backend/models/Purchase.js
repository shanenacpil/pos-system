const purchases = [];

module.exports = {
  getAll: () => purchases,
  getById: id => purchases.find(p => p.id === id),
  create: data => {
    const purchase = {
      id: Date.now().toString(),
      supplierId: data.supplierId,
      items: data.items || [],
      note: data.note || '',
      createdAt: new Date().toISOString()
    };
    purchases.push(purchase);
    return purchase;
  }
};
