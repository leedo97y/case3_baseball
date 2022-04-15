;(() => {
  'use strict'

  const get = (target) => document.querySelector(target)

  const init = () => {
    get('form').addEventListener('submit', (event) => {
      playGame(event)
    })
    setPassword()
  }

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false,
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input')
  }

  const {limit, digit, $question, $answer, $input} = baseball
  // destructure 을 통해 객체를 미리 선언할 수 있다.
  let {trial, end} = baseball
  // const는 재할당이 불가능 하기 때문에
  // 중간에 자주 바뀌는 변수는 let으로 선언

  const setPassword = () => {
    // 패스워드를 지정해 줍니다.
    const gameLimit = Array(limit).fill(false)
    let password = ''
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10)
      // radix 를 지정해줘야 10진수로 변환이 됨.
      // parseInt는 기본적으로 10진수가 아니다.

      if (gameLimit[random]) {
        continue
      }
      password += random
      gameLimit[random] = true
    }
    baseball.password = password
  }

  const onPlayed = (number, hint) => {
    // 시도를 했을 때
    // number : 내가 입력한 숫자
    // hint : 현재 어떤 상황?
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`
  }

  

  const isCorrect = (number, answer) => {
    // 번호가 같은가? 
    return number === answer
  }

  const isDuplicate = (number) => {
    // 중복번호가 있는가? 
    return [...new Set(number.split(''))].length !== digit
  }

  const getStrikes = (number, answer) => {
    // 스트라이크 카운트는 몇개?
    let strike = 0
    const nums = number.split('')

    nums.map((digit, index) => {
      if (digit === answer[index]) {
        strike++
      }
    })

    return strike
  }

  const getBalls = (number, answer) => {
    // 볼 카운트는 몇개?
    let ball = 0
    const nums = number.split('')
    const gameLimit = Array(limit).fill(false)

    answer.split('').map((num) => {
      gameLimit[num] = true
    })

    nums.map((num, index) => {
      if (answer[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })

    return ball
  }

  const getResult = (number, answer) => {
    // 시도에 따른 결과는?
    if (isCorrect(number, answer)) {
      end = true
      $answer.innerHTML = baseball.password
      return '홈런!!'
    }

    const strikes = getStrikes(number, answer)
    const balls = getBalls(number, answer)

    return 'STRIKE: ' + strikes + ', BALL: ' + balls
  }

  const playGame = (event) => {
    // 게임 플레이
    event.preventDefault();

    if(!!end) {
      return
    }

    const inputNumber = $input.value
    const { password } = baseball

    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`)
    } else if (isDuplicate(inputNumber)) {
      alert('중복 숫자가 있습니다.')
    } else {
      trial++
      const result = onPlayed(inputNumber, getResult (inputNumber, password))
      $question.innerHTML += `<span>${result}</span>`

      if (limit <= trial && !isCorrect (inputNumber, password)) {
        alert('쓰리아웃!')
        end = true
        $answer.innerHTML = password
      }
    }
    $input.value = ''
    $input.focus()
  }

  init();
})()
