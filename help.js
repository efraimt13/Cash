// =====================================================================================================================
// Global State Variables
// This section defines all the core data and flags that control the application's state and simulated data.
// All values are fake and client-side simulated for demonstration purposes.
// =====================================================================================================================
let balance = 1500.51; // Current cash balance. Starting higher for K-format demo. Max $99,999.99
let savingsBalance = 500.00; // Simulated savings account balance.
let bitcoinBalance = 1200.50; // Simulated Bitcoin investment value.
let stocksBalance = 3500.75; // Simulated Stocks investment value.
let roundUpsEnabled = false; // Flag to track if the 'Round Ups' feature is active.
let cardLocked = false; // Flag to track if the Cash Card is locked.
let selectedRecipient = ''; // Stores the currently selected recipient for 'Pay'/'Request' actions.
let transactionType = 'pay'; // 'pay' or 'request' - determines the type of transaction initiated from the keypad.
let amountValue = '0'; // String representation of the amount being entered on the keypad.
let accumulatedRoundUps = 0.00; // Simulated amount accumulated through round-ups.

// Array to store simulated transactions. This array will be dynamically updated as new transactions occur.
let transactions = [
    {
        id: 'tx-1001',
        name: 'Coffee Shop',
        amount: -4.50, // Store as number for calculations, format for display
        date: 'Today',
        time: '10:30 AM',
        status: 'Completed',
        category: 'Food',
        fullDetails: 'Purchase at Starbucks. Transaction ID: TXN1001. Paid with Cash Card. Category: Food & Drink. Location: Downtown Cafe. Enjoy your latte!'
    },
    {
        id: 'tx-1002',
        name: 'Grocery Store',
        amount: -32.75,
        date: 'Today',
        time: '11:45 AM',
        status: 'Completed',
        category: 'Shopping',
        fullDetails: 'Purchase at Whole Foods. Transaction ID: TXN1002. Paid with Cash Card. Category: Groceries. Location: Main Street Market. Stocked up for the week.'
    },
    {
        id: 'tx-1003',
        name: 'Received from Alice',
        amount: 20.00,
        date: 'Today',
        time: '01:15 PM',
        status: 'Completed',
        category: 'Received',
        fullDetails: 'Payment received from Alice ($AliceUser) for shared lunch. Transaction ID: TXN1003. Note: Thanks for lunch!'
    },
    {
        id: 'tx-1004',
        name: 'Uber Ride',
        amount: -12.80,
        date: 'Today',
        time: '03:00 PM',
        status: 'Completed',
        category: 'Transport',
        fullDetails: 'Uber ride to downtown. Transaction ID: TXN1004. Paid with Cash Card. Category: Transportation. Quick trip.'
    },
    {
        id: 'tx-1005',
        name: 'Online Subscription',
        amount: -9.99,
        date: 'This Month',
        time: 'May 15',
        status: 'Completed',
        category: 'Subscription',
        fullDetails: 'Monthly subscription for streaming service. Transaction ID: TXN1005. Category: Entertainment. Enjoy your shows!'
    },
    {
        id: 'tx-1006',
        name: 'Gym Membership',
        amount: -45.00,
        date: 'This Month',
        time: 'May 10',
        status: 'Completed',
        category: 'Health',
        fullDetails: 'Monthly gym membership fee. Transaction ID: TXN1006. Category: Health & Fitness. Stay fit!'
    },
    {
        id: 'tx-1007',
        name: 'Payment to Bob',
        amount: -50.00,
        date: 'This Month',
        time: 'May 05',
        status: 'Completed',
        category: 'Sent',
        fullDetails: 'Payment sent to Bob ($BobUser) for concert tickets. Transaction ID: TXN1007. Note: Enjoy the show!'
    },
    {
        id: 'tx-1008',
        name: 'Pending Deposit',
        amount: 100.00,
        date: 'Pending',
        time: 'Expected Tomorrow',
        status: 'Pending',
        category: 'Deposit',
        fullDetails: 'Incoming direct deposit. Expected to clear within 1-2 business days. Transaction ID: TXN1008.'
    },
    {
        id: 'tx-1009',
        name: 'Large Online Purchase',
        amount: -1500.00, // A larger amount for K-formatting demo
        date: 'This Month',
        time: 'May 03',
        status: 'Completed',
        category: 'Shopping',
        fullDetails: 'Online purchase from TechGadgets. Transaction ID: TXN1009. Paid with Cash Card. New laptop acquired!'
    },
    {
        id: 'tx-1010',
        name: 'Received from Charlie',
        amount: 25000.00, // Very large amount for K-formatting demo
        date: 'This Month',
        time: 'May 01',
        status: 'Completed',
        category: 'Received',
        fullDetails: 'Payment received from Charlie ($CharlieUser) for car sale. Transaction ID: TXN1010. Note: Thanks for the car!'
    }
];

// =====================================================================================================================
// Data Persistence (localStorage)
// Functions to save and load the application's state to/from localStorage for a persistent demo experience.
// =====================================================================================================================

/**
 * Saves the current application state to localStorage.
 * This includes balances, flags, and transactions.
 */
function saveState() {
    const appState = {
        balance: balance,
        savingsBalance: savingsBalance,
        bitcoinBalance: bitcoinBalance,
        stocksBalance: stocksBalance,
        roundUpsEnabled: roundUpsEnabled,
        cardLocked: cardLocked,
        accumulatedRoundUps: accumulatedRoundUps,
        transactions: transactions
    };
    localStorage.setItem('cashAppCloneState', JSON.stringify(appState));
}

/**
 * Loads the application state from localStorage.
 * If no saved state is found, it uses the default initial values.
 */
function loadState() {
    const savedState = localStorage.getItem('cashAppCloneState');
    if (savedState) {
        const appState = JSON.parse(savedState);
        balance = appState.balance;
        savingsBalance = appState.savingsBalance;
        bitcoinBalance = appState.bitcoinBalance;
        stocksBalance = appState.stocksBalance;
        roundUpsEnabled = appState.roundUpsEnabled;
        cardLocked = appState.cardLocked;
        accumulatedRoundUps = appState.accumulatedRoundUps;
        transactions = appState.transactions;
    }
}

// =====================================================================================================================
// Formatting Helper Functions
// These functions handle the specific display requirements for amounts and balances.
// =====================================================================================================================

/**
 * Formats a numerical amount into a user-friendly string,
 * applying 'K' for thousands, handling signs, and controlling decimal places.
 * Specifically for the nav bar, it shows no cents and 'K' for thousands.
 * For other displays, it shows cents and 'K' for thousands.
 * Max balance is $99,999.99, so it handles up to $99K.
 * @param {number} amount - The numerical amount to format.
 * @param {boolean} includeCents - Whether to include cents for amounts under 1000.
 * @returns {string} The formatted amount string (e.g., "$1", "$1.50", "$12K", "-$500").
 */
function formatAmountForDisplay(amount, includeCents = true) {
    const sign = amount < 0 ? '-' : '';
    const absAmount = Math.abs(amount);

    if (absAmount >= 1000) {
        // For amounts >= $1,000, format as 'K'
        // Round to nearest whole number for K display for amounts like $1234.56 -> $1K
        // For amounts like $12345.67 -> $12K
        // For amounts like $123456.78 (above max) -> capped at $99K
        let kValue = Math.round(absAmount / 1000);
        if (kValue > 99) { // Cap at 99K for display as per requirement
            kValue = 99;
        }
        return `${sign}$${kValue}K`;
    } else {
        // For amounts < $1,000
        if (includeCents) {
            return `${sign}$${absAmount.toFixed(2)}`;
        } else {
            return `${sign}$${Math.floor(absAmount)}`; // Only show dollars, no cents
        }
    }
}

// =====================================================================================================================
// UI Utility Functions
// These functions handle common UI interactions like showing/hiding popups, messages, and loading indicators.
// =====================================================================================================================

/**
 * Displays a custom message box with a title and message.
 * The message box is a custom HTML element, not a native browser alert().
 * @param {string} title - The title of the message box.
 * @param {string} message - The message content.
 */
function showMessageBox(title, message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.style.display = 'block';
    messageText.style.fontWeight = 'bold';
    messageText.style.fontSize = '1.1em';
    // Add a slight scale-in effect for the message box
    messageBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
        messageBox.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);
}

/**
 * Hides the custom message box.
 */
function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 200); // Match animation duration
}

/**
 * Shows the loading spinner.
 */
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

/**
 * Hides the loading spinner.
 */
function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

/**
 * Updates the displayed cash balance on the navigation bar and money section.
 * Applies the new formatting rules for mobile optimization (no cents, K for thousands).
 * Ensures all balance displays are consistent.
 */
function updateNavBalance() {
    // Format balance for the nav bar icon (no cents, K for thousands)
    document.getElementById('balanceIcon').textContent = formatAmountForDisplay(balance, false);
    // Format balance for the main cash balance card (always shows cents for precision here)
    document.getElementById('cashBalanceAmount').textContent = `$${balance.toFixed(2)}`;

    // Update detail screen balance if it's currently active
    const detailCashBalance = document.getElementById('detailCashBalance');
    if (detailCashBalance) {
        detailCashBalance.textContent = `$${balance.toFixed(2)}`;
    }
    saveState(); // Save state after balance update
}

/**
 * Shows a specific popup by adding the 'active' class.
 * Hides all other popups and prevents scrolling on the main content to focus on the popup.
 * @param {string} popupId - The ID of the popup to show.
 */
function showPopup(popupId) {
    document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('active'));
    document.getElementById(popupId).classList.add('active');
    document.getElementById('mainContent').style.overflow = 'hidden';
}

/**
 * Hides a specific popup by removing the 'active' class.
 * Re-enables scrolling on the main content.
 * If the recipient popup is closed, it also clears the keypad amount.
 * @param {string} popupId - The ID of the popup to hide.
 */
function hidePopup(popupId) {
    document.getElementById(popupId).classList.remove('active');
    document.getElementById('mainContent').style.overflow = 'auto';
    if (popupId === 'recipientPopup') {
        clearAmount(); // Clear amount when recipient popup is closed
    }
}

/**
 * Hides all active popups and re-enables scrolling on the main content.
 */
function hideAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('active'));
    document.getElementById('mainContent').style.overflow = 'auto';
}

/**
 * Displays transaction details in a popup.
 * @param {string} name - The name of the transaction (e.g., "Coffee Shop").
 * @param {string} amount - The formatted amount of the transaction (e.g., "-$4.50").
 * @param {string} details - Brief details (e.g., "Verified Today at 9:07 AM").
 * @param {string} fullDetails - Comprehensive details for the transaction.
 */
function showTransactionPopup(name, amount, details, fullDetails) {
    document.getElementById('transactionDetails').innerHTML = `
        <h2>${name}</h2>
        <p>Amount: <span>${amount}</span></p>
        <p>Details: <span>${details}</span></p>
        <p>Info: <span>${fullDetails}</span></p>
        <button class="show-more" id="transactionMoreInfoButton">More Info</button>
    `;
    // Add event listener for the "More Info" button within the popup
    document.getElementById('transactionMoreInfoButton').addEventListener('click', () => {
        showMessageBox('Transaction Info', 'This is a demo. In a real app, you might have options like "Report Issue" or "Contact Support" for this transaction.');
    });
    showPopup('transactionPopup');
}

// =====================================================================================================================
// Keypad and Transaction Logic
// Handles user input on the numeric keypad and simulates money sending/requesting.
// =====================================================================================================================

/**
 * Updates the amount display on the keypad based on user input.
 * Handles numeric input, decimal points, and backspace.
 * Ensures amount does not exceed $99,999.99.
 * Enables/disables Pay/Request buttons based on a valid amount being entered.
 * @param {string} value - The character pressed on the keypad ('0'-'9', '.', '←').
 */
function updateAmount(value) {
    const amountDisplay = document.getElementById('amount-display');
    if (value === '←') {
        // Handle backspace: remove the last character
        amountValue = amountValue.slice(0, -1);
        if (amountValue === '' || amountValue === '.') { // If empty or just a decimal, reset to '0'
            amountValue = '0';
        }
    } else if (value === '.') {
        // Handle decimal point: only allow one decimal point
        if (!amountValue.includes('.')) {
            amountValue += value;
        }
    } else {
        // Handle numeric input
        if (amountValue === '0' && value !== '.') {
            // If current amount is '0', replace it with the new digit (unless it's a decimal)
            amountValue = value;
        } else {
            // Prevent more than two decimal places after a decimal point
            const parts = amountValue.split('.');
            if (parts.length === 2 && parts[1].length >= 2) {
                // If already two decimal places, do nothing
            } else {
                amountValue += value;
            }
        }
    }

    // Parse the current amount value
    let numericAmount = parseFloat(amountValue);

    // Ensure the amount does not exceed the maximum allowed ($99,999.99)
    if (numericAmount > 99999.99) {
        amountValue = '99999.99'; // Cap at max
        numericAmount = 99999.99; // Update numeric amount after capping
        showMessageBox('Amount Limit', 'Maximum transaction amount is $99,999.99.');
    }

    // Format the displayed amount for currency (e.g., "$12.34")
    if (isNaN(numericAmount)) {
        amountDisplay.textContent = '$0';
    } else {
        // Display with appropriate decimal places based on user input
        const decimalPlaces = amountValue.includes('.') ? amountValue.split('.')[1].length : 0;
        amountDisplay.textContent = `$${numericAmount.toFixed(decimalPlaces)}`;
    }

    // Enable/disable Pay/Request buttons based on whether a valid amount > 0 is entered
    const payButton = document.getElementById('payButton');
    const requestButton = document.getElementById('requestButton');
    if (numericAmount > 0) {
        payButton.disabled = false;
        requestButton.disabled = false;
        amountDisplay.classList.add('active'); // Add active state for visual feedback
    } else {
        payButton.disabled = true;
        requestButton.disabled = true;
        amountDisplay.classList.remove('active'); // Remove active state
    }
}

/**
 * Clears the amount entered on the keypad and resets the display.
 */
function clearAmount() {
    amountValue = '0';
    document.getElementById('amount-display').textContent = '$0';
    document.getElementById('payButton').disabled = true;
    document.getElementById('requestButton').disabled = true;
    document.getElementById('amount-display').classList.remove('active');
}

/**
 * Shows the recipient selection popup for a transaction.
 * Resets the selected recipient and disables the confirm button initially.
 * @param {string} type - The type of transaction ('pay' or 'request').
 */
function showRecipientPopup(type) {
    transactionType = type;
    selectedRecipient = ''; // Reset selected recipient
    document.getElementById('confirmTransactionButton').disabled = true; // Disable confirm button initially
    showPopup('recipientPopup');
}

/**
 * Selects a recipient for the transaction and displays a confirmation message.
 * Enables the confirm transaction button.
 * @param {string} recipient - The name of the selected recipient.
 */
function selectRecipient(recipient) {
    selectedRecipient = recipient;
    showMessageBox('Recipient Selected', `You selected ${recipient}. Click 'Confirm' to proceed.`);
    document.getElementById('confirmTransactionButton').disabled = false;
}

/**
 * Simulates adding a new recipient. In a real app, this would involve a form.
 */
function addRecipient() {
    showMessageBox('Add Recipient', 'Simulating adding a new recipient. In a real app, you would enter their Cashtag or phone number.');
    selectedRecipient = 'New Contact'; // Assign a generic name for demo purposes
    document.getElementById('confirmTransactionButton').disabled = false;
}

/**
 * Confirms and simulates a transaction (pay or request).
 * Handles balance updates, adds new transactions to the feed, and provides feedback.
 */
async function confirmTransaction() {
    const amount = parseFloat(amountValue);

    // Basic validation for amount
    if (isNaN(amount) || amount <= 0) {
        showMessageBox('Invalid Amount', 'Please enter a valid amount greater than zero.');
        return;
    }

    // Simulate insufficient funds error for 'pay' transactions
    if (transactionType === 'pay' && balance < amount) {
        showMessageBox('Insufficient Funds', `You only have $${balance.toFixed(2)}. This transaction requires $${amount.toFixed(2)}.`);
        return;
    }

    // Hide the recipient popup and show a loading spinner to simulate processing
    hidePopup('recipientPopup');
    showLoadingSpinner();

    // Simulate network delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    let message = '';
    let transactionName = '';
    let transactionAmountNum = amount; // Store number for internal use
    let transactionStatus = 'Completed';
    let transactionDetails = '';
    let transactionCategory = '';

    if (transactionType === 'pay') {
        balance -= amount; // Deduct amount from balance
        transactionAmountNum = -amount; // Make it negative for display
        transactionName = `Payment to ${selectedRecipient}`;
        message = `Payment Sent to ${selectedRecipient}!`;
        transactionDetails = `Paid ${selectedRecipient} for $${amount.toFixed(2)}. This is a simulated transaction.`;
        transactionCategory = 'Sent';
    } else { // transactionType === 'request'
        // For requests, we don't change the balance immediately.
        // We simulate it as a pending transaction.
        transactionName = `Request from ${selectedRecipient}`;
        transactionAmountNum = amount; // Positive for request
        message = `Request Sent to ${selectedRecipient}!`;
        transactionDetails = `Requested $${amount.toFixed(2)} from ${selectedRecipient}. This is a simulated request.`;
        transactionCategory = 'Requested';
        transactionStatus = 'Pending'; // Requests are usually pending until fulfilled
    }

    // Add the new simulated transaction to the beginning of the transactions array
    transactions.unshift({
        id: `tx-${Date.now()}`, // Generate a unique ID for the transaction
        name: transactionName,
        amount: transactionAmountNum,
        date: 'Today', // New transactions are always marked as "Today"
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: transactionStatus,
        category: transactionCategory,
        fullDetails: transactionDetails
    });

    // Hide loading spinner, show success message, update UI, and reset keypad
    hideLoadingSpinner();
    showMessageBox('Transaction Complete', message);
    updateNavBalance(); // Update displayed balance
    renderActivityFeed(); // Re-render activity feed to show the new transaction
    clearAmount(); // Reset keypad for next transaction
}

// =====================================================================================================================
// Activity Feed Logic
// Manages the display and filtering of simulated transactions in the activity section.
// =====================================================================================================================

/**
 * Renders the activity feed by categorizing and displaying transactions.
 * Transactions are grouped into 'Pending', 'Today', and 'This Month'.
 */
function renderActivityFeed() {
    const pendingList = document.getElementById('pendingActivityList');
    const todayList = document.getElementById('todayActivityList');
    const thisMonthList = document.getElementById('thisMonthActivityList');

    // Clear existing lists to prevent duplication, except for the initial "New Device Login" in Today
    pendingList.innerHTML = '';
    todayList.innerHTML = `
        <div class="activity-item" data-tx-name="New Device Login" data-tx-amount="" data-tx-details="Verified Today at 9:07 PM" data-tx-fulldetails="Security verification for a new device login. If this was not you, please contact support immediately.">
            <div class="contact-item" style="background: #00C853;">✔️</div>
            <div>
                <div>New Device Login</div>
                <div class="card-subtext">Verified Today at 9:07 PM</div>
            </div>
            <span class="card-subtext">></span>
        </div>
    `;
    thisMonthList.innerHTML = '';

    // Iterate through all transactions and append them to the correct section
    transactions.forEach(tx => {
        const activityItem = document.createElement('div');
        activityItem.classList.add('activity-item');
        // Store transaction data as data attributes for easy retrieval when clicked
        activityItem.setAttribute('data-tx-name', tx.name);
        // Format amount for display in activity feed (with K for thousands)
        const formattedAmount = formatAmountForDisplay(tx.amount);
        activityItem.setAttribute('data-tx-amount', formattedAmount);
        activityItem.setAttribute('data-tx-details', `${tx.status} ${tx.date} at ${tx.time}`);
        activityItem.setAttribute('data-tx-fulldetails', tx.fullDetails);

        let iconContent = '';
        let iconBgColor = '#00C853'; // Default Cash App green
        let iconColor = '#000'; // Default text color for icons

        // Determine icon and background color based on transaction category or name
        switch (tx.category) {
            case 'Food': iconContent = '☕'; iconBgColor = '#8E44AD'; break;
            case 'Shopping': iconContent = '🛒'; iconBgColor = '#27AE60'; break;
            case 'Received': iconContent = '💰'; iconBgColor = '#00C853'; break;
            case 'Transport': iconContent = '🚗'; iconBgColor = '#9370DB'; break;
            case 'Subscription': iconContent = '📺'; iconBgColor = '#FF407A'; break;
            case 'Health': iconContent = '🏋️'; iconBgColor = '#9370DB'; break;
            case 'Sent': iconContent = '💸'; iconBgColor = '#FF407A'; break;
            case 'Requested': iconContent = '✉️'; iconBgColor = '#00C853'; break;
            case 'Deposit': iconContent = '⏳'; iconBgColor = '#FFC107'; break;
            default: // Fallback for specific names or general
                if (tx.name.includes('Lyft')) { iconContent = '<i class="fa-brands fa-lyft"></i>'; iconBgColor = '#E91E63'; }
                else if (tx.name.includes('Starbucks')) { iconContent = '<i class="fa-solid fa-coffee"></i>'; iconBgColor = '#00897B'; }
                else if (tx.name.includes('7-Eleven')) { iconContent = '<i class="fa-solid fa-store"></i>'; iconBgColor = '#FFC107'; }
                else if (tx.name.includes('DoorDash')) { iconContent = '<i class="fa-solid fa-utensils"></i>'; iconBgColor = '#D32F2F'; }
                else if (tx.name.includes('Uber')) { iconContent = 'U'; iconBgColor = '#FFFFFF'; iconColor = '#000'; }
                else if (tx.name.includes('Apple')) { iconContent = '🍎'; iconBgColor = '#D32F2F'; }
                else { iconContent = '$'; iconBgColor = '#00C853'; } // Generic icon
        }

        // Set inner HTML for the activity item
        activityItem.innerHTML = `
            <div class="contact-item" style="background: ${iconBgColor}; color: ${iconColor};">${iconContent}</div>
            <div>
                <div>${tx.name}</div>
                <div class="card-subtext">${tx.date} at ${tx.time}</div>
            </div>
            <span class="card-amount" style="color: ${tx.amount < 0 ? '#FF407A' : '#00C853'};">${formattedAmount}</span>
            <span class="card-subtext">></span>
        `;
        // Add click listener to show transaction details popup
        activityItem.addEventListener('click', () => showTransactionPopup(tx.name, formattedAmount, `${tx.status} ${tx.date} at ${tx.time}`, tx.fullDetails));

        // Append to the correct list based on status/date
        if (tx.status === 'Pending') {
            pendingList.appendChild(activityItem);
        } else if (tx.date === 'Today') {
            todayList.appendChild(activityItem);
        } else {
            thisMonthList.appendChild(activityItem);
        }
    });
    saveState(); // Save state after rendering activity feed
}

/**
 * Filters the activity feed visually based on a search query.
 * This is a client-side visual filter; it does not modify the underlying `transactions` array.
 * @param {string} query - The search query.
 */
function filterActivity(query) {
    const activityItems = document.querySelectorAll('#pendingActivityList .activity-item, #todayActivityList .activity-item, #thisMonthActivityList .activity-item');
    const lowerCaseQuery = query.toLowerCase();

    activityItems.forEach(item => {
        const txName = item.getAttribute('data-tx-name').toLowerCase();
        const txDetails = item.getAttribute('data-tx-fulldetails').toLowerCase(); // Search full details too

        if (query === '' || txName.includes(lowerCaseQuery) || txDetails.includes(lowerCaseQuery)) {
            item.style.display = 'flex'; // Show if matches or query is empty
        } else {
            item.style.display = 'none'; // Hide if no match
        }
    });
    // Provide feedback that filtering is simulated
    if (query !== '') {
        showMessageBox('Search Filter', `Simulating search for "${query}". The list is filtered visually.`);
    } else {
        // Only show this message if the search bar was previously not empty
        if (document.getElementById('activitySearchBar').value !== '') {
            showMessageBox('Search Cleared', 'Displaying all transactions.');
        }
    }
}

// =====================================================================================================================
// Card Section Logic
// Handles features related to the Cash Card, like locking and copying card details.
// =====================================================================================================================

/**
 * Toggles the card lock status and updates the UI accordingly.
 * Provides a message box confirmation.
 */
function toggleLockCard() {
    cardLocked = !cardLocked;
    const lockButton = document.getElementById('lockCardButton');
    if (cardLocked) {
        lockButton.textContent = 'Unlock Card';
        lockButton.style.background = '#FF407A'; // Red for locked state
        showMessageBox('Card Locked', 'Your Cash Card is now locked. All transactions will be declined until unlocked.');
    } else {
        lockButton.textContent = 'Lock Card';
        lockButton.style.background = '#282828'; // Original dark gray background
        showMessageBox('Card Unlocked', 'Your Cash Card is now unlocked. Transactions can proceed.');
    }
    saveState(); // Save state after card lock status update
}

/**
 * Simulates copying the last 4 digits of the card number to the clipboard.
 * Uses `document.execCommand('copy')` for broader compatibility in iframes.
 */
function copyCardNumber() {
    const cardNumber = "9812"; // Last 4 digits of the fake card number
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = cardNumber;
    tempInput.select();
    document.execCommand('copy'); // Execute copy command
    document.body.removeChild(tempInput); // Remove temporary input element
    showMessageBox('Copied!', 'Last 4 digits of card number copied to clipboard.');
}

/**
 * Displays offer details in a popup.
 * @param {string} title - The title of the offer.
 * @param {string} description - The description of the offer.
 */
function showOfferDetail(title, description) {
    document.getElementById('offerDetailTitle').textContent = title;
    document.getElementById('offerDetailDescription').textContent = description;
    showPopup('offerDetailPopup');
}

// =====================================================================================================================
// Detail Screen Logic
// Manages the dynamic content and functionality of various detail screens (e.g., Savings, Bitcoin, Settings).
// =====================================================================================================================

/**
 * Displays a detailed screen for various sections (Savings, Bitcoin, Stocks, Offers, etc.).
 * Dynamically injects content and sets up specific event listeners for each screen type.
 * @param {string} screenType - The type of detail screen to show (e.g., 'savingsDetail', 'bitcoinDetail').
 */
function showDetailScreen(screenType) {
    const detailScreen = document.getElementById('detailScreen');
    const detailScreenTitle = document.getElementById('detailScreenTitle');
    const detailScreenContent = document.getElementById('detailScreenContent');

    detailScreenContent.innerHTML = ''; // Clear previous content to ensure fresh load

    let contentHTML = '';
    let titleText = '';

    switch (screenType) {
        case 'cashBalanceDetail':
            titleText = 'Cash Balance';
            contentHTML = `
                <h3>Your Cash Balance</h3>
                <p>Current Balance: <span id="detailCashBalance">$${balance.toFixed(2)}</span></p>
                <p>This is your primary Cash App balance. All payments, requests, and card transactions are processed through this balance. Keep your balance funded to avoid issues.</p>
                <div class="action-buttons">
                    <button id="detailAddMoneyButton">Add Money</button>
                    <button id="detailWithdrawMoneyButton">Withdraw</button>
                </div>
                <h3 style="margin-top: 30px;">Direct Deposit</h3>
                <p>Set up direct deposit to get paid up to 2 days early. Your routing and account numbers are available here.</p>
                <p>Routing Number: <span>****981</span></p>
                <p>Account Number: <span>****3231</span></p>
                <button class="show-more" id="copyRoutingNumberButton">Copy Routing Number</button>
                <button class="show-more" id="copyAccountNumberButton">Copy Account Number</button>
            `;
            break;
        case 'savingsDetail':
            titleText = 'Savings';
            contentHTML = `
                <h3>Your Savings Account</h3>
                <p>Current Savings: <span id="detailSavingsBalance">$${savingsBalance.toFixed(2)}</span></p>
                <p>Interest Rate: <span>1.5% APY</span></p>
                <p>Your savings grow over time with competitive interest rates. Watch your money work for you! Interest is compounded daily.</p>
                <p>Simulated interest accrual: <span id="interestAccrual">$0.00</span></p>
                <div class="action-buttons">
                    <button id="addFundsToSavingsButton">Add Funds</button>
                    <button id="withdrawFundsFromSavingsButton">Withdraw Funds</button>
                </div>
                <h3 style="margin-top: 30px;">Savings Goals</h3>
                <p>Create custom savings goals to track your progress towards financial milestones. Set a target amount and date.</p>
                <button class="show-more" id="createSavingsGoalButton">Create New Goal</button>
                <div class="card" style="margin-top: 20px;">
                    <div>
                        <div class="card-title">Emergency Fund</div>
                        <div class="card-amount">$250.00 / $1,000.00</div>
                        <div class="card-subtext">25% Complete</div>
                    </div>
                    <span class="card-subtext">></span>
                </div>
            `;
            break;
        case 'bitcoinDetail':
            titleText = 'Bitcoin';
            contentHTML = `
                <h3>Your Bitcoin Holdings</h3>
                <p>Current Bitcoin Value: <span id="detailBitcoinValue">$${bitcoinBalance.toFixed(2)}</span></p>
                <p>Daily Change: <span id="detailBitcoinChange">${(Math.random() * 10 - 5).toFixed(2)}%</span></p>
                <div class="chart-placeholder">Fake Bitcoin Price Chart - Volatility Simulated</div>
                <p>Invest in Bitcoin directly from your Cash App balance. Bitcoin prices are highly volatile and can change rapidly. Only invest what you can afford to lose. We recommend dollar-cost averaging.</p>
                <div class="action-buttons">
                    <button id="buyBitcoinButton">Buy</button>
                    <button id="sellBitcoinButton">Sell</button>
                </div>
                <h3 style="margin-top: 30px;">Bitcoin Info</h3>
                <p>Bitcoin is a decentralized digital currency, without a central bank or single administrator. It can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries. Its value is determined by supply and demand.</p>
                <button class="show-more" id="bitcoinNewsButton">Read Bitcoin News</button>
            `;
            break;
        case 'stocksDetail':
            titleText = 'Stocks';
            contentHTML = `
                <h3>Your Stock Portfolio</h3>
                <p>Current Stock Value: <span id="detailStocksValue">$${stocksBalance.toFixed(2)}</span></p>
                <p>Daily Change: <span id="detailStocksChange">${(Math.random() * 5 - 2.5).toFixed(2)}%</span></p>
                <div class="chart-placeholder">Fake Stock Market Chart - Market Trends Simulated</div>
                <p>Invest in thousands of stocks with as little as $1. Build your portfolio and track your favorite companies. Stock investments carry inherent risks, and past performance is not indicative of future results.</p>
                <div class="action-buttons">
                    <button id="buyStocksButton">Buy</button>
                    <button id="sellStocksButton">Sell</button>
                </div>
                <h3 style="margin-top: 30px;">Popular Stocks</h3>
                <ul>
                    <li>Apple (AAPL): +1.2% Today</li>
                    <li>Tesla (TSLA): -0.8% Today</li>
                    <li>Amazon (AMZN): +2.5% Today</li>
                    <li>Google (GOOGL): +0.5% Today</li>
                </ul>
                <button class="show-more" id="exploreStocksButton">Explore More Stocks</button>
            `;
            break;
        case 'offersDetail':
            titleText = 'All Offers';
            contentHTML = `
                <h3>Available Boosts & Offers</h3>
                <p>Explore a wide range of instant discounts and boosts available for your Cash Card. Activate a Boost before you spend to save instantly!</p>
                <div class="offer" data-offer-title="Pizza Palace 20% Off" data-offer-description="Get 20% off your next Pizza Palace order. Max discount $10. Valid until 12/31/2025.">
                    <div class="contact-item" style="background: #E67E22;">🍕</div>
                    <span>Pizza Palace 20% Off</span>
                    <span class="card-subtext">Redeem</span>
                </div>
                <div class="offer" data-offer-title="Grocery Store $5 Off" data-offer-description="Save $5 on your next grocery purchase over $50. Valid until 12/31/2025.">
                    <div class="contact-item" style="background: #27AE60;">🛒</div>
                    <span>Grocery Store $5 Off</span>
                    <span class="card-subtext">Redeem</span>
                </div>
                <div class="offer" data-offer-title="Coffee Shop 15% Off" data-offer-description="Enjoy 15% off your next coffee purchase. Max discount $3. Valid until 12/31/2025.">
                    <div class="contact-item" style="background: #8E44AD;">☕</div>
                    <span>Coffee Shop 15% Off</span>
                    <span class="card-subtext">Redeem</span>
                </div>
                <div class="offer" data-offer-title="Online Retailer 10% Off" data-offer-description="Get 10% off your next purchase at selected online retailers. Max discount $20. Valid until 12/31/2025.">
                    <div class="contact-item" style="background: #3498DB;">🛍️</div>
                    <span>Online Retailer 10% Off</span>
                    <span class="card-subtext">Redeem</span>
                </div>
                <button class="show-more" id="viewExpiredOffersButton">View Expired Offers</button>
            `;
            break;
        case 'mySpendDetail':
            titleText = 'My Spend';
            contentHTML = `
                <h3>Your Spending Insights</h3>
                <p>Track your spending habits and categorize your transactions to better manage your money. Understand where your money goes each month.</p>
                <p>Total Spend This Month: <span id="detailMySpendAmount">$140.00</span></p>
                <div class="chart-placeholder">Fake Spending Categories Chart - Visualizing Your Habits</div>
                <h3 style="margin-top: 30px;">Common Categories:</h3>
                <ul>
                    <li>Food & Dining: $65.00</li>
                    <li>Transportation: $30.00</li>
                    <li>Shopping: $25.00</li>
                    <li>Utilities: $20.00</li>
                    <li>Entertainment: $15.00</li>
                    <li>Health & Fitness: $45.00</li>
                </ul>
                <button class="show-more" id="viewAllCategoriesButton">View All Categories</button>
            `;
            break;
        case 'roundUpsDetail':
            titleText = 'Round Ups';
            contentHTML = `
                <h3>Round Ups to the Nearest Dollar</h3>
                <p>Automatically save money with every Cash Card purchase by rounding up to the nearest dollar. Your spare change is transferred to your savings.</p>
                <p>Accumulated Round Ups: <span id="accumulatedRoundUps">$${accumulatedRoundUps.toFixed(2)}</span></p>
                <div class="toggle-switch">
                    <label for="roundUpsToggle">Turn On Round Ups</label>
                    <label class="switch">
                        <input type="checkbox" id="roundUpsToggle" ${roundUpsEnabled ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
                <p style="margin-top: 20px;">Round Ups are a simple way to save without thinking about it. Every time you spend, we round up to the nearest dollar and transfer the difference to your savings. It's a painless way to build your savings over time.</p>
                <button class="show-more" id="roundUpsHistoryButton">View Round Ups History</button>
            `;
            break;
        case 'overdraftDetail':
            titleText = 'Overdraft Coverage';
            contentHTML = `
                <h3>Free Overdraft Coverage</h3>
                <p>Get up to $50 in free overdraft coverage for eligible direct deposits. No fees, no interest, no hidden charges. We've got your back!</p>
                <p>Eligibility: Requires at least $300 in direct deposits monthly. Coverage is automatically applied when you need it, helping you avoid bounced payments.</p>
                <button class="show-more" id="enableOverdraftButton">Enable Overdraft</button>
                <h3 style="margin-top: 30px;">How it Works</h3>
                <p>If a transaction takes your balance below zero, we'll cover you up to $50. The amount covered will be automatically deducted from your next direct deposit. It's a safety net for unexpected expenses.</p>
                <button class="show-more" id="overdraftFAQsButton">Overdraft FAQs</button>
            `;
            break;
        case 'privacySettings':
            titleText = 'Privacy & Security';
            contentHTML = `
                <h3>Manage Your Privacy</h3>
                <p>Control who can find you on Cash App and manage your security settings to keep your account safe and secure.</p>
                <p>• Two-Factor Authentication: <span>Enabled</span> (Recommended for all users. Adds an extra layer of security.)</p>
                <p>• Profile Visibility: <span>Public</span> (Change to Private to hide from search and public view)</p>
                <p>• Payment History: <span>Private</span> (Only you can see your full transaction history. You can share individual transactions.)</p>
                <p>• Data Sharing: <span>Limited</span> (Control how your data is shared with third parties.)</p>
                <button class="show-more" id="updatePrivacySettingsButton">Update Settings</button>
                <h3 style="margin-top: 30px;">Security Tips</h3>
                <p>Always use a strong, unique password. Be wary of phishing attempts and never share your login credentials. Enable notifications for all account activity.</p>
                <button class="show-more" id="securityCheckupButton">Perform Security Checkup</button>
            `;
            break;
        case 'notificationSettings':
            titleText = 'Notifications';
            contentHTML = `
                <h3>Notification Preferences</h3>
                <p>Choose how you receive alerts for transactions, payments, and app updates. Customize your alerts to stay informed without being overwhelmed.</p>
                <p>• Push Notifications: <span>On</span> (Instant alerts for all activity. Highly recommended.)</p>
                <p>• Email Alerts: <span>On</span> (Monthly statements and important updates. Check your spam folder.)</p>
                <p>• SMS Alerts: <span>Off</span> (Turn on for critical alerts via text message, such as large transactions.)</p>
                <p>• Investment Alerts: <span>On</span> (Get notified about Bitcoin/Stock price changes and market news.)</p>
                <p>• Offer Alerts: <span>On</span> (Receive notifications about new and expiring Cash Card offers.)</p>
                <button class="show-more" id="updateNotificationSettingsButton">Update Settings</button>
                <h3 style="margin-top: 30px;">Manage Specific Alerts</h3>
                <p>You can fine-tune notifications for specific types of transactions or app features, ensuring you only get the alerts that matter most to you.</p>
            `;
            break;
        case 'linkedAccountsSettings':
            titleText = 'Linked Accounts';
            contentHTML = `
                <h3>Manage Linked Accounts</h3>
                <p>View and manage your linked bank accounts and debit cards. These are used for adding and withdrawing money, and for direct deposits.</p>
                <p>• Bank Account: <span>****1234 (Primary Checking)</span> - Linked on Jan 2023</p>
                <p>• Debit Card: <span>****5678 (Visa)</span> - Linked on Feb 2023</p>
                <button class="show-more" id="linkNewAccountButton">Link New Account</button>
                <h3 style="margin-top: 30px;">Linking Instructions</h3>
                <p>To link a new account, you'll need your bank's login credentials or your account and routing numbers. The process is secure and encrypted to protect your financial information.</p>
                <button class="show-more" id="unlinkAccountButton">Unlink an Account</button>
            `;
            break;
        default:
            titleText = 'Detail';
            contentHTML = '<p>No content available for this detail screen.</p>';
    }

    detailScreenTitle.textContent = titleText;
    detailScreenContent.innerHTML = contentHTML;
    detailScreen.classList.add('active');
    document.getElementById('mainContent').style.overflow = 'hidden'; // Prevent scrolling on main content

    // Add event listeners for buttons dynamically added to detail screens
    if (screenType === 'cashBalanceDetail') {
        document.getElementById('detailAddMoneyButton').addEventListener('click', () => showMessageBox('Add Money', 'Simulating adding money. This is a demo app, so no real funds are added.'));
        document.getElementById('detailWithdrawMoneyButton').addEventListener('click', () => showMessageBox('Withdraw', 'Simulating withdrawing money. This is a demo app, so no real funds are withdrawn.'));
        document.getElementById('copyRoutingNumberButton').addEventListener('click', () => {
            const routingNumber = "****981";
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = routingNumber;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showMessageBox('Copied!', 'Routing number copied to clipboard.');
        });
        document.getElementById('copyAccountNumberButton').addEventListener('click', () => {
            const accountNumber = "****3231";
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = accountNumber;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showMessageBox('Copied!', 'Account number copied to clipboard.');
        });
    } else if (screenType === 'savingsDetail') {
        document.getElementById('detailSavingsBalance').textContent = `$${savingsBalance.toFixed(2)}`;
        document.getElementById('addFundsToSavingsButton').addEventListener('click', () => showMessageBox('Add to Savings', 'Simulating adding funds to savings.'));
        document.getElementById('withdrawFundsFromSavingsButton').addEventListener('click', () => showMessageBox('Withdraw from Savings', 'Simulating withdrawing funds from savings.'));
        document.getElementById('createSavingsGoalButton').addEventListener('click', () => showMessageBox('Create Goal', 'Simulating creation of a new savings goal.'));
    } else if (screenType === 'bitcoinDetail') {
        document.getElementById('detailBitcoinValue').textContent = `$${bitcoinBalance.toFixed(2)}`;
        document.getElementById('buyBitcoinButton').addEventListener('click', () => {
            const amount = parseFloat(prompt('Enter amount to buy (fake):'));
            if (!isNaN(amount) && amount > 0) {
                if (balance < amount) {
                    showMessageBox('Insufficient Funds', 'You do not have enough cash balance to buy Bitcoin.');
                    return;
                }
                balance -= amount;
                bitcoinBalance += amount * (1 / (Math.random() * 0.1 + 0.95)); // Simulate price variation
                updateNavBalance();
                showMessageBox('Buy Bitcoin', `Simulating Bitcoin purchase of $${amount.toFixed(2)}. Your fake holdings increased.`);
                saveState();
            } else {
                showMessageBox('Invalid Amount', 'Please enter a valid amount.');
            }
        });
        document.getElementById('sellBitcoinButton').addEventListener('click', () => {
            const amount = parseFloat(prompt('Enter amount to sell (fake):'));
            if (!isNaN(amount) && amount > 0) {
                if (bitcoinBalance < amount) {
                    showMessageBox('Insufficient Bitcoin', 'You do not have enough Bitcoin to sell that amount.');
                    return;
                }
                balance += amount;
                bitcoinBalance -= amount;
                updateNavBalance();
                showMessageBox('Sell Bitcoin', `Simulating Bitcoin sale of $${amount.toFixed(2)}. Your fake holdings decreased.`);
                saveState();
            } else {
                showMessageBox('Invalid Amount', 'Please enter a valid amount or you have insufficient Bitcoin.');
            }
        });
        document.getElementById('bitcoinNewsButton').addEventListener('click', () => showMessageBox('Bitcoin News', 'Simulating opening a Bitcoin news feed. Stay informed about market trends!'));
    } else if (screenType === 'stocksDetail') {
        document.getElementById('detailStocksValue').textContent = `$${stocksBalance.toFixed(2)}`;
        document.getElementById('buyStocksButton').addEventListener('click', () => {
            const amount = parseFloat(prompt('Enter amount to buy (fake):'));
            if (!isNaN(amount) && amount > 0) {
                if (balance < amount) {
                    showMessageBox('Insufficient Funds', 'You do not have enough cash balance to buy stocks.');
                    return;
                }
                balance -= amount;
                stocksBalance += amount * (1 / (Math.random() * 0.05 + 0.98)); // Simulate price variation
                updateNavBalance();
                showMessageBox('Buy Stocks', `Simulating stock purchase of $${amount.toFixed(2)}. Your fake portfolio increased.`);
                saveState();
            } else {
                showMessageBox('Invalid Amount', 'Please enter a valid amount.');
            }
        });
        document.getElementById('sellStocksButton').addEventListener('click', () => {
            const amount = parseFloat(prompt('Enter amount to sell (fake):'));
            if (!isNaN(amount) && amount > 0) {
                if (stocksBalance < amount) {
                    showMessageBox('Insufficient Stocks', 'You do not have enough stocks to sell that amount.');
                    return;
                }
                balance += amount;
                stocksBalance -= amount;
                updateNavBalance();
                showMessageBox('Sell Stocks', `Simulating stock sale of $${amount.toFixed(2)}. Your fake portfolio decreased.`);
                saveState();
            } else {
                showMessageBox('Invalid Amount', 'Please enter a valid amount or you have insufficient stocks.');
            }
        });
        document.getElementById('exploreStocksButton').addEventListener('click', () => showMessageBox('Explore Stocks', 'Simulating navigating to a stock exploration page. Discover new investment opportunities!'));
    } else if (screenType === 'offersDetail') {
        document.querySelectorAll('#detailScreenContent .offer').forEach(offerItem => {
            offerItem.addEventListener('click', () => {
                showMessageBox('Offer Redeemed', 'Simulating offer redemption. Discount applied to your next eligible purchase!');
            });
        });
        document.getElementById('viewExpiredOffersButton').addEventListener('click', () => showMessageBox('Expired Offers', 'Simulating viewing expired offers.'));
    } else if (screenType === 'mySpendDetail') {
        document.getElementById('detailMySpendAmount').textContent = `$${(Math.random() * 200 + 100).toFixed(2)}`; // Randomize spend amount
        document.getElementById('viewAllCategoriesButton').addEventListener('click', () => showMessageBox('All Categories', 'Simulating viewing all spending categories.'));
    } else if (screenType === 'roundUpsDetail') {
        document.getElementById('accumulatedRoundUps').textContent = `$${accumulatedRoundUps.toFixed(2)}`;
        document.getElementById('roundUpsToggle').checked = roundUpsEnabled;
        document.getElementById('roundUpsToggle').addEventListener('change', toggleRoundUps);
        document.getElementById('roundUpsHistoryButton').addEventListener('click', () => showMessageBox('Round Ups History', 'Simulating viewing your round ups history. See how much you\'ve saved!'));
    } else if (screenType === 'overdraftDetail') {
        document.getElementById('enableOverdraftButton').addEventListener('click', () => showMessageBox('Overdraft Enabled', 'Simulating overdraft coverage enabled. You are now covered up to $50!'));
        document.getElementById('overdraftFAQsButton').addEventListener('click', () => showMessageBox('Overdraft FAQs', 'Simulating opening a page with frequently asked questions about overdraft coverage.'));
    } else if (screenType === 'privacySettings') {
        document.getElementById('updatePrivacySettingsButton').addEventListener('click', () => showMessageBox('Settings Updated', 'Simulating privacy settings update.'));
        document.getElementById('securityCheckupButton').addEventListener('click', () => showMessageBox('Security Checkup', 'Simulating a security checkup. Review your account security settings.'));
    } else if (screenType === 'notificationSettings') {
        document.getElementById('updateNotificationSettingsButton').addEventListener('click', () => showMessageBox('Settings Updated', 'Simulating notification settings update.'));
    } else if (screenType === 'linkedAccountsSettings') {
        document.getElementById('linkNewAccountButton').addEventListener('click', () => showMessageBox('Account Linked', 'Simulating linking a new account.'));
        document.getElementById('unlinkAccountButton').addEventListener('click', () => showMessageBox('Unlink Account', 'Simulating unlinking an account.'));
    }
}

/**
 * Hides the currently active detail screen.
 */
function hideDetailScreen() {
    document.getElementById('detailScreen').classList.remove('active');
    document.getElementById('mainContent').style.overflow = 'auto'; // Re-enable scrolling on main content
}

/**
 * Toggles the 'Round Ups' feature on or off.
 * Updates the UI and provides a message box confirmation.
 */
function toggleRoundUps() {
    roundUpsEnabled = document.getElementById('roundUpsToggle').checked;
    document.getElementById('roundUpsStatus').textContent = roundUpsEnabled ? 'On' : 'Off';
    showMessageBox('Round Ups', `Round Ups are now ${roundUpsEnabled ? 'enabled' : 'disabled'}.`);
    // If enabling, start a small interval to simulate accumulation
    if (roundUpsEnabled) {
        startRoundUpsAccumulation();
    }
    saveState(); // Save state after round ups status update
}

/**
 * Simulates the accumulation of funds through round-ups.
 * This is a continuous process when round-ups are enabled.
 */
function startRoundUpsAccumulation() {
    setInterval(() => {
        if (roundUpsEnabled) {
            const randomRoundUp = Math.random() * 0.50 + 0.01; // Simulate small random round-up amounts (1 cent to 51 cents)
            accumulatedRoundUps += randomRoundUp;
            const accumulatedRoundUpsElement = document.getElementById('accumulatedRoundUps');
            if (accumulatedRoundUpsElement) {
                accumulatedRoundUpsElement.textContent = `$${accumulatedRoundUps.toFixed(2)}`;
            }
            saveState(); // Save state after accumulation
        }
    }, 15000); // Accumulate every 15 seconds for demo
}

/**
 * Simulates interest accrual for the savings account.
 * This runs continuously to show a growing balance.
 */
function startSavingsInterest() {
    setInterval(() => {
        if (savingsBalance > 0) {
            const interest = savingsBalance * 0.000005; // Very small daily interest rate for demo (0.0005% daily)
            savingsBalance += interest;
            const savingsAmountElement = document.getElementById('savingsAmount');
            if (savingsAmountElement) {
                savingsAmountElement.innerHTML = `$${savingsBalance.toFixed(2)} <span class="icon savings">$</span>`;
            }
            const detailSavingsBalanceElement = document.getElementById('detailSavingsBalance');
            if (detailSavingsBalanceElement) {
                detailSavingsBalanceElement.textContent = `$${savingsBalance.toFixed(2)}`;
            }
            const interestAccrualElement = document.getElementById('interestAccrual');
            if (interestAccrualElement) {
                // Update the simulated interest accrual amount in the detail screen
                interestAccrualElement.textContent = `$${(parseFloat(interestAccrualElement.textContent.replace('$', '')) + interest).toFixed(2)}`;
            }
            saveState(); // Save state after interest accrual
        }
    }, 5000); // Update every 5 seconds
}

/**
 * Simulates daily price changes for Bitcoin and Stocks.
 * Provides dynamic fluctuation to the investment values.
 */
function updateInvestmentValues() {
    setInterval(() => {
        // Bitcoin simulation: random change between -5% and +5%
        const bitcoinChangeFactor = (Math.random() * 0.1 - 0.05); // -0.05 to +0.05
        bitcoinBalance = Math.max(0, bitcoinBalance * (1 + bitcoinChangeFactor)); // Ensure balance doesn't go negative
        const bitcoinAmountElement = document.getElementById('bitcoinAmount');
        if (bitcoinAmountElement) {
            bitcoinAmountElement.innerHTML = `$${bitcoinBalance.toFixed(2)} <span class="icon bitcoin">₿</span>`;
        }
        const bitcoinChangeElement = document.getElementById('bitcoinChange');
        if (bitcoinChangeElement) {
            bitcoinChangeElement.textContent = `${(bitcoinChangeFactor * 100).toFixed(2)}% Today`;
            bitcoinChangeElement.style.color = bitcoinChangeFactor >= 0 ? '#00C853' : '#FF407A'; // Green for positive, red for negative
        }
        const detailBitcoinValueElement = document.getElementById('detailBitcoinValue');
        if (detailBitcoinValueElement) {
            detailBitcoinValueElement.textContent = `$${bitcoinBalance.toFixed(2)}`;
        }
        const detailBitcoinChangeElement = document.getElementById('detailBitcoinChange');
        if (detailBitcoinChangeElement) {
            detailBitcoinChangeElement.textContent = `${(bitcoinChangeFactor * 100).toFixed(2)}%`;
            detailBitcoinChangeElement.style.color = bitcoinChangeFactor >= 0 ? '#00C853' : '#FF407A';
        }


        // Stocks simulation: random change between -2.5% and +2.5%
        const stocksChangeFactor = (Math.random() * 0.05 - 0.025); // -0.025 to +0.025
        stocksBalance = Math.max(0, stocksBalance * (1 + stocksChangeFactor)); // Ensure balance doesn't go negative
        const stocksAmountElement = document.getElementById('stocksAmount');
        if (stocksAmountElement) {
            stocksAmountElement.innerHTML = `$${stocksBalance.toFixed(2)} <span class="icon stocks">📈</span>`;
        }
        const detailStocksValueElement = document.getElementById('detailStocksValue');
        if (detailStocksValueElement) {
            detailStocksValueElement.textContent = `$${stocksBalance.toFixed(2)}`;
        }
        const detailStocksChangeElement = document.getElementById('detailStocksChange');
        if (detailStocksChangeElement) {
            detailStocksChangeElement.textContent = `${(stocksChangeFactor * 100).toFixed(2)}%`;
            detailStocksChangeElement.style.color = stocksChangeFactor >= 0 ? '#00C853' : '#FF407A';
        }
        saveState(); // Save state after investment updates
    }, 10000); // Update every 10 seconds
}


// =====================================================================================================================
// Initialization and Event Listener Setup
// This section runs when the DOM is fully loaded, setting up initial UI states and all necessary event listeners.
// =====================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved state from localStorage
    loadState();

    // Set initial states for card lock and round ups based on global variables
    document.getElementById('lockCardButton').textContent = cardLocked ? 'Unlock Card' : 'Lock Card';
    document.getElementById('lockCardButton').style.background = cardLocked ? '#FF407A' : '#282828';
    document.getElementById('roundUpsStatus').textContent = roundUpsEnabled ? 'On' : 'Off';

    // ====================== Navigation Bar Event Listeners ======================
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove 'active' class from all sections and navigation items
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(navItem => navItem.classList.remove('active'));

            // Add 'active' class to the clicked navigation item and its corresponding section
            this.classList.add('active');
            const targetTab = this.dataset.tab;
            document.getElementById(targetTab).classList.add('active');

            // Update the header title dynamically based on the active section
            let headerTitleText = 'Cash App';
            switch (targetTab) {
                case 'moneySection':
                    headerTitleText = 'Money';
                    break;
                case 'cardSection':
                    headerTitleText = 'Card';
                    break;
                case 'keypadSection':
                    headerTitleText = 'Send & Request';
                    break;
                case 'discoverSection':
                    headerTitleText = 'Discover';
                    break;
                case 'activitySection':
                    headerTitleText = 'Activity';
                    break;
            }
            document.getElementById('headerTitle').textContent = headerTitleText;
        });
    });

    // ====================== Message Box Event Listener ======================
    document.getElementById('messageBoxOkButton').addEventListener('click', hideMessageBox);

    // ====================== Header Profile Icon Event Listener ======================
    document.getElementById('profileIcon').addEventListener('click', () => showPopup('profilePopup'));

    // ====================== Popup Close Button Event Listeners ======================
    document.getElementById('closeProfilePopup').addEventListener('click', () => hidePopup('profilePopup'));
    document.getElementById('closeTransactionPopup').addEventListener('click', () => hidePopup('transactionPopup'));
    document.getElementById('closeRecipientPopup').addEventListener('click', () => hidePopup('recipientPopup'));
    document.getElementById('closeOfferDetailPopup').addEventListener('click', () => hidePopup('offerDetailPopup'));
    document.getElementById('closeDetailScreen').addEventListener('click', hideDetailScreen);

    // ====================== Money Section Event Listeners ======================
    document.getElementById('addMoneyButton').addEventListener('click', () => showMessageBox('Add Money', 'Simulating adding money. This is a demo app, so no real funds are added.'));
    document.getElementById('withdrawMoneyButton').addEventListener('click', () => showMessageBox('Withdraw', 'Simulating withdrawing money. This is a demo app, so no real funds are withdrawn.'));

    // Money Section cards to show detail screens
    document.getElementById('cashBalanceCard').addEventListener('click', () => showDetailScreen('cashBalanceDetail'));
    document.getElementById('savingsCard').addEventListener('click', () => showDetailScreen('savingsDetail'));
    document.getElementById('bitcoinCard').addEventListener('click', () => showDetailScreen('bitcoinDetail'));
    document.getElementById('stocksCard').addEventListener('click', () => showDetailScreen('stocksDetail'));

    // ====================== Discover Section Event Listeners ======================
    // Offers and show more button
    document.querySelectorAll('#discoverSection .offer').forEach(offerItem => {
        offerItem.addEventListener('click', function() {
            const title = this.dataset.offerTitle;
            const description = this.dataset.offerDescription;
            showOfferDetail(title, description);
        });
    });
    document.getElementById('showMoreOffersButton').addEventListener('click', () => showMessageBox('More Offers', 'No more offers available in this demo. Check back later!'));
    document.getElementById('discoverSearchBar').addEventListener('input', function() {
        // This search bar is primarily visual, but can be expanded if needed.
        showMessageBox('Search', `Simulating search for "${this.value}" in Discover. No actual filtering in demo.`);
    });
    // Contact list items for Discover section (visual only)
    document.querySelectorAll('#discoverSection .contact-item').forEach(item => {
        item.addEventListener('click', function() {
            showMessageBox('Contact Selected', `Simulating interaction with ${this.textContent}.`);
        });
    });

    // ====================== Activity Section Event Listeners ======================
    // Search bar and filter contacts
    document.getElementById('activitySearchBar').addEventListener('input', function() {
        filterActivity(this.value);
    });
    document.querySelectorAll('#activitySection .contact-item').forEach(item => {
        item.addEventListener('click', function() {
            filterActivity(this.dataset.filterQuery);
        });
    });
    // Initial rendering of activity feed
    renderActivityFeed();

    // ====================== Card Section Event Listeners ======================
    document.getElementById('lockCardButton').addEventListener('click', toggleLockCard);
    document.getElementById('copyCardNumberButton').addEventListener('click', copyCardNumber);
    document.getElementById('exploreOffersCard').addEventListener('click', () => showDetailScreen('offersDetail'));
    document.getElementById('mySpendCard').addEventListener('click', () => showDetailScreen('mySpendDetail'));
    document.getElementById('roundUpsCard').addEventListener('click', () => showDetailScreen('roundUpsDetail'));
    document.getElementById('overdraftCard').addEventListener('click', () => showDetailScreen('overdraftDetail'));

    // ====================== Keypad Section Event Listeners ======================
    document.querySelectorAll('.numeric-pad button').forEach(button => {
        button.addEventListener('click', function() {
            updateAmount(this.dataset.value);
        });
    });
    document.getElementById('requestButton').addEventListener('click', () => showRecipientPopup('request'));
    document.getElementById('payButton').addEventListener('click', () => showRecipientPopup('pay'));

    // ====================== Recipient Popup Event Listeners ======================
    document.querySelectorAll('#recipientList .recipient-item:not(.add-new)').forEach(item => {
        item.addEventListener('click', function() {
            selectRecipient(this.dataset.recipient);
        });
    });
    document.getElementById('addRecipientButton').addEventListener('click', addRecipient);
    document.getElementById('confirmTransactionButton').addEventListener('click', confirmTransaction);

    // ====================== Profile Popup Settings Cards Event Listeners ======================
    document.getElementById('editProfileButton').addEventListener('click', () => showMessageBox('Edit Profile', 'Simulating profile edit. In a real app, you would see a form to update details.'));
    document.getElementById('signOutButton').addEventListener('click', () => {
        localStorage.removeItem('cashAppCloneState'); // Clear state on sign out
        balance = 1.51; // Reset to a default small balance
        savingsBalance = 0.00;
        bitcoinBalance = 0.00;
        stocksBalance = 0.00;
        roundUpsEnabled = false;
        cardLocked = false;
        accumulatedRoundUps = 0.00;
        transactions = []; // Clear transactions
        updateNavBalance();
        renderActivityFeed();
        showMessageBox('Signed Out', 'You have been signed out. Refresh the page to start a new session.');
        hidePopup('profilePopup');
    });
    document.getElementById('privacySettingsCard').addEventListener('click', () => showDetailScreen('privacySettings'));
    document.getElementById('notificationSettingsCard').addEventListener('click', () => showDetailScreen('notificationSettings'));
    document.getElementById('linkedAccountsSettingsCard').addEventListener('click', () => showDetailScreen('linkedAccountsSettings'));

    // ====================== Initial UI Updates and Simulations ======================
    updateNavBalance(); // Ensure balance is updated on load with correct formatting
    renderActivityFeed(); // Initial render of activity feed with loaded data
    startSavingsInterest(); // Start simulating savings interest
    updateInvestmentValues(); // Start simulating investment value changes
    startRoundUpsAccumulation(); // Start simulating round-ups accumulation if enabled

    // Event listener for activity search bar to clear filter on focus out if empty
    const activitySearchBar = document.getElementById('activitySearchBar');
    activitySearchBar.addEventListener('blur', () => {
        if (activitySearchBar.value === '') {
            filterActivity(''); // Re-render all if search bar is empty
        }
    });

    // Initial check for roundUpsToggle state (for the detail screen)
    const roundUpsToggleElement = document.getElementById('roundUpsToggle');
    if (roundUpsToggleElement) {
        roundUpsToggleElement.checked = roundUpsEnabled;
    }
});