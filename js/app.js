/**
 * LUMINA Web Application Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    dietaryFilter: 'all',
    cart: [],
    selectedDish: null,
    tipPercentage: 20,
    orderType: 'dinein' // 'dinein' or 'pickup'
  };

  // DOM Elements
  const menuContainer = document.getElementById('menu-items-grid');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const searchInput = document.getElementById('menu-search');
  const dietaryFilterSelect = document.getElementById('dietary-filter');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartCountBadge = document.getElementById('cart-count');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTaxEl = document.getElementById('cart-tax');
  const cartTipEl = document.getElementById('cart-tip');
  const cartTotalEl = document.getElementById('cart-total');
  const floatingCartBtn = document.getElementById('floating-cart-btn');
  const dishModal = document.getElementById('dish-modal');
  const reservationModal = document.getElementById('reservation-modal');
  const privateDiningModal = document.getElementById('private-dining-modal');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const liveStatusPill = document.getElementById('live-status-pill');

  // --- 1. INITIALIZATION ---
  initCategories();
  renderMenuItems();
  updateLiveHoursStatus();
  setupEventListeners();
  renderTestimonials();

  // --- 2. CATEGORY & MENU RENDERING ---
  function initCategories() {
    if (!categoryTabsContainer) return;
    categoryTabsContainer.innerHTML = RESTAURANT_DATA.menuCategories.map(cat => `
      <button 
        data-category="${cat.id}"
        class="category-btn px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
          cat.id === state.selectedCategory 
            ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
            : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30 bg-neutral-900/60'
        }"
      >
        ${cat.name}
      </button>
    `).join('');

    categoryTabsContainer.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.selectedCategory = e.currentTarget.dataset.category;
        updateCategoryButtonsUI();
        renderMenuItems();
      });
    });
  }

  function updateCategoryButtonsUI() {
    const buttons = categoryTabsContainer.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      const isSelected = btn.dataset.category === state.selectedCategory;
      if (isSelected) {
        btn.className = 'category-btn px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.25)]';
      } else {
        btn.className = 'category-btn px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 bg-neutral-900/60';
      }
    });
  }

  function getFilteredItems() {
    return RESTAURANT_DATA.menuItems.filter(item => {
      // Category match
      const matchesCategory = state.selectedCategory === 'all' || item.category === state.selectedCategory;
      
      // Search query match
      const query = state.searchQuery.toLowerCase();
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.winePairing.toLowerCase().includes(query);

      // Dietary tag match
      let matchesDietary = true;
      if (state.dietaryFilter !== 'all') {
        matchesDietary = item.tags.some(tag => tag.toLowerCase().includes(state.dietaryFilter.toLowerCase()));
      }

      return matchesCategory && matchesSearch && matchesDietary;
    });
  }

  function renderMenuItems() {
    if (!menuContainer) return;
    const items = getFilteredItems();

    if (items.length === 0) {
      menuContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/80 flex items-center justify-center text-amber-400/60 border border-white/5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h3 class="text-xl font-serif text-white mb-2">No culinary offerings match your filter</h3>
          <p class="text-neutral-400 text-sm max-w-md mx-auto">Try resetting the search terms or exploring our complete seasonal collection.</p>
          <button id="reset-filter-btn" class="mt-4 px-4 py-2 text-xs uppercase tracking-wider text-amber-300 border border-amber-400/40 rounded-full hover:bg-amber-400/10">
            Reset Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.selectedCategory = 'all';
          state.searchQuery = '';
          state.dietaryFilter = 'all';
          if (searchInput) searchInput.value = '';
          if (dietaryFilterSelect) dietaryFilterSelect.value = 'all';
          updateCategoryButtonsUI();
          renderMenuItems();
        });
      }
      return;
    }

    menuContainer.innerHTML = items.map(item => `
      <div class="dish-card group relative bg-neutral-900/80 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between" data-id="${item.id}">
        <div>
          <!-- Image with zoom & tag overlay -->
          <div class="relative h-60 w-full overflow-hidden cursor-pointer" onclick="window.LuminaApp.openDishModal('${item.id}')">
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              class="dish-img w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              ${item.tags.map(tag => `
                <span class="px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded-md bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-200">
                  ${tag}
                </span>
              `).join('')}
            </div>

            <!-- Price Pill -->
            <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-neutral-950/80 border border-white/10 text-white font-serif text-lg font-semibold tracking-wide">
              $${item.price}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 
                class="font-serif text-xl font-semibold text-white group-hover:text-amber-300 transition-colors cursor-pointer"
                onclick="window.LuminaApp.openDishModal('${item.id}')"
              >
                ${item.name}
              </h3>
            </div>
            
            <p class="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">
              ${item.description}
            </p>

            <!-- Sommelier pairing hint -->
            <div class="flex items-center gap-2 text-xs text-amber-400/80 py-2 px-3 rounded-lg bg-amber-400/5 border border-amber-400/10 mb-4">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 009-9H3a9 9 0 009 9zm0 0v-6"></path></svg>
              <span class="truncate"><strong>Pairing:</strong> ${item.winePairing}</span>
            </div>
          </div>
        </div>

        <!-- Action footer -->
        <div class="px-6 pb-6 pt-0 flex items-center justify-between gap-3 border-t border-white/5 mt-auto">
          <button 
            onclick="window.LuminaApp.openDishModal('${item.id}')"
            class="text-xs tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
          >
            Details & Allergens
          </button>
          
          <button 
            onclick="window.LuminaApp.addToCart('${item.id}')"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-amber-400/10 hover:bg-amber-400 hover:text-neutral-950 text-amber-300 border border-amber-400/30 transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add to Order
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- 3. DISH DETAIL QUICK VIEW MODAL ---
  function openDishModal(dishId) {
    const item = RESTAURANT_DATA.menuItems.find(d => d.id === dishId);
    if (!item || !dishModal) return;

    state.selectedDish = item;
    const modalContent = document.getElementById('dish-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="relative bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl">
        <!-- Close Button -->
        <button 
          onclick="window.LuminaApp.closeDishModal()"
          class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-amber-400 hover:text-neutral-950 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Media Hero -->
        <div class="relative h-72 w-full">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent"></div>
          
          <div class="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div class="flex gap-2 mb-2">
                ${item.tags.map(t => `<span class="px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">${t}</span>`).join('')}
              </div>
              <h2 class="font-serif text-3xl font-bold text-white">${item.name}</h2>
            </div>
            <div class="text-3xl font-serif font-bold text-amber-300">$${item.price}</div>
          </div>
        </div>

        <!-- Body Details -->
        <div class="p-6 md:p-8 space-y-6">
          <p class="text-neutral-300 text-base leading-relaxed">
            ${item.description}
          </p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div class="p-3.5 rounded-xl bg-neutral-800/50 border border-white/5">
              <span class="text-xs text-neutral-400 uppercase tracking-wider block mb-1">Calories</span>
              <span class="text-sm font-semibold text-white">${item.calories || '450 kcal'}</span>
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-800/50 border border-white/5">
              <span class="text-xs text-neutral-400 uppercase tracking-wider block mb-1">Preparation</span>
              <span class="text-sm font-semibold text-white">${item.prepTime || '15 mins'}</span>
            </div>
            <div class="p-3.5 rounded-xl bg-neutral-800/50 border border-white/5 col-span-2 md:col-span-1">
              <span class="text-xs text-neutral-400 uppercase tracking-wider block mb-1">Allergens</span>
              <span class="text-sm font-semibold text-amber-200">
                ${item.allergens && item.allergens.length > 0 ? item.allergens.join(', ') : 'None Reported'}
              </span>
            </div>
          </div>

          <!-- Wine Pairing Callout -->
          <div class="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-0.5">Cellar Master's Recommended Pairing</h4>
              <p class="text-sm text-neutral-200">${item.winePairing}</p>
            </div>
          </div>

          <!-- Action buttons inside modal -->
          <div class="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
            <button 
              onclick="window.LuminaApp.closeDishModal()"
              class="px-5 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button 
              onclick="window.LuminaApp.addToCart('${item.id}'); window.LuminaApp.closeDishModal();"
              class="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add to Tasting Order ($${item.price})
            </button>
          </div>
        </div>
      </div>
    `;

    dishModal.classList.remove('hidden');
    dishModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeDishModal() {
    if (!dishModal) return;
    dishModal.classList.add('hidden');
    dishModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // --- 4. TASTING ORDER / CART DRAWER SYSTEM ---
  function addToCart(dishId) {
    const item = RESTAURANT_DATA.menuItems.find(d => d.id === dishId);
    if (!item) return;

    const existingIndex = state.cart.findIndex(c => c.id === dishId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    showToast(`Added "${item.name}" to your tasting order`, 'success');
  }

  function updateQuantity(dishId, change) {
    const index = state.cart.findIndex(c => c.id === dishId);
    if (index === -1) return;

    state.cart[index].quantity += change;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    updateCartUI();
  }

  function removeFromCart(dishId) {
    state.cart = state.cart.filter(c => c.id !== dishId);
    updateCartUI();
  }

  function toggleCartDrawer(open) {
    if (!cartDrawer || !cartBackdrop) return;
    if (open) {
      cartBackdrop.classList.add('active');
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      cartBackdrop.classList.remove('active');
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08875; // NYC / typical dining tax ~8.875%
    const tip = subtotal * (state.tipPercentage / 100);
    const total = subtotal + tax + tip;

    // Badges & Floating Btn
    if (cartCountBadge) {
      cartCountBadge.textContent = totalItems;
      cartCountBadge.classList.toggle('hidden', totalItems === 0);
    }
    if (floatingCartBtn) {
      const priceDisplay = document.getElementById('floating-cart-total');
      if (priceDisplay) priceDisplay.textContent = `$${subtotal.toFixed(2)}`;
      floatingCartBtn.classList.toggle('scale-0', totalItems === 0);
      floatingCartBtn.classList.toggle('scale-100', totalItems > 0);
    }

    // Totals in Drawer
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTaxEl) cartTaxEl.textContent = `$${tax.toFixed(2)}`;
    if (cartTipEl) cartTipEl.textContent = `$${tip.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

    // Render Items in Drawer
    if (cartItemsList) {
      if (state.cart.length === 0) {
        cartItemsList.innerHTML = `
          <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <div class="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <p class="font-serif text-lg text-white mb-1">Your Tasting Slate is Empty</p>
            <p class="text-xs text-neutral-500 max-w-xs">Explore our hearth dishes and cellar collection to curate your pre-order or dining selections.</p>
          </div>
        `;
      } else {
        cartItemsList.innerHTML = state.cart.map(item => `
          <div class="p-3.5 rounded-2xl bg-neutral-800/40 border border-white/5 flex gap-3.5 items-center">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-1">
                <h4 class="text-sm font-semibold text-white truncate">${item.name}</h4>
                <button onclick="window.LuminaApp.removeFromCart('${item.id}')" class="text-neutral-500 hover:text-red-400 text-xs">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <p class="text-xs text-amber-300 font-semibold mb-2">$${item.price} each</p>
              
              <!-- Quantity Controls -->
              <div class="flex items-center gap-2">
                <div class="flex items-center border border-white/10 rounded-lg bg-neutral-900/80">
                  <button onclick="window.LuminaApp.updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white text-xs">-</button>
                  <span class="w-6 text-center text-xs text-white font-medium">${item.quantity}</span>
                  <button onclick="window.LuminaApp.updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white text-xs">+</button>
                </div>
                <span class="text-xs text-neutral-400 font-medium ml-auto">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --- 5. RESERVATION SYSTEM ---
  function openReservationModal(defaultDate = null) {
    if (!reservationModal) return;
    
    // Set default date picker to tomorrow
    const dateInput = document.getElementById('res-date');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Populate seating area choices
    const seatingContainer = document.getElementById('seating-options-container');
    if (seatingContainer && seatingContainer.children.length === 0) {
      seatingContainer.innerHTML = RESTAURANT_DATA.seatingAreas.map((area, i) => `
        <label class="cursor-pointer border border-white/10 rounded-xl p-3 bg-neutral-800/40 hover:border-amber-400/40 transition-all flex items-start gap-3">
          <input type="radio" name="res-seating" value="${area.id}" ${i === 0 ? 'checked' : ''} class="mt-1 accent-amber-400">
          <div>
            <div class="text-sm font-semibold text-white">${area.name}</div>
            <div class="text-xs text-neutral-400 leading-snug">${area.desc}</div>
          </div>
        </label>
      `).join('');
    }

    reservationModal.classList.remove('hidden');
    reservationModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeReservationModal() {
    if (!reservationModal) return;
    reservationModal.classList.add('hidden');
    reservationModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function handleReservationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const guests = form['res-guests'].value;
    const date = form['res-date'].value;
    const time = form['res-time'].value;
    const seating = form['res-seating'].value;
    const name = form['res-name'].value;
    const email = form['res-email'].value;
    const phone = form['res-phone'].value;
    const occasion = form['res-occasion'].value;
    const notes = form['res-notes'].value;

    const bookingRef = 'LUM-' + Math.floor(100000 + Math.random() * 900000);
    const seatingName = RESTAURANT_DATA.seatingAreas.find(s => s.id === seating)?.name || 'Main Dining';

    // Show Confirmation View in Modal
    const modalBody = document.getElementById('reservation-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="text-center py-6 px-4">
          <div class="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <span class="text-xs font-semibold uppercase tracking-widest text-amber-400">Table Confirmed</span>
          <h2 class="font-serif text-3xl font-bold text-white mt-1 mb-2">We Look Forward to Welcoming You</h2>
          <p class="text-neutral-400 text-sm max-w-md mx-auto mb-6">
            A confirmation email & SMS has been dispatched to <strong class="text-white">${email}</strong>.
          </p>

          <!-- Ticket Card -->
          <div class="max-w-md mx-auto bg-neutral-800/80 border border-amber-400/30 rounded-2xl p-6 text-left relative overflow-hidden mb-6">
            <div class="absolute -top-3 -right-3 w-16 h-16 bg-amber-400/10 rounded-full blur-xl"></div>
            <div class="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-neutral-400">Reservation Reference</span>
                <div class="text-xl font-mono font-bold text-amber-300">${bookingRef}</div>
              </div>
              <div class="text-right">
                <span class="text-[10px] uppercase tracking-wider text-neutral-400">Party Size</span>
                <div class="text-base font-semibold text-white">${guests} Guests</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span class="text-xs text-neutral-400 block">Date & Time</span>
                <span class="font-medium text-white">${date} at ${time}</span>
              </div>
              <div>
                <span class="text-xs text-neutral-400 block">Seating Zone</span>
                <span class="font-medium text-white">${seatingName}</span>
              </div>
              <div>
                <span class="text-xs text-neutral-400 block">Guest of Honor</span>
                <span class="font-medium text-white">${name}</span>
              </div>
              <div>
                <span class="text-xs text-neutral-400 block">Occasion</span>
                <span class="font-medium text-amber-200 capitalize">${occasion || 'Dinner Service'}</span>
              </div>
            </div>

            ${notes ? `
              <div class="pt-3 border-t border-white/5 text-xs text-neutral-400">
                <strong class="text-neutral-300">Special Notes:</strong> ${notes}
              </div>
            ` : ''}
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onclick="window.LuminaApp.downloadReservationPass('${bookingRef}')"
              class="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Calendar Pass (.ics)
            </button>
            <button 
              onclick="window.LuminaApp.closeReservationModal()"
              class="px-6 py-2.5 rounded-xl text-sm border border-white/10 text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      `;
    }

    showToast(`Reservation ${bookingRef} booked successfully!`, 'success');
  }

  // --- 6. LIVE STATUS CALCULATION (OPEN/CLOSED) ---
  function updateLiveHoursStatus() {
    if (!liveStatusPill) return;
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const currentHour = now.getHours();

    let isOpen = false;
    let message = '';

    if (day === 1) { // Monday
      isOpen = false;
      message = 'Closed Mondays • Open Tomorrow at 5:00 PM';
    } else if (day === 0) { // Sunday (11 AM - 9:30 PM)
      if (currentHour >= 11 && currentHour < 22) {
        isOpen = true;
        message = 'Open Today • Brunch & Dinner until 9:30 PM';
      } else {
        message = 'Closed Now • Opens Sunday 11:00 AM';
      }
    } else if (day >= 2 && day <= 4) { // Tue - Thu (5 PM - 10:30 PM)
      if (currentHour >= 17 && currentHour < 23) {
        isOpen = true;
        message = 'Open Now • Dinner Service until 10:30 PM';
      } else {
        message = 'Closed Now • Dinner Service from 5:00 PM';
      }
    } else { // Fri - Sat (5 PM - 11:30 PM)
      if (currentHour >= 17 && currentHour < 24) {
        isOpen = true;
        message = 'Open Now • Hearth & Lounge until 11:30 PM';
      } else {
        message = 'Closed Now • Fires Ignite Today at 5:00 PM';
      }
    }

    liveStatusPill.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full status-dot ${isOpen ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}"></span>
      <span class="text-xs font-medium tracking-wide ${isOpen ? 'text-emerald-300' : 'text-neutral-300'}">${message}</span>
    `;
  }

  // --- 7. TESTIMONIALS RENDERING ---
  function renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;
    container.innerHTML = RESTAURANT_DATA.testimonials.map(item => `
      <div class="p-8 rounded-3xl bg-neutral-900/60 border border-white/5 relative flex flex-col justify-between hover:border-amber-400/20 transition-all duration-300">
        <!-- Quote Icon -->
        <div class="text-amber-400/20 mb-4">
          <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        </div>

        <p class="text-neutral-300 text-sm leading-relaxed italic mb-6">
          "${item.quote}"
        </p>

        <div class="flex items-center gap-3 pt-4 border-t border-white/5">
          <img src="${item.avatar}" alt="${item.name}" class="w-11 h-11 rounded-full object-cover border border-amber-400/30">
          <div>
            <h4 class="text-sm font-semibold text-white font-serif">${item.name}</h4>
            <p class="text-xs text-neutral-400">${item.title}</p>
          </div>
          <div class="ml-auto flex text-amber-400 text-xs">
            ${'★'.repeat(item.stars)}
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- 8. TOAST NOTIFICATIONS ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg px-4 py-3 rounded-xl shadow-2xl border text-sm flex items-center gap-3 bg-neutral-900 ${
      type === 'success' ? 'border-emerald-500/40 text-emerald-200' : 'border-amber-400/40 text-amber-200'
    }`;
    toast.innerHTML = `
      <svg class="w-5 h-5 shrink-0 ${type === 'success' ? 'text-emerald-400' : 'text-amber-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'success' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' 
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'}
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- 9. EVENT LISTENERS SETUP ---
  function setupEventListeners() {
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMenuItems();
      });
    }

    // Dietary filter
    if (dietaryFilterSelect) {
      dietaryFilterSelect.addEventListener('change', (e) => {
        state.dietaryFilter = e.target.value;
        renderMenuItems();
      });
    }

    // Cart Drawer triggers
    const openCartButtons = document.querySelectorAll('.open-cart-trigger');
    openCartButtons.forEach(btn => btn.addEventListener('click', () => toggleCartDrawer(true)));
    
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => toggleCartDrawer(false));

    // Tip buttons in drawer
    const tipButtons = document.querySelectorAll('.tip-btn');
    tipButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tipButtons.forEach(b => b.classList.remove('bg-amber-400', 'text-neutral-950', 'border-amber-400'));
        e.currentTarget.classList.add('bg-amber-400', 'text-neutral-950', 'border-amber-400');
        state.tipPercentage = parseInt(e.currentTarget.dataset.tip);
        updateCartUI();
      });
    });

    // Checkout button simulated action
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          showToast('Please add items to your tasting slate first', 'info');
          return;
        }
        toggleCartDrawer(false);
        openReservationModal();
        showToast('Tasting slate attached to reservation inquiry!', 'success');
      });
    }

    // Reservation Modal triggers
    const resTriggers = document.querySelectorAll('.open-reservation-trigger');
    resTriggers.forEach(btn => btn.addEventListener('click', () => openReservationModal()));

    const closeResBtn = document.getElementById('close-res-modal-btn');
    if (closeResBtn) closeResBtn.addEventListener('click', closeReservationModal);

    const resForm = document.getElementById('reservation-form');
    if (resForm) resForm.addEventListener('submit', handleReservationSubmit);

    // Private Dining triggers
    const privateDiningTriggers = document.querySelectorAll('.open-private-dining-trigger');
    privateDiningTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        if (privateDiningModal) {
          privateDiningModal.classList.remove('hidden');
          privateDiningModal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closePrivateDiningBtn = document.getElementById('close-private-dining-btn');
    if (closePrivateDiningBtn) {
      closePrivateDiningBtn.addEventListener('click', () => {
        if (privateDiningModal) {
          privateDiningModal.classList.add('hidden');
          privateDiningModal.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    }

    const privateDiningForm = document.getElementById('private-dining-form');
    if (privateDiningForm) {
      privateDiningForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Private dining inquiry received. Our concierge will call within 2 hours.', 'success');
        if (privateDiningModal) {
          privateDiningModal.classList.add('hidden');
          privateDiningModal.classList.remove('flex');
          document.body.style.overflow = '';
        }
        privateDiningForm.reset();
      });
    }

    // Mobile nav toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
    if (mobileMenuBtn && mobileMenuDrawer) {
      mobileMenuBtn.addEventListener('click', () => mobileMenuDrawer.classList.toggle('hidden'));
    }
    if (closeMobileMenuBtn && mobileMenuDrawer) {
      closeMobileMenuBtn.addEventListener('click', () => mobileMenuDrawer.classList.add('hidden'));
    }

    // Newsletter subscription form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for subscribing to Lumina’s Cellar Club & Journal.', 'success');
        newsletterForm.reset();
      });
    }
  }

  // Helper simulated ics download
  function downloadReservationPass(bookingRef) {
    showToast(`Pass #${bookingRef}.ics downloaded to device`, 'success');
  }

  // Expose global methods to window for inline onclick handlers
  window.LuminaApp = {
    addToCart,
    removeFromCart,
    updateQuantity,
    openDishModal,
    closeDishModal,
    openReservationModal,
    closeReservationModal,
    downloadReservationPass
  };
});
