const video = document.getElementById('video')


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
        
    )
}

video.addEventListener('play', ()=> {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            const ctx = canvas.getContext('2d')

            console.log(detections[0].expressions );
            faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

const text = [
    expressionsFunc(detections[0].expressions)
    ]
    const anchor = { x: detections[0].alignedRect._box._x, y: detections[0].alignedRect._box._y+200 }
    // see DrawTextField below
    const drawOptions = {
    anchorPosition: 'BOTTOM_LEFT',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 80
    }
    const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
    drawBox.draw(canvas)
            
    }, 100)
})
// startVideo()

function expressionsFunc(expression) {
    if (expression.angry > 0.55) {
        return '😠'
    }else if (expression.disgusted > 0.4) {
        return '🤢'
    }else if (expression.happy > 0.5) {
        return '😄'
    }else if (expression.sad > 0.45) {
        return '😔'
    }else if (expression.surprised > 0.5) {
        return '😲'
    }else{
        return '😐'
    }
}