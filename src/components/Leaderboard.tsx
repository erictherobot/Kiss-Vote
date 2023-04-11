import { useEffect, useState } from "react";
import Image from "next/image";

// Leaderboard component
const Leaderboard = ({
  votes,
}: {
  votes: Record<string, { count: number; avatar: string }>;
}) => {
  const [sortedVotes, setSortedVotes] = useState([]);

  // Sort leaderboard by vote counts
  useEffect(() => {
    setSortedVotes(
      Object.entries(votes).sort((a, b) => b[1].count - a[1].count)
    );
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
          {sortedVotes.map(([userId, voteData], index) => (
            <tr key={userId} className={index % 2 === 0 ? "bg-gray-200" : ""}>
              <td className="px-4 py-2">
                <Image
                  className="h-12 w-12 rounded-full"
                  src={voteData.avatar}
                  alt={`${userId} avatar`}
                  width={128}
                  height={128}
                />
              </td>
              <td className="px-4 py-2">{voteData.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
