import React,{useState,useMemo,useEffect,useCallback} from "react";
import {motion} from "framer-motion";
import { useSelector } from "react-redux";
import { metaApi } from "../../../utils/apiClients";
                                                        
const TradeHistory = () => {        
  const [activeTab, setActiveTab] = useState("open");
  const openTrades:any[] = [];
  const closeTrades :any []=[];
   const loggedUser = useSelector((s: any) => s?.user?.loggedUser);
   const accounts = useMemo(
       () =>
         (loggedUser?.accounts || [])
           .map((a: any) => a?.accountNumber ?? a?.MT5Account ?? a)
           .filter(Boolean),
       [loggedUser]
     );
  const [tradeData, setTradeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const rows = activeTab === "open" ? tradeData : closeTrades;
  const fetchOpenTrades = useCallback(async () => {
   if (!loggedUser?._id) {
      setTradeData([]);
      setError("Please sign in to view your trade history.");
      return;
    }
    if (!accounts.length) {
      setTradeData([]);
      setError("No linked MT5 accounts found.");
      return;
    }
   setLoading(true);
    setError("");
   try {
         const agg: any[] = [];
   
         for (const acc of accounts) {  
           const res = await metaApi.get(
             `/GetOpenTradeByAccount?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Accont=${acc}`
           );
           if (Array.isArray(res?.data)) agg.push(...res.data);
         }
   agg.sort((a, b) => {
        const at = new Date(a?.Open_Time || 0).getTime();
        const bt = new Date(b?.Open_Time || 0).getTime();
        return bt - at;
      });

       if (agg.length) {
        setTradeData(agg);
        setError("");
      } else {
        setTradeData([]);
        setError("No data found. Please try again.");
      }
    } catch (e) {
      console.error("Error fetching open trade data:", e);
      setTradeData([]);
      setError("Failed to fetch trade data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accounts, loggedUser?._id]);

  const accountsKey = useMemo(() => JSON.stringify(accounts), [accounts]);
  
    useEffect(() => {
      
      fetchOpenTrades();
    }, [fetchOpenTrades, accountsKey, loggedUser?._id]);
  


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-darkblue-800 via-darkblue-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Trade History
        </h2>

        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("open")}   
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "open" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Open Trade
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("close")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "close" ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Close Trade
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-orange-400 font-semibold">Symbol</th>
              <th className="text-left py-3 px-4 text-orange-400 font-semibold">{activeTab === "open" ? "Open" : "Close"}</th>
              <th className="text-left py-3 px-4 text-orange-400 font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-orange-400 font-semibold">Vol</th>
              <th className="text-left py-3 px-4 text-orange-400 font-semibold">P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No trades
                </td>
              </tr>
            ) : (
              rows.map((trade, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
                >
                  <td className="py-3 px-4 text-gray-300 font-semibold">{trade.symbol}</td>
                  <td className="py-3 px-4 text-gray-400">{activeTab === "open" ? trade.openTime : trade.closeTime}</td>
                  <td className="py-3 px-4 text-gray-300">{trade.type}</td>
                  <td className="py-3 px-4 text-gray-300">{trade.volume}</td>
                  <td className={`py-3 px-4 font-semibold ${trade.pl >= 0 ? "text-green-400" : "text-red-400"}`}>${trade.pl}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default TradeHistory;