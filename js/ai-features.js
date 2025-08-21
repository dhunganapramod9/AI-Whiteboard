// AI Features for Whiteboard
// Simulated AI functionality for demonstration

let aiPanel = document.getElementById('aiPanel');
let aiShapeMode = false;
let isProcessing = false;

// AI Tool Event Listeners
document.getElementById('aiShape').addEventListener('click', () => {
    showAIPanel();
    document.getElementById('aiShapeFeature').scrollIntoView();
    showStatus("AI Shape Recognition panel opened", 2000);
});

document.getElementById('aiText').addEventListener('click', () => {
    showAIPanel();
    showStatus("AI Text Generator ready", 2000);
});

document.getElementById('aiSuggest').addEventListener('click', () => {
    showAIPanel();
    showStatus("AI Suggestions panel opened", 2000);
});

// AI Panel Controls
document.getElementById('aiClose').addEventListener('click', hideAIPanel);

function showAIPanel() {
    aiPanel.classList.remove('hide');
}

function hideAIPanel() {
    aiPanel.classList.add('hide');
}

// Shape Recognition AI
document.getElementById('activateShapeAI').addEventListener('click', function() {
    aiShapeMode = !aiShapeMode;
    this.textContent = aiShapeMode ? 'Deactivate Shape AI' : 'Activate Shape AI';
    this.style.background = aiShapeMode ? 
        'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' : 
        'linear-gradient(135deg, #00ff88 0%, #00aa66 100%)';
    
    showStatus(aiShapeMode ? "Shape AI: ON - Draw shapes to auto-correct" : "Shape AI: OFF", 2000);
});

// Text Generation AI
document.getElementById('generateText').addEventListener('click', function() {
    const input = document.getElementById('aiTextInput').value.trim();
    const resultDiv = document.getElementById('textResult');
    
    if (!input) {
        resultDiv.textContent = "Please enter a topic first";
        return;
    }
    
    if (isProcessing) return;
    
    isProcessing = true;
    this.classList.add('ai-processing');
    this.textContent = 'Generating...';
    resultDiv.textContent = 'AI is thinking...';
    
    // Simulate AI processing delay
    setTimeout(() => {
        const suggestions = generateTextSuggestions(input);
        resultDiv.innerHTML = suggestions.map(s => `• ${s}`).join('<br>');
        this.classList.remove('ai-processing');
        this.textContent = 'Generate Ideas';
        isProcessing = false;
        showStatus("AI generated text ideas", 2000);
    }, 1500);
});

// Drawing Suggestions AI
document.getElementById('getSuggestions').addEventListener('click', function() {
    const resultDiv = document.getElementById('suggestionResult');
    
    if (isProcessing) return;
    
    isProcessing = true;
    this.classList.add('ai-processing');
    this.textContent = 'Analyzing...';
    resultDiv.textContent = 'AI analyzing your canvas...';
    
    // Simulate AI analysis
    setTimeout(() => {
        const suggestions = generateDrawingSuggestions();
        resultDiv.innerHTML = suggestions.map(s => `💡 ${s}`).join('<br>');
        this.classList.remove('ai-processing');
        this.textContent = 'Get Suggestions';
        isProcessing = false;
        showStatus("AI suggestions generated", 2000);
    }, 2000);
});

// Simulated AI Functions
function generateTextSuggestions(topic) {
    const templates = {
        'business': [
            'Market research and competitor analysis',
            'Customer journey mapping',
            'Revenue stream optimization',
            'Digital transformation strategy'
        ],
        'design': [
            'User experience principles',
            'Color theory and psychology',
            'Typography hierarchy',
            'Design system components'
        ],
        'technology': [
            'Cloud architecture patterns',
            'API design best practices',
            'Security implementation',
            'Performance optimization'
        ],
        'education': [
            'Interactive learning methods',
            'Assessment strategies',
            'Student engagement techniques',
            'Curriculum development'
        ]
    };
    
    // Find matching category or use general suggestions
    const category = Object.keys(templates).find(key => 
        topic.toLowerCase().includes(key)
    );
    
    if (category) {
        return templates[category];
    }
    
    // General AI-generated suggestions
    return [
        `How to implement ${topic} effectively`,
        `Best practices for ${topic}`,
        `Common challenges in ${topic}`,
        `Future trends in ${topic}`
    ];
}

function generateDrawingSuggestions() {
    const suggestions = [
        'Add connecting arrows between concepts',
        'Use color coding for different categories',
        'Create a mind map structure',
        'Add icons to represent key ideas',
        'Consider grouping related items',
        'Use different shapes for hierarchy',
        'Add a title or header section',
        'Include a legend or key'
    ];
    
    // Return 3-4 random suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
}

// Shape Recognition Logic
function recognizeShape(points) {
    if (points.length < 3) return null;
    
    // Simple shape recognition based on drawing patterns
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distance = Math.sqrt(
        Math.pow(lastPoint.x - firstPoint.x, 2) + 
        Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    // Check if it's a closed shape (circle/rectangle)
    if (distance < 20) {
        // Analyze the shape characteristics
        const boundingBox = getBoundingBox(points);
        const aspectRatio = boundingBox.width / boundingBox.height;
        
        if (aspectRatio > 0.7 && aspectRatio < 1.3) {
            // Likely a circle or square
            return isCircular(points) ? 'circle' : 'rectangle';
        } else {
            return 'rectangle';
        }
    }
    
    // Check for straight lines
    if (isLinear(points)) {
        return 'line';
    }
    
    return null;
}

function getBoundingBox(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
    };
}

function isCircular(points) {
    const center = getCenterPoint(points);
    const avgRadius = points.reduce((sum, point) => {
        return sum + Math.sqrt(
            Math.pow(point.x - center.x, 2) + 
            Math.pow(point.y - center.y, 2)
        );
    }, 0) / points.length;
    
    // Check if most points are close to the average radius
    const tolerance = avgRadius * 0.3;
    const circularPoints = points.filter(point => {
        const distance = Math.sqrt(
            Math.pow(point.x - center.x, 2) + 
            Math.pow(point.y - center.y, 2)
        );
        return Math.abs(distance - avgRadius) < tolerance;
    });
    
    return circularPoints.length > points.length * 0.7;
}

function getCenterPoint(points) {
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    return {
        x: sumX / points.length,
        y: sumY / points.length
    };
}

function isLinear(points) {
    if (points.length < 2) return false;
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    // Calculate expected line
    const deltaX = lastPoint.x - firstPoint.x;
    const deltaY = lastPoint.y - firstPoint.y;
    
    // Check if most points are close to the line
    let linearCount = 0;
    const tolerance = 15;
    
    points.forEach((point, index) => {
        const expectedX = firstPoint.x + (deltaX * index / (points.length - 1));
        const expectedY = firstPoint.y + (deltaY * index / (points.length - 1));
        
        const distance = Math.sqrt(
            Math.pow(point.x - expectedX, 2) + 
            Math.pow(point.y - expectedY, 2)
        );
        
        if (distance < tolerance) {
            linearCount++;
        }
    });
    
    return linearCount > points.length * 0.8;
}

// Draw perfect shapes
function drawPerfectShape(shape, points) {
    const boundingBox = getBoundingBox(points);
    const ctx = canvas.getContext('2d');
    
    ctx.save();
    ctx.strokeStyle = ctx.strokeStyle;
    ctx.lineWidth = ctx.lineWidth;
    
    switch (shape) {
        case 'circle':
            const radius = Math.min(boundingBox.width, boundingBox.height) / 2;
            const centerX = boundingBox.x + boundingBox.width / 2;
            const centerY = boundingBox.y + boundingBox.height / 2;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
            
        case 'rectangle':
            ctx.beginPath();
            ctx.rect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            ctx.stroke();
            break;
            
        case 'line':
            const firstPoint = points[0];
            const lastPoint = points[points.length - 1];
            
            ctx.beginPath();
            ctx.moveTo(firstPoint.x, firstPoint.y);
            ctx.lineTo(lastPoint.x, lastPoint.y);
            ctx.stroke();
            break;
    }
    
    ctx.restore();
    showStatus(`AI corrected your ${shape}!`, 2000);
}

// Export for use in main script
window.aiFeatures = {
    get aiShapeMode() { return aiShapeMode; },
    recognizeShape,
    drawPerfectShape
};
