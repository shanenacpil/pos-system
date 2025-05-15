const payments = [];

module.exports = {
  getAll: () => payments,

  getBySaleId: (saleId) =>
    payments.filter(p => p.saleId === saleId),

  create: (data) => {
    const payment = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    payments.push(payment);
    return payment;
  }
};
