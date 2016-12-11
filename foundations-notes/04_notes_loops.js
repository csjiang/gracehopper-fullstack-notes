// But under the hood, the indexOf method is basically looping through all the elements in the array until it does/doesn't find a match. So what does that mean? Every time we call indexOf we are starting a new loop (and we are already inside a loop!) 
// As you can imagine, on a large array this is way less efficient than looking up an object property, which is immediate!
// ---> rationale for using objects to look up something given an array and strings. arrays are super fast using index lookup but otherwise not. Object allows us to save filename as key and look up and see if filename exists on that obj using bracket notation. 

/* RENAME FILES */

function renameFiles(arrayOfFilenames) {

  var nameTracker = {},
  namer = function(fileName, num){ return fileName + "(" + num + ")"};

  return arrayOfFilenames.map(function(name) {
    // extension name
    var extension = nameTracker[name] || 0;
    // how many times filename is used
    nameTracker[name] = extension + 1;
    // 0 return true, if not proceed...
    if(!extension){
      return name;
    }
    // while the key exists
    keyName = namer(name, extension);
    while(nameTracker[keyName]){
      keyName = namer(name, extension++);
    }
    nameTracker[keyName] = 1;
    return keyName;
  });


};

// Recursive Solution

// var renameFiles = function(arrayOfNames) {
//  var filenames = [];
//
//   function renamer(name) {
//     // if name not in list, do nothing
//     // BASE CASE
//     if (filenames.indexOf(name) == -1) {
//       filenames.push(name);
//     }
//     else {
//       // if the name has numbers, add 1 to the number
//       var parentheses = name.indexOf("(");
//       if (parentheses > -1) {
//         // take current number and add 1
//         var number = +name.match(/\d+/)[0] + 1;
//         //
//         renamer(name.substring(0,parentheses+1)+number+")")
//       }
//       // otherwise, add "(1)" to the name
//       else renamer(name+"(1)");
//     }
//   }
//
//   arrayOfNames.forEach(renamer);
//
//   return filenames;
// }


  //more elegant solution involving Array.prototype methods, incorporating 
  //ES2015 stuff: 

  // return Array.apply(null, {length: n}).map(Number.call, Number).map(function(elem) {
  //  return function() {
  //    return elem;
  //  };
  // });

  //other ways to make array like list(range(n)) in Python: 
  //ES6: 
  
  //Array.from(Array(10).keys());

  //[...Array(10).keys()];
