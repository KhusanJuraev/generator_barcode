const barcode_block = document.querySelector('.barcodes'),
    text_barcodes = document.getElementById('textBarcodes');

function generateBarcodes() {
    let barcode_value = document.getElementById('barcodeValue').value;

    const barcode_type = document.getElementById('barcodeType').value,
        start_value = document.getElementById('startValue').value,
        end_value = document.getElementById('endValue').value,
        show_text = document.getElementById('showText').value,
        goods_text = document.getElementById('goodsText').value,
        barcodes = document.querySelectorAll('canvas'),
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
            JsBarcode(`#B${value}`, value, {
                format: barcode_type,
                lineColor: '#000',
                displayValue: show_text,
                fontSize: 26
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
    document.execCommand('copy')
}

function generatorBarcodeHtml(id) {
    return `<canvas id="B${id}"></canvas>`
}

function addTextToCanvas(text) {
    const canvas = document.querySelectorAll('canvas')
    canvas.forEach(item => {
        let ctx = item.getContext('2d')
        ctx.fillStyle = '#fff';
        ctx.fillRect(-300, 10, item.width + 200, item.height / 10);
        ctx.fontSize = "24px!important"
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(text, item.width / 2 - item.width + 10, 20);
    })
}

function downloadAllImg () {
    const canvas = document.getElementsByTagName('canvas');
    let array = [];
    let i = 0;
    let start_download = setInterval(function () {
        canvas[i].toDataURL('image/png');
        array.push( canvas[i].toDataURL('image/png') );
        i++;
    }, 500)

    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/generator_barcode-master/server/index.php",
            data: {
                images: array
            },
            error: function (xhr, status, error) {
                let err = eval("(" + xhr.responseText + ")");
                console.log(err.Message);
            }
        }).done(function(o) {
            setTimeout(() => downloadZipFile(), 1000)
        });
    }, 5000);

    setTimeout(() => {
        clearInterval(start_download)
    }, canvas.length * 500)
}

function downloadZipFile() {
    const a = document.createElement('a')
    a.download = 'barcode-file'
    a.href = '/generator_barcode-master/server/images.zip'
    a.click()
    const zipFile = '/generator_barcode-master/server/images.zip'
}

function printBarcodes() {
    const canvas = document.getElementsByTagName('canvas')
    const images = []
    
    for (let img of canvas) {
        images.push(img.toDataURL('image/png'))
    }

    printJS({
        printable: images,
        type: 'image',
        imageStyle: 'width:100%; margin-top: 75px;',
        documentTitle: '.',
        timeOrigin: null,
    })
}
