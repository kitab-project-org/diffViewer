/*
Implementation of the Tichy algorithm

see https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1377&context=cstech

This does not seem to be a useful approach for us, because it doesn't include
a difference between moved text and text that remained in place.
*/




/* check for every position in the old string O if it is in the new string N;
if it is, check what the longest combination of next letters is in N.*/
function findMoves(S, T){
  var m = S.length-1; // last_O_pos
  var n = T.length-1; // last_N_pos
  var results = new Object();

  var q = 0; // N_pos
  while (q <= n){
    var l = 0; // length of the maximal block move found in current iteration
    var p = 0; // index position in T of the start of the longest match
    var pCur = 0; // current index position in T
    while (pCur+1 <= m && q+l <= n){
      var lCur = 0; // current length of the match
      while ((pCur+lCur <= m) && (q+lCur <= n) && (S[pCur+lCur] === T[q+lCur])) {
        lCur++
      }
      if (lCur > l){
        l = lCur;
        p = pCur;
      }
      pCur ++;
    }
    if (l > 0) {
      console.log("pos in S: "+p+", pos in T: "+q+", length: "+l);
      results[q] = [p, l];
    }
    q += Math.max(1, l);
  }
  console.log(results);
  return results;
}

function tagMoves(T, moves, tagClass){
  let tagged_T = [];
  let in_tag = false;
  let i = 0;
  while (i < T.length){
    if (!moves.hasOwnProperty(i)){
      if (!in_tag){
        tagged_T.push('<span class="'+tagClass+'">');
        in_tag = true;
      }
      tagged_T.push(T[i]);
      i++;
    } else {
      if (in_tag){
        tagged_T.push('</span>');
        in_tag = false;
      }
      tagged_T.push('<span class="moved">'+T.substr(i, moves[i][1])+'</span>');
      i += moves[i][1];
    }
  }
  if (in_tag){
    tagged_T.push('</span>');
  }
  return tagged_T.join("");
}



let S = "uvwuvwxy";
let T = "zuvwxwu";

let T_results = findMoves(S, T);
let S_results = findMoves(T, S);

let tagged_T = tagMoves(T, T_results, "added");
let tagged_S = tagMoves(S, S_results, "deleted");
console.log(tagged_T);
console.log(tagged_S);

// mark additions in T: index positions not in results object:
var B = JSON.parse(JSON.stringify(S));
var A = [...Array(S.length).keys()]; // [0, 1, 2, ..., n]
