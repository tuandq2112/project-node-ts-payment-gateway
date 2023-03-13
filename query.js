const { default: axios } = require('axios');
async function sleep() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}
async function queryFizen() {
  axios
    .get(
      'https://api.bscscan.com/api?module=account&action=txlistinternal&address=0xda2a8c303e3655b768229fca9172239177aa6c91&startblock=0&endblock=999999999&sort=desc&apikey=FZ9TGE7XCY32G7YR7BDDBJ211CF7DMFF2G',
    )
    .then(async res => {
      let data = res.data.result;
      let listContract = data.map(item => item.contractAddress);
      let result = [];
      for (let index = 0; index < listContract.length; index++) {
        const contract = listContract[index];
        let subData = await axios.get(
          `https://api.bscscan.com/api?module=account&action=tokentx&address=${contract}&startblock=0&endblock=999999999&sort=desc&apikey=FZ9TGE7XCY32G7YR7BDDBJ211CF7DMFF2G`,
        );
        let listTx = subData.data.result;
        console.log(index + 1);
        await sleep();
        result.push({ address: contract, txLength: listTx.length });
      }
      let filterData = result.filter(item => item.txLength > 0);
      console.log(result, result.length);
      console.log(filterData, filterData.length);
    })
    .catch(err => {
      console.log(err);
    });
}
async function queryAsync() {
  let subData = await axios.get(
    `https://api.bscscan.com/api?module=account&action=tokentx&address=0xde13c5da1d234d5476b8456a1dd622ebd9acf365&startblock=0&endblock=999999999&sort=desc&apikey=FZ9TGE7XCY32G7YR7BDDBJ211CF7DMFF2G`,
  );
  let listTx = subData.data.result;
  console.log(
    listTx
      .filter(item => item.from == '0xde13c5da1d234d5476b8456a1dd622ebd9acf365')
      .map(item => Number(item.value) / 1e18)
      .reduce((a, b) => a + b, 0),
  );
  console.log(
    listTx
      .filter(item => item.to == '0xde13c5da1d234d5476b8456a1dd622ebd9acf365')
      .map(item => Number(item.value) / 1e18)
      .reduce((a, b) => a + b, 0),
  );
}
queryFizen();
// queryAsync();
