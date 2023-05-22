let pal = [];

function newPalette() {
    const palette = document.getElementById('palette');
    if (palette.children.length) {
        if (!confirm("Are you sure? This will discard your current palette.")) return;
    }

    const palSize = Number(document.getElementById('palsize').value);
    const cols = Number(document.getElementById('cols').value);
    const rows = Math.ceil(palSize / cols);

    for (let y = 0; y < rows; y++) {
        let div = document.createElement('div');
        for (let x = 0; x < cols; x++) {
            let i = y*cols + x;
            if (i >= palSize) continue;
            
            let input = document.createElement('input');
            input.type = "color";
            input.value = pal[i] ?? '#fff';
            div.appendChild(input);
        }
        document.getElementById('palette').appendChild(div);
    }
}

function updateCols() {
    
}