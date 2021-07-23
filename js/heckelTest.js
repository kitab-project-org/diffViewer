function shingle(s, n){
  console.log(s);
  if (s.length<n) {
    return [];
  }
  let shingles = [];
  for (let i=0; i<(s.length+1)-n; i++){
    shingles.push(s.substring(i,i+n));
  }
  return shingles;
}

function markupHeckelArrays(OArr, NArr, aHtml="", bHtml="", n=undefined, space=" "){
  let inDel = false;
  for (let i=0; i<O.length; i++){
    var token = O[i];
    if (typeof OArr[i] === "string") { // no equivalent found in other string N
      if (! inDel) {
        inDel = true;
        aHtml += '<span class="removed">' ;
      }
      aHtml += n !== undefined ? token[0] : token+space;
    } else {
      let j = OArr[i];  // the index of the equivalent token in the other string
      if (inDel) {
        inDel = false;
        aHtml += '</span>' ;
      }
      aHtml += n !== undefined ? token[0] : token+space;
    }
  }
  aHtml += token.substring(1,n+1);
  if (inDel) {
    aHtml += '</span>'
  }

  let inAdd = false;
  for (let i=0; i<N.length; i++){
    var token = N[i];
    if (typeof NArr[i] === "string") { // no equivalent found in other string N
      if (! inAdd) {
        inAdd = true;
        bHtml += '<span class="removed">' ;
      }
      bHtml += n !== undefined ? token[0] : token+space;
    } else {
      let j = NArr[i];  // the index of the equivalent token in the other string
      if (inAdd) {
        inAdd = false;
        bHtml += '</span>' ;
      }
      bHtml += n !== undefined ? token[0] : token+space;
    }
  }
  bHtml += n !== undefined ? token.substring(1, n+1) : "";
  if (inAdd) {
    bHtml += '</span>'
  }
  return [aHtml, bHtml];
}

/*
 * Partial implementation of the algorithm described in Heckel 1978, pp. 265f.:
 * in this implementation a list of tokens (can be words, lines, ngrams, ...)
 * is provided for the old (O) and new (N) strings.
 * If lists shingled character ngrams are provided, provide the n of the ngram.
 * Moved clusters are not implemented here (yet).
 *
 */

function heckel(O, N){
  var ST = new Object();  // symbol table
  var OArr = new Array();   // array of Old string
  var NArr = new Array();  // array of New string

  // STEP1: count the number of times each token is in the new string N:
  // populating the NArr array and the NC (new count) value in the symbol table ST:

  for (let i=0; i<N.length; i++){
    let token = N[i];
    NArr.push(token);
    if (!ST.hasOwnProperty(token)) {
      ST[token] = {OC: 0, NC: 0, OLNO: null};
    }
    ST[token].NC += 1;
  }

  // STEP2:count the number of times each token is in the new string N:
  // populating the OArr array and the OC (old count) and OLNO (old number)
  // values in the symbol table ST:

  for (let i=0; i<O.length; i++){
    let token = O[i];
    OArr.push(token);
    if (!ST.hasOwnProperty(token)) {
      ST[token] = {OC: 0, NC: 0, OLNO: null};
    }
    ST[token].OC += 1;
    ST[token].OLNO = i;
  }

  // STEP3: identify tokens that are only once in both O and N;
  // these will become the anchors for the rest of the Algorithm.
  // In OArr and NArr, replace the selected tokens by their position in the other array

  let maxVal = 1;
  for (const token in ST) {
    if (ST[token].OC === 1 && ST[token].NC === 1) {
      OArr[OArr.indexOf(token)] = NArr.indexOf(token)
      NArr[NArr.indexOf(token)] = ST[token].OLNO;
    } else {
      maxVal = Math.max(maxVal, ST[token].OC, ST[token].NC);
    }
  }

  // Steps 4 and 5 only make sense if some tokens are present more than once!
  if (maxVal > 1) {

    // STEP 4: go through the NArr in ascending order and for those items that
    // have been replaced with the index in the other array, check if the next
    // item in both arrays is the same token (that is, an token that is present
    // more than once in at least one of the strings).
    // If so, replace both with the index of that item in the other array:

    for (let i=0; i<NArr.length; i++) {
      let token = NArr[i];
      if (!ST.hasOwnProperty(token)) {
        let j = OArr.indexOf(i);
        // if a following item exists and is not a number, check if it is identical as the following token in OArr:
        if (i+1<NArr.length && (ST.hasOwnProperty(NArr[i+1])) && j+1<OArr.length && (NArr[i+1] === OArr[j+1])) {
          NArr[i+1] = j+1;
          OArr[j+1] = i+1;
         }
      }
    }

    // STEP5: like step 4, but in descending order:

    for (let i=NArr.length; i>=0; i--) {
      let token = NArr[i];
      if (!ST.hasOwnProperty(token)) {
        let j = OArr.indexOf(i);
        // if a preceding item exists and is not a number, check if it is identical as the preceding token in OArr:
        if (i>0 && (ST.hasOwnProperty(NArr[i-1])) && j>0 && (NArr[i-1] === OArr[j-1])) {
          console.log("YY");
          NArr[i-1] = j-1;
          OArr[j-1] = i-1;
         }
      }
    }
  }

  // STEP6: piece the string back together, inserting html tags: use separate funtion.

  return [OArr, NArr];
}

/*
// this does not work:
function reNgramHeckelArray(arr, new_n, old_n){
  let a = [];
  let s = ""
  for (let i=0; i<arr.length; i++) {
    console.log(arr[i]);
    if (typeof arr[i] === "number"){
      if (s) {
        let ngrams = shingle(s, new_n);
        if (ngrams){
          a = a.concat(ngrams);
        } else {
          a.push(s);
        }
        s = ""
      }
      a.push(arr[i]);
    } else {
      if (old_n !== undefined && i+1 !== arr.length){
        s += arr[i][0]
      } else {
        s += arr[i];
      }
    }
  }
  return a;
}*/
var aHtml = "";
var bHtml = "";
let n = 2;
let O = shingle("هم وزروعهم علي ماء ", n);
let N = shingle("متد وبساتين واجنه صالحه وتمتد زروعهم بماء ", n);
let [OArr, NArr] = heckel(O, N, aHtml, bHtml, n);
console.log(OArr);
[aHtml, bHtml] = markupHeckelArrays(OArr, NArr, aHtml, bHtml, n);

//let O = "هم وزروعهم علي ماء ".split(" ");
//let N = "متد وبساتين واجنه صالحه وتمتد زروعهم بماء ".split(" ");
//[aHtml, bHtml] = heckel(O, N, aHtml, bHtml, undefined, " ");
console.log(aHtml);
console.log(bHtml);
