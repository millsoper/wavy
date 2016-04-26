window.onload = function() {

    var audio,
        analyser,
        audioContext,
        soundSource,
        soundBuffer,
        sourceNode,
        cycle,
        transparency,
         freqArray,
        stream;

    var hue = hue || 280;
    var display = "circles";
  	var audioInput = document.getElementById('audiofile');

    audioInput.addEventListener('change', function(event) {
      if (!audioContext || audioContext.state !== "running"){
          stream = URL.createObjectURL(event.target.files[0]);
          audio = new Audio();
          console.log(audio);
          audio.src = stream;
          setup();
        }
      });


    var sample = document.getElementsByClassName('sample')[0];

    sample.addEventListener('click', function (){
      audio = new Audio('ready_to_howl.mp3');
      setup();
    });

    function startSound() {
      sourceNode = audioContext.createMediaElementSource(audio);
      sourceNode.connect(analyser);
      sourceNode.connect(audioContext.destination);

      audio.play();
      update();
    }

  	function setup() {
      audio.addEventListener('canplay', function () {
          audioContext = audioContext || new AudioContext();
          analyser = (analyser || audioContext.createAnalyser());
          analyser.smoothingTimeConstant = 0.1;
          analyser.fftSize = 512;

          startSound();
      });
    }
    document.getElementsByClassName('play')[0].addEventListener('click', playSound.bind(null,sourceNode));
    document.getElementsByClassName('stop')[0].addEventListener('click', stopSound);


    function playSound() {
        if (audioContext){
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
        }
    }

    function stopSound() {
      if (audioContext){
        if (audioContext.state === 'running'){
          audioContext.suspend();
        }
      }
    }


    function drawCircle(context, freqValue, freqSequence) {
        var x = ((width / 2)),
            y = ((height / 2));
        if (false){
          transparency = 0.001;
        } else {
          transparency = 0.08;
        }
        context.beginPath();
        context.arc(x-(freqValue / 8), y-(freqValue / 8), (Math.abs(freqValue-120)) * 5 , 0, 2 * Math.PI, false);
        context.strokeStyle = 'hsla(' + hue + ', ' + 100 + '%,' + 40 + '%,' + transparency  + ')';
        context.fillStyle = "hsla(" + hue + ", 100%, 40%, .01)";

        context.fill();
        context.lineWidth = 2;
        context.stroke();
    }

    function drawOscillo(context, freqArray) {

      context.beginPath();
      var sliceWidth = canvas.width * 1.0/freqArray.length;

      var oscilloX = 0;
      for (var i = 0; i < freqArray.length; i++){

        var v = freqArray[i]/86.0;
        var y = v * 200/2;

        if(i === 0){
          context.moveTo(oscilloX, y);
        } else {
          context.lineTo(oscilloX, y);
        }

      oscilloX += sliceWidth;
    }

        if (false){
          transparency = 0.001;
        } else {
          transparency = 0.08;
        }
        context.strokeStyle = 'hsla(' + hue + ', ' + 100 + '%,' + 40 + '%,' + 0.9 + ')';
        context.lineTo(canvas.width, canvas.height/2);
        context.lineWidth = 2;
        context.stroke();
    }


    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        c = 0;

    function update() {
        context.clearRect(0, 0, width, height);
        freqArray = new Uint8Array(analyser.frequencyBinCount);
	      analyser.getByteTimeDomainData(freqArray);
        oscilloX = 0;
        if (display === "circles"){

          for (var i = 0; i < freqArray.length; i += 1) {
              var point = freqArray[i];
              drawCircle(context, point, i);

          }
        } else if (display === "oscillo"){
              drawOscillo(context, freqArray);
          }

        if (cycle && audioContext.state === 'running'){
          hue += 1;
        }
        requestAnimationFrame(update);
    }

    var options = document.getElementsByClassName('options-header')[0];

    options.addEventListener("click", function() {
      var accordion = document.getElementsByClassName('options-list')[0];
      accordion.classList.toggle("hiding");
    })

    var colorpicker = document.getElementsByClassName('rainbow')[0];
    colorpicker.addEventListener("click", function(event){
      var rect = colorpicker.getBoundingClientRect();
      var percent = (event.pageX - rect.left)/colorpicker.offsetWidth;
      hue = 360 * percent;
      console.log(event.pageX - rect.left);
    })

    var cycleButton = document.getElementsByClassName('cycle')[0];

    cycleButton.addEventListener("click", function() {
      if (cycle){
        cycle = false;
      } else {
        cycle = true;
      }
    })

    var oscilloButton = document.getElementById('oscillo');
    var circlesButton = document.getElementById('circles');

    oscilloButton.addEventListener("click", function(){
      display = "oscillo";
      console.log(display);
    });

    circlesButton.addEventListener("click", function() {
      display = "circles";
      console.log(display);
    })
    var question = document.getElementsByClassName('help')[0];
    var closeButton = document.getElementsByClassName('close')[0];
    var modal = document.getElementsByClassName('modal')[0];

    closeButton.addEventListener("click", function(){
      modal.classList.add("closed");
    })

    question.addEventListener("click", function() {
      modal.classList.remove("closed");
    })
};
