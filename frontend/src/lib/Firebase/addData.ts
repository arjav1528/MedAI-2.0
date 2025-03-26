import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";



export default async function addData(collectionName: string,id : string , data: any) {
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