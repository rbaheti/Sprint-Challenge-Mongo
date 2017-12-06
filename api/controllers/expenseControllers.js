const Expense = require('../models/expense');

const expenseCreate = (req, res) => {
  const { amount, description, budget, category } =  req.body;
  const newExpense = new Expense({ amount, description, budget, category });
  newExpense.save(newExpense, (err, savedExpense) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(savedExpense);
  })
};

const getAllexpenses = (req, res) => {
	Expense.find({})
		.then(expenses => {
		  if (expenses.length === 0) throw new Error();
		  res.json(expenses)
		})
    .catch(err => res.status(422).json(err));
};

const expensesAggregatedBy = (req, res) => {
  Expense
    .aggregate([
      { $group: { _id: '$category', total: { $sum: '$ammount' } } },
      { $sort: { total: -1 } },
    ])
    .exec()
    .then(value => res.json(value))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  expenseCreate,
  getAllexpenses,
  expensesAggregatedBy
};