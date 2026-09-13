/**
 * AKASIA - Aplicación Principal
 * Catálogo interactivo, conmutador de imágenes de autor, modales y WhatsApp.
 */

(() => {
  // Cargar dependencias globales expuestas por data.js
  const { DEFAULT_CONFIG, NECKLACES_DATA, CLASICOS_DATA, LOOKBOOK_GALLERY } = window;

  class AkasiaApp {
    constructor() {
      this.necklaces = [...NECKLACES_DATA];
      this.clasicos = window.CLASICOS_DATA ? [...window.CLASICOS_DATA] : [];
      this.currentFilter = 'all'; // 'all', 'available', 'sold'
      this.searchQuery = '';
      this.selectedProduct = null;
      this.modalActiveTab = 'flat'; // 'flat' | 'worn'

      this.init();
    }

    init() {
      this.renderCatalog();
      this.renderClasicos();
      this.updateHeaderCounter();
      this.setupEventListeners();
      this.setupModal();
      this.setupHeroCarousel();
      this.setupScrollPrompt();
      this.setupDropsPortal();
      this.setupMobileNav();
      this.updateFloatingWhatsApp();
    }

    /**
     * Genera el enlace directo a WhatsApp con mensaje pre-armado
     */
    generateWhatsAppLink(necklace = null) {
      const phoneNumber = DEFAULT_CONFIG.whatsappNumber;
      let text = '';

      if (necklace) {
        if (necklace.isClassic) {
          text = `¡Hola Akasia! ✨ Me interesa el collar clásico *${necklace.name}* (${DEFAULT_CONFIG.currency} ${necklace.price}) de la línea complementaria. ¿Cómo puedo encargarlo?`;
        } else {
          text = `¡Hola Akasia! ✨ Me interesa el collar  *${necklace.name}* (${DEFAULT_CONFIG.currency} ${necklace.price})  ¿Sigue disponible para compra?`;
        }
      } else {
        text = `¡Hola Akasia! ✨ Vi su catálogo online de collares y me gustaría hacer una consulta personalizada.`;
      }

      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    }

    updateHeaderCounter() {
      const availableCount = this.necklaces.filter(n => !n.isSold).length;
      const counterEl = document.getElementById('availableCounter');
      if (counterEl) {
        counterEl.innerHTML = `<span class="dot"></span> <span class="counter-number">${availableCount}</span> <span class="counter-label">Disponibles</span>`;
      }

      // Actualizar números en filtros (solo Todos y Disponibles)
      const allBtn = document.querySelector('[data-filter="all"]');
      const availBtn = document.querySelector('[data-filter="available"]');

      if (allBtn) allBtn.textContent = `Todos (${this.necklaces.length})`;
      if (availBtn) availBtn.textContent = `Disponibles (${availableCount})`;
    }

    updateFloatingWhatsApp() {
      const floatingBtn = document.getElementById('floatingWaBtn');
      const footerBtn = document.getElementById('footerWaLink');
      const link = this.generateWhatsAppLink();
      if (floatingBtn) {
        floatingBtn.href = link;
        floatingBtn.target = '_blank';
        floatingBtn.rel = 'noopener noreferrer';
      }
      if (footerBtn) {
        footerBtn.href = link;
        footerBtn.target = '_blank';
        footerBtn.rel = 'noopener noreferrer';
      }
    }

    getFilteredNecklaces() {
      const filtered = this.necklaces.filter(item => {
        // Filtro de estado
        if (this.currentFilter === 'available' && item.isSold) return false;
        if (this.currentFilter === 'sold' && !item.isSold) return false;

        // Filtro de búsqueda
        if (this.searchQuery) {
          const q = this.searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesLength = item.length.toLowerCase().includes(q);
          const matchesDiameter = item.diameter.toLowerCase().includes(q);
          return matchesName || matchesLength || matchesDiameter;
        }

        return true;
      });

      // Ordenar: Piezas disponibles primero, piezas no disponibles/vendidas al fondo
      return filtered.sort((a, b) => {
        if (a.isSold === b.isSold) return 0;
        return a.isSold ? 1 : -1;
      });
    }

    renderCatalog() {
      const grid = document.getElementById('productsGrid');
      if (!grid) return;

      const filtered = this.getFilteredNecklaces();

      if (filtered.length === 0) {
        grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--ivory-muted);">
          <p style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">No se encontraron piezas</p>
          <p style="font-size: 0.9rem; font-family: var(--font-mono);">Intenta con otro término o limpia los filtros.</p>
        </div>
      `;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const waLink = this.generateWhatsAppLink(item);
        const isSold = item.isSold;

        return `
        <article class="product-card ${isSold ? 'is-sold' : ''}" data-id="${item.id}">
          <!-- Contenedor de Imagen con Efecto Hover/Touch -->
          <div class="card-media-wrapper" data-action="view-modal" data-id="${item.id}" title="Click para ver en detalle">
            <div class="card-badges">
              <span class="badge-unique">1 OF 1</span>
              <span class="badge-status ${isSold ? 'sold' : 'available'}">
                ${isSold ? 'VENDIDO' : 'DISPONIBLE'}
              </span>
            </div>

            <!-- Foto 1: Flat Lay Studio -->
            <img src="${item.flatImage}" 
                 alt="${item.name} - Flat lay" 
                 class="card-img card-img-flat" 
                 loading="lazy">

            <!-- Foto 2: Puesta en Modelo / Lookbook -->
            <img src="${item.wornImage}" 
                 alt="${item.name} - En modelo" 
                 class="card-img card-img-worn" 
                 loading="lazy">

            <div class="card-photo-toggle-hint">
              <span>Hover / Tap para alternar vista</span>
            </div>
          </div>

          <!-- Contenido de la Tarjeta (Solo nombre, precio, largo y diámetro) -->
          <div class="card-content">
            <div class="card-header-row">
              <h3 class="card-title">${item.name}</h3>
              <span class="card-price">${DEFAULT_CONFIG.currency} ${item.price}</span>
            </div>

            <!-- Ficha Técnica (Largo y Diámetro) -->
            <div class="card-specs-row">
              <span class="spec-pill">
                Largo: <strong>${item.length}</strong>
              </span>
              <span class="spec-pill">
                Diámetro: <strong>${item.diameter}</strong>
              </span>
            </div>

            <!-- Acciones -->
            <div class="card-actions">
              ${isSold ? `
                <button class="btn-buy-wa btn-sold-out" disabled title="Esta pieza única ya ha sido vendida">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                  Pieza Vendida
                </button>
              ` : `
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-buy-wa" title="Comprar vía WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z"/>
                  </svg>
                  Pedí por WhatsApp
                </a>
              `}

              <button class="btn-view-detail" data-action="view-modal" data-id="${item.id}" title="Ver ficha completa">
                Detalles
              </button>
            </div>
          </div>
        </article>
      `;
      }).join('');

      // Agregar listeners para abrir modal en clic
      grid.querySelectorAll('[data-action="view-modal"]').forEach(el => {
        el.addEventListener('click', (e) => {
          const id = el.getAttribute('data-id');
          this.openProductModal(id);
        });
      });

      // Soporte táctil móvil: alternar foto al tocar el contenedor en pantallas touch
      grid.querySelectorAll('.card-media-wrapper').forEach(wrapper => {
        wrapper.addEventListener('touchstart', (e) => {
          // Solo alternar si no se hizo clic en un botón interno
          wrapper.classList.toggle('show-worn');
        }, { passive: true });
      });
    }

    renderClasicos() {
      const grid = document.getElementById('clasicosGrid');
      if (!grid) return;

      if (this.clasicos.length === 0) {
        grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--ivory-muted);">
          <p style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">Próximamente piezas clásicas</p>
          <p style="font-size: 0.9rem; font-family: var(--font-mono);">Estamos preparando las piezas complementarias.</p>
        </div>
      `;
        return;
      }

      // Ordenar: Piezas disponibles primero, piezas vendidas al fondo
      const sortedClasicos = [...this.clasicos].sort((a, b) => {
        if (a.isSold === b.isSold) return 0;
        return a.isSold ? 1 : -1;
      });

      grid.innerHTML = sortedClasicos.map(item => {
        const waLink = this.generateWhatsAppLink(item);

        return `
        <article class="product-card" data-id="${item.id}">
          <!-- Contenedor de Imagen con Efecto Hover/Touch -->
          <div class="card-media-wrapper" data-action="view-modal" data-id="${item.id}" title="Click para ver en detalle">
            <div class="card-badges">
              <span class="badge-unique">CLASSIC</span>
              <span class="badge-status available">DISPONIBLE</span>
            </div>

            <!-- Foto 1: Flat Lay Studio -->
            <img src="${item.flatImage}" 
                 alt="${item.name} - Vista Principal" 
                 class="card-img card-img-flat" 
                 loading="lazy">

            <!-- Foto 2: Puesta en Modelo / Lookbook -->
            <img src="${item.wornImage}" 
                 alt="${item.name} - En modelo" 
                 class="card-img card-img-worn" 
                 loading="lazy">

            <div class="card-photo-toggle-hint">
              <span>Hover / Tap para alternar vista</span>
            </div>
          </div>

          <!-- Contenido de la Tarjeta -->
          <div class="card-content">
            <div class="card-header-row">
              <h3 class="card-title">${item.name}</h3>
              <span class="card-price">${DEFAULT_CONFIG.currency} ${item.price}</span>
            </div>

            <!-- Ficha Técnica (Largo y Diámetro) -->
            <div class="card-specs-row">
              <span class="spec-pill">
                Largo: <strong>${item.length}</strong>
              </span>
              <span class="spec-pill">
                Diámetro: <strong>${item.diameter}</strong>
              </span>
            </div>

            <!-- Acciones -->
            <div class="card-actions">
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-buy-wa" title="Encargar vía WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z"/>
                </svg>
                Pedí por WhatsApp
              </a>

              <button class="btn-view-detail" data-action="view-modal" data-id="${item.id}" title="Ver ficha completa">
                Detalles
              </button>
            </div>
          </div>
        </article>
      `;
      }).join('');

      // Agregar listeners para abrir modal en clic
      grid.querySelectorAll('[data-action="view-modal"]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-id');
          this.openProductModal(id);
        });
      });

      // Soporte táctil móvil
      grid.querySelectorAll('.card-media-wrapper').forEach(wrapper => {
        wrapper.addEventListener('touchstart', () => {
          wrapper.classList.toggle('show-worn');
        }, { passive: true });
      });
    }

    setupScrollPrompt() {
      const prompt = document.getElementById('dropPromptWrapper');
      if (!prompt) return;

      const checkScroll = () => {
        // Al deslizar un poco hacia abajo (más de 40px), aparece el botón
        if (window.scrollY > 40) {
          prompt.classList.add('visible');
        } else {
          prompt.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
    }

    setupMobileNav() {
      const toggleBtn = document.getElementById('mobileMenuToggle');
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('mobileNavBackdrop');
      const closeBtn = document.getElementById('mobileNavClose');
      const drawerWaLink = document.getElementById('mobileDrawerWaLink');

      if (drawerWaLink) {
        drawerWaLink.href = this.generateWhatsAppLink();
      }

      if (!toggleBtn || !drawer || !backdrop) return;

      const openDrawer = () => {
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
        toggleBtn.classList.add('is-active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        drawer.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = drawer.classList.contains('is-open');
        if (isOpen) closeDrawer();
        else openDrawer();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
      }

      backdrop.addEventListener('click', closeDrawer);

      // Cerrar al hacer click en cualquier link del menú móvil
      drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });

      // Cerrar al presionar Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
          closeDrawer();
        }
      });

      // Restaurar estado al navegar atrás/adelante en el historial del navegador
      window.addEventListener('pageshow', () => {
        closeDrawer();
      });
    }

    setupEventListeners() {
      // Filtros
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.getAttribute('data-filter');
          this.renderCatalog();
        });
      });

      // Búsqueda
      const searchInput = document.getElementById('catalogSearch');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim();
          this.renderCatalog();
        });
      }

      // Cerrar modal al presionar Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.selectedProduct) {
          this.closeProductModal();
        }
      });
    }

    setupModal() {
      const modalBackdrop = document.getElementById('productModalBackdrop');
      const closeBtn = document.getElementById('closeModalBtn');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeProductModal());
      }

      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) {
            this.closeProductModal();
          }
        });
      }

      // Tabs de vista en modal (Flat-lay vs Modelo)
      const tabFlat = document.getElementById('modalTabFlat');
      const tabWorn = document.getElementById('modalTabWorn');

      if (tabFlat && tabWorn) {
        tabFlat.addEventListener('click', () => this.setModalTab('flat'));
        tabWorn.addEventListener('click', () => this.setModalTab('worn'));
      }

      // Bloquear navegación si la pieza está vendida
      const modalWaBtn = document.getElementById('modalWaBtn');
      if (modalWaBtn) {
        modalWaBtn.addEventListener('click', (e) => {
          if (this.selectedProduct && this.selectedProduct.isSold) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      }
    }

    openProductModal(productId) {
      const product = this.necklaces.find(p => p.id === productId) || (this.clasicos && this.clasicos.find(p => p.id === productId));
      if (!product) return;

      this.selectedProduct = product;
      this.modalActiveTab = 'flat';

      const modalBackdrop = document.getElementById('productModalBackdrop');
      const modalTitle = document.getElementById('modalTitle');
      const modalPrice = document.getElementById('modalPrice');
      const modalStatus = document.getElementById('modalStatus');
      const modalLength = document.getElementById('modalLength');
      const modalDiameter = document.getElementById('modalDiameter');
      const modalMainImg = document.getElementById('modalMainImg');
      const modalWaBtn = document.getElementById('modalWaBtn');

      if (modalTitle) modalTitle.textContent = product.name;
      if (modalPrice) modalPrice.textContent = `${DEFAULT_CONFIG.currency} ${product.price}`;
      if (modalLength) modalLength.textContent = product.length;
      if (modalDiameter) modalDiameter.textContent = product.diameter;

      // Estado Vendido / Disponible / Clásico Permanente
      if (modalStatus) {
        if (product.isClassic) {
          modalStatus.className = 'badge-status available';
          modalStatus.textContent = 'Stock Permanente';
        } else {
          modalStatus.className = `badge-status ${product.isSold ? 'sold' : 'available'}`;
          modalStatus.textContent = product.isSold ? 'Pieza Vendida' : 'Disponible 1/1';
        }
      }

      // Botón WhatsApp en Modal
      if (modalWaBtn) {
        if (product.isSold && !product.isClassic) {
          modalWaBtn.className = 'btn-primary btn-modal-wa btn-sold-out';
          modalWaBtn.innerHTML = 'Pieza Vendida';
          modalWaBtn.removeAttribute('href');
          modalWaBtn.removeAttribute('target');
          modalWaBtn.removeAttribute('rel');
        } else {
          modalWaBtn.className = 'btn-primary btn-modal-wa';
          modalWaBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z"/>
          </svg>
          Pedí esta Pieza por WhatsApp
        `;
          modalWaBtn.href = this.generateWhatsAppLink(product);
          modalWaBtn.target = '_blank';
          modalWaBtn.rel = 'noopener noreferrer';
        }
      }

      this.setModalTab('flat');

      if (modalBackdrop) {
        modalBackdrop.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }

    setModalTab(tab) {
      if (!this.selectedProduct) return;
      this.modalActiveTab = tab;

      const modalMainImg = document.getElementById('modalMainImg');
      const tabFlat = document.getElementById('modalTabFlat');
      const tabWorn = document.getElementById('modalTabWorn');

      if (tab === 'flat') {
        if (modalMainImg) modalMainImg.src = this.selectedProduct.flatImage;
        if (tabFlat) tabFlat.classList.add('active');
        if (tabWorn) tabWorn.classList.remove('active');
      } else {
        if (modalMainImg) modalMainImg.src = this.selectedProduct.wornImage;
        if (tabWorn) tabWorn.classList.add('active');
        if (tabFlat) tabFlat.classList.remove('active');
      }
    }

    setupHeroCarousel() {
      const track = document.getElementById('heroCarouselTrack');
      const prevBtn = document.getElementById('carouselPrev');
      const nextBtn = document.getElementById('carouselNext');
      const dotsContainer = document.getElementById('carouselDots');
      if (!track) return;

      // Generar dinámicamente los slides a partir de MAIN_BANNER_IMAGES en data.js
      if (window.MAIN_BANNER_IMAGES && Array.isArray(window.MAIN_BANNER_IMAGES) && window.MAIN_BANNER_IMAGES.length > 0) {
        track.innerHTML = window.MAIN_BANNER_IMAGES.map((src, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}">
          <img src="${src}" alt="Editorial Akasia - Banner ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">
        </div>
      `).join('');
      }

      const slides = track.querySelectorAll('.hero-slide');
      if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        return;
      } else {
        if (prevBtn) prevBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
        if (dotsContainer) dotsContainer.style.display = '';
      }

      let currentIndex = 0;
      let autoInterval = null;

      // Crear dots
      if (dotsContainer) {
        dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
      `).join('');

        dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
          dot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            goToSlide(idx);
            resetAutoPlay();
          });
        });
      }

      const goToSlide = (index) => {
        slides[currentIndex].classList.remove('active');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
      };

      const nextSlide = () => goToSlide(currentIndex + 1);
      const prevSlide = () => goToSlide(currentIndex - 1);

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });
      }

      const startAutoPlay = () => {
        stopAutoPlay();
        autoInterval = setInterval(nextSlide, 4500);
      };

      const stopAutoPlay = () => {
        if (autoInterval) clearInterval(autoInterval);
      };

      const resetAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      const carouselEl = document.getElementById('heroCarousel');
      if (carouselEl) {
        carouselEl.addEventListener('mouseenter', stopAutoPlay);
        carouselEl.addEventListener('mouseleave', startAutoPlay);

        // Touch swipe
        let touchStartX = 0;
        carouselEl.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });

        carouselEl.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 45) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoPlay();
          }
        }, { passive: true });
      }

      startAutoPlay();
    }

    setupDropsPortal() {
      const portalContainer = document.getElementById('dropsPortalGrid');
      const dropsConfig = window.DROPS_PORTAL_CONFIG;
      if (!portalContainer || !dropsConfig || !dropsConfig.length) return;

      // Renderizar tarjetas con las fotos dinámicas configuradas en data.js
      portalContainer.innerHTML = dropsConfig.map((drop, dropIndex) => {
        const imagesHtml = drop.images.map((src, i) => `
        <img src="${src}" 
             alt="${drop.title} foto ${i + 1}" 
             class="drop-portal-img ${i === 0 ? 'active' : ''}" 
             loading="${dropIndex === 0 && i === 0 ? 'eager' : 'lazy'}"
             data-index="${i}">
      `).join('');

        const indicatorsHtml = drop.images.length > 1 ? `
        <div class="drop-portal-indicators">
          ${drop.images.map((_, i) => `<span class="indicator-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
        </div>
      ` : '';

        return `
        <a href="${drop.url}" class="drop-portal-card" id="portal-card-${drop.id}" data-drop-id="${drop.id}" aria-label="${drop.title} - ${drop.buttonText}">
          <div class="drop-portal-media">
            ${imagesHtml}
            <div class="drop-portal-gradient-overlay"></div>
            ${indicatorsHtml}
            <div class="drop-portal-top-bar">
              <span class="badge-portal ${drop.badgeType === 'available' ? 'badge-available' : 'badge-soon'}">
                <span class="dot-pulse"></span> ${drop.badge}
              </span>
            </div>
          </div>
          <div class="drop-portal-content">
            <div class="drop-portal-text-group">
              <h3 class="drop-portal-title">${drop.title}</h3>
            </div>
            <div class="drop-portal-btn-wrap">
              <span class="btn-drop-portal">
                <span>${drop.buttonText}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </a>
      `;
      }).join('');

      // Activar rotación dinámica e interacción de fotos para cada tarjeta
      dropsConfig.forEach((drop, dropIdx) => {
        const card = document.getElementById(`portal-card-${drop.id}`);
        if (!card || !drop.images || drop.images.length <= 1) return;

        const imgs = card.querySelectorAll('.drop-portal-img');
        const indicators = card.querySelectorAll('.indicator-dot');
        let currentIdx = 0;
        let intervalId = null;

        const setPhoto = (newIndex) => {
          imgs[currentIdx].classList.remove('active');
          if (indicators[currentIdx]) indicators[currentIdx].classList.remove('active');

          currentIdx = (newIndex + imgs.length) % imgs.length;

          imgs[currentIdx].classList.add('active');
          if (indicators[currentIdx]) indicators[currentIdx].classList.add('active');
        };

        const nextPhoto = () => setPhoto(currentIdx + 1);

        // Desfase entre tarjetas para una sensación más orgánica (3.8s y 4.5s)
        const delay = 3800 + (dropIdx * 700);

        const startTimer = () => {
          if (intervalId) clearInterval(intervalId);
          intervalId = setInterval(nextPhoto, delay);
        };

        const stopTimer = () => {
          if (intervalId) clearInterval(intervalId);
        };

        startTimer();

        // Interacción en hover: avanza inmediatamente de foto y rota más rápido al pasar el cursor
        card.addEventListener('mouseenter', () => {
          nextPhoto();
          stopTimer();
          intervalId = setInterval(nextPhoto, 1800);
        });

        card.addEventListener('mouseleave', () => {
          stopTimer();
          startTimer();
        });
      });
    }

    closeProductModal() {
      const modalBackdrop = document.getElementById('productModalBackdrop');
      if (modalBackdrop) {
        modalBackdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        this.selectedProduct = null;
      }
    }
  }

  // Iniciar aplicación al cargar el DOM o de inmediato si ya está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.akasiaApp = new AkasiaApp();
    });
  } else {
    window.akasiaApp = new AkasiaApp();
  }
})();
