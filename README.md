TODO: rewrite for Blood Pressure interactivej 


trunk:  
------
This is a javascript multiple choice quiz that handles radio button, or checkbox-style answers.


index.html:  

1. ALL CAPS TEXT: variable placeholders. These are replaced by javascript as the page loads. The data is found in js/data.json
2. -template divs: skeleton divs that are modified by the javascript, and added to the content div.

css/index.css:

1. artists should make all CSS changes here. 
2. images need to be added to index.html, as we are creating new DOM objects and adding them to an existing page. CSS is only applied when the page loads initially.

js/documentready.js:

1. all user-defined variables have been placed at the top of this file. Examples are: jsonfile, transitiontime, fadetime. 

js/data.json:

1. used to hold questions, answers, quiz title, final code, response text, and secret code, (if needed). 
2. it is possible to use HTML within the JSON strings
3. questiontype: radio or checkbox
4. answerkey: radio) single answer, (ie "a" or "b"). checkbox) multiple answer, (ie "a,b" or "c,e,g").
5. quiz is dynamically built, based on number of questions found in the 'questions' array.
6. secretcode: use this for a secondary completion code. This can be used as an Easter egg code. Check the easter_egg_quiz branch for an example of a final quiz that can take input of a secret code, and provide a prize. 

easter_egg_quiz branch:
-----------------------

This is the same as trunk, except that it provides another form field upon completion of the interactive. Users can input the 'secret code', and are redirected to secretprize.html. fullsecretcode, (data.json), is the answer for the 'secret code'.  
