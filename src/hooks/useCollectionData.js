import { useEffect, useState } from "react"
import {firebase} from '../firebase/config'


//hook to get data from a collection once

const useCollectionData = (collectionName) => {

    const db = firebase.firestore()

    let data = []

    db.collection(collectionName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{data.push(doc.data())})
    })

    return data


}

export default useCollectionData