import { useEffect, useState } from "react";
import Image from "next/image";

type VotesType = {
  [key: string]: {
    count: number;
    avatar: string;
  };
};

interface LeaderboardProps {
  votes: VotesType;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ votes }) => {
  const [sortedVotes, setSortedVotes] = useState<
    Array<[string, { count: number; avatar: string }]>
  >([]);

  useEffect(() => {
    const voteArray = Object.entries(votes);
    voteArray.sort((a, b) => b[1].count - a[1].count);
    setSortedVotes(voteArray);
  }, [votes]);

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">Votes</th>
          </tr>
        </thead>
        <tbody>
          {sortedVotes.map(([userId, { count, avatar }], index) => (
            <tr key={userId} className={index % 2 === 0 ? "bg-gray-200" : ""}>
              <td className="px-4 py-2">
                <Image
                  className="h-12 w-12 rounded-full"
                  src={avatar}
                  alt={`${userId} avatar`}
                  width={128}
                  height={128}
                />
              </td>
              <td className="px-4 py-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
