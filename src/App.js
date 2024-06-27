import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import dayjs from 'dayjs';
function App() {
  const columns = [
    {
      title: '用户',
      dataIndex: 'nickName',
    },
    {
      title: '币种',
      dataIndex: 'baseName',
    },
    {
      title: '类型',
      dataIndex: 'side',
      render: (_, { posSide, side }) => {
        if (posSide === 'long' && side === 'buy') {
          return <div style={{ color: 'green' }}>做多</div>
        } else if (posSide === 'long' && side === 'sell') {
          return <div style={{ color: 'blue' }}>平多</div>
        } else if (posSide === 'short' && side === 'sell') {
          return <div style={{ color: 'green' }}>做空</div>
        } else if (posSide === 'short' && side === 'buy') {
          return <div style={{ color: 'blue' }}>平空</div>
        }
      }
    },
    {
      title: '均价',
      dataIndex: 'avgPx',
    },
    {
      title: '时间',
      dataIndex: 'cTime',
      render: (_) => {
        return new Date(Number(_)).toLocaleDateString() + ' ' + new Date(Number(_)).toLocaleTimeString()
      }
    }
  ]
  const [recordData, setRecordData] = useState([]);
  const [curData, setCurData] = useState([]);
  useEffect(() => {
    axios.get('https://okx-info-service.vercel.app/api/trade-records').then((res) => {
      console.log(res?.data?.data, '238938988')
      setRecordData(res?.data?.data)
    })
    axios.get('https://okx-info-service.vercel.app/api/positions').then((res) => {
      console.log(res?.data?.data, 'kkkkkkk')
      setCurData(res?.data?.data)
    })
  }, [])
  return (
    <div style={{width: '100vw'}} className="App" style={{ padding: '50px' }}>
      <h3>当前持仓</h3>
      <Table dataSource={curData} />
      <h3>历史记录</h3>
      <Table columns={columns} dataSource={recordData} />
    </div>
  );
}

export default App;
