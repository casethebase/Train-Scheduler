var config = {
  apiKey: "AIzaSyBDuUwgDzR9fs0qEnCIThEDRmlL1TpnA0w",
  authDomain: "casethetrain.firebaseapp.com",
  databaseURL: "https://casethetrain.firebaseio.com",
  projectId: "casethetrain",
  storageBucket: "",
  messagingSenderId: "870980193204"
};

firebase.initializeApp(config);

var database = firebase.database();

function calculateSchedule(firstTrain, frequency) {
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(firstTimeConverted, "minutes");
  var remainder = diffTime % frequency;
  var minutesAway = remainder === 0 ? 0 : frequency - remainder;
  var nextTrain = moment().add(minutesAway, "minutes");

  return {
    minutesAway: minutesAway,
    arrivalTime: nextTrain.format("h:mm A")
  };
}

function appendTrainRow(train) {
  var frequency = parseInt(train.freqMin, 10);

  if (!train.trainsName || !train.destination || !train.firstTrain || !frequency) {
    return;
  }

  var schedule = calculateSchedule(train.firstTrain, frequency);
  var row = $("<tr></tr>");

  row.append($("<td></td>").text(train.trainsName));
  row.append($("<td></td>").text(train.destination));
  row.append($("<td></td>").text(frequency));
  row.append($("<td></td>").text(train.firstTrain));
  row.append($("<td></td>").text(schedule.minutesAway));
  row.append($("<td></td>").text(schedule.arrivalTime));

  $("#scheduleBody").append(row);
}

$("#submit-button").on("click", function(e) {
  e.preventDefault();

  var trainsName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var freqMin = $("#freqInput").val();
  var firstTrain = $("#firstTrainInput").val();

  if (!trainsName || !destination || !freqMin || !firstTrain) {
    return;
  }

  database.ref().push({
    trainsName: trainsName,
    destination: destination,
    freqMin: freqMin,
    firstTrain: firstTrain
  });

  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#freqInput").val("");
  $("#firstTrainInput").val("");
});

database.ref().on("child_added", function(snapshot) {
  appendTrainRow(snapshot.val());
});
