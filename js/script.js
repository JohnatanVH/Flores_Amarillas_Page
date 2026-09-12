// Intentamos registrar GSAP con cuidado por si la red falló
try {
    gsap.registerPlugin(ScrollTrigger);
} catch (e) {
    console.warn("GSAP no cargó, las animaciones no funcionarán pero la página seguirá visible.");
}

// ------------------------------------
// 1. Manejo de Audio y Música de Fondo
// ------------------------------------
const musicaFondo = document.getElementById('musica-fondo');
const btnEmpezar = document.getElementById('btn-empezar');
const btnMusica = document.getElementById('btn-musica');

let reproduciendo = false;

const inputFecha = document.getElementById('input-fecha');
const errorFecha = document.getElementById('error-fecha');
const contenedorFecha = document.getElementById('contenedor-fecha');

function iniciarMusicaYDesbloquear() {
    if (!reproduciendo) {
        musicaFondo.volume = 0.3;
        const playPromise = musicaFondo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                reproduciendo = true;
                btnMusica.classList.remove('hidden');
            }).catch(error => {
                console.log("El navegador bloqueó el autoplay de audio:", error);
                btnMusica.classList.remove('hidden');
            });
        }
    }
    
    // Forzar reproducción de videos tras interacción
    document.querySelectorAll('video').forEach(video => {
        video.play().catch(e => console.log("Video auto-play blocked after interaction", e));
    });
    
    // Ocultar contenedor de fecha
    if (contenedorFecha) {
        gsap.to(contenedorFecha, { opacity: 0, duration: 1, display: 'none' });
    }
    
    // Desbloquear el scroll de la página
    document.body.classList.remove('overflow-hidden', 'h-screen');
    
    window.scrollTo({
        top: document.getElementById('semilla').offsetTop,
        behavior: 'smooth'
    });
}

const calendario = document.getElementById('calendario-julio');

if (calendario) {
    // Generar el calendario de Julio 2026
    // Julio 1, 2026 cae Miércoles (Dejamos 2 espacios vacíos para Lunes y Martes)
    let html = `
        <div class="text-xs text-texto-cafe opacity-60 font-bold">L</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">M</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">M</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">J</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">V</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">S</div>
        <div class="text-xs text-texto-cafe opacity-60 font-bold">D</div>
        <div></div><div></div>
    `;
    
    for(let i=1; i<=31; i++) {
        html += `<button class="dia-btn w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-sans text-texto-cafe hover:bg-dorado hover:text-white transition-colors border-2 border-transparent hover:border-dorado shadow-sm bg-white" data-dia="${i}">${i}</button>`;
    }
    calendario.innerHTML = html;

    // Escuchar los clics en los días
    const dias = document.querySelectorAll('.dia-btn');
    dias.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dia = e.target.getAttribute('data-dia');
            if(dia === '13') {
                errorFecha.classList.add('hidden');
                e.target.classList.add('bg-dorado', 'text-white', 'scale-110'); // Highlight success
                setTimeout(() => iniciarMusicaYDesbloquear(), 600); // Pequeña pausa dramática
            } else {
                errorFecha.classList.remove('hidden');
                e.target.classList.add('bg-red-100', 'text-red-500', 'border-red-500');
                gsap.fromTo(contenedorFecha, {x: -10}, {x: 10, duration: 0.1, yoyo: true, repeat: 3});
                setTimeout(() => {
                    e.target.classList.remove('bg-red-100', 'text-red-500', 'border-red-500');
                }, 800);
            }
        });
    });
}

btnMusica.addEventListener('click', () => {
    if (reproduciendo) {
        musicaFondo.pause();
        btnMusica.style.opacity = '0.5';
    } else {
        musicaFondo.play();
        btnMusica.style.opacity = '1';
    }
    reproduciendo = !reproduciendo;
});

// ------------------------------------
// 2. Generador de Pétalos Suaves (CSS)
// ------------------------------------
function crearPetalos() {
    const contenedor = document.getElementById('contenedor-petalos');
    if (!contenedor) return;
    
    const cantidad = 15; // Sutil

    for (let i = 0; i < cantidad; i++) {
        let petalo = document.createElement('div');
        petalo.classList.add('petalo-suave');
        
        petalo.style.left = Math.random() * 100 + 'vw';
        petalo.style.animationDelay = Math.random() * 5 + 's';
        petalo.style.animationDuration = Math.random() * 10 + 10 + 's';
        
        // Tamaños variados pero pequeños (entre 8px y 15px)
        const size = Math.random() * 7 + 8; 
        petalo.style.width = size + 'px';
        petalo.style.height = size + 'px';
        
        contenedor.appendChild(petalo);
    }
}

// ------------------------------------
// 3. Inicialización
// ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    crearPetalos();

    // Intentar reproducir todos los videos nativamente por si acaso
    document.querySelectorAll('video').forEach(video => {
        video.play().catch(e => console.log("Video auto-play blocked", e));
    });

    try {
        gsap.utils.toArray('.foto-animada, .foto-galeria').forEach(item => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray('.texto-animado').forEach(texto => {
            gsap.from(texto, {
                scrollTrigger: {
                    trigger: texto,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            });
        });

        gsap.from('.glass-card', {
            scrollTrigger: {
                trigger: '.glass-card',
                start: "top 85%",
            },
            y: 20,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    } catch (e) {
        console.log("Animaciones desactivadas");
    }
});
