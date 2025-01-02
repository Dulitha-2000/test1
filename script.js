/* script.js */
document.getElementById('calculateButton').addEventListener('click', calculatePayment);
document.getElementById('clearButton').addEventListener('click', clearForm);

function calculatePayment() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTermYears = parseInt(document.getElementById('loanTermYears').value);
    const loanTermMonths = parseInt(document.getElementById('loanTermMonths').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const compound = document.getElementById('compound').value;

    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    if (isNaN(loanAmount) || isNaN(loanTermYears) || isNaN(loanTermMonths) || isNaN(interestRate)) {
        errorDiv.innerHTML = 'Please enter valid numerical values.';
        return;
    }

    const totalMonths = (loanTermYears * 12) + loanTermMonths;

    if (compound !== 'Monthly') {
        errorDiv.innerHTML = 'Currently, only Monthly (APR) is supported.';
        return;
    }

    if (totalMonths === 0) {
        errorDiv.innerHTML = 'Loan term cannot be zero.';
        return;
    }

    const monthlyRate = interestRate / 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

    resultDiv.innerHTML = `Your monthly payment is: $${monthlyPayment.toFixed(2)}`;
}

function clearForm() {
    document.getElementById('loanAmount').value = '';
    document.getElementById('loanTermYears').value = '';
    document.getElementById('loanTermMonths').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('compound').value = 'Monthly';
    document.getElementById('result').innerHTML = '';
    document.getElementById('error').innerHTML = '';
}
