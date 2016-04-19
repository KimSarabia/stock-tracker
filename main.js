'use strict';

$(function(){
  $('button.getPage').click(renderPeople);
  renderPeople();
});

function renderPeople(page){

  page = page || 1;

  event.preventDefault();

  var pageNum = $('.pageNum').val();

  $.ajax({
    url: `http://swapi.co/api/people/`,
    success: function(data){
      var personObjs = data.results;
      var $personCards = personObjs.map(makePersonCard);

      $('.people').append($personCards);

    },
    error: function(err) {
      console.error(err);
    }
  });
}

function getPerson(){
  event.preventDefault();

  var personNum = $('.personNumber').val();

  $.ajax({
    url: `http://swapi.co/api/people/${personNum}/`,
    success: function(personData){
      console.log('personData:', personData);
      var $person = makePersonCard(personData);
      $('.people').append($person);
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function makePersonCard(personObj){
  var $card = $('<div>').addClass('card');
  var $name = $('<p>').text(`Name: ${personObj.name}`);
  var $birth = $('<p>').text(`Birth: ${personObj.birth_year}`);
  var $gender = $('<p>').text(`Gender: ${personObj.gender}`);

  $card.append($name, $birth, $gender);
  return $card;
}


//

//my attempt
// function getbyNumber(persobObj){
//   var people = [];
//   var number = $('personNumber')
//   var filtered = people.filter(function(personObj){
//     return personObj.number
//   })
// }
