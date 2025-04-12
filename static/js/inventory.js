/**
 * JavaScript for inventory management functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Handle inventory filter form submission
    const inventoryFilterForm = document.getElementById('inventoryFilterForm');
    if (inventoryFilterForm) {
        inventoryFilterForm.addEventListener('submit', function(event) {
            // Remove empty fields from the form before submitting
            const inputs = this.querySelectorAll('input, select');
            inputs.forEach(function(input) {
                if (input.value === '' && input.name !== 'csrf_token') {
                    input.disabled = true;
                }
            });
        });
    }
    
    // Low stock warning colors
    const inventoryQuantities = document.querySelectorAll('.inventory-quantity');
    inventoryQuantities.forEach(function(element) {
        const quantity = parseInt(element.textContent);
        const minLevel = parseInt(element.getAttribute('data-min-level'));
        
        if (quantity <= 0) {
            element.classList.add('text-danger', 'fw-bold');
        } else if (quantity <= minLevel) {
            element.classList.add('text-warning', 'fw-bold');
        } else {
            element.classList.add('text-success');
        }
    });
    
    // Quick inventory adjustment buttons
    const quickAdjustButtons = document.querySelectorAll('[data-adjust]');
    if (quickAdjustButtons.length > 0) {
        quickAdjustButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const quantityInput = document.getElementById('quantity');
                const currentValue = parseInt(quantityInput.value) || 0;
                const adjustment = parseInt(this.getAttribute('data-adjust'));
                
                // Calculate new value, ensuring it doesn't go below zero
                const newValue = Math.max(0, currentValue + adjustment);
                quantityInput.value = newValue;
                
                // Highlight change with animation
                quantityInput.classList.add('bg-light');
                setTimeout(function() {
                    quantityInput.classList.remove('bg-light');
                }, 300);
            });
        });
    }
    
    // Handle bulk inventory update checkboxes
    const bulkSelectAll = document.getElementById('bulkSelectAll');
    if (bulkSelectAll) {
        bulkSelectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.inventory-select-item');
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = bulkSelectAll.checked;
            });
            
            // Update bulk action button state
            updateBulkActionState();
        });
        
        // Individual checkboxes
        const itemCheckboxes = document.querySelectorAll('.inventory-select-item');
        itemCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                // Update "select all" checkbox
                const allChecked = document.querySelectorAll('.inventory-select-item:checked').length === itemCheckboxes.length;
                bulkSelectAll.checked = allChecked;
                
                // Update bulk action button state
                updateBulkActionState();
            });
        });
    }
    
    // Update bulk action button state
    function updateBulkActionState() {
        const bulkActionButton = document.getElementById('bulkActionButton');
        if (bulkActionButton) {
            const checkedCount = document.querySelectorAll('.inventory-select-item:checked').length;
            bulkActionButton.disabled = checkedCount === 0;
            
            // Update button text with count
            const buttonText = bulkActionButton.getAttribute('data-base-text') || 'Bulk Action';
            bulkActionButton.textContent = `${buttonText} (${checkedCount})`;
        }
    }
    
    // Inventory value chart (if Chart.js is available)
    const inventoryValueChart = document.getElementById('inventoryValueChart');
    if (inventoryValueChart && typeof Chart !== 'undefined') {
        // This is where you would initialize a Chart.js chart
        // Example: new Chart(inventoryValueChart, { ... });
        console.log('Chart.js support ready for inventory visualizations');
    }
    
    // Set up search with delay for better performance
    const inventorySearch = document.getElementById('inventorySearch');
    if (inventorySearch) {
        let searchTimeout;
        
        inventorySearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(function() {
                const searchTerm = inventorySearch.value.toLowerCase();
                const inventoryRows = document.querySelectorAll('.inventory-item-row');
                
                inventoryRows.forEach(function(row) {
                    const productName = row.getAttribute('data-product-name').toLowerCase();
                    const productSku = row.getAttribute('data-product-sku').toLowerCase();
                    
                    if (productName.includes(searchTerm) || productSku.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }, 300); // 300ms delay for typing
        });
    }
});