import React, { useState, useEffect } from "react";
import Web3 from "web3";
import BfcStakingABI from "./abi/bfc_staking"; // abi 파일 임포트

function App() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [outputData, setOutputData] = useState([]);

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

  // candidate_state 함수 호출 및 결과값 처리
  const handleButtonClick = async () => {
    if (!web3) {
      console.error("Web3가 초기화되지 않았습니다.");
      return;
    }

    try {
      // 계정이 없을 경우 처리
      if (accounts.length === 0) {
        console.error("계정이 연결되지 않았습니다.");
        return;
      }

      // 컨트랙트 인스턴스 생성
      const contractAddress = "0x0000000000000000000000000000000000000400"; // 컨트랙트 주소
      const contract = new web3.eth.Contract(BfcStakingABI, contractAddress);

      // 하드코딩된 주소를 파라미터로 전달하여 함수 호출
      const addressParam = "0x6bef93e6d6bc1e02b9d697b4fb8606152c200b29";
      const result = await contract.methods
        .candidate_top_nominations(addressParam)
        .call();

      // 2번과 3번 데이터만 추출하여 새로운 배열 생성
      const newData = [];
      result[2].forEach((item, index) => {
        // 뒤에 18글자 삭제하여 문자열로 변환
        const intData = result[3][index].toString().slice(0, -18);
        newData.push(`${item.replace(/['"]+/g, "")}: ${intData}`);
      });
      setOutputData(newData);
    } catch (error) {
      console.error("컨트랙트 함수 호출 중 에러 발생:", error);
    }
  };

  return (
    <div className="App">
      <h1>MetaMask 연결 테스트</h1>
      {web3 ? (
        <div>
          <p>연결된 네트워크: {web3.currentProvider.networkVersion}</p>
          <p>연결된 계정: {accounts.join(", ")}</p>
          <button onClick={handleButtonClick}>Get Information</button>
          {/* 데이터 출력 */}
          <div>
            {outputData.map((data, index) => (
              <p key={index}>{data}</p>
            ))}
          </div>
        </div>
      ) : (
        <p>MetaMask를 설치하고 연결해주세요.</p>
      )}
    </div>
  );
}

export default App;
