// ============================================================
// MODERN 3D SOLAR SYSTEM - MAIN APPLICATION
// Ultra-realistic, cinematic experience with NASA-quality rendering
// ============================================================

// ============================================================
// CONFIGURATION & CONSTANTS
// ============================================================

const CONFIG = {
    // Rendering
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    width: window.innerWidth,
    height: window.innerHeight,
    
    // Performance
    maxLights: 4,
    shadowMapSize: 2048,
    antialias: true,
    
    // Animation
    cameraSpeed: 0.15,
    planetRotationSpeed: 0.0003,
    scrollSensitivity: 30,
    
    // Lighting
    sunIntensity: 2.5,
    ambientIntensity: 0.3,
};

// Planet data with realistic properties
const PLANETS_DATA = [
    {
        name: 'Sun',
        emoji: '☀️',
        scale: 0.5,
        color: 0xFDB813,
        distanceFromCamera: 0,
        diameter: '1,391,000 km',
        mass: '1.989 × 10³⁰ kg',
        gravity: '274 m/s²',
        distance: 'Center',
        temperature: '5,500°C',
        dayLength: '25 days',
        yearLength: '—',
        moons: '—',
        fact: 'The Sun contains 99.86% of all the mass in the entire solar system and is hot enough to sustain nuclear fusion.'
    },
    {
        name: 'Mercury',
        emoji: '☿️',
        scale: 0.05,
        color: 0x8C7853,
        distanceFromCamera: 80,
        diameter: '4,879 km',
        mass: '3.285 × 10²³ kg',
        gravity: '3.7 m/s²',
        distance: '57.9 million km',
        temperature: '167°C (avg)',
        dayLength: '59 days',
        yearLength: '88 days',
        moons: '0',
        fact: 'Mercury is the smallest planet and closest to the Sun. Despite its proximity to the Sun, it\'s not the hottest planet.'
    },
    {
        name: 'Venus',
        emoji: '♀️',
        scale: 0.08,
        color: 0xFFC649,
        distanceFromCamera: 120,
        diameter: '12,104 km',
        mass: '4.867 × 10²⁴ kg',
        gravity: '8.87 m/s²',
        distance: '108.2 million km',
        temperature: '464°C',
        dayLength: '243 days',
        yearLength: '225 days',
        moons: '0',
        fact: 'Venus is the hottest planet and has a thick atmosphere of carbon dioxide that creates a runaway greenhouse effect.'
    },
    {
        name: 'Earth',
        emoji: '🌍',
        scale: 0.085,
        color: 0x4A90E2,
        distanceFromCamera: 160,
        diameter: '12,742 km',
        mass: '5.972 × 10²⁴ kg',
        gravity: '9.81 m/s²',
        distance: '149.6 million km',
        temperature: '15°C (avg)',
        dayLength: '24 hours',
        yearLength: '365 days',
        moons: '1',
        fact: 'Earth is the only known planet to harbor life and has a protective magnetic field and a life-sustaining atmosphere.'
    },
    {
        name: 'Mars',
        emoji: '♂️',
        scale: 0.045,
        color: 0xE27B58,
        distanceFromCamera: 200,
        diameter: '6,779 km',
        mass: '6.417 × 10²³ kg',
        gravity: '3.71 m/s²',
        distance: '227.9 million km',
        temperature: '-63°C (avg)',
        dayLength: '24.6 hours',
        yearLength: '687 days',
        moons: '2',
        fact: 'Mars is known as the Red Planet due to iron oxide on its surface and has the largest volcano in the solar system.'
    },
    {
        name: 'Jupiter',
        emoji: '♃',
        scale: 0.25,
        color: 0xD4A76A,
        distanceFromCamera: 300,
        diameter: '139,820 km',
        mass: '1.898 × 10²⁷ kg',
        gravity: '24.79 m/s²',
        distance: '778.5 million km',
        temperature: '-110°C (avg)',
        dayLength: '10 hours',
        yearLength: '12 years',
        moons: '95+',
        fact: 'Jupiter is the largest planet and has a Great Red Spot—a storm larger than Earth that has raged for centuries.'
    },
    {
        name: 'Saturn',
        emoji: '♄',
        scale: 0.21,
        color: 0xF4D89F,
        distanceFromCamera: 380,
        diameter: '116,460 km',
        mass: '5.683 × 10²⁶ kg',
        gravity: '10.44 m/s²',
        distance: '1.434 billion km',
        temperature: '-140°C (avg)',
        dayLength: '10.7 hours',
        yearLength: '29 years',
        moons: '146+',
        fact: 'Saturn is famous for its spectacular ring system made of ice and rock, and is the least dense planet in our solar system.'
    },
    {
        name: 'Uranus',
        emoji: '♅',
        scale: 0.15,
        color: 0x4FD0E7,
        distanceFromCamera: 450,
        diameter: '50,724 km',
        mass: '8.681 × 10²⁵ kg',
        gravity: '8.69 m/s²',
        distance: '2.871 billion km',
        temperature: '-195°C (avg)',
        dayLength: '17 hours',
        yearLength: '84 years',
        moons: '27+',
        fact: 'Uranus rotates on its side with an axial tilt of 98 degrees, likely due to a collision early in the solar system\'s history.'
    },
    {
        name: 'Neptune',
        emoji: '♆',
        scale: 0.14,
        color: 0x4471CA,
        distanceFromCamera: 520,
        diameter: '49,244 km',
        mass: '1.024 × 10²⁶ kg',
        gravity: '11.15 m/s²',
        distance: '4.495 billion km',
        temperature: '-200°C (avg)',
        dayLength: '16 hours',
        yearLength: '165 years',
        moons: '14+',
        fact: 'Neptune is the windiest planet with wind speeds reaching 2,100 km/h, and takes 165 years to orbit the Sun.'
    }
];

// ============================================================
// GLOBAL STATE
// ============================================================

let state = {
    currentPlanetIndex: 0,
    isAnimating: false,
    isMusicPlaying: false,
    touchStartX: 0,
    touchStartY: 0,
    isDragging: false,
    scrollVelocity: 0,
};

// ============================================================
// THREE.JS SETUP
// ============================================================

let scene, camera, renderer, planets = [], lights = [];

function initThreeJs() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050812);
    scene.fog = new THREE.FogExp2(0x050812, 0.0001);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        CONFIG.width / CONFIG.height,
        0.1,
        10000
    );
    camera.position.set(0, 15, 50);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: CONFIG.antialias,
        powerPreference: 'high-performance',
        precision: 'highp'
    });

    renderer.setSize(CONFIG.width, CONFIG.height);
    renderer.setPixelRatio(CONFIG.pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.shadowMap.mapSize.width = CONFIG.shadowMapSize;
    renderer.shadowMap.mapSize.height = CONFIG.shadowMapSize;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Lighting setup
    setupLighting();

    // Create scene elements
    createStarsfield();
    createPlanets();
    createAmbientEffects();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    console.log('Three.js initialized successfully');
}

// ============================================================
// LIGHTING SYSTEM
// ============================================================

function setupLighting() {
    // Sun (Primary light source)
    const sunLight = new THREE.PointLight(0xFDB813, CONFIG.sunIntensity, 1000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = CONFIG.shadowMapSize;
    sunLight.shadow.mapSize.height = CONFIG.shadowMapSize;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 1000;
    scene.add(sunLight);
    lights.push(sunLight);

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, CONFIG.ambientIntensity);
    scene.add(ambientLight);

    // Hemisphere light for more natural lighting
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x000000, 0.4);
    scene.add(hemiLight);
}

// ============================================================
// STARFIELD CREATION
// ============================================================

function createStarsfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.7,
        sizeAttenuation: true,
        transparent: true
    });

    const starsVertices = [];
    const starsColors = [];
    const colorArray = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3, 0xF38181];

    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 4000;
        const y = (Math.random() - 0.5) * 4000;
        const z = (Math.random() - 0.5) * 4000;
        starsVertices.push(x, y, z);

        const color = new THREE.Color(colorArray[Math.floor(Math.random() * colorArray.length)]);
        starsColors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(starsColors), 3));

    starsMaterial.vertexColors = true;

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animate stars twinkling
    animateTwinklingStars(starsGeometry);
}

function animateTwinklingStars(geometry) {
    const originalOpacity = 0.8;
    let twinkelIntensity = 0;

    setInterval(() => {
        twinkelIntensity = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;
        geometry.material.opacity = originalOpacity * (twinkelIntensity * 0.5 + 0.5);
    }, 50);
}

// ============================================================
// PLANET CREATION
// ============================================================

function createPlanets() {
    PLANETS_DATA.forEach((data, index) => {
        const planet = createPlanet(data, index);
        planets.push(planet);
        scene.add(planet);
    });

    console.log(`Created ${planets.length} planets`);
}

function createPlanet(data, index) {
    const group = new THREE.Group();

    if (data.name === 'Sun') {
        // Create Sun with glow effect
        const sunGeometry = new THREE.SphereGeometry(data.scale, 128, 128);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 2
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.castShadow = true;
        sun.receiveShadow = true;
        group.add(sun);

        // Add glow layer for Sun
        const glowGeometry = new THREE.SphereGeometry(data.scale * 1.3, 128, 128);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);

        // Animate solar flares
        animateSolarFlares(group, data.scale);

    } else if (data.name === 'Saturn') {
        // Create Saturn with rings
        const saturnGeometry = new THREE.SphereGeometry(data.scale, 64, 64);
        const saturnMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 30,
            emissive: 0x333333
        });
        const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturn.castShadow = true;
        saturn.receiveShadow = true;
        group.add(saturn);

        // Create Saturn rings
        createSaturnRings(group, data.scale);

    } else if (data.name === 'Earth') {
        // Create Earth with clouds
        const earthGeometry = new THREE.SphereGeometry(data.scale, 128, 128);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 50,
            emissive: 0x1a1a2e
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.castShadow = true;
        earth.receiveShadow = true;
        group.add(earth);

        // Add cloud layer
        createEarthClouds(group, data.scale);

    } else if (data.name === 'Jupiter') {
        // Create Jupiter with storm bands
        const jupiterGeometry = new THREE.SphereGeometry(data.scale, 128, 128);
        const jupiterMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 20,
            emissive: 0x2d2d1a
        });
        const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
        jupiter.castShadow = true;
        jupiter.receiveShadow = true;
        group.add(jupiter);

        // Add storm bands
        createJupiterStorms(group, data.scale);

    } else if (data.name === 'Mars') {
        // Create Mars with dust glow
        const marsGeometry = new THREE.SphereGeometry(data.scale, 64, 64);
        const marsMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 10,
            emissive: 0x331a00
        });
        const mars = new THREE.Mesh(marsGeometry, marsMaterial);
        mars.castShadow = true;
        mars.receiveShadow = true;
        group.add(mars);

        // Add dust glow
        createMarsDustGlow(group, data.scale);

    } else {
        // Generic planet
        const geometry = new THREE.SphereGeometry(data.scale, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 30,
            emissive: new THREE.Color(data.color).multiplyScalar(0.2)
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
    }

    // Add glow effect to all planets
    const glowScale = data.scale * 1.15;
    const glowGeometry = new THREE.SphereGeometry(glowScale, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glowMesh);

    // Position planet
    const distance = data.distanceFromCamera;
    group.position.set(distance, 0, 0);

    // Add metadata
    group.userData = {
        name: data.name,
        originalPosition: new THREE.Vector3(distance, 0, 0),
        rotationSpeed: CONFIG.planetRotationSpeed * (Math.random() + 0.5),
        isRotating: true
    };

    return group;
}

// ============================================================
// PLANET SPECIAL EFFECTS
// ============================================================

function createSaturnRings(group, scale) {
    const ringGeometry = new THREE.RingGeometry(scale * 1.6, scale * 2.2, 64);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xC9B890,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        emissive: 0x664433
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = 0.4;
    rings.castShadow = true;
    rings.receiveShadow = true;
    group.add(rings);
}

function createEarthClouds(group, scale) {
    const cloudGeometry = new THREE.SphereGeometry(scale * 1.08, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.4,
        shininess: 100
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.receiveShadow = false;
    group.add(clouds);

    // Animate clouds
    setInterval(() => {
        clouds.rotation.y += 0.0002;
    }, 16);
}

function createJupiterStorms(group, scale) {
    const stormBands = [
        { y: scale * 0.4, height: 0.15 },
        { y: 0, height: 0.2 },
        { y: -scale * 0.4, height: 0.15 }
    ];

    stormBands.forEach((band, index) => {
        const geometry = new THREE.PlaneGeometry(scale * 3, band.height);
        const material = new THREE.MeshBasicMaterial({
            color: 0x8B7355,
            transparent: true,
            opacity: 0.3
        });
        const storm = new THREE.Mesh(geometry, material);
        storm.position.y = band.y;
        storm.position.z = scale + 0.01;
        group.add(storm);
    });
}

function createMarsDustGlow(group, scale) {
    const dustGeometry = new THREE.SphereGeometry(scale * 1.25, 32, 32);
    const dustMaterial = new THREE.MeshBasicMaterial({
        color: 0xE27B58,
        transparent: true,
        opacity: 0.2
    });
    const dust = new THREE.Mesh(dustGeometry, dustMaterial);
    group.add(dust);

    // Pulsing animation
    setInterval(() => {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
        dustMaterial.opacity = 0.2 * scale;
    }, 16);
}

function animateSolarFlares(group, scale) {
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const flareGeometry = new THREE.ConeGeometry(scale * 0.3, scale * 0.5, 16);
        const flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF6B00,
            transparent: true,
            opacity: 0.6
        });
        const flare = new THREE.Mesh(flareGeometry, flareMaterial);

        flare.position.x = Math.cos(angle) * scale * 1.2;
        flare.position.y = Math.sin(angle) * scale * 1.2;
        flare.lookAt(0, 0, 0);

        group.add(flare);

        // Animate flares
        (function(flareRef) {
            setInterval(() => {
                const scale = Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5;
                flareMaterial.opacity = 0.6 * scale;
            }, 16);
        })(flare);
    }
}

// ============================================================
// AMBIENT EFFECTS
// ============================================================

function createAmbientEffects() {
    // Create floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.1,
        transparent: true,
        opacity: 0.4
    });

    const particlesVertices = [];
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 600;
        particlesVertices.push(x, y, z);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlesVertices), 3));
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Animate particles
    setInterval(() => {
        const positions = particleGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 0.5;
            positions[i + 1] += (Math.random() - 0.5) * 0.5;
            positions[i + 2] += (Math.random() - 0.5) * 0.5;
        }
        particleGeometry.attributes.position.needsUpdate = true;
    }, 50);
}

// ============================================================
// CAMERA JOURNEY SYSTEM
// ============================================================

function focusPlanet(index) {
    if (index < 0 || index >= planets.length) return;

    state.currentPlanetIndex = index;
    state.isAnimating = true;

    const targetPlanet = planets[index];
    const targetPosition = targetPlanet.position.clone();
    targetPosition.z += 80 + index * 5;

    animateCameraTo(targetPosition);
    updateUI();
    displayPlanetInfo(index);

    setTimeout(() => {
        state.isAnimating = false;
    }, 1500);
}

function animateCameraTo(targetPosition) {
    const startPosition = camera.position.clone();
    const duration = 1500;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        camera.lookAt(targetPosition.x - 80, 0, 0);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ============================================================
// USER INTERFACE
// ============================================================

function displayPlanetInfo(index) {
    const planet = PLANETS_DATA[index];
    document.getElementById('planetName').textContent = planet.name;
    document.getElementById('infoDiameter').textContent = planet.diameter;
    document.getElementById('infoMass').textContent = planet.mass;
    document.getElementById('infoGravity').textContent = planet.gravity;
    document.getElementById('infoDistance').textContent = planet.distance;
    document.getElementById('infoTemp').textContent = planet.temperature;
    document.getElementById('infoDayLength').textContent = planet.dayLength;
    document.getElementById('infoYearLength').textContent = planet.yearLength;
    document.getElementById('infoMoons').textContent = planet.moons;
    document.getElementById('infoFact').textContent = planet.fact;

    const infoPanel = document.getElementById('infoPanel');
    infoPanel.classList.add('active');
}

function updateUI() {
    document.getElementById('currentPlanet').textContent = state.currentPlanetIndex + 1;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (state.currentPlanetIndex > 0) {
            focusPlanet(state.currentPlanetIndex - 1);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (state.currentPlanetIndex < planets.length - 1) {
            focusPlanet(state.currentPlanetIndex + 1);
        }
    });

    // Planet selector menu
    document.getElementById('menuToggle').addEventListener('click', () => {
        const menuContent = document.querySelector('.menu-content');
        menuContent.classList.toggle('active');
    });

    document.querySelectorAll('.planet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            focusPlanet(index);
            document.querySelector('.menu-content').classList.remove('active');
        });
    });

    // Music toggle
    document.getElementById('musicToggle').addEventListener('click', () => {
        const btn = document.getElementById('musicToggle');
        state.isMusicPlaying = !state.isMusicPlaying;
        btn.textContent = state.isMusicPlaying ? '🔉' : '🔊';
    });

    // Fullscreen
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Close info panel
    document.getElementById('closeInfo').addEventListener('click', () => {
        document.getElementById('infoPanel').classList.remove('active');
    });

    // Scroll wheel navigation
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!state.isAnimating) {
            if (e.deltaY > 0 && state.currentPlanetIndex < planets.length - 1) {
                focusPlanet(state.currentPlanetIndex + 1);
            } else if (e.deltaY < 0 && state.currentPlanetIndex > 0) {
                focusPlanet(state.currentPlanetIndex - 1);
            }
        }
    }, { passive: false });

    // Touch swipe support
    document.addEventListener('touchstart', (e) => {
        state.touchStartX = e.touches[0].clientX;
        state.touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = state.touchStartX - touchEndX;
        const diffY = state.touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50 && state.currentPlanetIndex < planets.length - 1) {
                focusPlanet(state.currentPlanetIndex + 1);
            } else if (diffX < -50 && state.currentPlanetIndex > 0) {
                focusPlanet(state.currentPlanetIndex - 1);
            }
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && state.currentPlanetIndex < planets.length - 1) {
            focusPlanet(state.currentPlanetIndex + 1);
        } else if (e.key === 'ArrowLeft' && state.currentPlanetIndex > 0) {
            focusPlanet(state.currentPlanetIndex - 1);
        }
    });
}

// ============================================================
// ANIMATION LOOP
// ============================================================

function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    planets.forEach((planet) => {
        if (planet.userData.isRotating) {
            planet.rotation.y += planet.userData.rotationSpeed;
        }
    });

    renderer.render(scene, camera);
}

// ============================================================
// WINDOW RESIZE HANDLING
// ============================================================

function onWindowResize() {
    CONFIG.width = window.innerWidth;
    CONFIG.height = window.innerHeight;

    camera.aspect = CONFIG.width / CONFIG.height;
    camera.updateProjectionMatrix();

    renderer.setSize(CONFIG.width, CONFIG.height);
}

// ============================================================
// LOADING SCREEN & INITIALIZATION
// ============================================================

function simulateLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    const loadingPercent = document.getElementById('loadingPercent');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;

        progressFill.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';

        if (progress >= 90) {
            clearInterval(interval);
            setTimeout(() => {
                progress = 100;
                progressFill.style.width = '100%';
                loadingPercent.textContent = '100%';

                setTimeout(() => {
                    document.getElementById('totalPlanets').textContent = planets.length;
                    focusPlanet(0);
                    document.getElementById('scrollHint').style.opacity = '1';
                }, 300);
            }, 500);
        }
    }, 200);
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

window.addEventListener('load', () => {
    console.log('Application starting...');
    initThreeJs();
    setupEventListeners();
    simulateLoading();
    animate();

    console.log('✓ Application fully initialized');
});