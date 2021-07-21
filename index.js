/*

Diffcheck implementation based on Wikipedia's diff checking algorithm.
Wikipedia displays the diff of both texts in a single composite text;
this tool takes the output of Wikipedia's algorithm and displays it in two
separate fields.

TO DO:
* find a way to archive + download the output
* further testing + customization
* implement options:
  - normalization
  - keep new line characters?
  - option to display the diff in one div

See:
* description of the Wikipedia algorithm: https://en.wikipedia.org/wiki/User:Cacycle/diff
* online test instance of the Wikipedia diff tool: http://cacycle.altervista.org/wikEd-diff-tool.html
* javascript code of the Wikipedia diff tool: https://en.wikipedia.org/w/index.php?title=User:Cacycle/diff.js&action=raw&ctype=text/javascript
*/


// initialize:

var inputA = `الي النهروان يوم السبت فاقام به ثمانية ايام وخرج اليه اهل بيته ووجوه اهل بغداد فسلموا عليه فلما كان يوم السبت الاخر دخل الي بغداد وكان قد كتب الي طاهر بن الحسين وكان بالرقة ان يوافيه بالنهروان فقدم طاهر ودخل عليه وامره ان ينزل الخيزرانية هو واصحابة ثم انه تحول فنزل قصره علي شاطء دجلة وامر حميد بن عبد الحميد وعلي بن هشام وكل من-- كان في عساكر هما ان ينزلوا في عسكره قالوا جميعا فكانوا يختلفون الي ال----مامون في كل يوم مسلمين ولباسهم الثياب الخضر ولم يكن احد يدخل عليه---- الا في خضرة-------- ولبس ذلك اهل بغداد---------- اجمعون وكانوا يخرقون كل شء راو-ه من السواد علي ا--حد الا القلانس-- فان------------ الواحد بعد الواحد كان يلبسها متخوفا ووجلا فاما قباء او علم فلم يكن احد يجترء ان يلبس شيءا من ذلك ولا يحمله فمكثوا بذلك ثمانية ايام وتكلم فيها-- بنو هاشم من ولد العباس خاصة وقالوا له  يا امير المءمنين تركت لباس -------اهل بيتك ودولتهم ولبست الخضرة قالوا وكتب اليه في ذلك قواد اهل خراسان`;
var inputB = `الي النهروان وذلك يوم السبت فاقام فيه ثمانية ايام وخرج اليه اهل بيته والقواد ووجوه الناس فسلموا عليه وقد كان كتب الي طاهر بن الحسين من الطريق وهو بالرقة ان يوافيه الي النهروان فوافاه بها فلما كان السبت الاخر دخل بغداد ارتفاع النهار لا-ربع عشرة ليلة بقيت من صفر سنة اربع وماءتين و----لباسه ولباس اصحابه------ اقبيتهم وقلانسهم وطراداتهم واعلامهم كلها الخضرة------ فلما قدم نزل الرصافة وقدم معه طاهر فامره بنزو-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ل الخيزرانية مع -اصحابه ثم---- تحول فنزل قصره علي شط-- دجلة وامر حميد بن عبد الحميد وعلي بن هشام وكل قاءد كان في عس-كر---ه ان ي--قيم في عسكره ------------فكانوا يختلفون الي دار المامون في كل يوم ولم يكن-------------------------------- يدخل عليه احد الا في الثياب الخضر ولبس ذلك اهل بغداد وبنو هاشم اجمعون فكانوا يخرقون كل شء يرونه من السواد علي انسان الا القل-نسوة فانه كان يلبسها الواحد بعد الواحد علي ---------خوف- ووجل- فاما قباء او علم فلم يكن احد يجترء ان يلبس شيءا من ذلك ولا يحمله فمكثوا بذلك ثمانية ايام فتكلم في ذلك بنو هاشم و--ولد العباس خاصة وقالوا له- يا امير المءمنين تركت لباس اباءك واهل بيتك ودولتهم ولبست الخضرة------ وكتب اليه في ذلك قواد اهل خراسان `;

/*var inputA = "الي النهروان يوم السبت فاقام به ثمانية ايام"
var inputB = "الي النهروان وذلك يوم السبت فاقام فيه ثمانية ايام"*/

var calcDiffBtn, inputBtn, inputDiv, outputDiv, loadExampleLnk, clearBtn;

window.addEventListener('load', function() {
  inputDiv = calcDiffBtn = document.getElementById("inputDiv");
  outputDiv = calcDiffBtn = document.getElementById("outputDiv");
  loadExampleLnk = document.getElementById("loadExample");
  loadExampleLnk.addEventListener("click", loadExample);
  calcDiffBtn = document.getElementById("calcDiffButton");
  calcDiffBtn.addEventListener("click", calcDiff);
  clearBtn = document.getElementById("clearButton");
  clearBtn.addEventListener("click", clear);
  inputBtn =  document.getElementById("inputButton");
  inputBtn.addEventListener("click", function(){
    inputDiv.style.display="block";
    outputDiv.style.display="none";
  });
});

function loadExample(){
  document.getElementById("inputA").value = inputA;
  document.getElementById("inputB").value = inputB;
}

function clear(){
  document.getElementById("inputA").value = "";
  document.getElementById("inputB").value = "";
}

function clean(text){
    text = text.replace(/### \|+ /g, "");
    text = text.replace(/^# /g, "");
    text = text.replace(/-+/g, "");
    text = text.replace(/\r/g, "");
    text = text.replace(/\n+~~/g, " ");
    text = text.replace(/~~/g, "");
    text = text.replace(/[\n ]*ms\d+[\n ]*/g, " ");
    text = text.replace(/[\n ]*PageV[^P]+P\d+[a-bA-B]?[\n ]*/g, " ");
    return text
}

function getLineOffsets(s){
  var offsets = [];
  for (let i=0; i<s.length; i++){
    if (s[i] === "\n"){
      offsets.push(i);
    }
  }
  return offsets
}

// parse the wikiEdDiff html into two separate strings
function parseDiffHtml(diffHtml){
  var parser = new DOMParser();
  var wikiHtml = parser.parseFromString(diffHtml, "text/html");
  console.log(wikiHtml);
  var rootNode = wikiHtml.getElementsByTagName("pre")[0]
  console.log(rootNode);
  var aHtml = "";
  var bHtml = "";

  for (var i = 0; i < rootNode.childNodes.length; i++) {
    var c = rootNode.childNodes[i];
    console.log(c);
    if (c.nodeType === Node.TEXT_NODE){
      console.log("UNMARKED: COMMON TEXT "+c.textContent);
      aHtml += c.textContent;
      bHtml += c.textContent;
    } else if (c.classList.contains("wikEdDiffInsert")) {
      console.log("MARK IN B (INSERTION)");
      bHtml += '<span class="added">'+c.textContent+'</span>';
      if (c.querySelector(".wikEdDiffNewline") != null){
        bHtml += "<br>"
      }
    } else if (c.classList.contains("wikEdDiffDelete")) {
      console.log("MARK IN A (DELETION) "+c.textContent);
      aHtml += '<span class="removed">'+c.textContent+'</span>';
      if (c.querySelector(".wikEdDiffNewline") != null){
        aHtml += "<br>"
      }
    } else if (c.classList.contains("wikEdDiffBlock")) {
      console.log("MOVED, B "+c.textContent);
      if (c.textContent.length > 1){
        bHtml += '<span class="moved">'+c.textContent+'</span>';
      } else {
        bHtml += '<span class="added">'+c.textContent+'</span>';
      }
    } else if (c.classList.contains("wikEdDiffMarkLeft")) {
      console.log("MOVED, A "+c.getAttribute('title'));
      if (c.getAttribute('title').length > 1){
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
      }
    } else if (c.classList.contains("wikEdDiffMarkRight")) {
      console.log("MOVED, A "+c.getAttribute('title'));
      if (c.getAttribute('title').length > 1){
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
      }
    }
  }
  document.getElementById("aDiff").innerHTML = "<p>"+aHtml+"</p>";
  document.getElementById("bDiff").innerHTML = "<p>"+bHtml+"</p>";
  document.getElementById("cDiff").innerHTML = diffHtml;
  console.log(aHtml);
  console.log(bHtml);
  outputDiv.style.display="block";
  inputDiv.style.display="none";
}


function calcDiff() {
  // load variables from inputs:
  var a = document.getElementById("inputA").value;
  var b = document.getElementById("inputB").value;
  if (a === ""){
    document.getElementById("inputA").value = "PLEASE PROVIDE A TEXT HERE";
    return
  }
  if (b === ""){
    document.getElementById("inputB").value = "PLEASE PROVIDE A TEXT HERE";
    return
  }
  // clean both strings:
  a = clean(a);
  b = clean(b);

  // get the offsets of the new lines in both strings:
  /*aLineOffsets = getLineOffsets(a);
  console.log(aLineOffsets);
  a = a.replace(/\n+/g, "");
  bLineOffsets = getLineOffsets(b);
  console.log(bLineOffsets);
  b = b.replace(/\n+/g, "");*/

  // create the diff:
  var wikEdDiff = new WikEdDiff();
  var diffHtml =   wikEdDiff.diff(a, b);
  console.log(diffHtml);
  parseDiffHtml(diffHtml);

}
