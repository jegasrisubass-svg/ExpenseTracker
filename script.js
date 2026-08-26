/* =========================================================
   SPENDWISE AI - COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================
   SETTINGS
========================= */

const DAILY_LIMIT = 1000;
const MONTHLY_BUDGET = 20000;


/* =========================
   STORAGE
========================= */

let expenses =
    JSON.parse(
        localStorage.getItem("spendwiseExpenses")
    ) || [];

let chatHistory =
    JSON.parse(
        localStorage.getItem("spendwiseChatHistory")
    ) || [];


/* =========================
   CATEGORY ICONS
========================= */

const categoryIcons = {

    Food: "🍔",

    Transport: "🚕",

    Shopping: "🛍️",

    Bills: "💡",

    Entertainment: "🎬",

    Health: "💊",

    Education: "📚",

    Other: "📦"

};


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setDate();

        setDefaultDate();

        updateDashboard();

        renderExpenses();

        renderAnalytics();

        renderChatHistory();

        checkDailyLimit();

    }
);


/* =========================
   DATE
========================= */

function todayString() {

    const date = new Date();

    return date
        .toISOString()
        .split("T")[0];

}


function setDate() {

    const date = new Date();

    const formatted =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const element =
        document.getElementById("dateText");

    if (element) {

        element.textContent =
            formatted;

    }

}


function setDefaultDate() {

    const input =
        document.getElementById(
            "expenseDate"
        );

    if (input) {

        input.value =
            todayString();

    }

}


/* =========================
   NAVIGATION
========================= */

function showSection(sectionName) {

    document
        .querySelectorAll(".section")
        .forEach(function (section) {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(
            sectionName
        );


    if (section) {

        section.classList.add("active");

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    const indexMap = {

        dashboard: 0,

        expenses: 1,

        analytics: 2,

        chat: 3

    };


    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    const index =
        indexMap[sectionName];


    if (
        index !== undefined &&
        buttons[index]
    ) {

        buttons[index]
            .classList.add("active");

    }


    const titles = {

        dashboard: "Dashboard",

        expenses: "Expense History",

        analytics: "Analytics",

        chat: "AI Assistant"

    };


    const title =
        document.getElementById(
            "pageTitle"
        );


    if (title) {

        title.textContent =
            titles[sectionName];

    }

}


/* =========================
   MODAL
========================= */

function openExpenseModal() {

    const modal =
        document.getElementById(
            "expenseModal"
        );


    if (modal) {

        modal.classList.add("show");

    }


    setDefaultDate();

}


function closeExpenseModal() {

    const modal =
        document.getElementById(
            "expenseModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================
   ADD EXPENSE FORM
========================= */

function addExpense(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("expenseName")
            .value
            .trim();


    const amount =
        Number(
            document
                .getElementById(
                    "expenseAmount"
                )
                .value
        );


    const category =
        document
            .getElementById(
                "expenseCategory"
            )
            .value;


    const date =
        document
            .getElementById(
                "expenseDate"
            )
            .value;


    if (
        !name ||
        !amount ||
        amount <= 0 ||
        !date
    ) {

        showToast(
            "Please enter valid details"
        );

        return;

    }


    expenses.push({

        id:
            Date.now() +
            Math.random(),

        name: name,

        amount: amount,

        category: category,

        date: date

    });


    saveExpenses();


    document
        .getElementById(
            "expenseForm"
        )
        .reset();


    setDefaultDate();

    closeExpenseModal();


    refreshAll();


    showToast(
        formatMoney(amount) +
        " expense added!"
    );

}


/* =========================
   SAVE
========================= */

function saveExpenses() {

    localStorage.setItem(
        "spendwiseExpenses",
        JSON.stringify(expenses)
    );

}


/* =========================
   REFRESH
========================= */

function refreshAll() {

    updateDashboard();

    renderExpenses();

    renderAnalytics();

    checkDailyLimit();

}


/* =========================
   MONEY
========================= */

function formatMoney(amount) {

    return "₹" +
        Number(amount)
            .toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            );

}


/* =========================
   TOTAL
========================= */

function getTotal() {

    return expenses.reduce(
        function (total, expense) {

            return total +
                Number(expense.amount);

        },
        0
    );

}


/* =========================
   TODAY TOTAL
========================= */

function getTodayTotal() {

    const today =
        todayString();


    return expenses
        .filter(function (expense) {

            return expense.date === today;

        })
        .reduce(
            function (total, expense) {

                return total +
                    Number(expense.amount);

            },
            0
        );

}


/* =========================
   MONTH TOTAL
========================= */

function getMonthTotal() {

    const now =
        new Date();


    const month =
        now.getMonth();


    const year =
        now.getFullYear();


    return expenses
        .filter(function (expense) {

            const date =
                new Date(
                    expense.date +
                    "T00:00:00"
                );


            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        })
        .reduce(
            function (total, expense) {

                return total +
                    Number(expense.amount);

            },
            0
        );

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const total =
        getTotal();


    const today =
        getTodayTotal();


    const month =
        getMonthTotal();


    const totalSpent =
        document.getElementById(
            "totalSpent"
        );


    if (totalSpent) {

        totalSpent.textContent =
            formatMoney(total);

    }


    const todaySpent =
        document.getElementById(
            "todaySpent"
        );


    if (todaySpent) {

        todaySpent.textContent =
            formatMoney(today);

    }


    const monthlyBudget =
        document.getElementById(
            "monthlyBudget"
        );


    if (monthlyBudget) {

        monthlyBudget.textContent =
            formatMoney(
                MONTHLY_BUDGET
            );

    }


    const remaining =
        Math.max(
            0,
            MONTHLY_BUDGET - month
        );


    const budgetRemaining =
        document.getElementById(
            "budgetRemaining"
        );


    if (budgetRemaining) {

        budgetRemaining.textContent =
            formatMoney(remaining) +
            " remaining";

    }


    const transactionCount =
        document.getElementById(
            "transactionCount"
        );


    if (transactionCount) {

        transactionCount.textContent =
            expenses.length;

    }


    renderRecentExpenses();

    renderCategorySummary();

}


/* =========================
   RECENT EXPENSES
========================= */

function renderRecentExpenses() {

    const container =
        document.getElementById(
            "recentExpenses"
        );


    if (!container) return;


    const recent =
        [...expenses]
            .sort(function (a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            })
            .slice(0, 5);


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-receipt"></i>
                <br>
                No expenses yet
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent.map(function (expense) {

            return `

                <div class="expense-item">

                    <div class="expense-icon">

                        ${
                            categoryIcons[
                                expense.category
                            ] || "📦"
                        }

                    </div>


                    <div class="expense-info">

                        <b>
                            ${
                                escapeHTML(
                                    expense.name
                                )
                            }
                        </b>

                        <small>

                            ${expense.category}

                            •

                            ${formatDate(
                                expense.date
                            )}

                        </small>

                    </div>


                    <div class="expense-amount">

                        ${
                            formatMoney(
                                expense.amount
                            )
                        }

                    </div>

                </div>

            `;

        })
        .join("");

}


/* =========================
   CATEGORY TOTAL
========================= */

function getCategoryTotals() {

    const totals = {};


    expenses.forEach(
        function (expense) {

            const category =
                expense.category ||
                "Other";


            if (!totals[category]) {

                totals[category] = 0;

            }


            totals[category] +=
                Number(
                    expense.amount
                );

        }
    );


    return totals;

}


/* =========================
   CATEGORY SUMMARY
========================= */

function renderCategorySummary() {

    const container =
        document.getElementById(
            "categorySummary"
        );


    if (!container) return;


    const totals =
        getCategoryTotals();


    const entries =
        Object.entries(totals)
            .sort(function (a, b) {

                return b[1] - a[1];

            })
            .slice(0, 6);


    if (entries.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No category data yet
            </div>
        `;

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                function (item) {

                    return item[1];

                }
            )
        );


    container.innerHTML =
        entries.map(
            function (item) {

                const category =
                    item[0];


                const amount =
                    item[1];


                const percentage =
                    max > 0
                        ? (
                            amount / max
                        ) * 100
                        : 0;


                return `

                    <div class="category-row">

                        <div class="category-top">

                            <span>

                                ${
                                    categoryIcons[
                                        category
                                    ] || "📦"
                                }

                                ${category}

                            </span>


                            <span>

                                ${
                                    formatMoney(
                                        amount
                                    )
                                }

                            </span>

                        </div>


                        <div class="progress">

                            <div
                                style="
                                width:${percentage}%;
                                ">
                            </div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================
   EXPENSE TABLE
========================= */

function renderExpenses() {

    const tbody =
        document.getElementById(
            "expenseTable"
        );


    if (!tbody) return;


    const searchElement =
        document.getElementById(
            "searchExpense"
        );


    const categoryElement =
        document.getElementById(
            "filterCategory"
        );


    const search =
        searchElement
            ? searchElement.value
                .toLowerCase()
                .trim()
            : "";


    const selectedCategory =
        categoryElement
            ? categoryElement.value
            : "all";


    let filtered =
        [...expenses];


    if (search) {

        filtered =
            filtered.filter(
                function (expense) {

                    return (

                        expense.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        expense.category
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    if (
        selectedCategory !==
        "all"
    ) {

        filtered =
            filtered.filter(
                function (expense) {

                    return (
                        expense.category ===
                        selectedCategory
                    );

                }
            );

    }


    filtered.sort(
        function (a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        }
    );


    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty">

                        <i class="
                            fa-solid
                            fa-folder-open
                        "></i>

                        <br>

                        No expenses found

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        filtered.map(
            function (expense) {

                return `

                    <tr>

                        <td>

                            <b>

                                ${
                                    categoryIcons[
                                        expense.category
                                    ] || "📦"
                                }

                                ${
                                    escapeHTML(
                                        expense.name
                                    )
                                }

                            </b>

                        </td>


                        <td>

                            <span
                                class="category-badge">

                                ${
                                    expense.category
                                }

                            </span>

                        </td>


                        <td>

                            <strong>

                                ${
                                    formatMoney(
                                        expense.amount
                                    )
                                }

                            </strong>

                        </td>


                        <td>

                            ${
                                formatDate(
                                    expense.date
                                )
                            }

                        </td>


                        <td>

                            <button
                                class="delete-btn"
                                onclick="
                                deleteExpense(
                                    ${expense.id}
                                )">

                                <i class="
                                    fa-solid
                                    fa-trash
                                "></i>

                            </button>

                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


/* =========================
   DELETE EXPENSE
========================= */

function deleteExpense(id) {

    const expense =
        expenses.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!expense) return;


    const answer =
        confirm(
            "Delete " +
            expense.name +
            " - " +
            formatMoney(
                expense.amount
            ) +
            "?"
        );


    if (!answer) return;


    expenses =
        expenses.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveExpenses();

    refreshAll();

    showToast(
        "Expense deleted"
    );

}


/* =========================
   ANALYTICS
========================= */

function renderAnalytics() {

    const totals =
        getCategoryTotals();


    const entries =
        Object.entries(totals)
            .sort(function (a, b) {

                return b[1] - a[1];

            });


    const highest =
        entries.length > 0
            ? entries[0][0]
            : "—";


    const average =
        expenses.length > 0
            ? getTotal() /
              expenses.length
            : 0;


    const biggest =
        expenses.length > 0
            ? Math.max(
                ...expenses.map(
                    function (expense) {

                        return Number(
                            expense.amount
                        );

                    }
                )
              )
            : 0;


    const highestElement =
        document.getElementById(
            "highestCategory"
        );


    if (highestElement) {

        highestElement.textContent =
            highest;

    }


    const averageElement =
        document.getElementById(
            "averageExpense"
        );


    if (averageElement) {

        averageElement.textContent =
            formatMoney(average);

    }


    const biggestElement =
        document.getElementById(
            "biggestExpense"
        );


    if (biggestElement) {

        biggestElement.textContent =
            formatMoney(biggest);

    }


    renderChart(entries);

}


/* =========================
   CHART
========================= */

function renderChart(entries) {

    const chart =
        document.getElementById(
            "chart"
        );


    if (!chart) return;


    if (entries.length === 0) {

        chart.innerHTML = `

            <div class="empty">

                <i class="
                    fa-solid
                    fa-chart-column
                "></i>

                <br>

                Add expenses to see analytics

            </div>

        `;

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                function (item) {

                    return item[1];

                }
            )
        );


    chart.innerHTML =
        entries.map(
            function (item) {

                const category =
                    item[0];


                const amount =
                    item[1];


                const width =
                    max > 0
                        ? (
                            amount / max
                        ) * 100
                        : 0;


                return `

                    <div class="chart-row">

                        <div class="chart-name">

                            ${
                                categoryIcons[
                                    category
                                ] || "📦"
                            }

                            ${category}

                        </div>


                        <div class="chart-bar">

                            <div
                                class="chart-fill"
                                style="
                                width:${width}%;
                                ">
                            </div>

                        </div>


                        <div class="chart-value">

                            ${
                                formatMoney(
                                    amount
                                )
                            }

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================
   DAILY LIMIT
========================= */

function checkDailyLimit() {

    const todayAmount =
        getTodayTotal();


    const alert =
        document.getElementById(
            "budgetAlert"
        );


    if (!alert) return;


    if (
        todayAmount >=
        DAILY_LIMIT
    ) {

        alert.classList.remove(
            "hidden"
        );

    } else {

        alert.classList.add(
            "hidden"
        );

    }

}


function closeAlert() {

    const alert =
        document.getElementById(
            "budgetAlert"
        );


    if (alert) {

        alert.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   CHAT
   ========================================================= */


/* =========================
   ENTER KEY
========================= */

function handleChatKey(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

}


/* =========================
   QUICK CHAT
========================= */

function quickChat(message) {

    const input =
        document.getElementById(
            "chatInput"
        );


    if (!input) return;


    input.value =
        message;


    sendMessage();

}


/* =========================
   SEND MESSAGE
========================= */

function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );


    if (!input) return;


    const text =
        input.value.trim();


    if (!text) return;


    addChatMessage(
        text,
        "user"
    );


    saveChatHistory(
        text,
        "user"
    );


    input.value = "";


    setTimeout(
        function () {

            const response =
                processChat(text);


            addChatMessage(
                response,
                "bot"
            );


            saveChatHistory(
                response,
                "bot"
            );


            renderChatHistory();

            refreshAll();

        },
        250
    );

}


/* =========================
   ADD CHAT MESSAGE
========================= */

function addChatMessage(
    text,
    sender
) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    if (!container) return;


    const message =
        document.createElement(
            "div"
        );


    message.className =
        "message " +
        sender;


    const avatar =
        sender === "bot"
            ? "🤖"
            : "👤";


    message.innerHTML = `

        <div class="message-avatar">

            ${avatar}

        </div>


        <div class="bubble">

            ${
                sender === "bot"
                    ? text
                    : escapeHTML(text)
            }

        </div>

    `;


    container.appendChild(
        message
    );


    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   MAIN CHAT AI
   ========================================================= */

function processChat(input) {

    const text =
        input
            .toLowerCase()
            .trim();


    /* =====================================================
       MULTIPLE EXPENSES
       Example:

       I spent ₹250 for lunch
       I spent ₹100 for bus
       I spent ₹500 for shopping
       ===================================================== */


    const multiplePattern =
        /(?:i\s+)?spent\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:for|on)\s+([^,.]+?)(?=\s+(?:i\s+)?spent\s|$)/gi;


    const matches =
        [
            ...text.matchAll(
                multiplePattern
            )
        ];


    if (matches.length > 0) {

        let addedExpenses = [];

        let addedTotal = 0;


        matches.forEach(
            function (match) {

                const amount =
                    Number(
                        match[1]
                    );


                const item =
                    match[2]
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );


                if (
                    !amount ||
                    amount <= 0
                ) {
                    return;
                }


                const category =
                    detectCategory(
                        item
                    );


                const name =
                    cleanExpenseName(
                        item,
                        category
                    );


                expenses.push({

                    id:
                        Date.now() +
                        Math.random(),

                    name: name,

                    amount: amount,

                    category: category,

                    date: todayString()

                });


                addedExpenses.push({

                    name: name,

                    amount: amount,

                    category: category

                });


                addedTotal +=
                    amount;

            }
        );


        if (
            addedExpenses.length >
            0
        ) {

            saveExpenses();


            let response = `

                ✅ <b>
                    ${addedExpenses.length}
                    expenses added!
                </b>

                <br><br>

            `;


            addedExpenses.forEach(
                function (expense) {

                    response += `

                        ${
                            categoryIcons[
                                expense.category
                            ] || "📦"
                        }

                        ${
                            escapeHTML(
                                expense.name
                            )
                        }

                        —

                        <b>
                            ${
                                formatMoney(
                                    expense.amount
                                )
                            }
                        </b>

                        <br>

                    `;

                }
            );


            response += `

                <br>

                💰 <b>
                    Added Total:
                </b>

                ${
                    formatMoney(
                        addedTotal
                    )
                }

            `;


            const todayTotal =
                getTodayTotal();


            if (
                todayTotal >=
                DAILY_LIMIT
            ) {

                response += `

                    <br><br>

                    🚨 <b>
                        Daily Spending Alert!
                    </b>

                    <br>

                    Today's spending is

                    <b>
                        ${
                            formatMoney(
                                todayTotal
                            )
                        }
                    </b>

                    <br>

                    You crossed the
                    ₹1,000 daily limit.

                `;

            }


            return response;

        }

    }


    /* =====================================================
       TAMIL / TANGLISH MULTIPLE EXPENSES

       Example:

       Naan lunch ku 250 spend pannen
       bus ku 100 spend pannen
       ===================================================== */


    const tamilPattern =
        /(?:naan\s+)?(.+?)\s+(?:ku|kku|க்கு)\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:spend|spent|pannen|panniten|செலவு)/gi;


    const tamilMatches =
        [
            ...text.matchAll(
                tamilPattern
            )
        ];


    if (
        tamilMatches.length >
        0
    ) {

        let added = [];

        let totalAdded = 0;


        tamilMatches.forEach(
            function (match) {

                const item =
                    match[1]
                        .trim();


                const amount =
                    Number(
                        match[2]
                    );


                if (
                    !amount ||
                    amount <= 0
                ) {
                    return;
                }


                const category =
                    detectCategory(
                        item
                    );


                const name =
                    cleanExpenseName(
                        item,
                        category
                    );


                expenses.push({

                    id:
                        Date.now() +
                        Math.random(),

                    name: name,

                    amount: amount,

                    category: category,

                    date: todayString()

                });


                added.push({

                    name: name,

                    amount: amount,

                    category: category

                });


                totalAdded +=
                    amount;

            }
        );


        if (added.length > 0) {

            saveExpenses();


            let response = `

                ✅ <b>
                    ${added.length}
                    expenses added!
                </b>

                <br><br>

            `;


            added.forEach(
                function (expense) {

                    response += `

                        ${
                            categoryIcons[
                                expense.category
                            ] || "📦"
                        }

                        ${
                            escapeHTML(
                                expense.name
                            )
                        }

                        —

                        <b>
                            ${
                                formatMoney(
                                    expense.amount
                                )
                            }
                        </b>

                        <br>

                    `;

                }
            );


            response += `

                <br>

                💰 <b>
                    Added Total:
                </b>

                ${
                    formatMoney(
                        totalAdded
                    )
                }

            `;


            if (
                getTodayTotal() >=
                DAILY_LIMIT
            ) {

                response += `

                    <br><br>

                    🚨 <b>
                        Daily Limit Crossed!
                    </b>

                `;

            }


            return response;

        }

    }


    /* =====================================================
       TODAY
       ===================================================== */

    if (

        text.includes("today") ||

        text.includes("today expense") ||

        text.includes("today spending") ||

        text.includes("spent today") ||

        text.includes(
            "calculate today"
        ) ||

        text.includes(
            "today total"
        ) ||

        text.includes(
            "innaiku"
        ) ||

        text.includes(
            "இன்று"
        )

    ) {

        const today =
            getTodayTotal();


        if (today === 0) {

            return `

                📅 <b>
                    Today's Spending
                </b>

                <br><br>

                No expense recorded
                today.

                <br><br>

                Try:

                <br>

                "I spent ₹200 for food"

            `;

        }


        const remaining =
            Math.max(
                0,
                DAILY_LIMIT - today
            );


        let response = `

            📅 <b>
                Today's Spending
            </b>

            <br><br>

            💰 Total spent:

            <b>
                ${
                    formatMoney(
                        today
                    )
                }
            </b>

            <br>

            🎯 Daily limit:

            ${
                formatMoney(
                    DAILY_LIMIT
                )
            }

        `;


        if (
            today >=
            DAILY_LIMIT
        ) {

            response += `

                <br><br>

                🚨 <b>
                    Alert!
                </b>

                <br>

                You crossed today's
                ₹1,000 limit.

            `;

        } else {

            response += `

                <br><br>

                💚 Remaining:

                <b>
                    ${
                        formatMoney(
                            remaining
                        )
                    }
                </b>

            `;

        }


        return response;

    }


    /* =====================================================
       TOTAL
       ===================================================== */

    if (

        text.includes(
            "total"
        ) ||

        text.includes(
            "how much i spent"
        ) ||

        text.includes(
            "how much have i spent"
        ) ||

        text.includes(
            "calculate the total"
        ) ||

        text.includes(
            "calculate total"
        ) ||

        text.includes(
            "overall spending"
        ) ||

        text.includes(
            "overall total"
        ) ||

        text.includes(
            "mothama"
        ) ||

        text.includes(
            "மொத்தம்"
        )

    ) {

        const total =
            getTotal();


        return `

            💰 <b>
                Total Spending
            </b>

            <br><br>

            You have spent:

            <b>
                ${
                    formatMoney(
                        total
                    )
                }
            </b>

            <br><br>

            📊 Transactions:

            <b>
                ${expenses.length}
            </b>

        `;

    }


    /* =====================================================
       HISTORY
       ===================================================== */

    if (

        text.includes(
            "history"
        ) ||

        text.includes(
            "show history"
        ) ||

        text.includes(
            "expense history"
        ) ||

        text.includes(
            "show expenses"
        ) ||

        text.includes(
            "list expenses"
        ) ||

        text.includes(
            "my expenses"
        ) ||

        text.includes(
            "வரலாறு"
        )

    ) {

        if (
            expenses.length ===
            0
        ) {

            return `

                📜 <b>
                    Expense History
                </b>

                <br><br>

                No expenses recorded yet.

            `;

        }


        const latest =
            [...expenses]
                .sort(
                    function (a, b) {

                        return (
                            new Date(
                                b.date
                            ) -

                            new Date(
                                a.date
                            )
                        );

                    }
                )
                .slice(0, 15);


        let response = `

            📜 <b>
                Recent Expense History
            </b>

            <br><br>

        `;


        latest.forEach(
            function (expense, index) {

                response += `

                    ${index + 1}.

                    ${
                        categoryIcons[
                            expense.category
                        ] || "📦"
                    }

                    ${
                        escapeHTML(
                            expense.name
                        )
                    }

                    —

                    <b>
                        ${
                            formatMoney(
                                expense.amount
                            )
                        }
                    </b>

                    <br>

                    <small>
                        ${
                            formatDate(
                                expense.date
                            )
                        }
                    </small>

                    <br><br>

                `;

            }
        );


        response += `

            💰 <b>
                Total:
            </b>

            ${
                formatMoney(
                    getTotal()
                )
            }

        `;


        return response;

    }


    /* =====================================================
       CATEGORY QUERY
       ===================================================== */

    const category =
        detectCategory(
            text
        );


    const categoryKeywords = [

        "food",

        "lunch",

        "dinner",

        "breakfast",

        "coffee",

        "tea",

        "snack",

        "groceries",

        "grocery",

        "shopping",

        "dress",

        "clothes",

        "transport",

        "bus",

        "train",

        "auto",

        "petrol",

        "fuel",

        "travel",

        "movie",

        "cinema",

        "entertainment",

        "bill",

        "bills",

        "electricity",

        "wifi",

        "recharge",

        "rent",

        "medicine",

        "doctor",

        "hospital",

        "health",

        "education",

        "college",

        "book"

    ];


    const categoryQuestion =
        categoryKeywords.some(
            function (word) {

                return text.includes(
                    word
                );

            }
        );


    if (
        categoryQuestion &&
        (
            text.includes("how much") ||
            text.includes("spent") ||
            text.includes("spending") ||
            text.includes("total") ||
            text.includes("amount")
        )
    ) {

        const categoryTotal =
            expenses
                .filter(
                    function (expense) {

                        return (
                            expense.category ===
                            category
                        );

                    }
                )
                .reduce(
                    function (
                        total,
                        expense
                    ) {

                        return (
                            total +
                            Number(
                                expense.amount
                            )
                        );

                    },
                    0
                );


        return `

            ${
                categoryIcons[
                    category
                ] || "📦"
            }

            <b>
                ${category}
                Spending
            </b>

            <br><br>

            You have spent:

            <b>
                ${
                    formatMoney(
                        categoryTotal
                    )
                }
            </b>

        `;

    }


    /* =====================================================
       SAVING TIP
       ===================================================== */

    if (

        text.includes(
            "saving tip"
        ) ||

        text.includes(
            "saving"
        ) ||

        text.includes(
            "save money"
        ) ||

        text.includes(
            "save panna"
        ) ||

        text.includes(
            "saving advice"
        ) ||

        text.includes(
            "tips"
        ) ||

        text.includes(
            "tip"
        )

    ) {

        return getSavingTip();

    }


    /* =====================================================
       GREETING
       ===================================================== */

    if (

        text === "hi" ||

        text === "hello" ||

        text === "hey" ||

        text.includes(
            "vanakkam"
        ) ||

        text.includes(
            "வணக்கம்"
        )

    ) {

        return `

            👋 <b>
                Vanakkam!
            </b>

            <br><br>

            Welcome to
            <b>
                SpendWise AI
            </b>
            💰

            <br><br>

            Naan unga expense
            manage panna help
            pannuren.

            <br><br>

            <b>
                Try:
            </b>

            <br>

            💰 "I spent ₹250 for food"

            <br>

            📅 "Calculate today's spending"

            <br>

            📊 "How much I spent?"

            <br>

            📜 "Show history"

            <br>

            💡 "Give saving tip"

        `;

    }


    /* =====================================================
       HELP
       ===================================================== */

    if (

        text.includes(
            "help"
        ) ||

        text.includes(
            "what can you do"
        ) ||

        text.includes(
            "enna panna"
        ) ||

        text.includes(
            "what can i ask"
        )

    ) {

        return `

            🤖 <b>
                SpendWise AI can help you with:
            </b>

            <br><br>

            💰 Add expenses

            <br>

            📅 Calculate today's spending

            <br>

            📊 Calculate total spending

            <br>

            📜 Show expense history

            <br>

            🏷️ Check category spending

            <br>

            💡 Give saving tips

            <br>

            🚨 Daily ₹1,000 alert

        `;

    }


    /* =====================================================
       UNKNOWN
       ===================================================== */

    return `

        🤔 <b>
            I couldn't understand that.
        </b>

        <br><br>

        Try saying:

        <br><br>

        💰
        <b>
            I spent ₹300 for food
        </b>

        <br>

        📅
        <b>
            Calculate today's spending
        </b>

        <br>

        📊
        <b>
            How much I spent?
        </b>

        <br>

        📜
        <b>
            Show history
        </b>

        <br>

        💡
        <b>
            Give me saving tip
        </b>

    `;

}


/* =========================================================
   CATEGORY DETECTION
========================================================= */

function detectCategory(text) {

    const value =
        text
            .toLowerCase()
            .trim();


    if (

        value.includes("food") ||

        value.includes("lunch") ||

        value.includes("dinner") ||

        value.includes("breakfast") ||

        value.includes("coffee") ||

        value.includes("tea") ||

        value.includes("snack") ||

        value.includes("grocery") ||

        value.includes("groceries") ||

        value.includes("restaurant") ||

        value.includes("hotel") ||

        value.includes("saapadu") ||

        value.includes("sapadu") ||

        value.includes("சாப்பாடு")

    ) {

        return "Food";

    }


    if (

        value.includes("bus") ||

        value.includes("train") ||

        value.includes("auto") ||

        value.includes("uber") ||

        value.includes("ola") ||

        value.includes("taxi") ||

        value.includes("petrol") ||

        value.includes("fuel") ||

        value.includes("transport") ||

        value.includes("travel")

    ) {

        return "Transport";

    }


    if (

        value.includes("shopping") ||

        value.includes("dress") ||

        value.includes("clothes") ||

        value.includes("cloth") ||

        value.includes("shoe") ||

        value.includes("shoes") ||

        value.includes("amazon") ||

        value.includes("flipkart")

    ) {

        return "Shopping";

    }


    if (

        value.includes("bill") ||

        value.includes("bills") ||

        value.includes("electricity") ||

        value.includes("current") ||

        value.includes("wifi") ||

        value.includes("internet") ||

        value.includes("recharge") ||

        value.includes("rent")

    ) {

        return "Bills";

    }


    if (

        value.includes("movie") ||

        value.includes("cinema") ||

        value.includes("game") ||

        value.includes("netflix") ||

        value.includes("spotify") ||

        value.includes("entertainment")

    ) {

        return "Entertainment";

    }


    if (

        value.includes("medicine") ||

        value.includes("doctor") ||

        value.includes("hospital") ||

        value.includes("medical") ||

        value.includes("health")

    ) {

        return "Health";

    }


    if (

        value.includes("college") ||

        value.includes("book") ||

        value.includes("books") ||

        value.includes("course") ||

        value.includes("education") ||

        value.includes("fees") ||

        value.includes("study")

    ) {

        return "Education";

    }


    return "Other";

}


/* =========================================================
   EXPENSE NAME
========================================================= */

function cleanExpenseName(
    item,
    category
) {

    let name =
        item
            .trim()
            .replace(
                /\s+/g,
                " "
            );


    name =
        name
            .replace(
                /\bfor\b/gi,
                ""
            )
            .replace(
                /\bon\b/gi,
                ""
            )
            .trim();


    if (
        !name ||
        name.length < 2
    ) {

        return (
            category +
            " Expense"
        );

    }


    return (
        name.charAt(0)
            .toUpperCase() +
        name.slice(1)
    );

}


/* =========================================================
   SAVING TIP
========================================================= */

function getSavingTip() {

    const tips = [

        `
            💡 <b>
                Smart Saving Tip
            </b>

            <br><br>

            Small ₹50–₹100 expenses
            daily can become
            ₹1,500–₹3,000 per month.

            <br><br>

            Track small expenses
            carefully.
        `,


        `
            💡 <b>
                Food Saving Tip
            </b>

            <br><br>

            Food delivery expenses
            can increase quickly.

            <br><br>

            Try setting a weekly
            food budget.
        `,


        `
            💡 <b>
                Shopping Tip
            </b>

            <br><br>

            Before buying something
            expensive, wait 24 hours.

            <br><br>

            If you still need it,
            then buy it.
        `,


        `
            💡 <b>
                Daily Budget Tip
            </b>

            <br><br>

            Try to stay below your
            daily spending limit.

            <br><br>

            Don't wait until you
            reach ₹1,000.
        `

    ];


    return tips[
        Math.floor(
            Math.random() *
            tips.length
        )
    ];

}


/* =========================================================
   CHAT HISTORY SAVE
========================================================= */

function saveChatHistory(
    message,
    sender
) {

    chatHistory.push({

        message: message,

        sender: sender,

        time:
            new Date()
                .toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

    });


    if (
        chatHistory.length >
        100
    ) {

        chatHistory =
            chatHistory.slice(-100);

    }


    localStorage.setItem(
        "spendwiseChatHistory",
        JSON.stringify(
            chatHistory
        )
    );

}


/* =========================================================
   CHAT HISTORY DISPLAY
========================================================= */

function renderChatHistory() {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!container) return;


    const messages =
        chatHistory
            .filter(
                function (item) {

                    return (
                        item.sender ===
                        "user"
                    );

                }
            )
            .slice(-20)
            .reverse();


    if (messages.length === 0) {

        container.innerHTML = `

            <div class="empty">

                No chat history

            </div>

        `;

        return;

    }


    container.innerHTML =
        messages.map(
            function (item) {

                return `

                    <div class="history-item">

                        <b>
                            ${
                                escapeHTML(
                                    item.message
                                )
                            }
                        </b>

                        <span>
                            ${item.time}
                        </span>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   CLEAR CHAT
========================================================= */

function clearChat() {

    const answer =
        confirm(
            "Clear all chat history?"
        );


    if (!answer) return;


    chatHistory = [];


    localStorage.removeItem(
        "spendwiseChatHistory"
    );


    const container =
        document.getElementById(
            "chatMessages"
        );


    if (container) {

        container.innerHTML = `

            <div class="message bot">

                <div class="message-avatar">
                    🤖
                </div>

                <div class="bubble">

                    <b>
                        Chat cleared! 👋
                    </b>

                    <br><br>

                    New conversation
                    start pannalam.

                </div>

            </div>

        `;

    }


    renderChatHistory();

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) return "";


    const d =
        new Date(
            date +
            "T00:00:00"
        );


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.spendWiseToast
    );


    window.spendWiseToast =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   MODAL BACKDROP
========================================================= */

const expenseModal =
    document.getElementById(
        "expenseModal"
    );


if (expenseModal) {

    expenseModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                expenseModal
            ) {

                closeExpenseModal();

            }

        }
    );

}


/* =========================================================
   END
========================================================= */