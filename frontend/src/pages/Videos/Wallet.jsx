import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaWallet, FaCoins, FaArrowAltCircleDown, FaArrowAltCircleUp, FaInfoCircle, FaRegFolderOpen } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const Wallet = () => {
  const { userData } = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletDetails = async () => {
    try {
      // Re-fetch current user profile to get most updated wallet state
      const response = await axios.get(`${serverUrl}/api/user/getuser`, {
        withCredentials: true,
      });
      setBalance(response.data.rewardsBalance || 0);
      setHistory(response.data.rewardsHistory || []);
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      showCustomAlert("Failed to load wallet details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchWalletDetails();
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <ClipLoader color="#a855f7" size={50} />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-5 bg-[#0f0f0f] text-white min-h-screen">
        <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800">
          <FaWallet size={48} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-gray-300">Wallet access restricted</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Please sign in to your account to view your rewards wallet and earn coins.
          </p>
        </div>
        <Link
          to="/signin"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-full text-sm font-semibold transition text-white shadow-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Calculate daily watch rewards limit
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dailyClaimsToday = history.filter(
    (h) => h.type === "watch" && new Date(h.createdAt) >= oneDayAgo
  ).length;

  const totalEarned = history
    .filter((h) => h.amount > 0)
    .reduce((sum, h) => sum + h.amount, 0);

  const totalTipped = Math.abs(
    history.filter((h) => h.type === "tip_sent").reduce((sum, h) => sum + h.amount, 0)
  );

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaWallet className="text-purple-500 text-2xl" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Rewards Wallet</h1>
          </div>
          <span className="text-xs font-semibold text-purple-400 bg-purple-950/40 border border-purple-800/40 px-3 py-1 rounded-full uppercase tracking-wider">
            Web3 Integrated
          </span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Glowing Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#1b122e] to-[#121212] border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between h-[200px]">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                PlayTube Coins (PTC)
              </span>
              <FaCoins className="text-purple-400 text-xl animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
                {balance.toFixed(2)} <span className="text-lg font-medium text-purple-400">PTC</span>
              </h2>
              <p className="text-xs text-gray-500">
                Estimated Value: <span className="text-gray-300 font-semibold">${(balance * 0.05).toFixed(2)} USD</span> (1 PTC = $0.05)
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-purple-500/10 pt-4 text-xs text-gray-400">
              <span>Daily Limit status:</span>
              <span className="font-semibold text-purple-300">
                {dailyClaimsToday}/5 Claims Used ({5 - dailyClaimsToday} remaining today)
              </span>
            </div>
          </div>

          {/* Stats Column */}
          <div className="bg-[#141414] border border-gray-800/80 rounded-3xl p-6 flex flex-col justify-around gap-4 shadow-xl">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Total Earned
              </span>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                +{totalEarned.toFixed(1)} PTC
              </h3>
            </div>
            
            <div className="border-t border-gray-800/80 pt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Total Tipped Out
              </span>
              <h3 className="text-2xl font-bold text-red-400 mt-1">
                -{totalTipped.toFixed(1)} PTC
              </h3>
            </div>
          </div>

        </div>

        {/* Info Rules banner */}
        <div className="bg-[#181818]/60 border border-gray-900 rounded-2xl p-4 flex gap-3 text-xs text-gray-400 leading-relaxed shadow-sm">
          <FaInfoCircle size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <p>
            <span className="text-white font-bold">How it works:</span> You automatically earn <span className="text-purple-400 font-bold">1.0 PTC</span> token for every unique video you watch for at least 10 seconds. You can earn a maximum of <span className="text-purple-400 font-bold">5.0 PTC</span> per day. Tokens can be used to tip your favorite creators directly from the video watch page!
          </p>
        </div>

        {/* Transactions History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-white">Transaction Logs</h2>
          
          {history.length > 0 ? (
            <div className="bg-[#141414]/30 border border-gray-800/60 rounded-2xl overflow-hidden shadow-xl">
              <div className="divide-y divide-gray-800/60">
                {[...history].reverse().map((tx, idx) => {
                  const isIncoming = tx.amount > 0;
                  return (
                    <div key={tx._id || idx} className="p-4 flex items-center justify-between hover:bg-[#181818]/25 transition">
                      <div className="flex items-center gap-3">
                        {isIncoming ? (
                          <FaArrowAltCircleDown className="text-emerald-400 text-lg shrink-0" />
                        ) : (
                          <FaArrowAltCircleUp className="text-red-400 text-lg shrink-0" />
                        )}
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-gray-200 leading-snug">
                            {tx.detail}
                          </p>
                          <span className="text-[10px] text-gray-500 font-sans">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ${isIncoming ? "text-emerald-400" : "text-red-400"}`}>
                        {isIncoming ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`} PTC
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty Logs State */
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 bg-[#141414]/30 border border-gray-800/40 rounded-2xl">
              <div className="bg-[#181818] text-gray-600 p-5 rounded-full border border-gray-800">
                <FaRegFolderOpen size={30} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-300">No transactions recorded</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Start watching videos to earn your first PlayTube Coins!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Wallet;
