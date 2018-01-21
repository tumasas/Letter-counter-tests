const pjson = require("./../../package.json")

describe(
		'Letter counter test suite',
		function() {
            
			let blackboxResults = ''
			
			// Executes Black Box program, reads results and opens home page
			before(function() {
				cy.exec('java -jar "' + pjson.config["blackbox-path"] + '" "' + pjson.config["input-path"] + '" "' 
						+ pjson.config["CSVs-path"] + '"').its('stdout').should('contain', 'Number of results')
				
				cy.readFile(pjson.config["results-path"]).then((content) => {
					blackboxResults = content.split('\n')
					blackboxResults.splice(0, 1)
					blackboxResults.splice(blackboxResults.indexOf(''), 1)
				})
				cy.visit('http://127.0.0.1:8080/')
			})

			// Test remediation
			after(function() {
				cy.exec('del "' + pjson.config["results-path"] + '"')
			})
			
			it('Verifies if chart displays blackbox program\'s results', function() {
				cy.get('div[id*=\'google-visualization-errors\']').should('not.exist')
				cy.get('#chart_div g[clip-path] g + g:nth-child(2) rect').should('have.length', blackboxResults.length);
			})
			
			it('Verifies if chart displays random letter\'s count', function() {
				
             		// Pick a random char from results
					var randomIndex = Math.floor((Math.random() * blackboxResults.length) + 1)
					//randomIndex = 3
					var expectedLetterAndCount = blackboxResults[randomIndex].split('\",')
			        var expectedLetter = expectedLetterAndCount[0].replace("\"", "")
			        var expectedCharCount = expectedLetterAndCount[1]
					
					// Get index of picket letter in UI chart
					var uiLetter = cy.get('text[text-anchor=\'middle\']').contains(expectedLetter)
					cy.get('#chart_div text[text-anchor=\'middle\']').then((allLettersUi) => {
						
						var letters = allLettersUi.text()
						var index = 0
						for (var i = 0; i < allLettersUi.length; i++) {
							if (letters[i] === expectedLetter) {
	                            index = i + 1
	                        }
	                    }

						cy.get('#chart_div g[clip-path] g + g:nth-child(2) rect').eq(index)
			             			            .trigger('mouseover', {force: true}).then((obj) => {
							cy.get('#chart_div svg path ~ g').then((elem) => {
								var actualLetterAndCount = elem.text().split('count')
				                var actualLetter = actualLetterAndCount[0]
							    var actualCount = actualLetterAndCount[1].replace(':', '')
								cy.expect(actualLetter).equals(expectedLetter)
						        cy.expect(actualCount).equals(expectedCharCount)
							})
						})
					})
			})			    		
		})
