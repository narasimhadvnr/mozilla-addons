
var pre = '';
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().toString();
    }
    return text.toLowerCase().trim();
}

document.onmouseup = document.onkeyup = document.onselectionchange = function () {
    //  console.log("Selected text: ", getSelectionText());
    var selectedText = getSelectionText();

    if (selectedText && selectedText.length < 30) {

        //console.log( getMeaning(selectedText));
        //   console.log("Sending request for data:",selectedText);
        if (pre !== selectedText) {
            getMeaning(selectedText, (response) => {
                if(response && response.length>0 && response !=="error"){
                    console.log('response: for word: ', selectedText, " is:", response);
                    window.alert(response[0]);
                }
            });
            pre = selectedText;
        }
    }
};


function getMeaning(word, callback) {
    var request = new XMLHttpRequest();
    var language = 'en';
    //   var word = 'win';
    var url = "https://od-api.oxforddictionaries.com/api/v1/entries/" + language + "/" + word;
    //    console.log(url);
    request.open("GET", url, true);
    request.setRequestHeader('app_id', '9ad093d7');
    request.setRequestHeader('app_key', '3561972bc8edb22957e3cabfb4809cf5');
    request.send(null);
    var response = [];
    console.log("creating event listener for request fow word: ", word);
    request.addEventListener('readystatechange', () => {
        //      console.log(request.response);
        if (request.readyState == 4) {
            var jsontext = request.response;
            var results;
            try {
                var jsonObject = JSON.parse(jsontext);
                //       console.log(jsonObject);
                results = jsonObject.results;
            } catch (e) {

            }
            if (results && results.length > 0)
                results.forEach(function (element) {
                    // console.log(element.lexicalEntries);
                    var lexicalEntries = element.lexicalEntries;
                    if (lexicalEntries.length > 0) {
                        lexicalEntries.forEach(function (object) {
                            //    console.log("Entry:",object.entries);
                            //   var etimologies = object.entries.etimologies;
                            var entries = object.entries;
                            if (entries.length > 0) {
                                entries.forEach(function (etimology) {
                                    // console.log("Etimology:",etimology);
                                    // console.log("Etimologies:",etimology.senses);
                                    var senses = etimology.senses;
                                    senses.forEach(function (sense) {
                                        //           console.log(sense.definitions);
                                        response.push(sense.definitions);
                                    });
                              //      console.log("response: ", response);
                                    
                                });
                            }
                            //    console.log(etimologies);
                        });
                    }
                }, this);
            //   console.log(JSON.parse(request.responseText));
        }
        callback(response);
    });
    callback('error');

}


getMeaning('win');
