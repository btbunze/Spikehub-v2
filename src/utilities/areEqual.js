const areEqual = (val1,val2) => {
    
    if(typeof val1 != typeof val2){
        return false;
    }

    if(val1 === val2){
        return true
    }

    let equal = true;

    switch (typeof val1){
        case "object": 
            if(Array.isArray(val1)){
                val1.forEach((elt,index) =>{
                    if(!areEqual(val2[index], elt)){
                        equal = false;
                    }
                })
                val2.forEach((elt,index) =>{
                    if(!areEqual(val1[index], elt)){
                        equal = false;
                    }
                })
                return equal;
            }
            if (val1 instanceof Date){
                return val1.getTime() == val2.getTime()
            }
            for(let i of Object.keys(val1)){
                if(!areEqual(val1[i], val2[i])){
                    equal = false;
                }
            }
            return equal
        case "array":

            return equal
        
    }
}

export default areEqual