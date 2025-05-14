const products = [];

module.exports = {
  getAll: () => products,

  getById: (id) => products.find(p => p.id === id),

create: (data) => {
  const profit = data.price - data.cost;
  const product = {
    id: Date.now().toString(),
    ...data,
    profit
  };
  products.push(product);
  return product;
},

update: (id, data) => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated = {
    ...products[index],
    ...data,
    profit: (data.price ?? products[index].price) - (data.cost ?? products[index].cost)
  };
  products[index] = updated;
  return updated;
},

  delete: (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }
};

