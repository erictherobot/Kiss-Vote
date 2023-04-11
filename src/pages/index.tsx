import { GetServerSideProps } from "next";
import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";
import { UserType, VotesType } from "../types";
import Image from "next/image";
import KissAnimation from "@/components/KissAnimation";

type VotingProps = {
  user1: UserType;
  user2: UserType;
};

// Fetch two random users
export const getServerSideProps: GetServerSideProps = async () => {
  const [{ data: user1 }, { data: user2 }] = await Promise.all([
    axios.get("https://randomuser.me/api/"),
    axios.get("https://randomuser.me/api/"),
  ]);

  return {
    props: {
      user1: user1.results[0],
      user2: user2.results[0],
    },
  };
};

// Main voting component
const Voting: React.FC<VotingProps> = ({ user1, user2 }) => {
  const [votes, setVotes] = useState<VotesType>({});
  const [users, setUsers] = useState([user1, user2]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [showKiss, setShowKiss] = useState(false);

  // Load votes from local storage
  useEffect(() => {
    const storedVotes = localStorage.getItem("votes");
    if (storedVotes) setVotes(JSON.parse(storedVotes));
  }, []);

  // Fetch new random users after a vote or skip
  const fetchNewUsers = async () => {
    const params = genderFilter === "all" ? {} : { gender: genderFilter };
    const [{ data: newUser1 }, { data: newUser2 }] = await Promise.all([
      axios.get("https://randomuser.me/api/", { params }),
      axios.get("https://randomuser.me/api/", { params }),
    ]);
    setUsers([newUser1.results[0], newUser2.results[0]]);
  };

  const vote = (userId: string | number, avatar: any) => {
    setVotes((prevVotes) => {
      const updatedVotes = {
        ...prevVotes,
        [userId]: { count: (prevVotes[userId]?.count || 0) + 1, avatar },
      };
      localStorage.setItem("votes", JSON.stringify(updatedVotes));
      return updatedVotes;
    });
    setShowKiss(true);
    setTimeout(() => {
      setShowKiss(false);
      fetchNewUsers();
    }, 300);
  };

  // Change gender filter
  const changeGenderFilter = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setGenderFilter(event.target.value);
  };

  useEffect(() => {
    setShowKiss(false);
    fetchNewUsers();
  }, [genderFilter]);

  return (
    <div className="container mx-auto p-4">
      {showKiss && <KissAnimation />}

      <h1 className="text-4xl font-bold mb-8">KissVote</h1>
      <p className="text-4xl font-bold mb-8">Who do you find most kissable?</p>
      <div className="mb-4">
        <label htmlFor="genderFilter">
          What gender do you prefer to rate?{" "}
        </label>
        <select
          id="genderFilter"
          value={genderFilter}
          onChange={changeGenderFilter}
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-8 text-center m-auto ">
        {users.map((user) => (
          <div key={user.login.uuid} className="p-4 text-center m-auto">
            <h2 className="text-2xl mb-4">{`${user.name.first} ${user.name.last}`}</h2>
            <Image
              className="m-4 rounded-full"
              src={user.picture.large}
              alt={`${user.name.first} ${user.name.last}`}
              width={128}
              height={128}
            />
            <button
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => vote(user.login.uuid, user.picture.large)}
            >
              Vote for {user.name.first}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center m-auto">
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchNewUsers}
        >
          Skip This Round
        </button>
      </div>
      <Leaderboard votes={votes} />
    </div>
  );
};

export default Voting;
