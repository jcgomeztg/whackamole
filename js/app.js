(
	function(){
		console.log('Start App');
		var initialTime = 2000;
		var time;
		var hits;
		var missed;
		var chances;
		var minHits;
		var over;
		var level;
		var score;
		var playersName;
		Parse.initialize("4kJd4xMIJpvzoekUNRyX2WCLAVjpLumMNmotyg83", "80OiLg2Mu3XNxIx2eDwhdOXzcGD0DL5fRibAqHkT");

		function initGame(l){
			level = l;
			time = initialTime - (level * 100);
			hits = 0;
			missed = 0;
			chances = 10;
			minHits = 8;
			over = false;	
			$('#hits').text('Hits: ' + hits);
			$('#missing').text('Missing: ' + missed);
			$('#level').text('Level: ' + level);
			$('#score').text('Score: ' + score);

		}

		function holeClick(){
			var mole = '#'+this.id;
			var active = $(mole).hasClass('active');
			if(active){
				hits += 1;
				score += (level * 10);
				$('#hits').text('Hits: ' + hits);
				$('#score').text('Score: ' + score);
				$(mole).removeClass('active');
				$(mole).addClass('hit');
			}
		}

		function showMole (hole){
			console.log(hole);
			$(hole).addClass('active');
			setTimeout(function(){hideMole(hole);},time);
		}
		function hideMole(hole){
			var active = $(hole).hasClass('active');
			if(active){
				missed += 1;
				$(hole).removeClass('active');	
				$('#missing').text('Missing: ' + missed);
				if(missed > (chances-minHits)){
					gameOver();
				}
			}
			
		}
		
		function getHoleNumber(){
			return Math.floor(Math.random() * (9) + 1);
		}
		
		function gameOver(){
			console.log('Game Over.');
			over = true;
			var ScoreObject = Parse.Object.extend("ScoreObject");
			var scoreObject = new ScoreObject();
			scoreObject.save({
				playersName: playersName,
				date: Date(),
				score: score,
				level: level
			})
				.then(function(object) {
			  		alert("Game Over.");
			  		loadResults();
				});	
					
		}

		function play(){
				console.log(hits);
				console.log(missed);
				console.log(chances);
				console.log(hits + missed);
				console.log(minHits);
				console.log(level);

			if(!over){
				var mole = '#hole' + getHoleNumber();
				if(hits + missed < chances) {
					showMole(mole);
					setTimeout(play,time);					
				}
				else if(hits >= minHits){
					console.log('Next Level');
					start(level + 1);
				}
				else{
					gameOver();
				}				
			}
		}

		function start(level){
			playersName = $("input[name='playersName']").val();
			console.log(playersName);
			if( playersName === ''){
				alert('Enter Your Name.');
				return;
			}
			if(level === 1){
				score = 0;
			}

			initGame(level);

			play();
		}

		function loadResults(){
			var ScoreObject = Parse.Object.extend("ScoreObject");
			var query = new Parse.Query(ScoreObject);
			query.limit(10);
			query.descending("score");
			query.find({
			  success: function(results) {
			    console.log("Successfully retrieved " + results.length + " scores.");
			    
			    $("#resultsTable > tbody > tr").remove();

			    for (var i = 0; i < results.length; i++) { 
			      var object = results[i];
			      $("#resultsTable > tbody").append('<tr><td>'+object.get('score')+'</td><td>'+object.get('playersName')+'</td><td>'+object.get('level')+'</td></tr>')
			      console.log(object.id + ' - ' + object.get('playersName'));
			    }
			  },
			  error: function(error) {
			    console.log("Error: " + error.code + " " + error.message);
			  }
			});			
		}
		var holes = $('.hole');

		for(var i = 0; i< holes.length; i++){
			holes[i].addEventListener("click", holeClick, false);
		}

		window.startGame = start;
		loadResults();
	}
)();