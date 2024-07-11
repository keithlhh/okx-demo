import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import qs from "query-string";

const query = window.location.search;
const queryObj = qs.parse(query);
const shouldPollingInterval = query.indexOf("pollingInterval") > -1;

function App() {
  const columns = [
    {
      title: "币种",
      dataIndex: "instId",
      render: (_, { instId }) => {
        const coionType = instId.split("-")[0];
        if (coionType === "BTC") {
          return (
            <div style={{ display: "flex" }}>
              <div style={{ width: 20 }}>🦞</div>
              {coionType}
            </div>
          );
        } else if (coionType === "ETH") {
          return (
            <div style={{ display: "flex" }}>
              <div style={{ width: 20 }}>🦀️</div>
              {coionType}
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex" }}>
              <div style={{ width: 20 }}></div>
              {coionType}
            </div>
          );
        }
      },
    },
    {
      title: "杠杆",
      dataIndex: "lever",
      render: (_) => {
        return Number(_);
      },
    },
    {
      title: "类型",
      dataIndex: "side",
      render: (_, { posSide, side }) => {
        if (posSide === "long") {
          return (
            <div style={{ color: "green", whiteSpace: "nowrap" }}>做多</div>
          );
        } else if (posSide === "long" && side === "sell") {
          return (
            <div style={{ color: "blue", whiteSpace: "nowrap" }}>平多</div>
          );
        } else if (posSide === "short") {
          return <div style={{ color: "red", whiteSpace: "nowrap" }}>做空</div>;
        } else if (posSide === "short" && side === "buy") {
          return (
            <div style={{ color: "blue", whiteSpace: "nowrap" }}>平空</div>
          );
        } else {
          return "-";
        }
      },
    },
    {
      title: "开仓均价",
      dataIndex: "openAvgPx",
    },
    {
      title: "平仓均价",
      dataIndex: "closeAvgPx",
    },
    {
      title: "收益",
      dataIndex: "closeUplRatio",
      render: (ratio) => {
        ratio = Math.floor(ratio * 10000) / 100;
        if (ratio >= 0) {
          return (
            <div style={{ color: "green", whiteSpace: "nowrap" }}>{ratio}%</div>
          );
        } else {
          return (
            <div style={{ color: "red", whiteSpace: "nowrap" }}>{ratio}%</div>
          );
        }
      },
    },
    {
      title: "时间",
      dataIndex: "cTime",
      render: (_) => {
        return (
          new Date(Number(_)).toLocaleDateString() +
          " " +
          new Date(Number(_)).toLocaleTimeString()
        );
      },
    },
  ];
  const positionColumns = [
    {
      title: "币种",
      dataIndex: "instId",
    },
    {
      title: "杠杆",
      dataIndex: "lever",
    },
    {
      title: "类型",
      dataIndex: "posSide",
      render: (_, { posSide, side }) => {
        if (posSide === "long") {
          return (
            <div style={{ color: "green", whiteSpace: "nowrap" }}>做多</div>
          );
        } else if (posSide === "short") {
          return (
            <div style={{ color: "green", whiteSpace: "nowrap" }}>做空</div>
          );
        }
      },
    },
    {
      title: "均价",
      dataIndex: "avgPx",
    },
    {
      title: "时间",
      dataIndex: "cTime",
      render: (_) => {
        return (
          new Date(Number(_)).toLocaleDateString() +
          " " +
          new Date(Number(_)).toLocaleTimeString()
        );
      },
    },
  ];
  const [recordData, setRecordData] = useState([]);
  const [curData, setCurData] = useState([]);
  const [curDataV2, setCurDataV2] = useState([]);
  const [prev, setPrev] = useState("");
  const { run } = useRequest(
    () => {
      axios
        .get("https://okx-info-service.vercel.app/api/positions")
        .then((res) => {
          console.log(res?.data?.data, "238938988");
          const data = res?.data?.data;
          const strData = JSON.stringify(data);
          const test = new Date().getMinutes();
          if (test % 5 == 0) {
            axios.post(
              "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
              {
                chat_id: "1604598018",
                text: new Date() + " " + "正在运行中...",
              }
            );
          }
          if (strData !== prev) {
            setPrev(strData);
            axios.post(
              "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
              {
                chat_id: "-4259724953",
                text: strData,
              }
            );
          }
        });
    },
    {
      pollingInterval: 5000,
      manual: true,
    }
  );
  useRequest(
    () => {
      axios
        .get("https://okx-info-service.vercel.app/api/positions", {
          params: queryObj,
        })
        .then((res) => {
          console.log(res?.data?.data, "kkkkkkk1111");
          setCurData(res?.data?.data);
        });
      axios
        .get("https://okx-info-service.vercel.app/api/positions-v2", {
          params: queryObj,
        })
        .then((res) => {
          console.log(res?.data?.data?.[0]?.posData, "kkkkkkk2222");
          setCurDataV2(res?.data?.data?.[0]?.posData);
        });
    },
    {
      pollingInterval: 10 * 1000,
    }
  );
  useEffect(() => {
    if (shouldPollingInterval) {
      run();
    }
    axios
      .get(
        "https://okx-info-service.vercel.app/api/history-positions?limit=100",
        {
          params: queryObj,
        }
      )
      .then((res) => {
        console.log(res?.data?.data, "238938988");
        setRecordData(res?.data?.data);
      });
  }, []);

  return (
    <div className="App">
      <h3>当前持仓V1</h3>
      <Table
        className="okx-table"
        columns={positionColumns}
        empty={<div>暂无持仓</div>}
        pagination={{
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        dataSource={curData}
      />
      <h3>当前持仓V2</h3>
      <Table
        className="okx-table"
        columns={positionColumns}
        empty={<div>暂无持仓</div>}
        pagination={{
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        dataSource={curDataV2}
      />
      <h3>历史记录</h3>
      <Table
        className="okx-table"
        pagination={{
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        columns={columns}
        dataSource={recordData}
      />
      <div style={{ paddingBottom: 100 }}>{JSON.stringify(curData)}</div>
    </div>
  );
}

export default App;
