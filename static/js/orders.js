/**
 * JavaScript for order management functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Order status badge colors
    const orderStatusBadges = document.querySelectorAll('.order-status');
    orderStatusBadges.forEach(function(badge) {
        const status = badge.getAttribute('data-status');
        
        if (status === 'pending') {
            badge.classList.add('bg-warning', 'text-dark');
        } else if (status === 'processing') {
            badge.classList.add('bg-info', 'text-dark');
        } else if (status === 'shipped') {
            badge.classList.add('bg-primary');
        } else if (status === 'delivered') {
            badge.classList.add('bg-success');
        } else if (status === 'cancelled') {
            badge.classList.add('bg-danger');
        } else {
            badge.classList.add('bg-secondary');
        }
    });
    
    // Handle product selection in "Add Item" modal
    const productSelect = document.getElementById('product_id');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const productId = this.value;
            if (productId) {
                // Fetch product price from the API
                fetch(`/api/product/${productId}/price`)
                    .then(response => response.json())
                    .then(data => {
                        const unitPriceInput = document.getElementById('unit_price');
                        if (unitPriceInput) {
                            unitPriceInput.value = data.price;
                            unitPriceInput.placeholder = `Default: $${data.price}`;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching product price:', error);
                    });
            }
        });
    }
    
    // Calculate subtotal when quantity or price changes
    const quantityInput = document.getElementById('quantity');
    const unitPriceInput = document.getElementById('unit_price');
    const subtotalDisplay = document.getElementById('item-subtotal');
    
    function updateSubtotal() {
        if (quantityInput && unitPriceInput && subtotalDisplay) {
            const quantity = parseInt(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const subtotal = quantity * unitPrice;
            
            subtotalDisplay.textContent = formatCurrency(subtotal);
        }
    }
    
    if (quantityInput && unitPriceInput) {
        quantityInput.addEventListener('input', updateSubtotal);
        unitPriceInput.addEventListener('input', updateSubtotal);
    }
    
    // Order items quantity adjustment buttons
    const quantityAdjustBtns = document.querySelectorAll('.quantity-adjust');
    quantityAdjustBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const input = document.getElementById(this.getAttribute('data-target'));
            const action = this.getAttribute('data-action');
            
            if (input) {
                let value = parseInt(input.value) || 0;
                
                if (action === 'increase') {
                    value++;
                } else if (action === 'decrease' && value > 1) {
                    value--;
                }
                
                input.value = value;
                
                // Trigger change event to update calculations
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    });
    
    // Order filter form handling
    const orderFilterForm = document.getElementById('orderFilterForm');
    if (orderFilterForm) {
        orderFilterForm.addEventListener('submit', function(event) {
            // Remove empty fields from form before submitting
            const inputs = this.querySelectorAll('input, select');
            inputs.forEach(function(input) {
                if (input.value === '' && input.name !== 'csrf_token' && input.name !== 'type') {
                    input.disabled = true;
                }
            });
        });
    }
    
    // Order status update confirmation
    const statusUpdateForms = document.querySelectorAll('.order-status-form');
    statusUpdateForms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            const newStatus = this.querySelector('input[name="status"]').value;
            let confirmMessage;
            
            switch (newStatus) {
                case 'processing':
                    confirmMessage = 'Start processing this order? This will deduct items from your inventory.';
                    break;
                case 'cancelled':
                    confirmMessage = 'Are you sure you want to cancel this order? This action cannot be undone.';
                    break;
                case 'shipped':
                    confirmMessage = 'Mark this order as shipped?';
                    break;
                case 'delivered':
                    confirmMessage = 'Mark this order as delivered? This will add items to the customer\'s inventory.';
                    break;
                default:
                    confirmMessage = 'Update order status to ' + newStatus + '?';
            }
            
            if (!confirm(confirmMessage)) {
                event.preventDefault();
            }
        });
    });
    
    // Order summary calculations
    function updateOrderSummary() {
        const subtotalElements = document.querySelectorAll('.item-subtotal');
        let orderSubtotal = 0;
        
        subtotalElements.forEach(function(element) {
            orderSubtotal += parseFloat(element.getAttribute('data-value') || 0);
        });
        
        const orderSubtotalElement = document.getElementById('order-subtotal');
        const orderTaxElement = document.getElementById('order-tax');
        const orderTotalElement = document.getElementById('order-total');
        
        if (orderSubtotalElement) {
            orderSubtotalElement.textContent = formatCurrency(orderSubtotal);
        }
        
        if (orderTaxElement && orderTotalElement) {
            const taxRate = parseFloat(orderTaxElement.getAttribute('data-tax-rate') || 0);
            const taxAmount = orderSubtotal * (taxRate / 100);
            const orderTotal = orderSubtotal + taxAmount;
            
            orderTaxElement.textContent = formatCurrency(taxAmount);
            orderTotalElement.textContent = formatCurrency(orderTotal);
        }
    }
    
    // Call summary update on page load if needed
    if (document.querySelector('.item-subtotal')) {
        updateOrderSummary();
    }
});