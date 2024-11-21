$("#start").on("click", quiz);

function quiz() {
  let songList = [];
  for (let i in song) songList.push([i, song[i]]);
  shuffle(songList);

  console.log(songList);

  let i = 0;

  function showQuiz() {
    if (i >= songList.length) {
      alert("퀴즈가 끝났습니다!");
      $("#content")
        .html(`<button id="start" style="display: block; margin-left: 40vw">
          문제 풀기
        </button>`);
      return;
    }

    let source = `
          <div style='margin: 0 auto; margin-bottom: 5vh'>
            <audio id="quizAudio" controls controlsList="nodownload" ontimeupdate="restrictAudio(this)">
              <source src="/music/${songList[i][0]}..mp3" type="audio/mp3" />
            </audio>
          </div>
          <input id='title' type='text' placeholder='제목을 입력하세요'>
          <input id='composer' type='text' placeholder='작곡가를 입력하세요'>
          <input id='era' type='text' placeholder='시대를 입력하세요'>
          <input id='genre' type='text' placeholder='장르/연주형태를 입력하세요'>
          <button id='showAnswer'>정답 확인</button>
          <button id='nextButton' style='display: none;'>다음 문제</button>
        `;
    $("#content").html(source);

    const audio = document.getElementById("quizAudio");
    audio.play().catch((err) => {
      console.warn("오디오 자동 재생이 차단되었습니다:", err);
    });

    function check(e) {
      let isCorrect = false;
      const userInput = $(`#${e}`).val().trim();
      const correctAnswers = songList[i][1][e];

      for (let answer of correctAnswers) {
        if (answer === userInput) {
          isCorrect = true;
          break;
        }
      }

      if (isCorrect) {
        $(`#${e}`).css("border", "2px solid green");
      } else {
        const inputField = $(`#${e}`);
        inputField.css("border", "2px solid red");
        inputField.val(userInput + ">>" + correctAnswers[0]);
        inputField.attr("placeholder", correctAnswers[0]);
        inputField.addClass("shake");

        setTimeout(() => {
          inputField.removeClass("shake");
        }, 300);
      }
    }

    $("#showAnswer").on("click", function () {
      $(this).hide();
      $("#quizAudio")[0].pause();
      check("title");
      check("composer");
      check("era");
      check("genre");
      $("#nextButton").show();
    });

    $("#nextButton").on("click", function () {
      i++;
      showQuiz();
    });
  }

  showQuiz();
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function restrictAudio(event) {
  if (event.currentTime < 0 || event.currentTime > 30) {
    event.pause();
    event.currentTime = 0;
  }
}
