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
        ctx.fillRect(-1000, 10, item.width + 800, item.height / 10);
        ctx.fontSize = "24px!important"
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(text, item.width / 2 - item.width + 10, 20);
    })
}

function downloadAllImg () {
    const canvas = document.getElementsByTagName('canvas')
    let i = 0
    let start_download = setInterval(function () {
        const link = document.createElement('a');
        link.id = i;
        link.download = canvas[i].id;
        link.href = canvas[i].toDataURL('image/png');
        console.log(canvas[i].toDataURL('image/png'))
        link.click()
        i++;
    }, 500)

    setTimeout(() => {
        clearInterval(start_download)
    }, canvas.length * 500)
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

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}


const zip = new JSZip()
const zipBarcodes = document.getElementById('barcodes_zip-file')
const bas64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAACUCAYAAABr0GdOAAAAAXNSR0IArs4c6QAAIABJREFUeF7tnQWQJMXTxRN3d5eAwC1w54/b4S6Hu7vb4e5yuLs7HO7uDoG7S+D2xa/2ar6e2q7Jqp6ZXfYmO+KC49qqsjJfvXyZvTvUv//++6/YYRYwC5gFGlhgKAMK8w+zgFlAs4ABhWahFp//5ptvZP3115fPP/9crrrqKpluuula/IbWPe7NN9+UtddeWyaccEK57LLLZJxxxmndw1v8pL401hZPvUceZ0DRI2b+/5cYULTH4AYU7bGrf6oBRXvt2+3pBhTtMbgBRXvsakDRXrtGn25A0R7DG1C0x64GFO21qwFFD9vXgKK9Bu+Y1IOd/IorrpAbb7xRnnrqKfnpp59k7LHHltlmm03WWGMN2XzzzWX44Yevs/Zff/0lzz//vNx8881yzz33yBNPPOHOzzfffLLyyivLZpttJuONN17pClF1fumll+T888+Xu+66S3Bk3jfTTDPJq6++KpNNNlmpmPnll1+6d910003y5JNPygcffCBTTDGFzDvvvLL11lvLoosuKkMPPXTpO6vMkQf9888/8vDDD8sFF1wgDzzwQO2dk046qZvDAgssEBUzP/zwQ7n44ovltttuq9mH8TLPjTbaSNZaa61uY/3xxx/d+6699lp5/PHHa7bhPRtvvLGsuOKKMsIII5TOsepYuQ97sh68m/XgmGOOOZygfPDBB5cKy82sR3tDt2ef3hFAgVMQ1I8++mipdbfaais58cQTZaSRRqo7j9K/wQYbRFeE4CW4Zphhhm4Aw/MOPfRQB0hlBwAVVj18WgKwxI6jjjpKdtttNxl22GHrLqk6x59//ln2228/Ofnkk6PvXGaZZUqB4qGHHpItt9yyFnThAwYMGCAHHHBA3T//+uuvsssuu8jAgQOj79t2223lmGOOkVFGGaXumqpjBfC19XjkkUdkwQUXrHtfM+vRs2Hc/rcN8UDx+++/y5577imnnHKK7L777rLzzjvLxBNPLEMNNZT88ccfwo7x7bffuh1wmGGGqbP4NddcI2+88YYsv/zyMuOMMzogYWd6++23XbCyi/JsAKHIRq688koXQLzniCOOEAINp+d9L774ouywww7y22+/lQIFO9viiy/uGARlSdgDAXL55Ze7d8JKYEWzzz57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n322HHbYYS6AOAjaRkDx+++/u3sInJ9++qmbiXGWCy64QGaYYYZu5w499FA58MADS5dltNFGkyOOOEK23nprGXbYYeuuYTw4YOzYd999hT9h0DM+nnnUUUeV3krwDhw4UCaYYIJu5wkEAvWggw6SW2+9tXa+EVBwz2OPPSbbbbedvPjii92eyRzPOussWXfddUsD9/HHH5dtttmm9F4A44QTTpBVV121271vv/22bL/99nL33XeXvjNmV9afc/wpOwj4448/vhvwA57MA5uX+cDSSy8tp512mkw77bTdHtvTc+wFDEh6ZZ8ACoKdXeCQQw5xuyTON8sss8iAAQNUoLjzzjtlrbXWkqmnntoF4OKLL+4C+7XXXpPddtvNOSvMAkcJA/f000+X0UcfXZZaaqlacH7xxRfu2sMPP9yBC7vwTDPNVGfsG2+80e1Y7HCTTTaZYw/fffedYxj77LOPu/aGG24QdsLigTMTeDguYDjHHHO4048++qjb3QnmAw44wIHBMMMMU7v1ww8/FHZKQGS44YaTPffc07ERmEkjoPj444/dbvrss886QGRXHmusseSbb76R4447ztkrNsf333/fgSFj23333WXXXXeViSaaSGB7AAT3zzbbbHLFFVfUgTB2gDVgNwCIeU411VQugAF01nTUUUd142at/AGonXLKKbLzzju75x5zzDG18/fdd5+bM/YB3Pfee+868L7pppvcPGFKvG/11VeXEUYYQZ577jm3geADW2yxhZx44ol1PtDTc0yK2F66qE8ABc4H7YYWEyTbbrutSwdwVI1RsJtceOGFsuiii3bbMZ566ikXzBy33HKLzDnnnEnLgLMTVAR7CrX3DwXwcGgcnoAg6IsHO+a5554r6623Xrddkfni4KRaAA47tj+g/ptvvrkDmKOPPtqBE+nGXXfdpY4PMGE+/fr1q9v5i3Mk8HfZZZe6oCWoAFrWgqAtgiwp2w477OBSixDY/DzK2BFrxfrCGELwfu+99xywfP7553LRRRe59SweBPsaa6whk046aR14+3mw0ZSxI1LSddZZRwDNIngDTD09xyTn66WL+gRQ/P333y64yO0JZn4cnaf3GlA0siu5J0GJEz3yyCOy4IILJi0DGgSBww6eAxQ83KczZUDR6OVvvPGGY0awE/L6Yv4PO0JLgY0QsDCCVKCIvZNAgcHxJxzr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'

zip.file('text.txt', 'Generator Barcode\n')
zip.file('barcode.png', '')
zip.file('img.jpg', '')
zip.generateAsync({type: 'blob'})
    .then( res => window.URL.createObjectURL(res))
    .then( res => `<a download="Barcodes" href="${res}">Download Barcodes</a>`)
    .then(res => zipBarcodes.innerHTML = res)