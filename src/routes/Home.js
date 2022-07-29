import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [fileurl, setFileurl] = useState("");

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(userObj);
      console.log(nweetArray);
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let pictureUrl = "";
    if (fileurl !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, fileurl, "data_url");
      // data_url : 밑에 readAsDataURL에서 가져온 것을 사용
      pictureUrl = await getDownloadURL(response.ref);
    }

    const tweet = {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      pictureUrl,
    };

    await addDoc(collection(dbService, "nweets"), tweet);
    setNweet("");
    setFileurl(null);
  };

  const onChange = (e) => {
    // event 안에 있는 value를 달라고 하는 것
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFileurl(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearPhoto = () => setFileurl(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
        />
        <input type="file" accpet="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {fileurl && (
          <div>
            <img src={fileurl} width="50px" height="50px" />
            <button onClick={onClearPhoto}>Delete</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
