const totalBalance       = document.querySelector('.total__balance');
const totalMoneyIncome   = document.querySelector('.total__money-income');
const totalMoneyExpenses = document.querySelector('.total__money-expenses');
const historyList        = document.querySelector('.history__list');
const form               = document.querySelector('#form');
const operationName      = document.querySelector('.operation__name');
const operationAmount    = document.querySelector('.operation__amount');

let dbOperation = JSON.parse(localStorage.getItem('operation')) || [];

const generateId = () => `impsbl${Math.round(Math.random() * 1e8).toString(16)}`

const renderOperation = (operation) => {
    const className = operation.amount > 0 ? 'history__item-plus' : 'history__item-minus';

    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    listItem.innerHTML = `
        ${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history_delete" data-id="${operation.id}">x</button>`;

    historyList.append(listItem);
};

const updateBalance = () => {
    const resultIncome = dbOperation
            .filter((item) => item.amount > 0)
            .reduce((sum, item) => sum + item.amount, 0);
    const resultExpenses = dbOperation
            .filter((item) => item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0);

    totalMoneyIncome.textContent = resultIncome + ' ₽';
    totalMoneyExpenses.textContent = resultExpenses + ' ₽';
    totalBalance.textContent = (resultIncome + resultExpenses) + ' ₽';
};

const addOperation = (event) => {
    event.preventDefault();
    const operationNameValue = operationName.value;
    const operationAmountValue = operationAmount.value;
    if (operationNameValue && operationAmountValue) {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue
        };

        dbOperation.push(operation);
        init();console.log(dbOperation);
    } else if (!operationNameValue) {
        operationName.getElementsByClassName.border = 'color: red';
    } else if (!operationAmountValue) {
        operationAmount.getElementsByClassName.border = 'color: red';
    }
    operationName.value = '';
    operationAmount.value = '';
};

const deleteOperation = (event) => {
    const target = event.target;
    if (target.classList.contains('history_delete')) {
        dbOperation = dbOperation.filter(operation => operation.id !== target.dataset.id);
    }

    init();
};


const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('operation', JSON.stringify(dbOperation));
};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);

init();