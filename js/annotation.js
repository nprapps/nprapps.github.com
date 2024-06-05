var onWindowLoaded = function() {
	console.log('hello world')  

  // get all annotations
  var annotations = document.querySelectorAll('.footnotes li');
  console.log(annotations)
  annotations.forEach(d => {
    console.log(d)
    var id = d.id.replace("fn:","fnref:")
    console.log(id)
    
    // match <li> with <sup>
    var sup = document.querySelector(`sup#${id.replace(":","\\:")}`)    
    var p = sup.parentNode
    
    // add li before sup
    p.insertBefore(d,sup)

    // add a class to the sup's parent <p>
    p.classList.add("annotation")

    // remove p backlink
    p.querySelector('a').remove()

    // remove sup backlink
    sup.querySelector('a').href = `#t`;

    sup.addEventListener("mouseover", (event) => {
      console.log(event)      
      d.classList.add("active")
    });

    sup.addEventListener("mouseout", (event) => {
      d.classList.remove("active")
    });
  })
  
  
  

}

// Initially load
window.addEventListener("load", onWindowLoaded);