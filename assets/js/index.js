const barcode_block = document.querySelector('.barcodes'),
    text_barcodes = document.getElementById('textBarcodes');

function generateBarcodes() {
    let barcode_value = document.getElementById('barcodeValue').value;

    const barcode_type = document.getElementById('barcodeType').value,
        start_value = document.getElementById('startValue').value,
        end_value = document.getElementById('endValue').value,
        show_text = document.getElementById('showText').value,
        goods_text = document.getElementById('goodsText').value,
        barcodes = document.querySelectorAll('.barcode'),
        barcodes_arr = [];

    if (barcode_value) {
        document.querySelector('.check-input').classList.remove('error-input')
        document.querySelector('.check-text').classList.remove('error-text')

        if (barcodes.length) {
            for (let barcode of barcodes) {
                barcode.remove()
            }
            text_barcodes.textContent = ''
        }

        for (let i = parseInt(start_value); i <= end_value; i++) {
            barcodes_arr.push(barcode_value++)
            barcode_block.innerHTML += generatorBarcodeHtml(barcode_value - 1)
            text_barcodes.textContent += `${barcode_value - 1} \n`
        }

        barcodes_arr.map((value) => {
            JsBarcode(`#A${value}`, value, {
                format: barcode_type,
                lineColor: "#000",
                displayValue: show_text
            })
        })

        addTextToCanvas(goods_text)
    } else {
        document.querySelector('.check-input').classList.add('error-input')
        document.querySelector('.check-text').classList.add('error-text')
    }
}

function copyBarcodes() {
    text_barcodes.select()
    document.execCommand("copy")
}

function generatorBarcodeHtml(id) {
    return `<canvas id="A${id}"></canvas>`
}

function addTextToCanvas(text) {
    const canvas = document.querySelectorAll('canvas')
    canvas.forEach(item => {
        let ctx = item.getContext('2d')
        ctx.fillStyle = "#000";
        ctx.fillRect(10,10, 50, 140);
        ctx.font = 16 + "px monospace";
        ctx.fillStyle = '#000';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(text, -90, 15);
    })
}

function downloadAllImg () {
    const images = document.getElementsByTagName('img')
    const srcList = []
    let i = 0

    setInterval(function () {
        srcList.push(images[i].src)
        const link = document.createElement('a');
        link.id = i;
        link.download = images[i].id;
        link.href = images[i].src;
        link.click()
        i++;
    }, 500)
}
