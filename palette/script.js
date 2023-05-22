const $ = (id) => document.getElementById(id);

let pal = [];
let undoHistory = [];
let redoHistory = [];
let hl;  // highlighted palette index

function toHex(num) {
    let result = Number(num).toString(16);
    if (result.length == 1) result = '0' + result;
    return result;
}

function encodeColor(array) {
    return `#${toHex(array[0])}${toHex(array[1])}${toHex(array[2])}`;
}

function decodeColor(hex) {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    return [red, green, blue];
}

function updateUndoButton() {
    $('undo').disabled = !undoHistory.length;
    console.log($('undo'), $('undo').disabled, undoHistory, !undoHistory.length)
    $('redo').disabled = !redoHistory.length;
}

function addUndoHistory() {
    // need to copy the array
    undoHistory.push(Array.from(pal));
    updateUndoButton();
}

function undo() {
    redoHistory.push(pal);
    pal = undoHistory.pop();
    updateUndoButton();
    updateCols();
}

function redo() {
    undoHistory.push(pal);
    pal = redoHistory.pop();
    updateUndoButton();
    updateCols();
}

function newPalette() {
    const palSize = Number($('palsize').value);
    pal = [];
    for (let i = 0; i < palSize; i++) pal[i] = [0, 0, 0];
    updateCols();
    closeEditor();
    updateUndoButton();
}

function updateCols() {
    const cols = Number($('cols').value);
    const rows = Math.ceil(pal.length / cols);

    const palette = $('palette');
    while (palette.firstChild) {
        palette.removeChild(palette.firstChild);
    }

    for (let y = 0; y < rows; y++) {
        let div = document.createElement('div');
        for (let x = 0; x < cols; x++) {
            let i = y*cols + x;
            if (i >= pal.length) continue;
            
            let button = document.createElement('button');
            button.style.backgroundColor = encodeColor(pal[i]) ?? '#FF0000';
            button.classList = ['color'];
            button.id = i;
            button.onclick = () => { highlight(i) }
            div.appendChild(button);
        }
        $('palette').appendChild(div);
    }
}

function highlight(id) {
    hl = id;
    console.log(id);
    for (let i = 0; i < pal.length; i++) {
        $(i).classList.remove('highlight_a');
    }
    $(id).classList.add('highlight_a');

    $("editor").style.display = 'block';
    $('red').value = pal[id][0];
    $('green').value = pal[id][1];
    $('blue').value = pal[id][2];
    $('picker').value = encodeColor(pal[id]);
    updateColorEditor();
}

function updateColorEditor(source) {
    switch (source) {
        // One of the RGB decimal values was changed
        case 'color': {
            addUndoHistory();
            const red = Number($('red').value);
            const green = Number($('green').value);
            const blue = Number($('blue').value);
            pal[hl] = [red, green, blue];
            break;
        }

        // One of the RGB hex values was changed
        case 'hex': {
            addUndoHistory();
            const red = parseInt($('redHex').value, 16);
            const green = parseInt($('greenHex').value, 16);
            const blue = parseInt($('blueHex').value, 16);
            pal[hl] = [red, green, blue];
            break;
        }

        // Color picker value was changed
        case 'picker': {
            addUndoHistory();
            pal[hl] = decodeColor($('picker').value);
            break;
        }

        // Unspecified - color was changed externally (pal array was modified), e.g. randomize button
        // Note: in this case, use addUndoHistory() in that function
    }

    // Change all the other representations to match the current value
    $('red').value = pal[hl][0];
    $('green').value = pal[hl][1];
    $('blue').value = pal[hl][2];
    $('redHex').value = toHex(pal[hl][0]);
    $('greenHex').value = toHex(pal[hl][1]);
    $('blueHex').value = toHex(pal[hl][2]);
    $('picker').value = encodeColor(pal[hl]);

    // Update the full palette view (color grid)
    updateCols();
}

function randomizeColor() {
    addUndoHistory();
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    pal[hl] = [red, green, blue];
    updateColorEditor('other');
}

function convert12Bit() {
    addUndoHistory();
    pal[hl][0] = Math.round(pal[hl][0] / 17) * 17;
    pal[hl][1] = Math.round(pal[hl][1] / 17) * 17;
    pal[hl][2] = Math.round(pal[hl][2] / 17) * 17;
    updateColorEditor('other');
}

function closeEditor() {
    $('editor').style.display = 'none';
}