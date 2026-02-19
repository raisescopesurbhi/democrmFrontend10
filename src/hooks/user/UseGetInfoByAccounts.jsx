import { useEffect, useState } from "react";
//import { metaApi } from "../../utils/apiClients";
import { backendApi } from "../../utils/apiClients";
import {useSelector, useDispatch } from "react-redux";
import {
  setAccountsData,
  setAccountStats,
  setIbAccountsData,
} from "../../redux/user/userSlice";

export function useGetInfoByAccounts(accountIds = [], component) {
  
  const dispatch = useDispatch();


  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalEquity: 0,
    totalProfit: 0,
  });
  // console.log("stats", stats);

  useEffect(() => {
    if (!accountIds || accountIds.length === 0) return;

    let intervalId;

    const fetchData = async () => {
      try {

        const res = await backendApi.post("/meta/user-info-by-accounts", {
          // Manager_Index: import.meta.env.VITE_MANAGER_INDEX,
           accountIds,
        });



        console.log(res.data.data);
        if (Array.isArray(res.data.data)) {
          setData(res.data.data);
          // Calculate stats
          const totalBalance = res.data.data.reduce(
            (sum, acc) => sum + Number(acc.Balance || 0),
            0
          );
          const totalEquity = res.data.data.reduce(
            (sum, acc) => sum + Number(acc.Equity || 0),
            0
          );
          const totalProfit = res.data.data.reduce(
            (sum, acc) => sum + Number(acc.Profit || 0),
            0
          );
          const dispatchStats = {
            totalBalance: totalBalance,
            totalEquity: totalEquity,
            totalProfit: totalProfit,
          };

          setStats({ totalBalance, totalEquity, totalProfit });

          // dispatch conditionally ---
          if (component === "accounts") {
            dispatch(setAccountsData(res.data.data));
            dispatch(setAccountStats(dispatchStats));
          }
          // dispatch conditionally ---
          if (component === "ib") {
            dispatch(setIbAccountsData(res.data.data));
          }
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
        setData([]);
      }
    };

    fetchData(); // fetch immediately on change
    intervalId = setInterval(fetchData, 2000); // continue polling

    return () => clearInterval(intervalId);
  }, [JSON.stringify(accountIds)]); // track actual value, not just string

  return { data, stats };
}
