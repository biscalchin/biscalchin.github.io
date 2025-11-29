// script.js

// Embedded content to avoid fetch issues on local file system
const contentData = {
    "researcher_profile": {
        "name": "Alberto Biscalchin",
        "affiliation": "Department of Technology and Society, Malmö University",
        "address": "Neptuniplan 7, 205 06 Malmö, Sweden",
        "contacts": {
            "email_personal": "alberto.biscalchin@gmail.com",
            "email_institutional": "alberto.biscalchin@mau.se",
            "orcid": "0009-0005-1737-6754"
        },
        "education": [
            { "year": 2025, "degree": "M.Sc. Applied Data Science", "institution": "Malmö University, Sweden" },
            { "year": 2022, "degree": "B.Sc. Computer and Automation Engineering", "institution": "Università eCampus, Italy" },
            { "year": 2019, "degree": "Executive Master, Digital Video Editing", "institution": "MyWeb School, Naples" },
            { "year": 2010, "degree": "High School Diploma, Applied Sciences", "institution": "Giulio Natta Institute, Rivoli" }
        ],
        "skills": {
            "programming": ["Python", "MATLAB", "SQL", "C", "C++", "Java", "PHP", "HTML"],
            "tools": ["AutoCAD", "Inventor", "Adobe Suite", "Reaper"],
            "languages": ["Italian (Native)", "English (C2)", "Spanish (B1)"]
        }
    },

    "academic_positions": [
        { "role": "Research Assistant", "institution": "Malmö University", "years": "2024–present" },
        { "role": "Secondary School Teacher", "institution": "Istituto Juvarra", "years": "2022–2023" },
        { "role": "Head Teacher", "institution": "Centro Studi Omnibus", "years": "2021–2023" }
    ],

    "teaching_experience": [
        {
            "subjects": ["Mathematics", "Physics", "Computer Science"],
            "institution": "Istituto Juvarra & Centro Studi Omnibus",
            "years": "2021–2023"
        }
    ],

    "professional_experience": [
        { "role": "Full-stack Web Developer", "company": "GIGA srls", "years": "2018–2019" },
        { "role": "Head of IT Department", "company": "Mondadori Mega Store", "years": "2014–2015" },
        { "role": "Freelance Photographer/Videographer", "company": "-", "years": "2012–2018" },
        { "role": "Customs Consultant", "company": "FCA", "years": "2011–2012" },
        { "role": "Industrial Quality Control", "company": "Con.Top S.R.L.", "years": "2011" }
    ],

    "research_experience": {
        "research_assistant_role": {
            "summary": "Design and deployment of multi-agent LLM systems for mobility analysis and structured reporting.",
            "STAR": {
                "situation": "Need for scalable analytical pipelines for travel behaviour studies.",
                "task": "Develop a modular multi-agent architecture for survey analytics and reporting.",
                "action": [
                    "Led development of preprocessing and contextual reasoning pipelines",
                    "Designed JSON-governed multi-agent workflow",
                    "Implemented reporting and validation agents"
                ],
                "result": "Framework adopted in international publications and active research projects."
            }
        },
        "master_thesis": {
            "title": "Multi-agent architecture for elderly mobility analysis",
            "grade": "A",
            "STAR": {
                "situation": "Limited interpretability and scalability in elderly mobility modelling.",
                "task": "Design a transparent multi-agent system for clustering, validation and interpretation.",
                "action": [
                    "Implemented agents for segmentation and expert comparison",
                    "Created reproducible modelling framework"
                ],
                "result": "System now forms the basis of an ongoing journal manuscript."
            }
        },
        "course_development": {
            "project": "Exploratory Data Analysis (MATLAB → Python)",
            "STAR": {
                "situation": "Course limited by MATLAB licensing and accessibility issues.",
                "task": "Migrate entire course to Python.",
                "action": [
                    "Rebuilt exercises and pipelines",
                    "Developed complete open-source repository"
                ],
                "result": "Course now fully delivered in Python."
            }
        }
    },

    "publications": [
        {
            "type": "conference",
            "title": "Designing Education for the AI Era: Principles for Integrating LLMs in Pedagogy",
            "venue": "IEEE SoftCOM 2025",
            "year": 2025,
            "authors": ["Alberto Biscalchin", "Arezoo Sarkheyli-Hägele", "Jeanette Eriksson", "Bahtijar Vogel"],
            "core_contributions": [
                "Review of 98 sources on LLMs in education",
                "Redefinition of student AI use as a design rather than misconduct problem",
                "Proposal of principles for AI-integrated education"
            ]
        },
        {
            "type": "conference",
            "title": "Multi-Agent Foundation Models for Urban Mobility: The Malmö Elderly Case",
            "venue": "FLLM 2025",
            "year": 2025,
            "authors": ["Alberto Biscalchin", "Elnaz Sarkheyli", "Arezoo Sarkheyli-Hägele"],
            "core_contributions": [
                "Introduction of five-agent modular LLM pipeline",
                "Application to Malmö elderly travel survey",
                "Benchmark vs commercial LLM and human experts",
                "Open-source release of full pipeline"
            ]
        },
        {
            "type": "journal_under_review",
            "manuscript_id": "TBS-D-2025-01074",
            "title": "The Applications of Large Language Models in Travel Behavior Studies: A Narrative Review",
            "venue": "Travel Behaviour and Society",
            "year": 2025,
            "authors": ["Alberto Biscalchin", "Arezoo Sarkheyli-Hägele", "Elnaz Sarkheyli", "Jan A. Persson", "Shiva Habibi"],
            "core_contributions": [
                "Narrative review of 59 LLM and ML mobility studies",
                "Five-class taxonomy of contextual factors",
                "Comparison of CML, LLM, and hybrid systems",
                "Identification of methodological blind spots and future directions"
            ]
        }
    ],

    "research_domains": {
        "ai_in_education": {
            "themes": [
                "LLMs as intelligent interfaces",
                "Task/assessment redesign",
                "Cognitive development under AI mediation",
                "Ethical and epistemological implications"
            ]
        },
        "urban_mobility_llms": {
            "themes": [
                "Travel behaviour analysis",
                "Multi-agent LLM architectures",
                "Interpretability and expert comparison",
                "Ageing population mobility"
            ]
        },
        "contextual_reasoning": {
            "themes": [
                "Integration of heterogeneous contextual data",
                "Limitations of current CML approaches",
                "Generalizability and explainability challenges",
                "Hybrid modelling with LLMs"
            ]
        }
    }
};

// Global state for orbit
let currentOrbitAngle = 0;
let isAnimating = false;
let isPaused = false;
let animationFrameId;
const ORBIT_SPEED = 0.05; // Degrees per frame for idle rotation

document.addEventListener('DOMContentLoaded', () => {
    initScene(contentData);
    startOrbitLoop();
});

function initScene(data) {
    const profile = data.researcher_profile;

    // Setup Profile
    document.getElementById('name').textContent = profile.name;
    document.getElementById('subtitle').textContent = profile.affiliation;
    document.getElementById('uni-text').textContent = "Malmö University";

    // Setup Planets
    const orbitSystem = document.getElementById('orbit-system');
    const sections = [
        { id: 'about', label: 'About', texture: 'img/texture_1.png' },
        { id: 'research', label: 'Research', texture: 'img/texture_2.png' },
        { id: 'publications', label: 'Publications', texture: 'img/texture_3.png' },
        { id: 'teaching', label: 'Teaching', texture: 'img/texture_4.png' },
        { id: 'contact', label: 'Contact', texture: 'img/texture_5.png' }
    ];

    const radius = orbitSystem.offsetWidth / 2;
    const totalPlanets = sections.length;
    const angleStep = 360 / totalPlanets;

    sections.forEach((section, index) => {
        const angle = index * angleStep;
        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-container';
        planetContainer.dataset.angle = angle; // Store initial angle

        // Position planet on the circle using transform
        // We rotate the container to the correct angle, then translate out
        planetContainer.style.transform = `rotateZ(${angle}deg) translateX(${radius}px)`;

        const planet = document.createElement('div');
        planet.className = 'planet';
        planet.style.backgroundImage = `url('${section.texture}')`;

        const label = document.createElement('div');
        label.className = 'planet-label';
        label.textContent = section.label;

        planet.appendChild(label);
        planetContainer.appendChild(planet);
        orbitSystem.appendChild(planetContainer);

        // Click Event
        planetContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isAnimating) return;

            // Calculate target angle to bring this planet to the front (90 degrees in our setup usually corresponds to "bottom/front" depending on rotation)
            // Actually, in a standard CSS circle, 90deg is bottom. 
            // We want the clicked planet to be at 90deg (front of the tilted ellipse).
            // So we need to rotate the orbit system such that: (initialAngle + systemRotation) % 360 = 90
            // systemRotation = 90 - initialAngle

            const targetSystemAngle = 90 - angle;
            rotateToAngle(targetSystemAngle, () => {
                openPanel(section.id, data);
            });
        });
    });

    // Close Button
    document.getElementById('close-btn').addEventListener('click', closePanel);
    document.getElementById('panel-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'panel-overlay') closePanel();
    });
}

function startOrbitLoop() {
    function loop() {
        if (!isPaused && !isAnimating) {
            currentOrbitAngle += ORBIT_SPEED;
            updateOrbitVisuals(currentOrbitAngle);
        }
        animationFrameId = requestAnimationFrame(loop);
    }
    loop();
}

function updateOrbitVisuals(angle) {
    const orbitSystem = document.getElementById('orbit-system');
    orbitSystem.style.transform = `rotateX(75deg) rotateZ(${angle}deg)`;

    // Update depth effects for each planet
    const planets = document.querySelectorAll('.planet-container');
    planets.forEach(p => {
        const initialAngle = parseFloat(p.dataset.angle);
        const totalAngle = (initialAngle + angle) % 360;
        const rad = totalAngle * (Math.PI / 180);

        // Calculate Z-depth (sine of angle)
        // In a circle starting at 0 (right), 90 is bottom (front), 270 is top (back).
        // sin(90) = 1 (front), sin(270) = -1 (back).
        const zDepth = Math.sin(rad);

        // Scale and Brightness based on Z-depth
        // Front (1): Scale 1.2, Brightness 1.2
        // Back (-1): Scale 0.8, Brightness 0.5, Blur 2px

        const scale = 0.8 + (0.4 * (zDepth + 1) / 2); // Map -1..1 to 0.8..1.2
        const brightness = 0.5 + (0.7 * (zDepth + 1) / 2); // Map -1..1 to 0.5..1.2
        const blur = zDepth < 0 ? (Math.abs(zDepth) * 3) : 0;
        const zIndex = Math.floor((zDepth + 1) * 100); // 0 to 200

        const planet = p.querySelector('.planet');
        planet.style.filter = `brightness(${brightness}) blur(${blur}px)`;
        p.style.zIndex = zIndex;

        // We also need to counter-rotate the planet container's Z rotation so it stays upright?
        // No, the planet container rotates WITH the system. 
        // But the planet itself has rotateX(-75deg) to stand up.
        // The label also has rotateX(-75deg).
        // We might want to scale the container itself.
        p.style.transform = `rotateZ(${initialAngle}deg) translateX(${orbitSystem.offsetWidth / 2}px) scale(${scale})`;
    });
}

function rotateToAngle(targetAngle, callback) {
    isAnimating = true;

    // Normalize angles to find shortest path
    let start = currentOrbitAngle % 360;
    let end = targetAngle % 360;

    // Ensure smooth transition across 0/360 boundary
    let diff = end - start;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const finalAngle = currentOrbitAngle + diff;
    const duration = 1000; // ms
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);

        currentOrbitAngle = start + (diff * ease);
        updateOrbitVisuals(currentOrbitAngle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            isPaused = true; // Pause idle rotation while panel is open
            if (callback) callback();
        }
    }
    requestAnimationFrame(animate);
}

function openPanel(sectionId, data) {
    const overlay = document.getElementById('panel-overlay');
    const contentDiv = document.getElementById('panel-content');

    contentDiv.innerHTML = generateContent(sectionId, data);
    overlay.classList.remove('hidden');
}

function closePanel() {
    const overlay = document.getElementById('panel-overlay');
    overlay.classList.add('hidden');

    // Resume idle rotation
    isPaused = false;
}

function generateContent(sectionId, data) {
    let html = '';
    switch (sectionId) {
        case 'about':
            html += `<h2>About Me</h2>`;
            html += `<div class="card"><p>I am ${data.researcher_profile.name}, a researcher at ${data.researcher_profile.affiliation}.</p></div>`;
            html += `<h3>Education</h3>`;
            data.researcher_profile.education.forEach(edu => {
                html += `<div class="card">
                    <strong>${edu.year}</strong> - ${edu.degree}<br>
                    <span style="color:var(--text-muted)">${edu.institution}</span>
                </div>`;
            });
            break;

        case 'research':
            html += `<h2>Research Domains</h2>`;
            for (const [key, domain] of Object.entries(data.research_domains)) {
                const title = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                html += `<div class="card">
                    <h3>${title}</h3>
                    <ul>${domain.themes.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>`;
            }
            html += `<h3>Experience</h3>`;
            const resExp = data.research_experience.research_assistant_role;
            if (resExp) {
                html += `<div class="card">
                    <p><strong>${resExp.summary}</strong></p>
                    <p>${resExp.STAR.result}</p>
                </div>`;
            }
            break;

        case 'publications':
            html += `<h2>Publications</h2>`;
            data.publications.forEach(pub => {
                html += `<div class="card">
                    <h3>${pub.title}</h3>
                    <p style="color:var(--accent-glow)">${pub.venue}, ${pub.year}</p>
                    <p><em>${pub.authors.join(', ')}</em></p>
                    <p style="margin-top:0.5rem">${pub.core_contributions[0]}</p>
                </div>`;
            });
            break;

        case 'teaching':
            html += `<h2>Teaching & Experience</h2>`;
            html += `<h3>Academic Positions</h3>`;
            data.academic_positions.forEach(pos => {
                html += `<div class="card">
                    <strong>${pos.role}</strong><br>
                    ${pos.institution} (${pos.years})
                </div>`;
            });
            html += `<h3>Professional Experience</h3>`;
            data.professional_experience.forEach(pos => {
                html += `<div class="card">
                    <strong>${pos.role}</strong><br>
                    ${pos.company} (${pos.years})
                </div>`;
            });
            break;

        case 'contact':
            html += `<h2>Contact</h2>`;
            const contact = data.researcher_profile.contacts;
            html += `<div class="card" style="text-align:center">
                <p>${data.researcher_profile.affiliation}</p>
                <p>${data.researcher_profile.address}</p>
                <h3 style="margin:2rem 0">${contact.email_institutional}</h3>
                <p>Personal: ${contact.email_personal}</p>
            </div>`;
            break;
    }
    return html;
}