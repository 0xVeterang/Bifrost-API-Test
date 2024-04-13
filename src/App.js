import React, { useState, useEffect } from "react";
import Web3 from "web3";
import BfcStakingABI from "./abi/bfc_staking"; // abi 파일 임포트

function App() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contractResult, setContractResult] = useState(null); // 결과값 상태 추가

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
        .candidate_state(addressParam)
        .call();

      // BigInt 값을 문자열로 변환하고 뒤에서 18자리를 제외하여 출력
      result.initial_bond = result.initial_bond.toString().slice(0, -18);
      result.voting_power = result.voting_power.toString().slice(0, -18);
      // 결과값을 상태에 저장
      setContractResult(result);
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
          {contractResult && (
            <div>
              <p>candidate: {contractResult.candidate}</p>
              <p>stash: {contractResult.stash}</p>
              <p>bond: {contractResult.bond.toString()}</p>
              <p>initial_bond: {contractResult.initial_bond} BFC</p>
              <p>voting_power: {contractResult.voting_power} BFC</p>
            </div>
          )}
        </div>
      ) : (
        <p>MetaMask를 설치하고 연결해주세요.</p>
      )}
    </div>
  );
}

export default App;
