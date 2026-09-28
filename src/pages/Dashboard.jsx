import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";

import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction";

function Dashboard() {
  const { user, logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch transactions
  useEffect(() => {
    let ignore = false;

    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTransactions(user.$id);

        if (!ignore) {
          setTransactions(response.rows);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load transactions.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (user?.$id) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [user?.$id]);

  // Calculate totals
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Currency formatter
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  // Add or update transaction
  const handleSave = async (transaction) => {
    setSaving(true);
    setError("");

    try {
      if (editingTransaction) {
        const updated = await updateTransaction(
          editingTransaction.$id,
          transaction
        );

        setTransactions((previous) =>
          previous.map((item) =>
            item.$id === updated.$id ? updated : item
          )
        );
      } else {
        const created = await addTransaction(
          transaction,
          user.$id
        );

        setTransactions((previous) => [
          created,
          ...previous,
        ]);
      }

      setEditingTransaction(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  // Delete transaction
  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteTransaction(transactionId);

      setTransactions((previous) =>
        previous.filter((item) => item.$id !== transactionId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete transaction.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError(err.message || "Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between bg-white px-4 py-4 shadow-sm sm:px-6">
        <h1 className="text-2xl font-bold text-blue-600">
          FinanceFlow
        </h1>

        <div className="flex items-center gap-3">
          <span className="hidden text-gray-700 sm:block">
            Welcome, {user?.name}
          </span>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="mt-1 text-gray-500">
              Manage your income and expenses.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Add Transaction
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-blue-600 p-6 text-white shadow">
            <p className="text-sm text-blue-100">Total Balance</p>
            <h3 className="mt-3 text-3xl font-bold">
              {formatCurrency(balance)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Income</p>
            <h3 className="mt-3 text-3xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h3 className="mt-3 text-3xl font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </h3>
          </div>
        </div>

        {/* Transaction form */}
        {showForm && (
          <section className="mt-8 rounded-xl bg-white p-6 shadow">
            <h3 className="mb-5 text-xl font-bold text-gray-800">
              {editingTransaction
                ? "Edit Transaction"
                : "Add Transaction"}
            </h3>

            <TransactionForm
              onSubmit={handleSave}
              editingTransaction={editingTransaction}
              onCancel={handleCancel}
              loading={saving}
            />
          </section>
        )}

        {/* Transaction list */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="mb-5 text-xl font-bold text-gray-800">
            Recent Transactions
          </h3>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading transactions...
            </p>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No transactions found. Add your first transaction.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((item) => (
                    <tr
                      key={item.$id}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 font-medium text-gray-800">
                        {item.title}
                      </td>

                      <td className="py-4 text-gray-500">
                        {item.category}
                      </td>

                      <td className="py-4 text-gray-500">
                        {item.date.slice(0, 10)}
                      </td>

                      <td
                        className={`py-4 text-right font-semibold ${
                          item.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {formatCurrency(Number(item.amount))}
                      </td>

                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-md bg-yellow-100 px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.$id)}
                            className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;