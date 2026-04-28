// script.js

// Datos de trabajos recientes (portfolio)
// Basado en el contenido original de la web
const worksData = [
    { title: "Cafetería Bhaso", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/09/Bhasno1.jpg", description: "Tapizado de sillas" },
    { title: "Cafetería Bhaso", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/09/Bhasno3.jpg", description: "Renovación integral" },
    { title: "Cafetería Bhaso", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/09/Bhasno2.jpg", description: "Sillas modernizadas" },
    { title: "Asador La Junquera", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/la_junquera1.jpg", description: "Restauración y tapizado" },
    { title: "Asador La Junquera", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/la_junquera2.jpg", description: "Sillas a medida" },
    { title: "Asador La Junquera", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/la_junquera3.jpg", description: "Tapicería clásica" },
    { title: "Cervecería D'Jorge", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/cerveceria_djorge1.jpg", description: "Ambiente renovado" },
    { title: "Cervecería D'Jorge", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/cerveceria_djorge2.jpg", description: "Sillones tapizados" },
    { title: "Cervecería D'Jorge", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/07/cerveceria_djorge4.jpg", description: "Butacas exclusivas" },
    { title: "D'arte Restaurante", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/04/WhatsApp-Image-2023-01-26-at-11.44.20-3.jpeg", description: "Elegancia y confort" },
    { title: "D'arte Restaurante", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/04/WhatsApp-Image-2023-01-26-at-11.44.20-2.jpeg", description: "Tapizado premium" },
    { title: "Discoteca Chocolate", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2023/04/WhatsApp-Image-2022-12-21-at-14.03.06-1.jpeg", description: "Tapizado de VIP" },
    { title: "Restaurante La Mafia", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2022/05/la-mafia3.jpeg", description: "Sofás Chester" },
    { title: "Restaurante Urban Cafe", category: "restaurant", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2022/04/urban-cafe-2.jpg", description: "Tapizado contemporáneo" },
    { title: "Hide Club", category: "pub", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2022/04/discoteca-hide-3.jpg", description: "Diseño vanguardista" },
    { title: "Centro Deportivo", category: "renovation", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2021/08/gimnasio-1.jpg", description: "Zonas lounge" },
    { title: "Restauración de Sillón", category: "renovation", image: "https://tapiceriasdeluxe.com/wp-content/uploads/2022/10/sillon-antes-de-tapizar.jpeg", description: "Antes / Después" }
];

// Función para renderizar galería
function renderGallery(filter = "all") {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;
    
    let filteredWorks = worksData;
    if (filter !== "all") {
        filteredWorks = worksData.filter(work => work.category === filter);
    }
    
    // Tomamos los primeros 9 para mostrar inicialmente, o todos si son menos
    const worksToShow = filteredWorks.slice(0, 9);
    
    galleryGrid.innerHTML = "";
    worksToShow.forEach(work => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `
            <img src="${work.image}" alt="${work.title}" loading="lazy">
            <div class="gallery-info">
                <p><strong>${work.title}</strong></p>
                <small>${work.description}</small>
            </div>
        `;
        galleryGrid.appendChild(galleryItem);
    });
    
    // Si no hay imágenes, mostrar mensaje
    if (worksToShow.length === 0) {
        galleryGrid.innerHTML = '<div class="text-center" style="grid-column:1/-1;">No hay trabajos en esta categoría por ahora.</div>';
    }
    
    // Actualizar el botón ver más (si existe)
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    if (viewMoreBtn) {
        if (filteredWorks.length <= 9) {
            viewMoreBtn.style.display = "none";
        } else {
            viewMoreBtn.style.display = "inline-block";
            // Al hacer click se podrían mostrar más; para simplificar redirige o muestra alerta
            viewMoreBtn.onclick = (e) => {
                e.preventDefault();
                // Podríamos cargar todos, pero al ser demo redirigimos a seccion o mostramos más
                alert("Visita nuestra web para ver la galería completa de trabajos recientes. ¡Tenemos muchísimos más!");
            };
        }
    }
}

// Eventos de filtros
function initFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const filterValue = this.getAttribute("data-filter");
            filterBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderGallery(filterValue);
        });
    });
}

// Inicializar la galería al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderGallery("all");
    initFilters();
    
    // Configurar botón "Ver más trabajos" principal si existe en la sección recientes
    const secondaryViewBtn = document.querySelector("#viewMoreBtn");
    if (secondaryViewBtn) {
        secondaryViewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Explora nuestra galería completa en nuestra web o contáctanos para ver más proyectos exclusivos.");
        });
    }
    
    // Configurar botones de transformaciones (antes/después)
    const moreTransBtn = document.querySelector(".btn-secondary");
    if (moreTransBtn && moreTransBtn.innerText.includes("Ver más transformaciones")) {
        moreTransBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Contáctanos para ver nuestro porfolio de restauraciones completas. ¡Cada mueble tiene una historia!");
        });
    }
    
    // FORMULARIO DE CONTACTO (presupuesto/llamada)
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const surname = document.getElementById("surname").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const messageDiv = document.getElementById("formMessage");

            if (!name || !surname || !phone || !date || !time) {
                messageDiv.textContent = "Por favor, completa todos los campos del formulario.";
                messageDiv.classList.add("error");
                return;
            }

            const whatsappNumber = "654680667";
            const whatsappText = `¡Hola! Tengo una duda con tus servicios.\n\nNombre: ${name} ${surname}\nTeléfono: ${phone}\nDía de llamada: ${date}\nHora de llamada: ${time}`;
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

            messageDiv.textContent = "Redirigiendo a WhatsApp...";
            messageDiv.classList.remove("error");
            messageDiv.style.color = "green";

            window.open(whatsappUrl, '_blank');

            contactForm.reset();

            setTimeout(() => {
                messageDiv.textContent = "";
            }, 6000);
        });
    }
    
    // Animaciones suaves para enlaces internos (si hay anchor)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#" || targetId === "") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
    
    // Botón "Solicitar Presupuesto" múltiples - dirigir al formulario
    const budgetBtns = document.querySelectorAll('.btn-primary[href="#contacto"]');
    budgetBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const contactSection = document.getElementById("contacto");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
    
    // Agregar efecto hover sutil a service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.2s ease';
        });
    });
    
    // Botón 'Pedir cita' también redirige a contacto
    const citaBtn = document.querySelector('.domicilio .btn-primary');
    if (citaBtn && citaBtn.innerText.includes('Pedir cita')) {
        citaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
        });
    }
    
    // Lazy load: imágenes ya tienen loading lazy en HTML nativo
    // Pequeño efecto de aparición
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .gallery-item, .ba-card, .two-col > div').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(el);
    });
    
    // Ajuste para el hero en móvil
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth <= 600) {
        // No modificar porque en CSS ya aplica correcto
    }
});

// WhatsApp widget interactivity
const whatsappWidget = document.querySelector('.whatsapp-widget');
const whatsappToggle = document.querySelector('.whatsapp-toggle');
const whatsappClose = document.querySelector('.whatsapp-chat-close');

if (whatsappWidget && whatsappToggle && whatsappClose) {
    const toggleChat = () => {
        const isOpen = whatsappWidget.classList.toggle('open');
        whatsappToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.getElementById('whatsappChat').setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    whatsappToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleChat();
    });

    whatsappClose.addEventListener('click', (event) => {
        event.stopPropagation();
        whatsappWidget.classList.remove('open');
        whatsappToggle.setAttribute('aria-expanded', 'false');
        document.getElementById('whatsappChat').setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('click', (event) => {
        if (!whatsappWidget.contains(event.target)) {
            whatsappWidget.classList.remove('open');
            whatsappToggle.setAttribute('aria-expanded', 'false');
            document.getElementById('whatsappChat').setAttribute('aria-hidden', 'true');
        }
    });

    whatsappToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleChat();
        }
    });
}
