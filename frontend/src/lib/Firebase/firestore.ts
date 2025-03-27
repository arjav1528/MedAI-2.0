import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "./firebase";



export const addData = async (collectionName: string,id : string , data: any) => {
    let result = null;
    let error = null;

    try{
        result = await setDoc(doc(db, collectionName, id), data, {
            merge: true,
        });

        return { result, error };

    }catch(err){
        error = err;
        console.error("Error adding document: ", error);
    }

    return { result, error };
}


export const retriveData = async (collectionName: string,id: string) => {
    let result = null;
    let error = null;

    try{
        const collectionRef = collection(db,collectionName);
        const snapshot = await getDocs(collectionRef);
        snapshot.forEach(doc => {
            if(doc.id === id){
                result = doc.data();
            }
        });

        return { result, error };

    }catch(err){
        console.error("Error getting document: ", error);
    }
}