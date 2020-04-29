$(document).ready(function () {
  checkStorage()
  $('#formSignIn').on('submit', function (event) {
    event.preventDefault()
    const email = $('#signInEmail').val()
    const password = $('#signInPassword').val()
    signIn(email, password)
  })
})

function signIn(email, password) {
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/login',
    data: {
      email,
      password
    }
  })
    .done(function (response) {
      const token = response.token
      $('#signInEmail').val('')
      $('#signInPassword').val('')
      localStorage.setItem('token', token)
      // hide landing
      $('#landingPage').hide()
      $('#signInError').hide()
      // show dashboard
      $('#dashboardPage').show()
      fetchDigimon()
    })
    .fail(function (err) {
      console.log(err.responseJSON.message, ' <<< error')
      $('#signInError').show()
      $('#signInError').text(err.responseJSON.message)
    })
}

function checkStorage() {
  if (localStorage.token) {
    $('#landingPage').hide()
    $('#dashboardPage').show()
    fetchDigimon()
  } else {
    $('#landingPage').show()
    $('#dashboardPage').hide()
  }
}

function fetchDigimon() {
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/digimons',
    headers: {
      token
    }
  })
    .done(function (response) {
      const digimons = response.Digimons
      $('#digimonList').empty()
      digimons.forEach(el => {
        $('#digimonList').append(`
          <li>${el.name}</li>
        `)
      })
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function submitDigimon(e) {
  e.preventDefault()
  const token = localStorage.getItem('token')
  const digimonName = $('#digimonName').val()
  const digimonLevel = $('#digimonLevel').val()
  const digimonImgUrl = $('#digimonImgUrl').val()

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/digimons',
    headers: {
      token
    },
    data: {
      name: digimonName,
      level: digimonLevel,
      imgUrl: digimonImgUrl
    }
  })
    .done(function (response) {
      const digimon = response.Digimon
      $('#digimonList').append(`
        <li>${digimon.name}</li>
      `)
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function logout() {
  localStorage.clear()
  $('#landingPage').show()
  $('#dashboardPage').hide()
}
