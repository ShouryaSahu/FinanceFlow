import { useEffect, useState } from "react";

const getInitialForm = () => ({
  title: "",
  description: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().slice(0, 10),
});

function TransactionForm({
  onSubmit,
  editingTransaction,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState(getInitialForm);
  const [error, setError] = useState("");

  // Load existing transaction when editing
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title || "",
        description: editingTransaction.description || "",
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date.slice(0, 10),
      });
    } else {
      setForm(getInitialForm());
    }

    setError("");
  }, [editingTransaction]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.amount ||
      !form.category ||
      !form.date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!["income", "expense"].includes(form.type)) {
      setError("Please select a valid transaction type.");
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      amount,
      type: form.type,
      category: form.category,
      date: new Date(
        `${form.date}T00:00:00.000Z`
      ).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Transaction Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Groceries"
          maxLength={255}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter transaction details"
          maxLength={1000}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Amount
        </label>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Type */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Type
        </label>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Category
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Date
        </label>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : editingTransaction
              ? "Update Transaction"
              : "Add Transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;