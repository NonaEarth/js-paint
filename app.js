const saveBtn = document.getElementById('save');

const textInput = document.getElementById('text');
const fileInput = document.getElementById('file');
const modeBtn = document.getElementById('mode-btn');
const destroyBtn = document.getElementById('destroy-btn');
const eraseBtn = document.getElementById('eraser-btn');
const colorOptionsOriginal = document.getElementsByClassName('color-option');
const colorOptions = Array.from(colorOptionsOriginal);
const color = document.getElementById('color');
const lineWidth = document.getElementById('line-width');
const fontSize = document.getElementById('font-size');
const canvas = document.querySelector('canvas');
const ctx = canvas?.getContext('2d');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let fontSizeVal = 68;

const app = function () {

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.lineWidth = parseInt(lineWidth.value);
    ctx.lineCap = 'round';

    const colors = [
        "#ff3838",
        "#ffb8b8",
        "#c56cf0",
        "#ff9f1a",
        "#fff200",
        "#32ff7e",
        "#7efff5",
        "#18dcff",
        "#7d5fff",
    ];

    let isPainting = false;
    let isFilling = false;

    ctx.moveTo(0, 0);

    let onMove = function (event) {
        if (isPainting) {
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
            return;
        }
        
        ctx.moveTo(event.offsetX, event.offsetY);
        // ctx.beginPath():
        // ctx.moveTo(0, 0);
        // const color = colors[Math.floor(Math.random() * colors.length)];
        // ctx.strokeStyle = color;
        // ctx?.lineTo(event.offsetX, event.offsetY);
        // ctx?.stroke();
    }
    
    let startPainting = function () {
        isPainting = true;
    }

    let cancelPainting = function () {
        isPainting = false;
        ctx.beginPath();
    }

    let onLineWidthChange = function (event) {

        const target = event.target;

        ctx.lineWidth = parseInt(target.value);
    }

    let onFontSizeChange = function (event) {

        const target = event.target;

        fontSizeVal = parseInt(target.value);
    }

    let onColorChange = function (event) {

        const target = event.target;
        ctx.strokeStyle = target.value;
        ctx.fillStyle = target.value;
    }

    const onCanvasClick = function (event) {
        if (isFilling) {
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }

    const onDoubleClick = function (event) {
        const text = textInput.value;
        if (text !== '') {
            ctx.save();
            ctx.lineWidth = 1;
            ctx.font = `${fontSizeVal}px serif`;
            ctx.fillText(text, event.offsetX, event.offsetY);
            ctx.restore();
        }
    } 
    
    canvas.addEventListener('dblclick', onDoubleClick);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mouseup', cancelPainting);
    canvas.addEventListener('mouseleave', cancelPainting);
    canvas.addEventListener('click', onCanvasClick);

    lineWidth.addEventListener('change', onLineWidthChange);
    fontSize.addEventListener('change', onFontSizeChange);
    color.addEventListener('change', onColorChange);

    const onColorClick = function (event) {

        const target = event.target;

        ctx.strokeStyle = target.dataset.color;
        ctx.fillStyle = target.dataset.color;
        
        color.value = target.dataset.color;
    }

    colorOptions.forEach(color => color.addEventListener('click', onColorClick));

    const onModeClick = function (event) {

        if (isFilling) {
            isFilling = false;
            modeBtn.innerText = 'Fill';
        } else {
            isFilling = true;
            modeBtn.innerText = 'Draw';
        }
    }

    const onDestroyClick = function () {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    const onEraserClick = function () {
        ctx.strokeStyle = 'white';
        isFilling = false;
        modeBtn.innerText = 'Fill';
    }

    const onFileChange = function (event) {
        console.dir(event.target);

        const target = event.target;

        const file = target.files[0];
        const url= URL.createObjectURL(file);

        console.log(url);

        const image = new Image();
        image.src = url;
        // ctx.tyle.objectFit = 'cover';

        image.onload = function () {
            ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            fileInput.value = null;
        }
    }

    const onSaveClick = function (event) {
        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'myDrawing.png';
        a.click();
    }

    modeBtn.addEventListener('click', onModeClick);
    destroyBtn.addEventListener('click', onDestroyClick);
    eraseBtn.addEventListener('click', onEraserClick);
    fileInput.addEventListener('change', onFileChange);

    saveBtn.addEventListener('click', onSaveClick);
}

app();