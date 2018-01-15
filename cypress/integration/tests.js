var pathToResultsFile = '.\\Task\\UI_Server\\CSVs\\black_box_results.csv'

describe(
		'Letter counter test suite',
		function() {

			// Deletes an old backend Results file if needed and executes Black Box program
			before(function() {
				cy.exec('del "' + pathToResultsFile + '"')
				cy.exec('java -jar "./Task/black_box.jar" "./Task/DropZone/Input.txt" "./Task/UI_Server/CSVs"')
						.its('stdout').should('contain', 'Number of results')
				cy.visit('http://127.0.0.1:8080/')
			})

			it('Reads results from Black Box program and verifies if chart is displayed in UI', function() {
				cy.readFile('./Task/UI_Server/CSVs/black_box_results.csv').then((content) => {
					var beResults = content.split('\n')
					beResults.splice(0, 1)
					beResults.splice(beResults.indexOf(''), 1)
				    cy.get('g[clip-path] rect[fill = \'#3366cc\']').should('have.length', beResults.length);
				})
			})
			
			it('Picks random letter from Input.txt and verifies if it\'s count is correct in the chart', function() {
				cy.readFile('./Task/DropZone/Input.txt').then((content) => {
	
					// Pick a random char from Input.txt
					var char = ' '
					while (char === ' ') {
						var randomIndex = Math.floor((Math.random() * content.length) + 1)
						char = content[randomIndex]
					}
					cy.log("[TEST ACTION] Picked letter: " + char)

					// Count of picked letter in Input.txt
					var charCount = 0
					for (var i = 0; i < content.length; i++) {
                        if (content[i] === char) {
                        	charCount = charCount + 1;
                        }
                    }
					cy.log('[TEST ACTION] Calculated letter count from Input.txt: ' + charCount)
					
					// Get index of picket letter in UI chart
					var uiLetter = cy.get('text[text-anchor=\'middle\']').contains(char)
					cy.get('text[text-anchor=\'middle\']').then((allLettersUi) => {
						var letters = allLettersUi.text()
						var index = 0
						for (var i = 0; i < allLettersUi.length; i++) {
							if (letters[i] === char) {
	                            index = i + 1
	                        }
	                    }
						cy.get('g[clip-path] rect[fill = \'#3366cc\']').eq(index).trigger('mouseover', {force: true}).then((a) => {
							cy.get('svg g:nth-child(3) text:nth-child(2)').should('have.text', charCount.toString());
						} )
					})
				})
			})
		})
