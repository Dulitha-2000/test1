document.getElementById('calculateButton').addEventListener('click', calculate);
document.getElementById('clearButton').addEventListener('click', clearForm);
document.getElementById('calculationType').addEventListener('change', toggleInputs);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculationType').value = 'monthlyPayment';
    toggleInputs();
});

function toggleInputs() {
    const calculationType = document.getElementById('calculationType').value;

    document.querySelectorAll('#inputFields .form-group').forEach(input => {
        input.style.display = 'none';
    });

    if (calculationType === 'monthlyPayment') {
        ['loanAmount', 'loanTermYears', 'loanTermMonths', 'interestRate', 'finalBaloonpayment','compound'].forEach(id => {
            document.getElementById(id).parentElement.style.display = 'block';
        });
    } else if (calculationType === 'loanAmount') {
        ['monthlyPayment', 'loanTermYears', 'loanTermMonths', 'interestRate', 'finalBaloonpayment','compound'].forEach(id => {
            document.getElementById(id).parentElement.style.display = 'block';
        });
    } else if (calculationType === 'interestRate') {
        ['loanAmount', 'monthlyPayment', 'loanTermYears', 'loanTermMonths', 'finalBaloonpayment','compound'].forEach(id => {
            document.getElementById(id).parentElement.style.display = 'block';
        });
    } else if (calculationType === 'loanTerm') {
        ['loanAmount', 'monthlyPayment', 'interestRate', 'finalBaloonpayment', 'compound'].forEach(id => {
            document.getElementById(id).parentElement.style.display = 'block';
        });
    }
}

function calculate() {
    const calculationType = document.getElementById('calculationType').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTermYears = parseInt(document.getElementById('loanTermYears').value) || 0;
    const loanTermMonths = parseInt(document.getElementById('loanTermMonths').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value);
    const compound = document.getElementById('compound').value;
    const finalBaloonpayment= parseInt(document.getElementById('finalBaloonpayment').value);

    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    let compoundFrequency;
    if (compound === 'Annual') compoundFrequency = 1;
    else if (compound === 'Monthly') compoundFrequency = 12;
    else if (compound === 'Semimonthly') compoundFrequency = 24;
    else if (compound === 'Biweekly') compoundFrequency = 26;
    else if (compound === 'weekly') compoundFrequency = 52;
    else if (compound === 'daily') compoundFrequency = 365;
    else {
        errorDiv.innerHTML = 'Invalid compounding frequency.';
        return;
    }

    const totalCompoundings = (loanTermYears + loanTermMonths / 12) * compoundFrequency;  //n*t(n:-compoundFrequency,t:-years)
    

    if (calculationType === 'monthlyPayment') {
        if (!Number.isFinite(loanAmount) || loanAmount <= 0 || isNaN(totalCompoundings) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter valid values.';
            return;
        }
        const rateForCompoundPeriod = Math.pow(1 + interestRate, 1 / compoundFrequency) - 1;

        //final baloon payment
        const fbp = finalBaloonpayment*(Math.pow(1+rateForCompoundPeriod,-totalCompoundings));
        const payment = ((loanAmount-fbp) * rateForCompoundPeriod) / (1 - Math.pow(1 + rateForCompoundPeriod, -totalCompoundings));
        //const payment = (loanAmount * rateForCompoundPeriod) / (1 - Math.pow(1 + rateForCompoundPeriod, -totalCompoundings));
        resultDiv.innerHTML = `Your monthly payment is: $${payment.toFixed(2)}`;
    } else if (calculationType === 'loanAmount') {
        if (isNaN(monthlyPayment) || isNaN(totalCompoundings) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter valid values.';
            return;
        }
        const rateForCompoundPeriod = Math.pow(1 + interestRate, 1 / compoundFrequency) - 1;
        const fbp = finalBaloonpayment*(Math.pow(1+rateForCompoundPeriod,-totalCompoundings));
        const amount = ((monthlyPayment * (1 - Math.pow(1 + rateForCompoundPeriod, -totalCompoundings)))/ rateForCompoundPeriod)+fbp;
       //const amount = (monthlyPayment * (1 - Math.pow(1 + rateForCompoundPeriod, -totalCompoundings))) / rateForCompoundPeriod;
        resultDiv.innerHTML = `The loan amount is: $${Math.round(amount)}`;
    } else if (calculationType === 'interestRate') {
        if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(monthlyPayment) || isNaN(totalCompoundings)) {
            errorDiv.innerHTML = 'Please enter valid values.';
            return;
        }

        let low = 0;
        let high = 1;
        const tolerance = 1e-6;

        while (high - low > tolerance) {
            const mid = (low + high) / 2;
            const rateForCompoundPeriod = Math.pow(1 + mid, 1 / compoundFrequency) - 1;
            const estimatedPayment = (loanAmount * rateForCompoundPeriod) / (1 - Math.pow(1 + rateForCompoundPeriod, -totalCompoundings));
            if (estimatedPayment > monthlyPayment) {
                high = mid;
            } else {
                low = mid;
            }
        }

        const annualRate = low * 100;
        resultDiv.innerHTML = `The interest rate is: ${annualRate.toFixed(6)}%`;
    } else if (calculationType === 'loanTerm') {
        if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(monthlyPayment) || isNaN(interestRate)) {
            errorDiv.innerHTML = 'Please enter valid values.';
            return;
        }

        const rateForCompoundPeriod = Math.pow(1 + interestRate, 1 / compoundFrequency) - 1;
        const totalCompoundings = Math.log(monthlyPayment / (monthlyPayment - loanAmount * rateForCompoundPeriod)) / Math.log(1 + rateForCompoundPeriod);
        const years = Math.floor(totalCompoundings / compoundFrequency);
        const months = Math.round((totalCompoundings % compoundFrequency) * 12 / compoundFrequency);

        resultDiv.innerHTML = `The loan term is: ${years} years and ${months} months`;
    }
}


function clearForm() {
    document.querySelectorAll('#inputFields input').forEach(input => input.value = '');
    document.getElementById('result').innerHTML = '';
    document.getElementById('error').innerHTML = '';
}
