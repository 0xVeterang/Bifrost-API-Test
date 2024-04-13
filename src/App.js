import React, { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    // MetaMask가 설치되어 있는지 확인
    if (window.ethereum) {
      const provider = new Web3(window.ethereum);
      setWeb3(provider);

      // 계정 정보 가져오기
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => setAccounts(accounts))
        .catch((error) => console.error(error));
    } else {
      console.log("MetaMask를 설치해주세요.");
    }
  }, []);

  return (
    <div className="App">
      <h1>MetaMask 연결 테스트</h1>
      {web3 ? (
        <div>
          <p>연결된 네트워크: {web3.currentProvider.networkVersion}</p>
          <p>연결된 계정: {accounts.join(", ")}</p>
        </div>
      ) : (
        <p>MetaMask를 설치하고 연결해주세요.</p>
      )}
    </div>
  );
}

export default App;
