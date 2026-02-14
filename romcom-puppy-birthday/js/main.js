// ==================== GAME STATE ====================
const state = {
    scene: 'intro',
    completedTasks: 0,
    tasks: {
        decorate: false,
        movie: false,
        dance: false,
        gift: false
    },
    musicOn: false,
    currentTask: null,
    taskStep: 0
};

// ==================== DOM ELEMENTS ====================
const elements = {
    puppy: document.getElementById('puppy'),
    textOverlay: document.getElementById('text-overlay'),
    controls: document.getElementById('controls'),
    music: document.getElementById('bg-music'),
    musicBtn: document.getElementById('music-toggle'),
    background: document.getElementById('background'),
    interactiveArea: document.getElementById('interactive-area'),
    progress: document.getElementById('progress'),
    progressDots: document.querySelectorAll('.progress-dot')
};

// Check if elements exist
console.log('Elements loaded:', {
    puppy: !!elements.puppy,
    textOverlay: !!elements.textOverlay,
    controls: !!elements.controls,
    interactiveArea: !!elements.interactiveArea
});
// Add near the top of your file, after elements definition
// Fix for multiple animations
let currentAnimation = null;

// Replace or update your setPuppy function's emoji fallback part
// When using emoji fallback, make sure to hide any previous emoji
// ==================== PUPPY ANIMATION (No external files needed) ====================
function setPuppy(animationType, autoReset = true) {
    // Hide Lottie player
    if (elements.puppy) {
        elements.puppy.style.display = 'none';
    }
    
    // Create or get emoji container
    let emojiContainer = document.getElementById('puppy-emoji');
    if (!emojiContainer) {
        emojiContainer = document.createElement('div');
        emojiContainer.id = 'puppy-emoji';
        emojiContainer.style.fontSize = '200px';
        emojiContainer.style.textAlign = 'center';
        emojiContainer.style.lineHeight = '1';
        emojiContainer.style.animation = 'float 3s infinite ease-in-out';
        
        // Add style for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.querySelector('.puppy-container').appendChild(emojiContainer);
    }
    
    // Map animation types to emojis
    switch(animationType) {
        case 'idle':
            emojiContainer.textContent = '🐶';
            break;
        case 'excited':
        case 'clap':
            emojiContainer.textContent = '🐕‍🦺✨';
            if (autoReset) setTimeout(() => setPuppy('idle'), 1500);
            break;
        case 'wag':
            emojiContainer.textContent = '🐕‍🦺💕';
            if (autoReset) setTimeout(() => setPuppy('idle'), 1500);
            break;
        case 'hop':
            emojiContainer.textContent = '🐕‍🦺🦘';
            if (autoReset) setTimeout(() => setPuppy('idle'), 1500);
            break;
        case 'celebrate':
            emojiContainer.textContent = '🐕‍🦺🎉';
            if (autoReset) setTimeout(() => setPuppy('idle'), 1500);
            break;
        case 'curious':
            emojiContainer.textContent = '🤔🐶';
            if (autoReset) setTimeout(() => setPuppy('idle'), 1500);
            break;
        default:
            emojiContainer.textContent = '🐶';
    }
}

// ==================== HELPER FUNCTIONS ====================
function showText(lines, delay = 300) {
    if (!elements.textOverlay) return;
    
    elements.textOverlay.innerHTML = lines.map(line => 
        `<p class="fade-line">${line}</p>`
    ).join('');
    
    setTimeout(() => {
        document.querySelectorAll('.fade-line').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 1000);
        });
    }, delay);
}

function showButton(text, onClick, isPrimary = true) {
    if (!elements.controls) return;
    
    elements.controls.innerHTML = `<button class="${isPrimary ? 'primary' : ''}">${text}</button>`;
    const button = elements.controls.querySelector('button');
    if (button) {
        button.onclick = onClick;
    }
}

function clearControls() {
    if (elements.controls) {
        elements.controls.innerHTML = '';
    }
}

function updateProgress() {
    if (!elements.progressDots.length) return;
    
    elements.progressDots.forEach((dot, index) => {
        const taskKeys = ['decorate', 'movie', 'dance', 'gift'];
        if (state.tasks[taskKeys[index]]) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
    });
}

function nextScene(sceneId) {
    console.log('Switching to scene:', sceneId);
    state.scene = sceneId;
    
    // Clear interactive area
    if (elements.interactiveArea) {
        elements.interactiveArea.innerHTML = '';
        elements.interactiveArea.classList.remove('active');
    }
    
    // Call appropriate scene renderer
    switch(sceneId) {
        case 'intro':
            renderIntro();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'buildup':
            renderBuildup();
            break;
        case 'reveal':
            renderReveal();
            break;
    }
}

// ==================== MUSIC CONTROL ====================
if (elements.musicBtn) {
    elements.musicBtn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    state.musicOn = !state.musicOn;
    
    if (state.musicOn && elements.music) {
        elements.music.volume = 0.25;
        elements.music.play().catch(e => console.log('Music play failed:', e));
        elements.musicBtn.textContent = '🔊';
    } else if (elements.music) {
        elements.music.pause();
        elements.musicBtn.textContent = '🎵';
    }
}

// ==================== SCENE 1: INTRO ====================
function renderIntro() {
    console.log('Rendering intro scene');
    
    setPuppy('idle');
    
    if (elements.background) {
        elements.background.classList.remove('lit');
        elements.background.classList.add('dim');
    }
    
    showText([
        "Every good rom-com...",
        "needs the perfect setup."
    ]);
    
    setTimeout(() => {
        showButton("Let's set the scene 🎬", () => nextScene('tasks'));
    }, 3500);
}

// ==================== SCENE 2: TASKS ====================
function renderTasks() {
    console.log('Rendering tasks scene');
    
    if (elements.progress) {
        elements.progress.classList.remove('hidden');
    }
    updateProgress();
    
    setPuppy('idle');
    
    showText([
        "Okay, first things first...",
        "Let's make this place feel special."
    ]);
    
    setTimeout(() => {
        startTask('decorate');
    }, 4000);
}

function startTask(taskId) {
    console.log('Starting task:', taskId);
    state.currentTask = taskId;
    state.taskStep = 0;
    
    if (elements.textOverlay) elements.textOverlay.innerHTML = '';
    clearControls();
    
    if (elements.interactiveArea) {
        elements.interactiveArea.classList.add('active');
        elements.interactiveArea.classList.remove('hidden');
        elements.interactiveArea.innerHTML = '';
    }
    
    switch(taskId) {
        case 'decorate':
            renderDecorateTask();
            break;
        case 'movie':
            renderMovieTask();
            break;
        case 'dance':
            renderDanceTask();
            break;
        case 'gift':
            renderGiftTask();
            break;
    }
}

function completeTask(taskId) {
    console.log('Completing task:', taskId);
    
    state.tasks[taskId] = true;
    state.completedTasks++;
    updateProgress();
    
    setPuppy('clap');
    
    const messages = {
        decorate: "Already looking better...",
        movie: "Perfect movie night picks!",
        dance: "You've got the rhythm!",
        gift: "Almost there..."
    };
    
    showText([messages[taskId]]);
    
    if (elements.interactiveArea) {
        elements.interactiveArea.classList.remove('active');
        elements.interactiveArea.innerHTML = '';
    }
    
    if (state.completedTasks >= 2 && elements.background) {
        elements.background.classList.add('lit');
    }
    
    if (state.completedTasks < 4) {
        setTimeout(() => {
            const nextTasks = ['decorate', 'movie', 'dance', 'gift'];
            const nextTask = nextTasks.find(t => !state.tasks[t]);
            if (nextTask) {
                startTask(nextTask);
            }
        }, 2000);
    } else {
        setTimeout(() => {
            nextScene('buildup');
        }, 2500);
    }
}

// ==================== TASK 1: DECORATE (Fixed Version) ====================
// ==================== TASK 1: DECORATE (Fixed Layout) ====================
function renderDecorateTask() {
    console.log('Rendering decorate task - FIXED LAYOUT');
    
    // Clear any existing elements
    elements.interactiveArea.innerHTML = '';
    
    // Show text with better positioning
    elements.textOverlay.innerHTML = `
        <p class="fade-line visible" style="font-size: 1.2rem; margin-bottom: 5px;">Let's add some decorations!</p>
        <p class="fade-line visible" style="font-size: 0.9rem; opacity: 0.8;">Tap each item to place it</p>
    `;
    
    // Items to place - better positioned
    const items = [
        { id: 'banner', emoji: '🎊', label: 'Banner', x: 20, y: 60 },
        { id: 'lights', emoji: '✨', label: 'Lights', x: 40, y: 50 },
        { id: 'balloons', emoji: '🎈', label: 'Balloons', x: 60, y: 65 }
    ];
    
    // Target positions - where items should go
    const targets = [
        { id: 'target-banner', emoji: '🎊', x: 70, y: 25, label: 'Banner spot' },
        { id: 'target-lights', emoji: '✨', x: 25, y: 30, label: 'Lights spot' },
        { id: 'target-balloons', emoji: '🎈', x: 50, y: 35, label: 'Balloons spot' }
    ];
    
    let placedCount = 0;
    
    // Create draggable items
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.id = item.id;
        itemEl.className = 'task-element';
        itemEl.style.left = item.x + '%';
        itemEl.style.top = item.y + '%';
        itemEl.style.fontSize = '70px';
        itemEl.style.cursor = 'grab';
        itemEl.style.transform = 'translate(-50%, -50%)';
        itemEl.textContent = item.emoji;
        itemEl.setAttribute('draggable', 'true');
        itemEl.setAttribute('data-item', item.id);
        
        // Add small label
        const label = document.createElement('div');
        label.style.fontSize = '12px';
        label.style.textAlign = 'center';
        label.style.background = 'rgba(255,255,255,0.7)';
        label.style.padding = '2px 6px';
        label.style.borderRadius = '10px';
        label.style.marginTop = '5px';
        label.textContent = item.label;
        itemEl.appendChild(label);
        
        // Drag events
        itemEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.target.style.opacity = '0.6';
        });
        
        itemEl.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
        
        elements.interactiveArea.appendChild(itemEl);
    });
    
    // Create target zones (visual drop areas)
    targets.forEach(target => {
        const targetEl = document.createElement('div');
        targetEl.id = target.id;
        targetEl.className = 'target-zone';
        targetEl.style.left = target.x + '%';
        targetEl.style.top = target.y + '%';
        targetEl.style.width = '100px';
        targetEl.style.height = '100px';
        targetEl.style.transform = 'translate(-50%, -50%)';
        targetEl.setAttribute('data-target', target.id.replace('target-', ''));
        
        // Add visual hint
        const hint = document.createElement('div');
        hint.style.fontSize = '30px';
        hint.style.opacity = '0.7';
        hint.style.marginBottom = '5px';
        hint.textContent = target.emoji;
        targetEl.appendChild(hint);
        
        const label = document.createElement('div');
        label.style.fontSize = '10px';
        label.style.color = '#666';
        label.textContent = target.label;
        targetEl.appendChild(label);
        
        // Drop events
        targetEl.addEventListener('dragover', (e) => e.preventDefault());
        
        targetEl.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetZone = e.target.closest('.target-zone');
            if (!targetZone) return;
            
            const itemId = e.dataTransfer.getData('text/plain');
            const item = document.getElementById(itemId);
            if (!item) return;
            
            const targetFor = targetZone.id.replace('target-', '');
            const itemType = item.id;
            
            if (itemType === targetFor) {
                // Place item
                const rect = targetZone.getBoundingClientRect();
                item.style.left = (rect.left / window.innerWidth * 100) + '%';
                item.style.top = (rect.top / window.innerHeight * 100) + '%';
                item.style.position = 'fixed';
                item.setAttribute('draggable', 'false');
                item.style.cursor = 'default';
                item.classList.add('placed');
                
                // Add checkmark
                const check = document.createElement('div');
                check.style.position = 'absolute';
                check.style.top = '-10px';
                check.style.right = '-10px';
                check.style.background = '#4ECDC4';
                check.style.color = 'white';
                check.style.width = '25px';
                check.style.height = '25px';
                check.style.borderRadius = '50%';
                check.style.display = 'flex';
                check.style.alignItems = 'center';
                check.style.justifyContent = 'center';
                check.style.fontSize = '16px';
                check.textContent = '✓';
                item.appendChild(check);
                
                // Remove target zone
                targetZone.remove();
                
                placedCount++;
                
                // Puppy reaction
                setPuppy('puppy-wag.json', false, 1);
                
                if (placedCount === items.length) {
                    setTimeout(() => {
                        completeTask('decorate');
                    }, 1000);
                }
            } else {
                // Wrong placement - wiggle
                item.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    item.style.animation = '';
                }, 500);
            }
        });
        
        elements.interactiveArea.appendChild(targetEl);
    });
    
    // Add instruction at bottom
    const instruction = document.createElement('div');
    instruction.className = 'task-instruction';
    instruction.textContent = '👆 Drag each item to its matching spot';
    elements.interactiveArea.appendChild(instruction);
}

// ==================== TASK 2: MOVIE POSTERS (Simplified) ====================
// ==================== TASK 2: MOVIE POSTERS (Fixed Layout) ====================
function renderMovieTask() {
    console.log('Rendering movie task - FIXED LAYOUT');
    
    elements.interactiveArea.innerHTML = '';
    
    elements.textOverlay.innerHTML = `
        <p class="fade-line visible" style="font-size: 1.2rem;">Now... what should we watch?</p>
        <p class="fade-line visible" style="font-size: 0.9rem; opacity: 0.8;">Tap the posters in order: 1-2-3</p>
    `;
    
    // Movie posters
    const posters = [
        { id: 'poster1', emoji: '🎬', title: 'Love Story', order: 1, x: 25, y: 50 },
        { id: 'poster2', emoji: '🎭', title: 'Rom Com', order: 2, x: 50, y: 50 },
        { id: 'poster3', emoji: '🎪', title: 'Happy End', order: 3, x: 75, y: 50 }
    ];
    
    let currentOrder = 1;
    
    posters.forEach(poster => {
        const posterEl = document.createElement('div');
        posterEl.id = poster.id;
        posterEl.className = 'poster';
        posterEl.style.left = poster.x + '%';
        posterEl.style.top = poster.y + '%';
        posterEl.style.transform = 'translate(-50%, -50%)';
        posterEl.style.width = '100px';
        posterEl.style.height = '130px';
        posterEl.setAttribute('data-order', poster.order);
        
        posterEl.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 5px;">${poster.emoji}</div>
            <div style="font-size: 11px; font-weight: bold; text-align: center;">${poster.title}</div>
            <div style="font-size: 10px; color: #888; margin-top: 5px;">Order: ${poster.order}</div>
        `;
        
        posterEl.addEventListener('click', function() {
            const order = parseInt(this.getAttribute('data-order'));
            
            if (order === currentOrder) {
                // Correct
                this.style.border = '4px solid #4ECDC4';
                this.style.transform = 'translate(-50%, -50%) scale(1.05)';
                this.style.pointerEvents = 'none';
                
                // Add checkmark
                const check = document.createElement('div');
                check.style.position = 'absolute';
                check.style.top = '-8px';
                check.style.right = '-8px';
                check.style.background = '#4ECDC4';
                check.style.color = 'white';
                check.style.width = '24px';
                check.style.height = '24px';
                check.style.borderRadius = '50%';
                check.style.display = 'flex';
                check.style.alignItems = 'center';
                check.style.justifyContent = 'center';
                check.style.fontSize = '14px';
                check.textContent = '✓';
                this.appendChild(check);
                
                currentOrder++;
                setPuppy('puppy-wag.json', false, 1);
                
                if (currentOrder > 3) {
                    setTimeout(() => {
                        completeTask('movie');
                    }, 500);
                }
            } else {
                // Wrong
                this.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            }
        });
        
        elements.interactiveArea.appendChild(posterEl);
    });
    
    // Add instruction
    const instruction = document.createElement('div');
    instruction.className = 'task-instruction';
    instruction.textContent = '👆 Tap in order: 1 → 2 → 3';
    elements.interactiveArea.appendChild(instruction);
}

// ==================== TASK 3: DANCE (Simplified) ====================
// ==================== TASK 3: DANCE (Fixed Layout) ====================
function renderDanceTask() {
    console.log('Rendering dance task - FIXED LAYOUT');
    
    elements.interactiveArea.innerHTML = '';
    
    elements.textOverlay.innerHTML = `
        <p class="fade-line visible" style="font-size: 1.2rem;">Time to set the mood with music...</p>
        <p class="fade-line visible" style="font-size: 0.9rem; opacity: 0.8;">Tap all 4 dots to dance!</p>
    `;
    
    // Create rhythm dots - better positioned
    const dots = [
        { id: 'dot1', emoji: '✨', x: 30, y: 45 },
        { id: 'dot2', emoji: '🎵', x: 50, y: 30 },
        { id: 'dot3', emoji: '💫', x: 70, y: 45 },
        { id: 'dot4', emoji: '🎉', x: 50, y: 60 }
    ];
    
    let tappedCount = 0;
    
    dots.forEach(dot => {
        const dotEl = document.createElement('div');
        dotEl.id = dot.id;
        dotEl.className = 'rhythm-dot';
        dotEl.style.left = dot.x + '%';
        dotEl.style.top = dot.y + '%';
        dotEl.style.transform = 'translate(-50%, -50%)';
        dotEl.textContent = dot.emoji;
        
        dotEl.addEventListener('click', function() {
            if (this.classList.contains('tapped')) return;
            
            this.classList.add('tapped', 'hit');
            this.style.background = '#4ECDC4';
            this.style.color = 'white';
            this.style.transform = 'translate(-50%, -50%) scale(1.2)';
            
            tappedCount++;
            
            // Puppy reaction
            setPuppy('puppy-hop.json', false, 1);
            
            if (tappedCount === dots.length) {
                setTimeout(() => {
                    completeTask('dance');
                }, 800);
            }
        });
        
        elements.interactiveArea.appendChild(dotEl);
    });
    
    // Add instruction
    const instruction = document.createElement('div');
    instruction.className = 'task-instruction';
    instruction.textContent = '👆 Tap all 4 dots to dance!';
    elements.interactiveArea.appendChild(instruction);
}

// ==================== TASK 4: GIFT (Simplified) ====================
function renderGiftTask() {
    console.log('Rendering gift task');
    
    if (!elements.interactiveArea) return;
    
    showText([
        "One last thing... the gift.",
        "Tap to add ribbon, then tap to seal"
    ]);
    
    // Create gift box
    const giftBox = document.createElement('div');
    giftBox.id = 'gift-box';
    giftBox.style.position = 'absolute';
    giftBox.style.left = '50%';
    giftBox.style.top = '40%';
    giftBox.style.transform = 'translate(-50%, -50%)';
    giftBox.style.width = '150px';
    giftBox.style.height = '150px';
    giftBox.style.background = 'linear-gradient(135deg, #FF9EB5, #FF6B8B)';
    giftBox.style.borderRadius = '20px';
    giftBox.style.display = 'flex';
    giftBox.style.alignItems = 'center';
    giftBox.style.justifyContent = 'center';
    giftBox.style.fontSize = '80px';
    giftBox.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    giftBox.style.cursor = 'pointer';
    giftBox.textContent = '🎁';
    elements.interactiveArea.appendChild(giftBox);
    
    let ribbonAdded = false;
    
    // Add ribbon on first click
    giftBox.addEventListener('click', function firstClick() {
        if (!ribbonAdded) {
            // Add ribbon emoji
            const ribbon = document.createElement('div');
            ribbon.style.position = 'absolute';
            ribbon.style.top = '-20px';
            ribbon.style.right = '-20px';
            ribbon.style.fontSize = '60px';
            ribbon.style.transform = 'rotate(45deg)';
            ribbon.textContent = '🎀';
            giftBox.appendChild(ribbon);
            
            ribbonAdded = true;
            setPuppy('wag');
            
            showText(["Now tap the gift to seal it!"]);
            
            // Change to second click handler
            giftBox.removeEventListener('click', firstClick);
            giftBox.addEventListener('click', secondClick);
        }
    });
    
    function secondClick() {
        // Add seal
        const seal = document.createElement('div');
        seal.style.position = 'absolute';
        seal.style.bottom = '-10px';
        seal.style.left = '50%';
        seal.style.transform = 'translateX(-50%)';
        seal.style.fontSize = '40px';
        seal.style.color = 'gold';
        seal.textContent = '⭐';
        giftBox.appendChild(seal);
        
        giftBox.style.transform = 'translate(-50%, -50%) scale(1.1)';
        giftBox.style.boxShadow = '0 0 50px gold';
        
        setPuppy('celebrate');
        
        showText(["Perfect... it's ready!"]);
        
        setTimeout(() => {
            completeTask('gift');
        }, 1500);
    }
}

// ==================== SCENE 3: BUILD-UP ====================
function renderBuildup() {
    console.log('Rendering buildup scene');
    
    if (elements.progress) {
        elements.progress.classList.add('hidden');
    }
    
    if (elements.background) {
        elements.background.classList.add('dim');
        elements.background.classList.remove('lit');
    }
    
    setPuppy('idle', false);
    
    setTimeout(() => {
        showText(["Okay..."]);
    }, 500);
    
    setTimeout(() => {
        showText(["Now it's ready."]);
    }, 2500);
    
    setTimeout(() => {
        showButton("Open it 🎁", () => nextScene('reveal'), true);
    }, 4500);
}

// ==================== SCENE 4: REVEAL ====================
function renderReveal() {
    console.log('Rendering reveal scene');
    
    setPuppy('celebrate', false);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'reveal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = '#000';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1.5s ease';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '200';
    document.body.appendChild(overlay);
    
    // Darken
    setTimeout(() => {
        overlay.style.opacity = '0.7';
        
        // Music swell
        if (state.musicOn && elements.music) {
            elements.music.volume = 0.4;
        }
        
        // Create confetti
        for (let i = 0; i < 30; i++) {
            createConfetti();
        }
        
        // Show title
        const title = document.createElement('h1');
        title.className = 'reveal-title';
        title.style.position = 'fixed';
        title.style.top = '50%';
        title.style.left = '50%';
        title.style.transform = 'translate(-50%, -50%)';
        title.style.fontFamily = "'Playfair Display', serif";
        title.style.fontSize = window.innerWidth < 600 ? '2.2rem' : '3rem';
        title.style.color = '#FFD700';
        title.style.textShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        title.style.textAlign = 'center';
        title.style.zIndex = '250';
        title.style.opacity = '0';
        title.style.transition = 'opacity 1.5s ease';
        title.style.width = '100%';
        title.style.padding = '20px';
        title.innerHTML = 'HAPPY BIRTHDAY!<br>' +
            '<span style="font-size: 1.5rem; color: white; margin-top: 20px; display: block;">Wishing you a year full of great movies & dance floors! 🎈</span>';
        document.body.appendChild(title);
        
        setTimeout(() => {
            title.style.opacity = '1';
        }, 500);
        
        // Show buttons
        setTimeout(() => {
            if (elements.controls) {
                elements.controls.innerHTML = `
                    <button class="primary" onclick="location.reload()">Watch again 🔄</button>
                    <button onclick="document.body.style.opacity='0'; setTimeout(()=>{alert('Hope you enjoyed the show! 🎬')},500)">Close 🎬</button>
                `;
            }
        }, 3000);
        
    }, 500);
}

// Helper to create confetti
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.width = (Math.random() * 10 + 5) + 'px';
    confetti.style.height = confetti.style.width;
    confetti.style.background = `hsl(${Math.random() * 60 + 300}, 80%, 70%)`;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.zIndex = '300';
    confetti.style.animation = `confettiFall ${Math.random() * 3 + 4}s linear forwards`;
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 7000);
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);

// ==================== INITIALIZATION ====================
window.addEventListener('load', () => {
    console.log('Rom-Com Puppy Birthday loaded!');
    
    // Set initial puppy
    setPuppy('idle');
    
    // Start with intro scene
    setTimeout(() => {
        renderIntro();
    }, 500);
});
