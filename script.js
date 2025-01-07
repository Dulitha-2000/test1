document.getElementById('calculateButton').addEventListener('click', calculate);
document.getElementById('clearButton').addEventListener('click', clearForm);
document.getElementById('calculationType').addEventListener('change', toggleInputs);

// Set the default calculation type to "monthlyPayment" when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculationType').value = 'monthlyPayment';
    toggleInputs(); // Call toggleInputs to display only relevant fields
});

function toggleInputs() {
    const calculationType = document.getElementById('calculationType').value;

    // Hide all input fields initially
    document.querySelectorAll('#inputFields .form-group').forEach(input => {
        input.style.display = 'none';
    });

    // Show relevant input fields based on the calculation type
    if (calculationType === 'monthlyPayment') {
        document.getElementById('loanAmount').parentElement.style.display = 'block';
        document.getElementById('loanTermYears').parentElement.style.display = 'block';
        document.getElementById('loanTermMonths').parentElement.style.display = 'block';
        document.getElementById('interestRate').parentElement.style.display = 'block';
    } else if (calculationType === 'loanAmount') {
        document.getElementById('monthlyPayment').parentElement.style.display = 'block';
        document.getElementById('loanTermYears').parentElement.style.display = 'block';
        document.getElementById('loanTermMonths').parentElement.style.display = 'block';
        document.getElementById('interestRate').parentElement.style.display = 'block';
    } else if (calculationType === 'interestRate') {
        document.getElementById('loanAmount').parentElement.style.display = 'block';
        document.getElementById('monthlyPayment').parentElement.style.display = 'block';
        document.getElementById('loanTermYears').parentElement.style.display = 'block';
        document.getElementById('loanTermMonths').parentElement.style.display = 'block';
    } else if (calculationType === 'loanTerm') {
        document.getElementById('loanAmount').parentElement.style.display = 'block';
        document.getElementById('monthlyPayment').parentElement.style.display = 'block';
        document.getElementById('interestRate').parentElement.style.display = 'block';
    }
}

function calculate() {
    const calculationType = document.getElementById('calculationType').value;
    const loanAmount = parseInt(document.getElementById('loanAmount').value);
    const loanTermYears = parseInt(document.getElementById('loanTermYears').value);
    const loanTermMonths = parseInt(document.getElementById('loanTermMonths').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value);

    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    const totalMonths = (loanTermYears * 12) + loanTermMonths;

    if (calculationType === 'monthlyPayment') {
        if (isNaN(loanAmount) || isNaN(totalMonths) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter all required values.';
            return;
        }
        const monthlyRate = Math.pow(1 + interestRate, 1 / 12) - 1;
        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
        resultDiv.innerHTML = `Your monthly payment is: $${payment.toFixed(2)}`;
    } else if (calculationType === 'loanAmount') {
        if (isNaN(monthlyPayment) || isNaN(totalMonths) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter all required values.';
            return;
        }
        const monthlyRate = Math.pow(1 + interestRate, 1 / 12) - 1;
        const amount = (monthlyPayment * (1 - Math.pow(1 + monthlyRate, -totalMonths))) / monthlyRate;

        const roundedAmount = Math.round(amount); // Use Math.floor() or Math.ceil() as per your requirement
        resultDiv.innerHTML = `The loan amount is: $${roundedAmount}`;
    } else if (calculationType === 'interestRate') {
        if (isNaN(loanAmount) || isNaN(monthlyPayment) || isNaN(totalMonths)) {
            errorDiv.innerHTML = 'Please enter all required values.';
            return;
        }
        let low = 0;
        let high = 1;
        let rate = 0;
        const tolerance = 1e-6;

        while (high - low > tolerance) {
            rate = (low + high) / 2;
            const monthlyRate = rate / 12;
            const calculatedPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

            if (calculatedPayment > monthlyPayment) {
                high = rate;
            } else {
                low = rate;
            }
        }

        const aeir = Math.pow(1 + rate / 12, 12) - 1;

        resultDiv.innerHTML = `The Annual Effective Interest Rate (AEIR) is: ${(aeir * 100).toFixed(2)}%`;
    } else if (calculationType === 'loanTerm') {
        if (isNaN(loanAmount) || isNaN(monthlyPayment) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter all required values.';
            return;
        }
        const monthlyRate = Math.pow(1 + interestRate, 1 / 12) - 1;
        const term = Math.log(monthlyPayment / (monthlyPayment - loanAmount * monthlyRate)) / Math.log(1 + monthlyRate);
        resultDiv.innerHTML = `The loan term is: ${Math.floor(term / 12)} years and ${Math.round(term % 12)} months.`;
    }
}

function clearForm() {
    document.querySelectorAll('#inputFields input').forEach(input => input.value = '');
    document.getElementById('result').innerHTML = '';
    document.getElementById('error').innerHTML = '';
}
