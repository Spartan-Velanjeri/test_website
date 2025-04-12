/**
 * Main JavaScript file for the Supply Chain Manager application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Format all currency elements
    formatAllCurrencyElements();

    // Format all date elements
    formatAllDateElements();

    // Setup flash message auto-dismiss
    setupFlashMessageAutoDismiss();
});

/**
 * Helper function to format a number as currency
 * @param {number} value - The number to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

/**
 * Format all elements with the 'currency' class
 */
function formatAllCurrencyElements() {
    const currencyElements = document.querySelectorAll('.currency');
    currencyElements.forEach(function(element) {
        const value = parseFloat(element.textContent);
        if (!isNaN(value)) {
            element.textContent = formatCurrency(value);
        }
    });
}

/**
 * Format all elements with the 'date-format' class
 */
function formatAllDateElements() {
    const dateElements = document.querySelectorAll('.date-format');
    dateElements.forEach(function(element) {
        const dateStr = element.textContent;
        if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date)) {
                element.textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    });
}

/**
 * Setup auto-dismiss for flash messages after 5 seconds
 */
function setupFlashMessageAutoDismiss() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

/**
 * Calculate order total based on items and prices
 * @param {Array} items - Array of order items
 * @returns {number} Total order amount
 */
function calculateOrderTotal(items) {
    return items.reduce(function(total, item) {
        return total + (item.quantity * item.unitPrice);
    }, 0);
}

/**
 * Toggle visibility of an element
 * @param {string} elementId - ID of the element to toggle
 */
function toggleElementVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}

/**
 * Format a status string to a more readable format
 * @param {string} status - Status string to format
 * @returns {string} Formatted status string
 */
function formatStatus(status) {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
}

/**
 * Get status badge class based on status
 * @param {string} status - The status value
 * @returns {string} CSS class for the badge
 */
function getStatusBadgeClass(status) {
    switch(status) {
        case 'pending':
            return 'bg-warning text-dark';
        case 'processing':
            return 'bg-info';
        case 'shipped':
            return 'bg-primary';
        case 'delivered':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

/**
 * Show confirmation dialog before proceeding with an action
 * @param {string} message - Confirmation message to display
 * @returns {boolean} True if confirmed, false otherwise
 */
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to proceed?');
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Send an AJAX request
 * @param {string} url - The URL to send the request to
 * @param {string} method - The HTTP method to use (GET, POST, etc.)
 * @param {Object} data - The data to send with the request
 * @param {Function} callback - The function to call when the request is complete
 */
function sendAjaxRequest(url, method, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(new Error(xhr.statusText), null);
        }
    };
    
    xhr.onerror = function() {
        callback(new Error('Network Error'), null);
    };
    
    xhr.send(JSON.stringify(data));
}