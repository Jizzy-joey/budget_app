import { useState, useEffect } from "react";
import "./App.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  // STATES
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("₦");

  const [showSidebar, setShowSidebar] = useState(false);
  const [theme, setTheme] = useState("#007bff");

  // ✅ LOAD DATA
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const savedIncome = localStorage.getItem("income");
    const savedTheme = localStorage.getItem("theme");

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIncome) setIncome(Number(savedIncome));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // ✅ SAVE DATA
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("income", income);
  }, [income]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ADD EXPENSE
  const addExpense = () => {
    if (!name || !amount) return alert("Fill all fields");

    setExpenses([...expenses, { name, amount: Number(amount) }]);
    setName("");
    setAmount("");
  };

  // TOTALS
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remaining = income ? income - totalSpent : 0;

  // HIGHEST EXPENSE
  const highestExpense = () => {
    if (expenses.length === 0) return null;
    return expenses.reduce((max, curr) =>
      curr.amount > max.amount ? curr : max
    );
  };

  // ADVICE
  const getAdvice = () => {
    if (!income || expenses.length === 0) return [];

    const messages = [];
    const highest = highestExpense();

    if (highest) {
      messages.push(
        `⚠️ Highest spending: ${highest.name} (${currency}${highest.amount})`
      );
    }

    if (remaining < 0) {
      messages.push("❌ You are overspending!");
    } else if (remaining < income * 0.2) {
      messages.push("⚠️ Low remaining balance. Reduce spending.");
    } else {
      messages.push("✅ Your spending looks good.");
    }

    return messages;
  };

  // CHART
  const chartData = {
    labels: expenses.map((e) => e.name),
    datasets: [
      {
        data: expenses.map((e) => e.amount),
        backgroundColor: expenses.map(
          (_, i) => `hsl(${(i * 60) % 360}, 70%, 60%)`
        )
      }
    ]
  };

  return (
    <div className="app">
      
      {/* MAIN */}
      <div className="container" style={{ borderColor: theme }}>
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>

        <h1 style={{ color: theme }}>💰 Budget Planner</h1>

        {/* 💰 INCOME SECTION */}
        <div className="income-box">
          <h3>Set Your Income</h3>
          <input
            type="number"
            placeholder="Enter Monthly Income"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>

        {/* Currency */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="₦">₦ Naira</option>
          <option value="$">$ Dollar</option>
          <option value="£">£ Pound</option>
          <option value="€">€ Euro</option>
        </select>

        <h3>Add Expense</h3>

        <input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={addExpense}>Add</button>

        <ul>
          {expenses.map((e, i) => (
            <li key={i}>
              {e.name} - {currency}{e.amount}
            </li>
          ))}
        </ul>

        <div className="summary">
          <p>Total: {currency}{totalSpent}</p>
          <p>Remaining: {currency}{remaining}</p>
        </div>

        {highestExpense() && (
          <div className="highlight">
            Biggest: {highestExpense().name} ({currency}{highestExpense().amount})
          </div>
        )}

        <div className="advice">
          {getAdvice().map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>

        {expenses.length > 0 && (
          <div className="chart">
            <Pie data={chartData} />
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${showSidebar ? "open" : ""}`}>
        <h2>⚙️ Settings</h2>

        <h4>🎨 Theme</h4>
        <input
          type="color"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        <h4>💱 Currency</h4>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="₦">₦</option>
          <option value="$">$</option>
          <option value="£">£</option>
          <option value="€">€</option>
        </select>

        <button onClick={() => setShowSidebar(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

export default App;
