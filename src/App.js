import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";

const query = window.location.search;
const shouldPollingInterval = query.indexOf("pollingInterval") > -1;

function App() {
  const columns = [
    {
      title: "用户",
      dataIndex: "nickName",
    },
    {
      title: "币种",
      dataIndex: "baseName",
    },
    {
      title: "类型",
      dataIndex: "side",
      render: (_, { posSide, side }) => {
        if (posSide === "long" && side === "buy") {
          return <div style={{ color: "green" }}>做多</div>;
        } else if (posSide === "long" && side === "sell") {
          return <div style={{ color: "blue" }}>平多</div>;
        } else if (posSide === "short" && side === "sell") {
          return <div style={{ color: "green" }}>做空</div>;
        } else if (posSide === "short" && side === "buy") {
          return <div style={{ color: "blue" }}>平空</div>;
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
  useEffect(() => {
    if (shouldPollingInterval) {
      run();
    }
    axios
      .get("https://okx-info-service.vercel.app/api/positions")
      .then((res) => {
        console.log(res?.data?.data, "kkkkkkk");
        setCurData(res?.data?.data?.[0].posData);
      });
    axios
      .get("https://okx-info-service.vercel.app/api/trade-records?limit=100")
      .then((res) => {
        console.log(res?.data?.data, "238938988");
        setRecordData(res?.data?.data);
      });
  }, []);
  return (
    <div className="App">
      <h3>当前持仓</h3>
      <Table
        columns={[
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
                return <div style={{ color: "green" }}>做多</div>;
              } else if (posSide === "short") {
                return <div style={{ color: "green" }}>做空</div>;
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
        ]}
        empty="暂无持仓"
        pagination={{
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        dataSource={curData}
      />
      <h3>历史记录</h3>
      <Table
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
