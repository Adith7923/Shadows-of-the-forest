document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    const scene = document.createElement("div");
    scene.id = "scene";

    const title = document.createElement("h1");
    title.id = "scene-title";
    const extraimage = document.createElement("img");
    extraimage.id = "extra-image";
    const image = document.createElement("img");
    image.id = "scene-image";

    const contentContainer = document.createElement("div");
    contentContainer.id = "content-container";

    const narration = document.createElement("p");
    narration.id = "narration";

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    const glass = document.querySelector(".magnifying-glass");

    narration.addEventListener("mousemove", (e) => {
        glass.style.display = "block"; 
        glass.style.left = `${e.clientX}px`;
        glass.style.top = `${e.clientY}px`;
    });
    
    narration.addEventListener("mouseleave", () => {
        glass.style.display = "none"; // Hide when leaving narration
    });
    
    contentContainer.appendChild(extraimage);
    contentContainer.appendChild(narration);
    contentContainer.appendChild(buttonContainer);

    scene.appendChild(title);
    scene.appendChild(image);
    scene.appendChild(contentContainer);
    gameContainer.appendChild(scene);

    let currentSceneAudio = null;
 // Track user interaction
 const clickSound = new Audio("sounds/stone_move.mp3");  

 function openPuzzleModal() {
    const modal = document.getElementById("puzzle-modal");
    modal.style.display = "flex";
    buttonContainer.innerHTML = ""; // Clear buttons
    createPuzzle(); // Generate puzzle when modal opens
}
function handleChoice(choice) {
    if (choice.redirect) {
        window.location.href = "index.html"; // Redirects to index.html
    } else {
        loadScene(choice.nextScene);
    }
}
function closePuzzleModal() {
    document.getElementById("puzzle-modal").style.display = "none";
    loadScene(16); // Load the next scene after solving
}

document.getElementById("exit-button").addEventListener("click", closePuzzleModal);
document.getElementById("skip-button").addEventListener("click", closePuzzleModal);

function createPuzzle() {
    const container = document.getElementById("puzzle-container");
    container.innerHTML = ""; 

    const symbols = ["🌧️", "✉️", "🌳", "🪨", "🐻", "👣", "🚪", "🌊", null];
    let currentState = symbols.slice().sort(() => Math.random() - 0.5);

    currentState.forEach((symbol, index) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (symbol !== null) {
            tile.innerText = symbol;
            tile.dataset.index = index;
        } else {
            tile.classList.add("empty");
        }
        tile.addEventListener("click", () => moveTile(index, currentState));
        container.appendChild(tile);
    });
}

function moveTile(index, currentState) {
    const emptyIndex = currentState.indexOf(null);
    if (isValidMove(index, emptyIndex)) {
        clickSound.play();
        [currentState[index], currentState[emptyIndex]] = [currentState[emptyIndex], currentState[index]];
        updateTiles(currentState);
        checkWin(currentState);
    }
}

function isValidMove(index, emptyIndex) {
    const size = 3;
    const [x1, y1] = [index % size, Math.floor(index / size)];
    const [x2, y2] = [emptyIndex % size, Math.floor(emptyIndex / size)];
    return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function updateTiles(currentState) {
    const container = document.getElementById("puzzle-container");
    container.innerHTML = "";
    currentState.forEach((symbol, index) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (symbol !== null) {
            tile.innerText = symbol;
            tile.dataset.index = index;
        } else {
            tile.classList.add("empty");
        }
        tile.addEventListener("click", () => moveTile(index, currentState));
        container.appendChild(tile);
    });
}

function checkWin(currentState) {
    const correctOrder = ["🌧️", "✉️", "🌳", "🪨", "🐻", "👣", "🚪", "🌊", null];
    if (JSON.stringify(currentState) === JSON.stringify(correctOrder)) {
        setTimeout(() => {
            alert("🔓 The door unlocks!");
            closePuzzleModal();
        }, 300);
    }
}

function playSceneAudio(audioFile) {
    // Stop and remove previous audio properly
    if (currentSceneAudio) {
        currentSceneAudio.pause();
        currentSceneAudio.currentTime = 0;
        currentSceneAudio = null; // Clear reference
    }

    // Create new audio and play if allowed
    currentSceneAudio = new Audio(audioFile);
    currentSceneAudio.volume = 0.1;

    if (isAudioUnlocked) {
        currentSceneAudio.play().catch(error => {
            console.warn("Audio playback error:", error);
        });
    } else {
        console.warn("Autoplay blocked. Waiting for user interaction.");
    }
}

// 🚀 Unlock audio on user interaction
document.addEventListener("click", function () {
    if (!isAudioUnlocked) {
        isAudioUnlocked = true;
        console.log("User interaction detected. Audio unlocked.");

        // Play pending audio if it exists
        if (currentSceneAudio) {
            currentSceneAudio.play().catch(error => console.warn("Audio unlock failed:", error));
        }
    }
});


    // 🔊 Add button click sound effect
    const buttonClickSound = new Audio("sounds/button.wav"); // Ensure this path is correct

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("choice-button")) {
            buttonClickSound.currentTime = 0; // Reset for quick replay
            buttonClickSound.play();
        }
    });

    
    // Scene data
    const scenes = [
        {   // Scene 0
            title: "The Detective’s Office",
            text: "Jack stares at the rain, the reflection of his weary face staring back. Two years. Two unsolved cases. Two tragedies that had shattered his reputation. ",
            background: "office.jpg",
            audio: "sounds/rain.mp3",
            choices: [
                { text: "Look through the Window", nextScene: 1 },
                { text: "Investigate Room", nextScene: 2 },
                
            ]
        },
        {   // Scene 1
            title: "A Creak Near the Window",
            text: "A faint creak. A noise near the window. Jack’s pulse quickens.",
            background: "window_creak.jpg",
            audio: "sounds/creak.mp3",
            choices: [
                { text: "Look Out", nextScene: 3 },
                { text: "Stay Silent", nextScene: 4 }
            ]
        },
        {   // Scene 2
            title: "A Mysterious Letter",
            text: "Jack walks to the door. In his postbox, a single letter rests inside. No return address. Just his name.",
            background: "postbox.jpg",
            audio: "sounds/letter_post.mp3",
            choices: [
                { text: "Open It", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        {   //scene 3
            title: "An Unexpected Letter",
            text: "Jack scans the room. Nothing unusual—except a single letter lying on the table.",
            background: "letter_table.jpg",
            audio: "sounds/silence.mp3",
            choices: [
                { text: "Open the Letter", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        
        {   //  Scene 4
            title: "A Letter Slips Through the Door",
            text: "A soft rustling sound. Jack turns just in time to see an envelope slide under his door.",
            background: "letter_door.jpg",
            audio: "sounds/letter_post.mp3",
            choices: [
                { text: "Open It", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        
        {   //scene 5
            title: "A Cryptic Message",
            text: "Inside, a message scrawled in hurried handwriting: 'A girl is lost. Find her before it's too late.' At the bottom—coordinates to an unknown place.",
            background: "envelope.png",
            extraimage: "paper.png",
            audio: "sounds/tear.mp3",
            choices: [
                { text: "Take It Seriously", nextScene: 7 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        {   // Scene 6
            title: "A Haunting Reminder",
            text: "Jack turns away, but the envelope remains in sight, taunting him. A memory stirs—something from his past that could destroy his career. His hands tremble.",
            background: "haunted_memory.jpg",
            audio: "sounds/heartbeat.mp3",
            choices: [
                { text: "Open the Letter", nextScene: 5 }
            ]
        },
        {   //scene 7
            title: "The Mysterious Coordinates",
            text: "Jack marks the coordinates on the map. Three locations stand out as potential leads.",
            background: "map.jpg",
            extraimage: "map.png",
            audio: "sounds/thinking.mp3",
            choices: [
                { text: "Forest", nextScene: 8 },
                { text: "Library", nextScene: 9 },
                { text: "School", nextScene: 9 }
            ]
        },
        
        {   //scene 8
            title: "Duskwood Forest",
            text: "Jack arrives at Duskwood Forest. The dense trees create an eerie silence. Following the coordinates, he finds a cave hidden behind overgrown vines.",
            background: "duskwood_forest.jpg",
            audio: "sounds/forest_ambience.wav",
            choices: [
                { text: "Enter the cave", nextScene: 10 }
            ]
        },
        {   //scene 9
            title: "Dead Ends",
            text: "Jack searches the library and school, but finds no useful clues. The coordinates must have meant something else.",
            background: "empty_library.jpg", // or "empty_school.png"
            audio: "sounds/failure.mp3",
            choices: [
                { text: "Recheck the map", nextScene: 7 } // Goes back to Scene 7
            ]
        },
        {   //scene 10
            title: "Footstep Trails",
            text: "Jack reaches the cave. He sees trails of boots, small girl footsteps, and animal tracks leading inside. The decision is critical.",
            background: "cave_entrance.jpg",
            audio: "sounds/ominous_wind.wav",
            choices: [
                { text: "Follow into the cave", nextScene: 11 }
            ]
        },
        {   //scene 11
            title: "Into the Darkness",
            text: "Jack steps deeper into the cave. The darkness is suffocating, and the air feels heavy. He can barely see his own hands. Every step echoes off the rocky walls.",
            background: "cave_dark.jpg",
            audio: "sounds/distant_drips.mp3",
            choices: [
                { text: "Turn on flashlight", nextScene: 12 },
                { text: "Walk silently in the dark", nextScene: 13 }
            ]
        },
        {   //scene 12
            title: "The Junction",
            text: "Jack lights his flashlight, and the cave walls flicker with eerie shadows. As he moves forward, he reaches a junction where three different trails appear on the dusty ground.",
            background: "cave_junction.jpg",
            audio: "sounds/flickering_fire.wav",
            choices: [
                { text: "Follow the smudged footprints", nextScene: 13 },
                { text: "Follow the girl's footsteps", nextScene: 13 },
                { text: "Follow the boot prints", nextScene: 14 }
            ]
        },
        {   //scene 13
            title: "The Bear Attack",
            text: "As Jack cautiously walks in the dark, he hears a deep growl. Suddenly, a massive bear lunges at him from the shadows! His heart pounds as the beast snarls, ready to strike.",
            background: "cave_bear.jpg",
            audio: "sounds/bear_roar.mp3",
            choices: [
                { text: "Use fire to scare the bear and run", nextScene: 12 } 
            ]
        },
        {   //scene 14
            title: "The Stone Door Puzzle",
            text: "Jack follows the trail of boots deeper into the cave. He arrives at an ancient stone door covered in strange symbols. A puzzle mechanism is embedded in the rock, blocking the way forward.",
            background: "stone_puzzle.jpg",
            audio: "sounds/mystery_puzzle.mp3",
            choices: [
                { text: "Solve the puzzle to open the door", nextScene: 15 }
            ]
        },
        {
            // Scene 15 - Puzzle Modal Appears Here
            title: "The Stone Puzzle Mechanism",
            text: "Jack examines the puzzle carefully. The door won't budge unless he aligns the symbols in the correct order.",
            background: "puzzle_closeup.jpg",
            audio: "sounds/puzzle_clicks.mp3",
            choices: [
                { text: "Attempt the puzzle", nextScene: 16 } // Opens puzzle modal
            ]
        },
        {
            // Scene 16
            title: "The River Crossing",
            text: "Jack slides down a muddy slope and lands at the riverbank. The water flows swiftly, blocking his path forward. He must decide how to cross.",
            background: "riverbank.webp",
            audio: "sounds/river_flow.mp3",
            choices: [
                { text: "Cross using the bridge", nextScene: 17 },
            ]
        },
        {
            // Scene 17
            title: "The Broken Bridge",
            text: "Jack approaches a narrow, unstable bridge. A strange puzzle is carved into the wooden planks, requiring a four-digit code to proceed.",
            background: "river_!.webp",
            extraimage: "bridge_puzzle.jpeg", 
            audio: "sounds/creaking_bridge.mp3",
            input: {
                type: "text",
                placeholder: "Enter the four-digit code",
                correctAnswer: "2578",
                successMessage: "The bridge stabilizes, allowing Jack to cross safely.",
                failureMessage: "The bridge collapses! Jack barely manages to hold onto the edge."
            },
            choices: [
                { text: "Submit Answer", validateInput: true, correctNextScene: 18 }
            ]
        },  
        {   // Scene 18 (Previously Scene 19)
            title: "The Other Side of the River",
            text: "Jack finally reaches the other side of the river after immense effort. He stumbles upon an abandoned truck with an unlocked carriage. Suddenly, a pack of wolves appears, growling at him.",
            background: "truck.webp",
            audio: "sounds/wolves_howling.wav",
            choices: [
                { text: "Enter the carriage", nextScene: 19 },
                { text: "Run away", nextScene: 20 }
            ]
        },
        
        {   // Scene 19 (Previously Scene 20)
            title: "The Mysterious Diary",
            text: "Inside the truck, Jack finds an old diary along with a map. The diary reveals a 3-digit pin, but the 4th digit has been rubbed off. The map leads to a house from an old school.",
            background: "diary_map.webp",
            extraimage:"diary_pin.webp",
            audio: "sounds/diary_flipping.mp3",
            choices: [
                { text: "Follow the map and continue the investigation", nextScene: 22 },
                { text: "Quit and return home after the wolf incident", nextScene: 30}
            ]
        },
        
        {   // Scene 20 (Previously Scene 21)
            title: "The Wolf Attack",
            text: "Jack stumbles while trying to escape. The wolves catch up to him, and his journey ends here.",
            background: "wolves_attack.webp",
            audio: "sounds/wolf_attack.wav",
            choices: [
                { text: "Restart from last checkpoint", nextScene: 18 }   
            ]
        },
        
        {   // Scene 21 (Previously Scene 22)
            title: "Game Over",
            text: "Jack falls and is caught by the wolves. His life ends here.",
            background: "wolves_attack.webp",
            gameOver: true
        },
        
        // Scene 22 (Previously Scene 22) - The Locked Gate
        {
            title: "The Locked Gate",
            text: "Jack reaches the house. A fence blocks his way, and the gate is locked.",
            background: "house_fence.webp",
            choices: [
                { text: "Search Nearby", nextScene: 23 },
                { text: "Jump the Fence", nextScene: 24 } // Game Over
            ]
        },
        
        // Scene 23 (Previously Scene 23) - Finding the Secret Tunnel
        {
            title: "The Secret Tunnel",
            text: "Jack finds a hidden tunnel behind the house. Inside, he reaches a number lock.",
            background: "tunnel.webp",
            input: {
                type: "text",
                placeholder: "Enter the 4-digit code",
                correctAnswer: "9996",
                successMessage: "The lock clicks open!",
                failureMessage: "An alarm triggers! Someone is coming..."
            },
            choices: [
                { text: "Submit Code", validateInput: true, correctNextScene: 25} // Wrong = Game Over
            ]
        },
        
        // Scene 24 (Previously Scene 24) - Game Over (Dog Attack)
        {
            title: "Game Over",
            text: "Jack jumps the fence but is attacked by a guard dog.",
            background: "dog_attack.webp",
            choices: [
                { text: "Restart from last checkpoint", nextScene: 22 }   
            ]
        },
        
        // Scene 25 (Previously Scene 25) - The Basement
        {
            title: "The Basement",
            text: "Jack finds hidden files and realizes the girl was part of a secret experiment.",
            background: "basement.jpg",
            choices: [
                { text: "Investigate further", nextScene: 26 },
                { text: "Take the files and escape", nextScene: 27 }
            ]
        },
        
        // Scene 26 (Previously Scene 26) - Ending 2 (Detective Agency Test)
        {
            title: "Congratulations!",
            text: "A man in a gray suit appears, revealing this was a test by a detective agency. Jack is hired!",
            background: "agency.webp",
            choices: [
                { text: "Future story", nextScene: 31 },
            ]
        },
        
        // Scene 27 (Previously Scene 27) - The Truth Exposed or Tragic End
        {
            title: "Final Choice",
            text: "Jack records everything. What will he do next?",
            background: "decision.webp",
            choices: [
                { text: "Expose the truth", nextScene: 28 },
                { text: "Escape into hiding", nextScene: 29 }
            ]
        },
        
        // Scene 28 (Previously Scene 28) - Ending 3 (Tragic End)
        {
            title: "Silenced",
            text: "Jack is shot before he can expose the truth. The case is buried forever.",
            background: "shot.webp",
            choices: [
                { text: "What happened to jack?", nextScene: 34 },
            ]
        },
        
        // Scene 29 (Previously Scene 29) - Ending 4 (The Truth Lives On)
        {
            "title": "The Detective’s Legacy",
            "text": "Jack exposes the conspiracy but is forced into hiding. His story becomes legend.",
            "background": "hiding.webp",
            "choices": [
                { "text": "Live in the shadows, watching over the city", "nextScene": 35 },
                { "text": "Future awaits", "nextScene": 36 }
            ]
        },
        
        {   // Scene 30
            title: "A Bitter Revelation",
            text: "Jack returns home, shaken by the eerie events in the forest. He convinces himself it was the right choice. But as he sits at his desk, sipping a drink, the news plays on his old TV. His rival detective, Victor Hensley, stands before reporters, shaking hands with top officials. The case was a test—an elaborate setup by a renowned detective agency seeking the best investigator. Jack was one step away from redemption, but he walked away.",
            background: "rival.jpg",
            audio: "sounds/newsreportmusic.mp3",
            choices: [
                
                { text: "Restart the case from the beginning", nextScene: 0 }
            ]
        },
        {   // Scene 31 - Jack's Victory
            title: "Jack's Victory",
            text: "Years have passed since Jack cracked the mystery. Now a renowned detective, he enjoys a well-earned celebration at a prestigious gala. Journalists surround him, eager for interviews about his legendary cases.",
            background: "celebration_gala.webp",
            audio: "sounds/crowd_cheering.mp3",
            choices: [
                { text: "Give a speech", nextScene: 32 },
                { text: "Step away from the spotlight", nextScene: 33 }
            ]
        },
        
        {   // Scene 32 - The Speech
            title: "The Speech",
            text: "Jack steps up to the podium, addressing the crowd. 'Every case is a story waiting to be uncovered. Tonight, I celebrate not just my success, but the pursuit of truth.' The audience erupts in applause.",
            background: "podium_speech.webp",
            audio: "sounds/crowd_cheering.mp3",
            
        },
        
        {   // Scene 33 - Quiet Reflection
            title: "A Private Moment",
            text: "Jack slips away from the crowd, finding a quiet balcony. As he gazes at the city lights, he realizes that the thrill of mystery never fades. A new case awaits.",
            background: "city_night.webp",
            audio: "sounds/night_wind.mp3",
            choices: [
                { text: "Begin a new case", nextScene: 0 }
            ]
        },
        {   // Scene 34 - What Happened to Jack?
            title: "What Happened to Jack?",
            text: "The world quickly forgets the detective who got too close to the truth. Newspapers report his 'unfortunate accident,' but those who knew him suspect otherwise. His office remains untouched, a relic of unsolved mysteries.",
            background: "abandoned_office.webp",
            
        },
        {   // Scene 35 - The Watchful Guardian
            title: "The Watchful Guardian",
            text: "Jack disappears into the city, ensuring justice is served from the shadows. His presence is felt but never seen.",
            background: "shadowy_city.webp",
        },
        {   // Scene 36 - The Hidden Message
            title: "The Detective’s Hall of Fame",
            text: "Jack’s relentless pursuit of truth earns him a place among history’s greatest detectives. Though he remains hidden, his influence shapes the next generation.",
            background: "detective_hall.webp",
            choices: [
                { "text": "Attend the ceremony", "nextScene": 31 },
            ]
        }
        
        
        
        
        
    ];

    function loadScene(sceneIndex) {
    const sceneData = scenes[sceneIndex];
    if (!sceneData) {
        console.error(`Scene ${sceneIndex} not found!`);
        return;
    }
// Check if the scene should load an external HTML file
        /*if (sceneIndex === 15) {  // Stone Door Puzzle Scene
            window.location.href = "puzzle.html"; // Redirects to another HTML file
            return;
        }*/
    title.textContent = sceneData.title;
    narration.textContent = sceneData.text;
    gameContainer.style.backgroundImage = `url('images/${sceneData.background}')`;

    if (sceneData.extraimage) {
        extraimage.style.display = "block";
        extraimage.src = `images/${sceneData.extraimage}`;
    } else {
        extraimage.style.display = "none";
    }
    playSceneAudio(sceneData.audio);
    if (sceneIndex === 15) {
        openPuzzleModal(); // Open the puzzle modal
        return;
    }
    buttonContainer.innerHTML = "";

    // Check if scene has an input field
    if (sceneData.input) {
        const inputField = document.createElement("input");
        inputField.type = sceneData.input.type;
        inputField.placeholder = sceneData.input.placeholder;
        inputField.id = "scene-input";
        
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answer";
        submitButton.classList.add("choice-button");

        submitButton.addEventListener("click", () => {
            const userAnswer = inputField.value.trim().toLowerCase(); 
            if (userAnswer === sceneData.input.correctAnswer.toLowerCase()) {
                alert(sceneData.input.successMessage);
                loadScene(sceneData.choices[0].correctNextScene);
            } else {
                alert(sceneData.input.failureMessage);
                loadScene(sceneData.choices[0].wrongNextScene);
            }
        });

        buttonContainer.appendChild(inputField);
        buttonContainer.appendChild(submitButton);
    }

    // Add choice buttons if available
    sceneData.choices.forEach(choice => {
        if (!choice.validateInput) {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.classList.add("choice-button");
            button.addEventListener("click", () => loadScene(choice.nextScene));
            buttonContainer.appendChild(button);
        }
    });

    playSceneAudio(sceneData.audio);
}

function playSceneAudio(audioPath) {
    const audio = new Audio(audioPath);
    audio.play();
}

// Start the game
loadScene(0);
});
